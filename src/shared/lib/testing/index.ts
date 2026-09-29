import type { ApiCredentials } from '@/shared/api';

/** Креды-заглушка для тестов моделей: сеть в тестах всегда подменена. */
export const testCredentials: ApiCredentials = {
  apiUrl: 'https://test.api.green-api.com',
  idInstance: '1',
  apiTokenInstance: 'token',
};
