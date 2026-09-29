import type { Chat } from '../model/types';

export const findChatById = (chats: Chat[], chatId: string | null) =>
  chats.find((chat) => chat.chatId === chatId) ?? null;

export const findChatByPhone = (chats: Chat[], phone: string) =>
  phone ? (chats.find((chat) => chat.phone === phone) ?? null) : null;
