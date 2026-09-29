import { useUnit } from 'effector-react';
import { chatModel } from '@/entities/chat';
import { ConnectionBadge } from '@/features/notifications/receive';
import { MessageInput } from '@/features/message/send';
import { formatPhone } from '@/shared/lib/phone';
import { Avatar, BackIcon, Button, ChatIcon } from '@/shared/ui';
import { cx } from '@/shared/lib/cx';
import styles from './ChatWindow.module.css';
import { MessageList } from './MessageList';

export function ChatWindow() {
  const [chat, selectChat] = useUnit([
    chatModel.$activeChat,
    chatModel.chatSelected,
  ]);

  if (!chat) {
    return (
      <section className={cx(styles.window, styles.placeholder)}>
        <ChatIcon width={48} height={48} />
        <p>Выберите чат или создайте новый</p>
      </section>
    );
  }

  const phone = chat.phone ? formatPhone(chat.phone) : null;

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <Button
          variant="icon"
          className={styles.back}
          onClick={() => selectChat(null)}
          aria-label="Назад к чатам"
        >
          <BackIcon />
        </Button>
        <Avatar name={chat.title} seed={chat.chatId} size={40} />
        <div className={styles.info}>
          <span className={styles.title}>{chat.title}</span>
          <span className={styles.subtitle}>
            {phone && phone !== chat.title && <span>{phone}</span>}
            <ConnectionBadge />
          </span>
        </div>
      </header>

      <MessageList key={chat.chatId} />

      <footer className={styles.footer}>
        <MessageInput key={chat.chatId} />
      </footer>
    </section>
  );
}
