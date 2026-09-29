import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cx } from '@/shared/lib/cx';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className={cx(styles.field, className)} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <input ref={ref} id={inputId} className={styles.input} {...props} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
});
