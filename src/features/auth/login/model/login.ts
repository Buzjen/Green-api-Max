import { combine, createEvent, createStore, sample } from 'effector';
import { sessionModel } from '@/entities/session';
import { resolveApiUrl } from '@/shared/config';
import { validateLogin, type LoginFormValues } from '../lib/validate';

export const fieldChanged = createEvent<{ name: keyof LoginFormValues; value: string }>();
export const loginSubmitted = createEvent();

const INITIAL: LoginFormValues = { idInstance: '', apiTokenInstance: '', apiUrl: '' };

/**
 * Значения живут в модели, а не в компоненте: если API отклонит креды,
 * форма перемонтируется, но введённые данные сохранятся.
 */
export const $values = createStore(INITIAL)
  .on(fieldChanged, (values, { name, value }) => ({ ...values, [name]: value }))
  .reset(sessionModel.reset);

const $validationError = createStore<string | null>(null).reset(
  fieldChanged,
  sessionModel.sessionStarted,
  sessionModel.reset,
);

sample({
  clock: loginSubmitted,
  source: $values,
  fn: validateLogin,
  target: $validationError,
});

/** Локальная ошибка формы или причина, по которой API отклонил креды. */
export const $error = combine(
  $validationError,
  sessionModel.$sessionError,
  (validation, session) => validation ?? session,
);

sample({
  clock: loginSubmitted,
  source: $values,
  filter: (values) => validateLogin(values) === null,
  fn: (values) => ({
    idInstance: values.idInstance.trim(),
    apiTokenInstance: values.apiTokenInstance.trim(),
    apiUrl: resolveApiUrl(values.idInstance, values.apiUrl),
  }),
  target: sessionModel.sessionStarted,
});
