import { findChatById, findChatByPhone, type Chat } from '@/entities/chat';
import type { ParsedNotification } from '@/entities/message';

/**
 * Ищет чат для уведомления: сначала по chatId, затем по телефону отправителя
 * (на случай, если чат создан до того, как стал известен chatId).
 */
export function resolveChat(
  chats: Chat[],
  { sender }: ParsedNotification,
): Chat | null {
  return (
    findChatById(chats, sender.chatId) ?? findChatByPhone(chats, sender.phone)
  );
}
