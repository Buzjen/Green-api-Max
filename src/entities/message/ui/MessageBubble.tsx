import { formatTime } from '@/shared/lib/date';
import { RetryIcon } from '@/shared/ui';
import type { Message } from '../model/types';
import {
  Bubble,
  Meta,
  RetryButton,
  Row,
  Status,
  Text,
} from './MessageBubble.styles';

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
  const isError = message.status === 'error';
  return (
    <Row data-direction={message.direction}>
      <Bubble data-error={isError}>
        <Text>{message.text}</Text>
        <Meta>
          {formatTime(message.timestamp)}
          {message.direction === 'outgoing' && (
            <Status
              data-error={isError}
              title={isError ? 'Не отправлено' : undefined}
            >
              {STATUS_LABEL[message.status]}
            </Status>
          )}
        </Meta>
      </Bubble>
      {isError && onRetry && (
        <RetryButton
          type="button"
          onClick={() => onRetry(message)}
          title="Отправить ещё раз"
        >
          <RetryIcon width={16} height={16} />
        </RetryButton>
      )}
    </Row>
  );
}
