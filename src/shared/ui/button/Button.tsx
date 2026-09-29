import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/shared/lib/cx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  block?: boolean;
}

export function Button({
  variant = 'primary',
  block = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[variant],
        block && styles.block,
        className,
      )}
      {...props}
    />
  );
}
