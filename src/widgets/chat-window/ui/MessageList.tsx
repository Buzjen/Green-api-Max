import { useUnit } from 'effector-react';
import { Fragment, useLayoutEffect, useRef } from 'react';
import { MessageBubble } from '@/entities/message';
import { sendMessageModel } from '@/features/message/send';
import { formatDay, isSameDay } from '@/shared/lib/date';
import { $activeMessages } from '../model/chat-window';
import {
  Day,
  Messages,
  MessagesInner,
  NoMessages,
  Pill,
} from './ChatWindow.styles';

/**
 * Насколько близко к низу (px) нужно быть,
 * чтобы новые сообщения прокручивали ленту.
 */
const STICK_THRESHOLD = 120;

export function MessageList() {
  const [messages, retry] = useUnit([
    $activeMessages,
    sendMessageModel.retryRequested,
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    stickToBottom.current =
      list.scrollHeight - list.scrollTop - list.clientHeight < STICK_THRESHOLD;
  };

  if (messages.length === 0) {
    return (
      <NoMessages>
        <Pill>Нет сообщений</Pill>
      </NoMessages>
    );
  }

  return (
    <Messages ref={listRef} onScroll={handleScroll}>
      <MessagesInner>
        {messages.map((message, index) => {
          const showDay =
            index === 0 ||
            !isSameDay(messages[index - 1].timestamp, message.timestamp);
          return (
            <Fragment key={message.id}>
              {showDay && <Day>{formatDay(message.timestamp)}</Day>}
              <MessageBubble message={message} onRetry={retry} />
            </Fragment>
          );
        })}
      </MessagesInner>
    </Messages>
  );
}
