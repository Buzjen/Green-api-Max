import { allSettled, fork, scopeBind } from 'effector';
import { describe, expect, it, vi } from 'vitest';
import { chatModel } from '@/entities/chat';
import { messageModel } from '@/entities/message';
import { sessionModel } from '@/entities/session';
import { ApiError, type Notification } from '@/shared/api';
import {
  $connectionStatus,
  abortRequestsFx,
  delayFx,
  deleteNotificationFx,
  receiveNotificationFx,
  RETRY_DELAYS,
} from './receive';

const credentials = { apiUrl: 'https://x', idInstance: '1', apiTokenInstance: 't' };

const textNotification = (receiptId: number, idMessage: string, text = 'Привет'): Notification => ({
  receiptId,
  body: {
    typeWebhook: 'incomingMessageReceived',
    timestamp: 1763115112,
    idMessage,
    senderData: { chatId: '10000000', senderName: 'Иван', senderPhoneNumber: 79876543210 },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: text } },
  },
});

/**
 * Имитирует очередь: отдаёт ответы по порядку, после последнего — выходит из сессии,
 * чтобы цикл остановился и allSettled завершился.
 */
function setup(responses: Array<Notification | null | Error>) {
  const queue = [...responses];
  const receive = vi.fn(async () => {
    const next = queue.shift();
    if (next === undefined) {
      logout();
      return null;
    }
    if (next instanceof Error) throw next;
    return next;
  });
  const remove = vi.fn(async (_params: { receiptId: number }) => ({ result: true }));
  const delay = vi.fn(async (_params: { ms: number }) => undefined);
  const scope = fork({
    handlers: [
      [receiveNotificationFx, receive],
      [deleteNotificationFx, remove],
      [delayFx, delay],
      [abortRequestsFx, () => undefined],
    ],
  });
  const logout = scopeBind(sessionModel.reset, { scope });
  return { scope, receive, remove, delay };
}

describe('receive notifications', () => {
  it('добавляет входящее сообщение, создаёт чат и удаляет уведомление', async () => {
    const { scope, remove } = setup([null, textNotification(1, 'm1')]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(expect.objectContaining({ receiptId: 1 }));
    expect(scope.getState(chatModel.$chats)).toMatchObject([
      { chatId: '10000000', title: 'Иван', phone: '79876543210' },
    ]);
    expect(scope.getState(messageModel.$messagesByChat)['10000000']).toMatchObject([
      { text: 'Привет', direction: 'incoming' },
    ]);
  });

  it('удаляет даже нераспознанные уведомления', async () => {
    const { scope, remove } = setup([
      { receiptId: 7, body: { typeWebhook: 'stateInstanceChanged' } },
      { receiptId: 8, body: null as never },
    ]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });

    expect(remove.mock.calls.map(([params]) => params.receiptId)).toEqual([7, 8]);
    expect(scope.getState(messageModel.$messagesByChat)).toEqual({});
  });

  it('не добавляет дубликаты', async () => {
    const { scope } = setup([textNotification(1, 'm1'), textNotification(2, 'm1')]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });
    expect(scope.getState(messageModel.$messagesByChat)['10000000']).toHaveLength(1);
  });

  it('кладёт ответ в чат, найденный по телефону', async () => {
    const { scope } = setup([textNotification(1, 'm1')]);
    await allSettled(chatModel.chatAdded, {
      scope,
      params: { chatId: 'old-id', phone: '79876543210', title: 'Иван' },
    });
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });

    expect(scope.getState(chatModel.$chats)).toHaveLength(1);
    expect(scope.getState(messageModel.$messagesByChat)['old-id']).toHaveLength(1);
  });

  it('после выхода новые запросы не уходят', async () => {
    const { scope, receive } = setup([null, null]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });
    // 2 ответа + вызов, в котором произошёл выход
    expect(receive).toHaveBeenCalledTimes(3);
    expect(scope.getState(sessionModel.$credentials)).toBeNull();
  });

  it('при сетевой ошибке ждёт с нарастающей паузой и продолжает', async () => {
    const { scope, delay, receive } = setup([
      new TypeError('Failed to fetch'),
      new TypeError('Failed to fetch'),
      null,
    ]);
    const statuses: string[] = [];
    delay.mockImplementation(async () => {
      statuses.push(scope.getState($connectionStatus));
    });
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });

    expect(delay.mock.calls.map(([params]) => params.ms)).toEqual([
      RETRY_DELAYS[0],
      RETRY_DELAYS[1],
    ]);
    expect(statuses).toEqual(['offline', 'offline']);
    expect(receive).toHaveBeenCalledTimes(4);
  });

  it('при неверных кредах завершает сессию с понятной ошибкой', async () => {
    const { scope, receive } = setup([new ApiError(401, '')]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });

    expect(receive).toHaveBeenCalledTimes(1);
    expect(scope.getState(sessionModel.$isAuthorized)).toBe(false);
    expect(scope.getState(sessionModel.$sessionError)).toBe(
      'Неверные idInstance или apiTokenInstance',
    );
  });

  it('сообщает про заданный webhookUrl', async () => {
    const { scope } = setup([
      new ApiError(400, 'Custom webhook url is set. Go to cabinet, clear webhook url'),
    ]);
    await allSettled(sessionModel.sessionStarted, { scope, params: credentials });
    expect(scope.getState(sessionModel.$sessionError)).toBe(
      'Очистите webhookUrl в личном кабинете GREEN-API',
    );
  });
});
