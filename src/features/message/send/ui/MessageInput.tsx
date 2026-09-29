import { useUnit } from 'effector-react';
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { MAX_MESSAGE_LENGTH } from '@/shared/api';
import { SendIcon } from '@/shared/ui';
import { messageSendRequested } from '../model/send';
import styles from './MessageInput.module.css';

export function MessageInput() {
  const send = useUnit(messageSendRequested);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tooLong = text.length > MAX_MESSAGE_LENGTH;
  const canSend = text.trim().length > 0 && !tooLong;

  // Высота поля растёт вместе с текстом (ограничена в CSS)
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  const submit = () => {
    if (!canSend) return;
    send(text);
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          placeholder="Сообщение"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Текст сообщения"
          autoFocus
        />
        {text.length > MAX_MESSAGE_LENGTH - 500 && (
          <span className={`${styles.counter} ${tooLong ? styles.over : ''}`}>
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </div>
      <button
        type="button"
        className={styles.send}
        onClick={submit}
        disabled={!canSend}
        aria-label="Отправить"
        title="Отправить (Enter)"
      >
        <SendIcon />
      </button>
    </div>
  );
}
