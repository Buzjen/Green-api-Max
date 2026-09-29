/**
 * Хост API зависит от кластера инстанса. По умолчанию он совпадает с первыми
 * четырьмя цифрами idInstance: 3100123456 → https://3100.api.green-api.com.
 * Если в личном кабинете указан другой apiUrl — пользователь
 * вводит его вручную.
 */
export function resolveApiUrl(idInstance: string, apiUrl?: string): string {
  const custom = apiUrl?.trim();
  if (custom) {
    const withProtocol = /^https?:\/\//i.test(custom)
      ? custom
      : `https://${custom}`;
    return withProtocol.replace(/\/+$/, '');
  }
  return `https://${idInstance.trim().slice(0, 4)}.api.green-api.com`;
}
