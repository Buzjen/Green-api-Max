import { useUnit } from 'effector-react';
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { MAX_MESSAGE_LENGTH } from '@/shared/api';
import { SendIcon } from '@/shared/ui';
import { messageSendRequested } from '../model/send';
import {
  Container,
  Counter,
  Field,
  SendButton,
  Textarea,
} from './MessageInput.styles';

/** За сколько символов до лимита показывать счётчик. */
const COUNTER_THRESHOLD = 500;

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
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <Container>
      <Field>
        <Textarea
          ref={textareaRef}
          rows={1}
          placeholder="Сообщение"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {text.length > MAX_MESSAGE_LENGTH - COUNTER_THRESHOLD && (
          <Counter data-over={tooLong}>
            {text.length}/{MAX_MESSAGE_LENGTH}
          </Counter>
        )}
      </Field>
      <SendButton
        type="button"
        onClick={submit}
        disabled={!canSend}
        title="Отправить (Enter)"
      >
        <SendIcon />
      </SendButton>
    </Container>
  );
}
