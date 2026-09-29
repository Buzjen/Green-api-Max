import { forwardRef, useId, type InputHTMLAttributes } from 'react';
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
    <label className={[styles.field, className].filter(Boolean).join(' ')} htmlFor={inputId}>
      {label && <span className={styles.label}>{label}</span>}
      <input ref={ref} id={inputId} className={styles.input} {...props} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
});
