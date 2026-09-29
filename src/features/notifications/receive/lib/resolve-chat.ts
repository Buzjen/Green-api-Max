import type { Chat } from '@/entities/chat';
import type { ParsedNotification } from '@/entities/message';

/**
 * Ищет чат для уведомления: сначала по chatId, затем по телефону отправителя
 * (на случай, если чат создан до того, как стал известен chatId).
 */
export function resolveChat(chats: Chat[], { sender }: ParsedNotification): Chat | null {
  return (
    chats.find((chat) => chat.chatId === sender.chatId) ??
    (sender.phone ? chats.find((chat) => chat.phone === sender.phone) : undefined) ??
    null
  );
}
