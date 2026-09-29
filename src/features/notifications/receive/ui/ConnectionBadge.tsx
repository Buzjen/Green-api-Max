import { useUnit } from 'effector-react';
import { $connectionStatus } from '../model/receive';
import { cx } from '@/shared/lib/cx';
import styles from './ConnectionBadge.module.css';

const LABEL = {
  online: 'В сети',
  offline: 'Нет соединения, переподключаемся…',
} as const;

export function ConnectionBadge() {
  const status = useUnit($connectionStatus);
  return (
    <span
      className={cx(styles.badge, styles[status])}
      role="status"
      title={LABEL[status]}
    >
      <span className={styles.dot} />
      <span className={styles.label}>{LABEL[status]}</span>
    </span>
  );
}
