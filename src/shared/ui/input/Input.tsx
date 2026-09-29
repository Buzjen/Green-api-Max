import { forwardRef, type InputHTMLAttributes } from 'react';
import { Field, Hint, Label, StyledInput } from './Input.styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, ...props },
  ref,
) {
  return (
    <Field>
      {label && <Label>{label}</Label>}
      <StyledInput ref={ref} {...props} />
      {hint && <Hint>{hint}</Hint>}
    </Field>
  );
});
