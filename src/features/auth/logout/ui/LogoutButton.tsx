import { useUnit } from 'effector-react';
import { Button, LogoutIcon } from '@/shared/ui';
import { logoutClicked } from '../model/logout';

export function LogoutButton() {
  const logout = useUnit(logoutClicked);
  return (
    <Button
      variant="icon"
      onClick={() => {
        if (window.confirm('Выйти? История чатов на этом устройстве будет удалена.')) logout();
      }}
      title="Выйти"
      aria-label="Выйти"
    >
      <LogoutIcon />
    </Button>
  );
}
