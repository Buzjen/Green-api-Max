import { useUnit } from 'effector-react';
import { useState, type FormEvent } from 'react';
import { Button, CloseIcon, ErrorText, Input, Spinner } from '@/shared/ui';
import {
  $error,
  $pending,
  chatCreateRequested,
  formClosed,
} from '../model/create-chat';
import styles from './NewChatForm.module.css';

export function NewChatForm() {
  const [error, pending, create, close] = useUnit([
    $error,
    $pending,
    chatCreateRequested,
    formClosed,
  ]);
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    create(phone);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <span className={styles.title}>Новый чат</span>
        <Button variant="icon" onClick={close} aria-label="Закрыть">
          <CloseIcon width={18} height={18} />
        </Button>
      </div>
      <Input
        type="tel"
        name="phone"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 999 123-45-67"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        autoFocus
      />
      <ErrorText>{error}</ErrorText>
      <Button type="submit" block disabled={pending || !phone.trim()}>
        {pending ? <Spinner /> : 'Создать чат'}
      </Button>
    </form>
  );
}
