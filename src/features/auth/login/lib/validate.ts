export interface LoginFormValues {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export function validateLogin(values: LoginFormValues): string | null {
  if (!/^\d+$/.test(values.idInstance.trim())) return 'idInstance должен состоять только из цифр';
  if (!values.apiTokenInstance.trim()) return 'Введите apiTokenInstance';
  const apiUrl = values.apiUrl.trim();
  if (apiUrl && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(:\d+)?(\/[\w./-]*)?$/i.test(apiUrl)) {
    return 'Некорректный apiUrl';
  }
  return null;
}
