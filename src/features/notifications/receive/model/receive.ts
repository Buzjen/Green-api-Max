import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { chatModel } from '@/entities/chat';
import {
  messageModel,
  parseNotification,
  type ParsedNotification,
} from '@/entities/message';
import { sessionModel } from '@/entities/session';
import {
  deleteNotification,
  describeApiError,
  isAbortError,
  isSessionError,
  receiveNotification,
  type ApiCredentials,
} from '@/shared/api';
import { formatPhone } from '@/shared/lib/phone';
import { resolveChat } from '../lib/resolve-chat';

/** Сколько секунд сервер держит запрос, если очередь пуста (5–60). */
export const RECEIVE_TIMEOUT = 20;
/** Паузы перед повтором после сетевой ошибки. */
export const RETRY_DELAYS = [1000, 2000, 5000];

/**
 * Пустая очередь держит запрос до RECEIVE_TIMEOUT секунд, поэтому
 * «online» — это «ошибок нет», а не «пришёл ответ»;
 * «offline» ставится только после реальной ошибки.
 */
export type ConnectionStatus = 'online' | 'offline';

export const pollingStartRequested = createEvent();
export const pollingStopped = createEvent();

/**
 * Номер текущего цикла. Каждый ответ несёт номер цикла, в котором был запрошен;
 * ответы старых циклов (после выхода и повторного входа) игнорируются.
 */
const $generation = createStore(0);
const $isPolling = createStore(false);
const $retryAttempt = createStore(0);

export const $connectionStatus = createStore<ConnectionStatus>('online');

interface Tick {
  generation: number;
}

interface RequestParams extends Tick {
  credentials: ApiCredentials;
}

// ---- эффекты --------------------------------------------------------------

const controllers = new Set<AbortController>();

export const receiveNotificationFx = createEffect(
  async ({ credentials }: RequestParams) => {
    const controller = new AbortController();
    controllers.add(controller);
    try {
      return await receiveNotification(credentials, {
        receiveTimeout: RECEIVE_TIMEOUT,
        signal: controller.signal,
      });
    } finally {
      controllers.delete(controller);
    }
  },
);

export const deleteNotificationFx = createEffect(
  ({ credentials, receiptId }: RequestParams & { receiptId: number }) =>
    deleteNotification(credentials, { receiptId }),
);

export const delayFx = createEffect(
  ({ ms }: Tick & { ms: number }) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
);

export const abortRequestsFx = createEffect(() => {
  controllers.forEach((controller) => controller.abort());
  controllers.clear();
});

// ---- запуск и остановка ---------------------------------------------------

const pollingStarted = sample({
  clock: [pollingStartRequested, sessionModel.sessionStarted],
  source: $isPolling,
  filter: (isPolling) => !isPolling,
  fn: () => undefined,
});

$isPolling.on(pollingStarted, () => true);
$generation.on(pollingStarted, (generation) => generation + 1);
$retryAttempt.reset(pollingStarted);
$connectionStatus.on(pollingStarted, () => 'online');

const stopped = sample({
  clock: [pollingStopped, sessionModel.reset, sessionModel.sessionFailed],
  fn: () => undefined,
});

$isPolling.on(stopped, () => false);
// Смена поколения отбрасывает ответы запросов, которые ещё в полёте
$generation.on(stopped, (generation) => generation + 1);
sample({ clock: stopped, target: abortRequestsFx });

// ---- цикл -----------------------------------------------------------------

/** Шаг цикла актуален, только если поллинг идёт и поколение совпадает. */
function isCurrent(
  state: { isPolling: boolean; generation: number },
  tick: Tick,
): boolean {
  return state.isPolling && state.generation === tick.generation;
}

const $state = combine({ isPolling: $isPolling, generation: $generation });

const nextPollRequested = createEvent<Tick>();
const pollRequested = sessionModel.withCredentials(receiveNotificationFx);

sample({
  clock: pollingStarted,
  source: $generation,
  fn: (generation) => ({ generation }),
  target: nextPollRequested,
});

sample({
  clock: nextPollRequested,
  source: $state,
  filter: isCurrent,
  fn: (_, { generation }) => ({ generation }),
  target: pollRequested,
});

const received = sample({
  clock: receiveNotificationFx.done,
  source: $state,
  filter: (state, { params }) => isCurrent(state, params),
  fn: (_, payload) => payload,
});

$connectionStatus.on(received, () => 'online');
$retryAttempt.reset(received);

// Очередь пуста — сразу следующий запрос
sample({
  clock: received,
  filter: ({ result }) => result === null,
  fn: ({ params }) => ({ generation: params.generation }),
  target: nextPollRequested,
});

const notificationReceived = sample({
  clock: received,
  filter: ({ result }) => result !== null,
  fn: ({ params, result }) => ({
    ...params,
    receiptId: result!.receiptId,
    body: result!.body,
  }),
});

// Удаляем ВСЕГДА, даже если уведомление не удалось разобрать
sample({
  clock: notificationReceived,
  fn: ({ credentials, generation, receiptId }) => ({
    credentials,
    generation,
    receiptId,
  }),
  target: deleteNotificationFx,
});

sample({
  clock: deleteNotificationFx.done,
  fn: ({ params }) => ({ generation: params.generation }),
  target: nextPollRequested,
});

// ---- ошибки ---------------------------------------------------------------

const receiveFailed = sample({
  clock: receiveNotificationFx.fail,
  source: $state,
  filter: (state, { params, error }) =>
    isCurrent(state, params) && !isAbortError(error),
  fn: (_, payload) => payload,
});

sample({
  clock: receiveFailed,
  filter: ({ error }) => isSessionError(error),
  fn: ({ error }) => describeApiError(error),
  target: sessionModel.sessionFailed,
});

const networkFailed = sample({
  clock: receiveFailed,
  filter: ({ error }) => !isSessionError(error),
});

const retryScheduled = sample({
  clock: [networkFailed, deleteNotificationFx.fail],
  source: { state: $state, attempt: $retryAttempt },
  filter: ({ state }, { params }) => isCurrent(state, params),
  fn: ({ attempt }, { params }) => ({
    generation: params.generation,
    ms: RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)],
  }),
});

$connectionStatus.on(retryScheduled, () => 'offline');
$retryAttempt.on(retryScheduled, (attempt) => attempt + 1);

sample({ clock: retryScheduled, target: delayFx });

sample({
  clock: delayFx.done,
  fn: ({ params }) => ({ generation: params.generation }),
  target: nextPollRequested,
});

// ---- входящие сообщения ---------------------------------------------------

const notificationParsed = sample({
  clock: notificationReceived,
  fn: ({ body }) => parseNotification(body),
});

const messageParsed = sample({
  clock: notificationParsed,
  filter: (parsed): parsed is ParsedNotification => parsed !== null,
});

const routed = sample({
  clock: messageParsed,
  source: chatModel.$chats,
  fn: (chats, parsed) => ({ parsed, chat: resolveChat(chats, parsed) }),
});

// Сообщение от нового собеседника — создаём чат
sample({
  clock: routed,
  filter: ({ chat }) => chat === null,
  fn: ({ parsed: { sender } }) => ({
    chatId: sender.chatId,
    phone: sender.phone,
    title:
      sender.name ||
      (sender.phone ? formatPhone(sender.phone) : `Чат ${sender.chatId}`),
  }),
  target: chatModel.chatAdded,
});

sample({
  clock: routed,
  fn: ({ parsed, chat }) => ({
    ...parsed.message,
    chatId: chat?.chatId ?? parsed.message.chatId,
  }),
  target: messageModel.messageAdded,
});
