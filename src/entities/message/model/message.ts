import { createEvent, createStore } from 'effector';
import { persist } from '@/shared/lib/storage';
import {
  isMessagesByChat,
  serializeMessages,
  STORAGE_KEY,
} from '../lib/persist';
import type { Message, MessagesByChat, MessageStatus } from './types';

export const messageAdded = createEvent<Message>();
export const messageStatusUpdated = createEvent<{
  chatId: string;
  id: string;
  status: MessageStatus;
  idMessage?: string;
}>();
export const reset = createEvent();
export const restoreRequested = createEvent();

function isDuplicate(messages: Message[], message: Message): boolean {
  return messages.some(
    (item) =>
      item.id === message.id ||
      (message.idMessage !== null && item.idMessage === message.idMessage),
  );
}

export const $messagesByChat = createStore<MessagesByChat>({})
  .on(messageAdded, (state, message) => {
    const messages = state[message.chatId] ?? [];
    if (isDuplicate(messages, message)) return state;
    return { ...state, [message.chatId]: [...messages, message] };
  })
  .on(messageStatusUpdated, (state, { chatId, id, status, idMessage }) => {
    const messages = state[chatId];
    if (!messages?.some((message) => message.id === id)) return state;
    return {
      ...state,
      [chatId]: messages.map((message) =>
        message.id === id
          ? { ...message, status, idMessage: idMessage ?? message.idMessage }
          : message,
      ),
    };
  })
  .reset(reset);

const restored = persist({
  store: $messagesByChat,
  key: STORAGE_KEY,
  pickup: restoreRequested,
  isValid: isMessagesByChat,
  isEmpty: (messagesByChat) => Object.keys(messagesByChat).length === 0,
  serialize: serializeMessages,
});

// Сообщения, пришедшие до восстановления, не теряются
$messagesByChat.on(restored, (current, saved) => {
  const merged: MessagesByChat = { ...saved };
  for (const [chatId, messages] of Object.entries(current)) {
    const base = merged[chatId] ?? [];
    merged[chatId] = [
      ...base,
      ...messages.filter((message) => !isDuplicate(base, message)),
    ];
  }
  return merged;
});
