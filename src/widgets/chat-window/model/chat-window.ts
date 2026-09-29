import { combine } from 'effector';
import { chatModel } from '@/entities/chat';
import { messageModel, type Message } from '@/entities/message';

const EMPTY: Message[] = [];

export const $activeMessages = combine(
  chatModel.$activeChatId,
  messageModel.$messagesByChat,
  (chatId, messagesByChat) =>
    chatId ? (messagesByChat[chatId] ?? EMPTY) : EMPTY,
);
