import type { ApiCredentials } from '@/shared/api';
import { readJson, removeItem, writeJson } from '@/shared/lib/storage';

const KEY = 'max-chat:session';

function isCredentials(value: unknown): value is ApiCredentials {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.apiUrl === 'string' &&
    typeof v.idInstance === 'string' &&
    typeof v.apiTokenInstance === 'string'
  );
}

export const loadCredentials = () => readJson(KEY, isCredentials);

export function saveCredentials(credentials: ApiCredentials | null): void {
  if (credentials) writeJson(KEY, credentials);
  else removeItem(KEY);
}
