export { ApiError, isAbortError } from './client';
export { describeApiError, isSessionError } from './errors';
export {
  MAX_MESSAGE_LENGTH,
  checkAccount,
  deleteNotification,
  receiveNotification,
  sendMessage,
} from './methods';
export type {
  ApiCredentials,
  CheckAccountResponse,
  Notification,
  NotificationBody,
  SendMessageResponse,
} from './types';
