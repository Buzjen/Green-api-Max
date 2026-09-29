import { createEffect, createEvent, sample } from 'effector';
import { chatModel } from '@/entities/chat';
import { messageModel, type Message } from '@/entities/message';
import { sessionModel } from '@/entities/session';
import { MAX_MESSAGE_LENGTH, sendMessage, type ApiCredentials } from '@/shared/api';

export const messageSendRequested = createEvent<string>();
export const retryRequested = createEvent<Message>();

interface SendParams {
  credentials: ApiCredentials;
  chatId: string;
  /** Локальный id сообщения, статус которого нужно обновить. */
  id: string;
  text: string;
}

export const sendMessageFx = createEffect(({ credentials, chatId, text }: SendParams) =>
  sendMessage(credentials, { chatId, message: text }),
);

let tempCounter = 0;
const createTempId = () => `tmp-${Date.now()}-${++tempCounter}`;

const optimisticMessageCreated = sample({
  clock: messageSendRequested,
  source: chatModel.$activeChatId,
  filter: (chatId, text) =>
    chatId !== null && text.trim().length > 0 && text.length <= MAX_MESSAGE_LENGTH,
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
  fn: ({ chatId, id }) => ({ chatId, id, status: 'sending' as const }),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: [optimisticMessageCreated, retried],
  source: sessionModel.$credentials,
  filter: Boolean,
  fn: (credentials, { chatId, id, text }): SendParams => ({ credentials, chatId, id, text }),
  target: sendMessageFx,
});

// Без сессии отправить нельзя — сразу ошибка, чтобы сообщение не висело в «отправляется»
sample({
  clock: optimisticMessageCreated,
  source: sessionModel.$credentials,
  filter: (credentials) => credentials === null,
  fn: (_, { chatId, id }) => ({ chatId, id, status: 'error' as const }),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: sendMessageFx.done,
  fn: ({ params, result }) => ({
    chatId: params.chatId,
    id: params.id,
    status: 'sent' as const,
    idMessage: result.idMessage,
  }),
  target: messageModel.messageStatusUpdated,
});

sample({
  clock: sendMessageFx.fail,
  fn: ({ params }) => ({ chatId: params.chatId, id: params.id, status: 'error' as const }),
  target: messageModel.messageStatusUpdated,
});
