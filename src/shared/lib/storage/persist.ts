import {
  createEffect,
  sample,
  type Event,
  type Store,
  type Unit,
} from 'effector';
import { readJson, removeItem, writeJson } from './storage';

interface PersistOptions<T> {
  store: Store<T>;
  key: string;
  /** По этому событию значение читается из хранилища. */
  pickup: Unit<void>;
  /** Проверка формы данных: битое или чужое значение игнорируется. */
  isValid: (value: unknown) => value is T;
  /** Пустое значение не записывается, а удаляет ключ. */
  isEmpty: (value: T) => boolean;
  /** Преобразование перед записью. */
  serialize?: (value: T) => T;
}

/**
 * Синхронизирует стор с localStorage: каждое обновление записывается,
 * а по `pickup` сохранённое значение читается и отдаётся в возвращаемое
 * событие. Как слить его с текущим состоянием, решает вызывающий код.
 */
export function persist<T>({
  store,
  key,
  pickup,
  isValid,
  isEmpty,
  serialize = (value) => value,
}: PersistOptions<T>): Event<T> {
  const loadFx = createEffect<void, T | null>(() => readJson(key, isValid));
  const saveFx = createEffect((value: T) => {
    if (isEmpty(value)) removeItem(key);
    else writeJson(key, serialize(value));
  });

  sample({ clock: pickup, target: loadFx });
  sample({ clock: store.updates, target: saveFx });

  return sample({
    clock: loadFx.doneData,
    filter: (value): value is T => value !== null,
  });
}
