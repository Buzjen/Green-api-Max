export interface LoginFormValues {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

const DIGITS_ONLY = /^\d+$/;
/** Хост с доменом верхнего уровня, опционально протокол, порт и путь. */
const API_URL_PATTERN =
  /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(:\d+)?(\/[\w./-]*)?$/i;

export function validateLogin(values: LoginFormValues): string | null {
  if (!DIGITS_ONLY.test(values.idInstance.trim()))
    return 'idInstance должен состоять только из цифр';
  if (!values.apiTokenInstance.trim()) return 'Введите apiTokenInstance';
  const apiUrl = values.apiUrl.trim();
  if (apiUrl && !API_URL_PATTERN.test(apiUrl)) return 'Некорректный apiUrl';
  return null;
}
