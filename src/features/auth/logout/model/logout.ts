import { createEvent, sample } from 'effector';
import { chatModel } from '@/entities/chat';
import { messageModel } from '@/entities/message';
import { sessionModel } from '@/entities/session';

export const logoutClicked = createEvent();

// Сущности сами удаляют свои ключи из хранилища, когда становятся пустыми.
// Поллинг останавливается сам, потому что слушает sessionModel.reset.
sample({
  clock: logoutClicked,
  target: [sessionModel.reset, chatModel.reset, messageModel.reset],
});
