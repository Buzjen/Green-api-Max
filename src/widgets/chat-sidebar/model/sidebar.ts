import { combine } from 'effector';
import { chatModel } from '@/entities/chat';
import { messageModel } from '@/entities/message';

export interface SidebarItem {
  chatId: string;
  title: string;
  preview: string;
  lastActivity: number;
}

/** Чаты с последним сообщением, свежие сверху. */
export const $items = combine(
  chatModel.$chats,
  messageModel.$messagesByChat,
  (chats, messagesByChat): SidebarItem[] =>
    chats
      .map((chat) => {
        const last = messagesByChat[chat.chatId]?.at(-1);
        return {
          chatId: chat.chatId,
          title: chat.title,
          preview: last
            ? `${last.direction === 'outgoing' ? 'Вы: ' : ''}${last.text}`
            : 'Нет сообщений',
          lastActivity: last?.timestamp ?? chat.createdAt,
        };
      })
      .sort((a, b) => b.lastActivity - a.lastActivity),
);
