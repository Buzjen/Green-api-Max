import { Avatar } from '@/shared/ui';
import styles from './ChatListItem.module.css';

interface ChatListItemProps {
  chatId: string;
  title: string;
  preview: string;
  time: string;
  active: boolean;
  onSelect: (chatId: string) => void;
}

export function ChatListItem({
  chatId,
  title,
  preview,
  time,
  active,
  onSelect,
}: ChatListItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ''}`}
      onClick={() => onSelect(chatId)}
      aria-current={active}
    >
      <Avatar name={title} seed={chatId} />
      <span className={styles.body}>
        <span className={styles.row}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>{time}</span>
        </span>
        <span className={styles.preview}>{preview}</span>
      </span>
    </button>
  );
}
