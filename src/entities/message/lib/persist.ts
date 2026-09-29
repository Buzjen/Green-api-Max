import type { MessagesByChat } from '../model/types';

export const STORAGE_KEY = 'max-chat:messages';
/** Сколько последних сообщений каждого чата хранить между перезагрузками. */
const MAX_PER_CHAT = 300;

export function isMessagesByChat(value: unknown): value is MessagesByChat {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(Array.isArray)
  );
}

export function serializeMessages(
  messagesByChat: MessagesByChat,
): MessagesByChat {
  return Object.fromEntries(
    Object.entries(messagesByChat).map(([chatId, messages]) => [
      chatId,
      // «Отправляется» после перезагрузки уже не завершится —
      // сохраняем как ошибку
      messages
        .slice(-MAX_PER_CHAT)
        .map((message) =>
          message.status === 'sending'
            ? { ...message, status: 'error' as const }
            : message,
        ),
    ]),
  );
}
