import { createEffect, createEvent, createStore, sample } from 'effector';
import { chatModel, findChatByPhone } from '@/entities/chat';
import { sessionModel } from '@/entities/session';
import {
  checkAccount,
  describeApiError,
  type ApiCredentials,
} from '@/shared/api';
import { formatPhone, normalizePhone } from '@/shared/lib/phone';

export const formOpened = createEvent();
export const formClosed = createEvent();
export const chatCreateRequested = createEvent<string>();

export const checkAccountFx = createEffect(
  ({ credentials, phone }: { credentials: ApiCredentials; phone: string }) =>
    checkAccount(credentials, { phoneNumber: Number(phone) }),
);

const checkAccountRequested = sessionModel.withCredentials(checkAccountFx);

export const $isFormOpen = createStore(false)
  .on(formOpened, () => true)
  .reset(formClosed, sessionModel.reset);

export const $pending = checkAccountFx.pending;

export const $error = createStore<string | null>(null)
  .on(checkAccountFx.failData, (_, error) => describeApiError(error))
  .reset(formOpened, formClosed, chatCreateRequested, sessionModel.reset);

const phoneNormalized = sample({
  clock: chatCreateRequested,
  filter: $pending.map((pending) => !pending),
  fn: normalizePhone,
});

sample({
  clock: phoneNormalized,
  filter: (phone) => phone === null,
  fn: () => 'Введите номер РФ (+7) или Беларуси (+375)',
  target: $error,
});

const validPhone = sample({
  clock: phoneNormalized,
  filter: (phone): phone is string => phone !== null,
});

const lookedUp = sample({
  clock: validPhone,
  source: chatModel.$chats,
  fn: (chats, phone) => ({ phone, chat: findChatByPhone(chats, phone) }),
});

// Чат с этим номером уже есть — CheckAccount не нужен
const existingChatFound = sample({
  clock: lookedUp,
  filter: ({ chat }) => chat !== null,
  fn: ({ chat }) => chat!.chatId,
});

sample({
  clock: lookedUp,
  filter: ({ chat }) => chat === null,
  fn: ({ phone }) => ({ phone }),
  target: checkAccountRequested,
});

sample({
  clock: checkAccountFx.done,
  filter: ({ result }) => !result.exist || !result.chatId,
  fn: () => 'Номер не зарегистрирован в MAX',
  target: $error,
});

const accountFound = sample({
  clock: checkAccountFx.done,
  filter: ({ result }) => result.exist && Boolean(result.chatId),
  fn: ({ params: { phone }, result }) => ({
    chatId: result.chatId,
    phone,
    title: formatPhone(phone),
  }),
});

// Чат с таким chatId мог появиться раньше из входящих —
// тогда chatAdded ничего не меняет, и чат просто выбирается
sample({ clock: accountFound, target: chatModel.chatAdded });

const chatReady = sample({
  clock: [existingChatFound, accountFound.map(({ chatId }) => chatId)],
});

sample({ clock: chatReady, target: [chatModel.chatSelected, formClosed] });
