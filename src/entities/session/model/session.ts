import { createEffect, createEvent, createStore, sample } from 'effector';
import type { ApiCredentials } from '@/shared/api';
import { loadCredentials, saveCredentials } from '../lib/persist';

export const sessionStarted = createEvent<ApiCredentials>();
/** Креды отклонены API: сессия сбрасывается, причина показывается на форме входа. */
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

const loadFx = createEffect(loadCredentials);
const saveFx = createEffect(saveCredentials);

sample({ clock: restoreRequested, target: loadFx });

sample({
  clock: loadFx.doneData,
  filter: (credentials): credentials is ApiCredentials => credentials !== null,
  target: sessionStarted,
});

sample({ clock: $credentials.updates, target: saveFx });
