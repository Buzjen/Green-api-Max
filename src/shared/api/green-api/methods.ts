import { request } from './client';
import type {
  ApiCredentials,
  CheckAccountResponse,
  DeleteNotificationResponse,
  Notification,
  SendMessageResponse,
} from './types';

/** Максимальная длина текста для SendMessage. */
export const MAX_MESSAGE_LENGTH = 4000;

export async function sendMessage(
  credentials: ApiCredentials,
  params: { chatId: string; message: string },
): Promise<SendMessageResponse> {
  const data = await request<SendMessageResponse>(credentials, {
    method: 'POST',
    apiMethod: 'sendMessage',
    body: params,
  });
  if (!data?.idMessage) throw new Error('Пустой ответ sendMessage');
  return data;
}

/** Возвращает `null`, если за receiveTimeout очередь осталась пустой. */
export function receiveNotification(
  credentials: ApiCredentials,
  params: { receiveTimeout: number; signal?: AbortSignal },
): Promise<Notification | null> {
  return request<Notification>(credentials, {
    method: 'GET',
    apiMethod: 'receiveNotification',
    query: { receiveTimeout: params.receiveTimeout },
    signal: params.signal,
  });
}

export async function deleteNotification(
  credentials: ApiCredentials,
  params: { receiptId: number },
): Promise<DeleteNotificationResponse> {
  const data = await request<DeleteNotificationResponse>(credentials, {
    method: 'DELETE',
    apiMethod: 'deleteNotification',
    pathSuffix: String(params.receiptId),
  });
  return data ?? { result: false };
}

export async function checkAccount(
  credentials: ApiCredentials,
  params: { phoneNumber: number },
): Promise<CheckAccountResponse> {
  const data = await request<CheckAccountResponse>(credentials, {
    method: 'POST',
    apiMethod: 'checkAccount',
    body: params,
  });
  if (!data) throw new Error('Пустой ответ checkAccount');
  return data;
}
