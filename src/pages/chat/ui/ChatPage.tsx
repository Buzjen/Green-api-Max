import { useUnit } from 'effector-react';
import { chatModel } from '@/entities/chat';
import { ChatSidebar } from '@/widgets/chat-sidebar';
import { ChatWindow } from '@/widgets/chat-window';
import styles from './ChatPage.module.css';

export function ChatPage() {
  const activeChatId = useUnit(chatModel.$activeChatId);
  return (
    <main className={styles.page} data-view={activeChatId ? 'chat' : 'list'}>
      <div className={styles.sidebar}>
        <ChatSidebar />
      </div>
      <div className={styles.content}>
        <ChatWindow />
      </div>
    </main>
  );
}
