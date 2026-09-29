import { useUnit } from 'effector-react';
import { sessionModel } from '@/entities/session';
import { ChatPage } from '@/pages/chat';
import { LoginPage } from '@/pages/login';

export function App() {
  const isAuthorized = useUnit(sessionModel.$isAuthorized);
  return isAuthorized ? <ChatPage /> : <LoginPage />;
}
