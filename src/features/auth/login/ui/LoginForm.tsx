import { useUnit } from 'effector-react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button, ErrorText, Input } from '@/shared/ui';
import type { LoginFormValues } from '../lib/validate';
import { $error, $values, fieldChanged, loginSubmitted } from '../model/login';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const [values, error, change, submit] = useUnit([
    $values,
    $error,
    fieldChanged,
    loginSubmitted,
  ]);
  const { idInstance, apiTokenInstance, apiUrl } = values;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    change({
      name: event.target.name as keyof LoginFormValues,
      value: event.target.value,
    });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="idInstance"
        name="idInstance"
        inputMode="numeric"
        autoComplete="username"
        placeholder="3100123456"
        value={idInstance}
        onChange={handleChange}
        autoFocus={!idInstance}
      />
      <Input
        label="apiTokenInstance"
        name="apiTokenInstance"
        type="password"
        autoComplete="current-password"
        placeholder="Токен из личного кабинета"
        value={apiTokenInstance}
        onChange={handleChange}
      />
      <details className={styles.advanced}>
        <summary>Дополнительно</summary>
        <Input
          label="apiUrl"
          name="apiUrl"
          placeholder="https://3100.api.green-api.com"
          hint="По умолчанию вычисляется по первым 4 цифрам idInstance"
          value={apiUrl}
          onChange={handleChange}
        />
      </details>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" block disabled={!idInstance || !apiTokenInstance}>
        Войти
      </Button>
    </form>
  );
}
