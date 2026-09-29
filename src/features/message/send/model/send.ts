import { createEffect, createEvent, sample } from 'effector';
import { chatModel } from '@/entities/chat';
import {
  messageModel,
  type Message,
  type MessageStatus,
} from '@/entities/message';
import { sessionModel } from '@/entities/session';
import {
  MAX_MESSAGE_LENGTH,
  sendMessage,
  type ApiCredentials,
} from '@/shared/api';

export const messageSendRequested = createEvent<string>();
export const retryRequested = createEvent<Message>();

interface SendParams {
  credentials: ApiCredentials;
  chatId: string;
  /** Локальный id сообщения, статус которого нужно обновить. */
  id: string;
  text: string;
}

export const sendMessageFx = createEffect(
  ({ credentials, chatId, text }: SendParams) =>
    sendMessage(credentials, { chatId, message: text }),
);

const sendRequested = sessionModel.withCredentials(sendMessageFx);

/** Обновление статуса локального сообщения по его chatId и id. */
const toStatus =
  (status: MessageStatus) =>
  ({ chatId, id }: Pick<Message, 'chatId' | 'id'>) => ({ chatId, id, status });

let tempCounter = 0;
const createTempId = () => `tmp-${Date.now()}-${++tempCounter}`;

const optimisticMessageCreated = sample({
  clock: messageSendRequested,
  source: chatModel.$activeChatId,
  filter: (chatId, text) =>
    chatId !== null &&
    text.trim().length > 0 &&
    text.length <= MAX_MESSAGE_LENGTH,
  fn: (chatId, text): Message => ({
    id: createTempId(),
    idMessage: null,
    chatId: chatId!,
    text: text.trim(),
    timestamp: Date.now(),
    direction: 'outgoing',
    status: 'sending',
  }),
});

sample({ clock: optimisticMessageCreated, target: messageModel.messageAdded });

const retried = sample({
  clock: retryRequested,
  filter: (message) => message.status === 'error',
});

sample({
  clock: retried,
  fn: toStatus('sending'),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: [optimisticMessageCreated, retried],
  fn: ({ chatId, id, text }) => ({ chatId, id, text }),
  target: sendRequested,
});

// Без сессии отправить нельзя — сразу ошибка,
// чтобы сообщение не висело в «отправляется»
sample({
  clock: optimisticMessageCreated,
  source: sessionModel.$credentials,
  filter: (credentials) => credentials === null,
  fn: (_, message) => toStatus('error')(message),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: sendMessageFx.done,
  fn: ({ params, result }) => ({
    ...toStatus('sent')(params),
    idMessage: result.idMessage,
  }),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: sendMessageFx.fail,
  fn: ({ params }) => toStatus('error')(params),
  target: messageModel.messageStatusUpdated,
});
