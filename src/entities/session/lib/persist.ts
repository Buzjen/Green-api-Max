import type { ApiCredentials } from '@/shared/api';

export const STORAGE_KEY = 'max-chat:session';

export function isCredentials(value: unknown): value is ApiCredentials {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.apiUrl === 'string' &&
    typeof v.idInstance === 'string' &&
    typeof v.apiTokenInstance === 'string'
  );
}
