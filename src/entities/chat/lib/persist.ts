import { readJson, removeItem, writeJson } from '@/shared/lib/storage';
import type { Chat } from '../model/types';

const KEY = 'max-chat:chats';

function isChatList(value: unknown): value is Chat[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.chatId === 'string' &&
        typeof item.phone === 'string' &&
        typeof item.title === 'string',
    )
  );
}

export const loadChats = () => readJson(KEY, isChatList) ?? [];

export function saveChats(chats: Chat[]): void {
  if (chats.length > 0) writeJson(KEY, chats);
  else removeItem(KEY);
}
