import { combine, createEvent, createStore } from 'effector';
import { persist } from '@/shared/lib/storage';
import { findChatById } from '../lib/find';
import { isChatList, STORAGE_KEY } from '../lib/persist';
import type { Chat } from './types';

export const chatAdded = createEvent<
  Omit<Chat, 'createdAt'> & { createdAt?: number }
>();
export const chatSelected = createEvent<string | null>();
export const reset = createEvent();
export const restoreRequested = createEvent();

export const $chats = createStore<Chat[]>([])
  .on(chatAdded, (chats, chat) =>
    findChatById(chats, chat.chatId)
      ? chats
      : [...chats, { ...chat, createdAt: chat.createdAt ?? Date.now() }],
  )
  .reset(reset);

export const $activeChatId = createStore<string | null>(null)
  .on(chatSelected, (_, chatId) => chatId)
  .reset(reset);

export const $activeChat = combine($chats, $activeChatId, findChatById);

const restored = persist({
  store: $chats,
  key: STORAGE_KEY,
  pickup: restoreRequested,
  isValid: isChatList,
  isEmpty: (chats) => chats.length === 0,
});

// Чаты, добавленные до восстановления, не теряются
$chats.on(restored, (current, saved) => [
  ...saved,
  ...current.filter((chat) => !findChatById(saved, chat.chatId)),
]);
