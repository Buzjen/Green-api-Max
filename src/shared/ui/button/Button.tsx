import type { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  block?: boolean;
}

export function Button({
  variant = 'primary',
  block = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      data-variant={variant}
      data-block={block}
      {...props}
    />
  );
}
