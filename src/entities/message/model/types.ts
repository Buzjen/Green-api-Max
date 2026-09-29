export type MessageDirection = 'incoming' | 'outgoing';
export type MessageStatus = 'sending' | 'sent' | 'error' | 'received';

export interface Message {
  /** Локальный ключ: tempId для оптимистичных сообщений или idMessage. */
  id: string;
  /** Идентификатор GREEN-API, известен после отправки или для входящих. */
  idMessage: string | null;
  chatId: string;
  text: string;
  /** Unix-время в миллисекундах. */
  timestamp: number;
  direction: MessageDirection;
  status: MessageStatus;
}

export type MessagesByChat = Record<string, Message[]>;
