import { useUnit } from 'effector-react';
import { $connectionStatus } from '../model/receive';
import { Badge, Dot, Label } from './ConnectionBadge.styles';

const LABEL = {
  online: 'В сети',
  offline: 'Нет соединения, переподключаемся…',
} as const;

export function ConnectionBadge() {
  const status = useUnit($connectionStatus);
  return (
    <Badge data-status={status} title={LABEL[status]}>
      <Dot />
      <Label>{LABEL[status]}</Label>
    </Badge>
  );
}
