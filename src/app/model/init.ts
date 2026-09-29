import { createEvent, sample } from 'effector';
import { chatModel } from '@/entities/chat';
import { messageModel } from '@/entities/message';
import { sessionModel } from '@/entities/session';
// Цикл получения подписан на sessionStarted — модель должна быть загружена до восстановления сессии
import '@/features/notifications/receive';

export const appStarted = createEvent();

// Сначала история, затем сессия: восстановление сессии запускает поллинг
sample({
  clock: appStarted,
  target: [
    chatModel.restoreRequested,
    messageModel.restoreRequested,
    sessionModel.restoreRequested,
  ],
});
