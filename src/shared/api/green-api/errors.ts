import { ApiError } from './client';

/** Ошибка, после которой продолжать работу с этими кредами бессмысленно. */
export function isSessionError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.status === 401 || error.status === 403) return true;
  // 400 на receiveNotification — неверные параметры инстанса или задан webhookUrl
  return error.status === 400;
}

/** Человекочитаемый текст ошибки API. */
export function describeApiError(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body.toLowerCase();
    if (body.includes('webhook')) return 'Очистите webhookUrl в личном кабинете GREEN-API';
    if (body.includes('suspended'))
      return 'Аккаунт GREEN-API заблокирован (Your account is suspended)';
    switch (error.status) {
      case 400:
        if (body.includes('idinstance') || body.includes('apitokeninstance')) {
          return 'Неверные idInstance или apiTokenInstance';
        }
        return error.body || 'Некорректный запрос';
      case 401:
      case 403:
        return 'Неверные idInstance или apiTokenInstance';
      case 429:
        return 'Слишком много запросов, попробуйте позже';
      case 466:
        return 'Исчерпан лимит тарифа GREEN-API';
      case 469:
        return 'Превышен лимит проверки номеров, повторите через пару часов';
      default:
        return error.body || `Ошибка GREEN-API (${error.status})`;
    }
  }
  if (error instanceof TypeError) return 'Нет соединения с GREEN-API';
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
}
