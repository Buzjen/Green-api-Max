import {
  createEvent,
  createStore,
  sample,
  type EventCallable,
  type UnitTargetable,
} from 'effector';
import type { ApiCredentials } from '@/shared/api';
import { persist } from '@/shared/lib/storage';
import { isCredentials, STORAGE_KEY } from '../lib/persist';

export const sessionStarted = createEvent<ApiCredentials>();
/**
 * Креды отклонены API: сессия сбрасывается,
 * причина показывается на форме входа.
 */
export const sessionFailed = createEvent<string>();
export const reset = createEvent();
export const restoreRequested = createEvent();

export const $credentials = createStore<ApiCredentials | null>(null)
  .on(sessionStarted, (_, credentials) => credentials)
  .reset(sessionFailed, reset);

export const $isAuthorized = $credentials.map(Boolean);

export const $sessionError = createStore<string | null>(null)
  .on(sessionFailed, (_, reason) => reason)
  .reset(sessionStarted, reset);

const restored = persist({
  store: $credentials,
  key: STORAGE_KEY,
  pickup: restoreRequested,
  isValid: isCredentials,
  isEmpty: (credentials) => credentials === null,
});

sample({ clock: restored, filter: Boolean, target: sessionStarted });

/**
 * Событие, которое вызывает эффект с кредами текущей сессии.
 * Без активной сессии вызов игнорируется.
 */
export function withCredentials<Params extends { credentials: ApiCredentials }>(
  fx: UnitTargetable<Params>,
): EventCallable<Omit<Params, 'credentials'>> {
  const called = createEvent<Omit<Params, 'credentials'>>();
  sample({
    clock: called,
    source: $credentials,
    filter: Boolean,
    fn: (credentials, params) => ({ ...params, credentials }) as Params,
    target: fx,
  });
  return called;
}
