import { allSettled, fork } from 'effector';
import { describe, expect, it, vi } from 'vitest';
import { chatModel } from '@/entities/chat';
import { messageModel } from '@/entities/message';
import { sessionModel } from '@/entities/session';
import { messageSendRequested, retryRequested, sendMessageFx } from './send';

const credentials = { apiUrl: 'https://x', idInstance: '1', apiTokenInstance: 't' };

describe('send message', () => {
  it('добавляет сообщение оптимистично и помечает отправленным', async () => {
    const send = vi.fn(async () => ({ idMessage: 'srv-1' }));
    const scope = fork({
      values: [
        [chatModel.$activeChatId, '100'],
        [sessionModel.$credentials, credentials],
      ],
      handlers: [[sendMessageFx, send]],
    });

    await allSettled(messageSendRequested, { scope, params: '  Привет  ' });

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ chatId: '100', text: 'Привет' }));
    expect(scope.getState(messageModel.$messagesByChat)['100']).toMatchObject([
      { text: 'Привет', direction: 'outgoing', status: 'sent', idMessage: 'srv-1' },
    ]);
  });

  it('помечает ошибку и отправляет повторно по retry', async () => {
    const send = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({ idMessage: 'srv-2' });
    const scope = fork({
      values: [
        [chatModel.$activeChatId, '100'],
        [sessionModel.$credentials, credentials],
      ],
      handlers: [[sendMessageFx, send]],
    });

    await allSettled(messageSendRequested, { scope, params: 'текст' });
    const [failed] = scope.getState(messageModel.$messagesByChat)['100'];
    expect(failed.status).toBe('error');

    await allSettled(retryRequested, { scope, params: failed });
    expect(send).toHaveBeenCalledTimes(2);
    expect(scope.getState(messageModel.$messagesByChat)['100']).toMatchObject([
      { id: failed.id, status: 'sent', idMessage: 'srv-2' },
    ]);
  });

  it('не отправляет пустой текст и без выбранного чата', async () => {
    const send = vi.fn();
    const scope = fork({
      values: [[sessionModel.$credentials, credentials]],
      handlers: [[sendMessageFx, send]],
    });
    await allSettled(messageSendRequested, { scope, params: 'текст' });
    await allSettled(chatModel.chatSelected, { scope, params: '100' });
    await allSettled(messageSendRequested, { scope, params: '   ' });
    expect(send).not.toHaveBeenCalled();
  });
});
