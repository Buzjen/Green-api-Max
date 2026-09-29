import { describe, expect, it } from 'vitest';
import type { NotificationBody } from '@/shared/api';
import { parseNotification } from './parseNotification';

const senderData = {
  chatId: '10000000',
  chatName: 'Иван',
  senderName: 'Иван',
  senderPhoneNumber: 79876543210,
};

describe('parseNotification', () => {
  it('разбирает textMessage', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1763115112,
      idMessage: '1265',
      senderData,
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    };

    expect(parseNotification(body)).toEqual({
      message: {
        id: '1265',
        idMessage: '1265',
        chatId: '10000000',
        text: 'Привет',
        timestamp: 1763115112000,
        direction: 'incoming',
        status: 'received',
      },
      sender: { chatId: '10000000', name: 'Иван', phone: '79876543210' },
    });
  });

  it('разбирает extendedTextMessage', () => {
    const parsed = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1,
      idMessage: '2',
      senderData,
      messageData: {
        typeMessage: 'extendedTextMessage',
        extendedTextMessageData: { text: 'https://example.com' },
      },
    });
    expect(parsed?.message.text).toBe('https://example.com');
  });

  it('разбирает сообщение, отправленное с телефона, как исходящее', () => {
    const parsed = parseNotification({
      typeWebhook: 'outgoingMessageReceived',
      timestamp: 1,
      idMessage: '3',
      senderData: { ...senderData, senderName: 'Я' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Ок' } },
    });
    expect(parsed?.message.direction).toBe('outgoing');
    expect(parsed?.sender.phone).toBe('');
  });

  it.each<[string, NotificationBody | null]>([
    ['null', null],
    ['статус инстанса', { typeWebhook: 'stateInstanceChanged' }],
    [
      'отправка через API',
      {
        typeWebhook: 'outgoingAPIMessageReceived',
        idMessage: '4',
        senderData,
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'x' } },
      },
    ],
    [
      'медиа',
      {
        typeWebhook: 'incomingMessageReceived',
        idMessage: '5',
        senderData,
        messageData: { typeMessage: 'imageMessage' },
      },
    ],
    [
      'без chatId',
      {
        typeWebhook: 'incomingMessageReceived',
        idMessage: '6',
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'x' } },
      },
    ],
  ])('возвращает null: %s', (_, body) => {
    expect(parseNotification(body)).toBeNull();
  });
});
