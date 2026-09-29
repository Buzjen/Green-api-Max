import type { ReactNode } from 'react';
import styles from './ErrorText.module.css';

/** Ошибка формы; ничего не рендерит, если ошибки нет. */
export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className={styles.error} role="alert">
      {children}
    </p>
  );
}
