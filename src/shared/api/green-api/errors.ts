import { ApiError } from './client';

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOO_MANY_REQUESTS: 429,
  /** Исчерпан лимит тарифа GREEN-API. */
  QUOTA_EXCEEDED: 466,
  /** Превышен лимит проверки номеров (CheckAccount). */
  CHECK_ACCOUNT_LIMIT: 469,
} as const;

/** Ошибка, после которой продолжать работу с этими кредами бессмысленно. */
export function isSessionError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (
    error.status === HTTP_STATUS.UNAUTHORIZED ||
    error.status === HTTP_STATUS.FORBIDDEN
  ) {
    return true;
  }
  // 400 на receiveNotification — неверные параметры инстанса
  // или задан webhookUrl
  return error.status === HTTP_STATUS.BAD_REQUEST;
}

/** Человекочитаемый текст ошибки API. */
export function describeApiError(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body.toLowerCase();
    if (body.includes('webhook'))
      return 'Очистите webhookUrl в личном кабинете GREEN-API';
    if (body.includes('suspended'))
      return 'Аккаунт GREEN-API заблокирован (Your account is suspended)';
    switch (error.status) {
      case HTTP_STATUS.BAD_REQUEST:
        if (body.includes('idinstance') || body.includes('apitokeninstance')) {
          return 'Неверные idInstance или apiTokenInstance';
        }
        return error.body || 'Некорректный запрос';
      case HTTP_STATUS.UNAUTHORIZED:
      case HTTP_STATUS.FORBIDDEN:
        return 'Неверные idInstance или apiTokenInstance';
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return 'Слишком много запросов, попробуйте позже';
      case HTTP_STATUS.QUOTA_EXCEEDED:
        return 'Исчерпан лимит тарифа GREEN-API';
      case HTTP_STATUS.CHECK_ACCOUNT_LIMIT:
        return 'Превышен лимит проверки номеров, повторите через пару часов';
      default:
        return error.body || `Ошибка GREEN-API (${error.status})`;
    }
  }
  if (error instanceof TypeError) return 'Нет соединения с GREEN-API';
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
}
