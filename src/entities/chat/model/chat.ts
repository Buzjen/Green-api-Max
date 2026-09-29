import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { loadChats, saveChats } from '../lib/persist';
import type { Chat } from './types';

export const chatAdded = createEvent<Omit<Chat, 'createdAt'> & { createdAt?: number }>();
export const chatSelected = createEvent<string | null>();
export const reset = createEvent();
export const restoreRequested = createEvent();

const loadFx = createEffect(loadChats);
const saveFx = createEffect(saveChats);

export const $chats = createStore<Chat[]>([])
  .on(chatAdded, (chats, chat) =>
    chats.some((item) => item.chatId === chat.chatId)
      ? chats
      : [...chats, { ...chat, createdAt: chat.createdAt ?? Date.now() }],
  )
  .on(loadFx.doneData, (current, restored) => {
    const ids = new Set(restored.map((chat) => chat.chatId));
    return [...restored, ...current.filter((chat) => !ids.has(chat.chatId))];
  })
  .reset(reset);

export const $activeChatId = createStore<string | null>(null)
  .on(chatSelected, (_, chatId) => chatId)
  .reset(reset);

export const $activeChat = combine(
  $chats,
  $activeChatId,
  (chats, chatId) => chats.find((chat) => chat.chatId === chatId) ?? null,
);

sample({ clock: restoreRequested, target: loadFx });
sample({ clock: $chats.updates, target: saveFx });
