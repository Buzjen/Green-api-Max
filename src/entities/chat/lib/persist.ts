import type { Chat } from '../model/types';

export const STORAGE_KEY = 'max-chat:chats';

export function isChatList(value: unknown): value is Chat[] {
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
