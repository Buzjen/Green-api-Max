import { useUnit } from 'effector-react';
import { ChatListItem, chatModel } from '@/entities/chat';
import { sessionModel } from '@/entities/session';
import { LogoutButton } from '@/features/auth/logout';
import {
  createChatModel,
  NewChatButton,
  NewChatForm,
} from '@/features/chat/create-by-phone';
import { formatRecent } from '@/shared/lib/date';
import { Button, ChatIcon } from '@/shared/ui';
import { $items } from '../model/sidebar';
import styles from './ChatSidebar.module.css';

export function ChatSidebar() {
  const [items, activeChatId, selectChat, isFormOpen, openForm, credentials] =
    useUnit([
      $items,
      chatModel.$activeChatId,
      chatModel.chatSelected,
      createChatModel.$isFormOpen,
      createChatModel.formOpened,
      sessionModel.$credentials,
    ]);

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Чаты</h1>
          {credentials && (
            <span className={styles.instance}>
              Инстанс {credentials.idInstance}
            </span>
          )}
        </div>
        <NewChatButton />
        <LogoutButton />
      </header>

      {isFormOpen && (
        <div className={styles.form}>
          <NewChatForm />
        </div>
      )}

      {items.length > 0 ? (
        <nav className={styles.list} aria-label="Список чатов">
          {items.map((item) => (
            <ChatListItem
              key={item.chatId}
              chatId={item.chatId}
              title={item.title}
              preview={item.preview}
              time={formatRecent(item.lastActivity)}
              active={item.chatId === activeChatId}
              onSelect={selectChat}
            />
          ))}
        </nav>
      ) : (
        !isFormOpen && (
          <div className={styles.empty}>
            <ChatIcon width={40} height={40} />
            <p>Чатов пока нет</p>
            <Button variant="secondary" onClick={openForm}>
              Новый чат
            </Button>
          </div>
        )
      )}
    </aside>
  );
}
