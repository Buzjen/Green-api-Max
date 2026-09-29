const DEFAULT_API_URL_TEMPLATE = 'https://{cluster}.api.green-api.com';

/**
 * Шаблон адреса GREEN-API. `{cluster}` заменяется кластером инстанса;
 * без плейсхолдера адрес используется как есть для любого инстанса.
 */
export const API_URL_TEMPLATE =
  import.meta.env.VITE_GREEN_API_URL?.trim() || DEFAULT_API_URL_TEMPLATE;
