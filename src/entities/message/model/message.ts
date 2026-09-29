import { createEffect, createEvent, createStore, sample } from 'effector';
import { loadMessages, saveMessages } from '../lib/persist';
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

const loadFx = createEffect(loadMessages);
const saveFx = createEffect(saveMessages);

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
  .on(loadFx.doneData, (current, restored) => {
    const merged: MessagesByChat = { ...restored };
    for (const [chatId, messages] of Object.entries(current)) {
      const base = merged[chatId] ?? [];
      merged[chatId] = [...base, ...messages.filter((message) => !isDuplicate(base, message))];
    }
    return merged;
  })
  .reset(reset);

sample({ clock: restoreRequested, target: loadFx });
sample({ clock: $messagesByChat.updates, target: saveFx });
