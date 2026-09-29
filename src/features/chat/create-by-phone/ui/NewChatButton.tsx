import { useUnit } from 'effector-react';
import { Button, PlusIcon } from '@/shared/ui';
import { $isFormOpen, formOpened } from '../model/create-chat';

export function NewChatButton() {
  const [isOpen, open] = useUnit([$isFormOpen, formOpened]);
  return (
    <Button variant="icon" onClick={open} disabled={isOpen} title="Новый чат">
      <PlusIcon />
    </Button>
  );
}
