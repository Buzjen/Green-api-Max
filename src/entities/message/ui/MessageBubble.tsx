import { formatTime } from '@/shared/lib/date';
import { RetryIcon } from '@/shared/ui';
import type { Message } from '../model/types';
import { cx } from '@/shared/lib/cx';
import styles from './MessageBubble.module.css';

const STATUS_LABEL: Record<Message['status'], string> = {
  sending: '🕓',
  sent: '✓',
  error: '!',
  received: '',
};

interface MessageBubbleProps {
  message: Message;
  onRetry?: (message: Message) => void;
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const outgoing = message.direction === 'outgoing';
  return (
    <div
      className={cx(styles.row, outgoing ? styles.outgoing : styles.incoming)}
    >
      <div
        className={cx(
          styles.bubble,
          message.status === 'error' && styles.error,
        )}
      >
        <span className={styles.text}>{message.text}</span>
        <span className={styles.meta}>
          {formatTime(message.timestamp)}
          {outgoing && (
            <span
              className={styles.status}
              title={message.status === 'error' ? 'Не отправлено' : undefined}
            >
              {STATUS_LABEL[message.status]}
            </span>
          )}
        </span>
      </div>
      {message.status === 'error' && onRetry && (
        <button
          type="button"
          className={styles.retry}
          onClick={() => onRetry(message)}
          title="Отправить ещё раз"
          aria-label="Отправить ещё раз"
        >
          <RetryIcon width={16} height={16} />
        </button>
      )}
    </div>
  );
}
