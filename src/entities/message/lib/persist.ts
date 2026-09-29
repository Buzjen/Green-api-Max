import { readJson, removeItem, writeJson } from '@/shared/lib/storage';
import type { MessagesByChat } from '../model/types';

const KEY = 'max-chat:messages';
/** Сколько последних сообщений каждого чата хранить между перезагрузками. */
const MAX_PER_CHAT = 300;

function isMessagesByChat(value: unknown): value is MessagesByChat {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(Array.isArray)
  );
}

export const loadMessages = () => readJson(KEY, isMessagesByChat) ?? {};

export function saveMessages(messagesByChat: MessagesByChat): void {
  const entries = Object.entries(messagesByChat);
  if (entries.length === 0) {
    removeItem(KEY);
    return;
  }
  writeJson(
    KEY,
    Object.fromEntries(
      entries.map(([chatId, messages]) => [
        chatId,
        // «Отправляется» после перезагрузки уже не завершится — сохраняем как ошибку
        messages
          .slice(-MAX_PER_CHAT)
          .map((message) =>
            message.status === 'sending' ? { ...message, status: 'error' } : message,
          ),
      ]),
    ),
  );
}
