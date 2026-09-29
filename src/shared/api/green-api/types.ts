/** Параметры доступа к инстансу. apiUrl уже вычислен (см. shared/config). */
export interface ApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache: boolean;
}

export interface DeleteNotificationResponse {
  result: boolean;
}

/** Только те поля уведомления, которые реально читаются приложением. */
export interface NotificationBody {
  typeWebhook: string;
  timestamp?: number;
  idMessage?: string;
  senderData?: {
    chatId?: string;
    chatName?: string;
    senderName?: string;
    senderPhoneNumber?: number;
  };
  messageData?: {
    typeMessage?: string;
    textMessageData?: { textMessage?: string };
    extendedTextMessageData?: { text?: string };
  };
}

export interface Notification {
  receiptId: number;
  body: NotificationBody;
}
