import type { NotificationBody } from '@/shared/api';
import type { Message } from '../model/types';

export interface ParsedNotification {
  message: Message;
  /** Данные собеседника — чтобы найти или создать чат. */
  sender: {
    chatId: string;
    name: string;
    /** Телефон собеседника; для исходящих неизвестен. */
    phone: string;
  };
}

const MS_IN_SECOND = 1000;

const DIRECTION_BY_TYPE: Record<string, Message['direction']> = {
  incomingMessageReceived: 'incoming',
  // сообщение, отправленное с телефона; отправленные через API
  // (outgoingAPIMessageReceived) уже есть в ленте, поэтому игнорируются
  outgoingMessageReceived: 'outgoing',
};

function extractText(
  messageData: NotificationBody['messageData'],
): string | null {
  switch (messageData?.typeMessage) {
    case 'textMessage':
      return messageData.textMessageData?.textMessage ?? null;
    case 'extendedTextMessage':
      return messageData.extendedTextMessageData?.text ?? null;
    default:
      return null;
  }
}

/** Превращает тело уведомления в сообщение. Всё, что не текст, — `null`. */
export function parseNotification(
  body: NotificationBody | null | undefined,
): ParsedNotification | null {
  if (!body) return null;
  const direction = DIRECTION_BY_TYPE[body.typeWebhook];
  if (!direction) return null;

  const chatId = body.senderData?.chatId;
  const text = extractText(body.messageData);
  if (!chatId || !body.idMessage || text === null || text === '') return null;

  const phone =
    direction === 'incoming' && body.senderData?.senderPhoneNumber
      ? String(body.senderData.senderPhoneNumber)
      : '';
  const name =
    body.senderData?.chatName ||
    (direction === 'incoming' ? body.senderData?.senderName : '') ||
    '';

  return {
    message: {
      id: body.idMessage,
      idMessage: body.idMessage,
      chatId,
      text,
      timestamp: body.timestamp ? body.timestamp * MS_IN_SECOND : Date.now(),
      direction,
      status: direction === 'incoming' ? 'received' : 'sent',
    },
    sender: { chatId, name, phone },
  };
}
