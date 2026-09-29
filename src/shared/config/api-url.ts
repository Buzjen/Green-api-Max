const HTTP_PROTOCOL = /^https?:\/\//i;
const TRAILING_SLASHES = /\/+$/;
/** Сколько первых цифр idInstance задают кластер инстанса. */
const CLUSTER_DIGITS = 4;

/**
 * Хост API зависит от кластера инстанса. По умолчанию он совпадает с первыми
 * четырьмя цифрами idInstance: 3100123456 → https://3100.api.green-api.com.
 * Если в личном кабинете указан другой apiUrl — пользователь
 * вводит его вручную.
 */
export function resolveApiUrl(idInstance: string, apiUrl?: string): string {
  const custom = apiUrl?.trim();
  if (custom) {
    const withProtocol = HTTP_PROTOCOL.test(custom)
      ? custom
      : `https://${custom}`;
    return withProtocol.replace(TRAILING_SLASHES, '');
  }
  return `https://${idInstance.trim().slice(0, CLUSTER_DIGITS)}.api.green-api.com`;
}
