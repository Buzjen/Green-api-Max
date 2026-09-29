import { createEffect, createEvent, createStore, sample } from 'effector';
import { chatModel } from '@/entities/chat';
import { sessionModel } from '@/entities/session';
import { checkAccount, describeApiError, type ApiCredentials } from '@/shared/api';
import { formatPhone, normalizePhone } from '@/shared/lib/phone';

export const formOpened = createEvent();
export const formClosed = createEvent();
export const chatCreateRequested = createEvent<string>();

export const checkAccountFx = createEffect(
  ({ credentials, phone }: { credentials: ApiCredentials; phone: string }) =>
    checkAccount(credentials, { phoneNumber: Number(phone) }),
);

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

const existingChatFound = sample({
  clock: validPhone,
  source: chatModel.$chats,
  filter: (chats, phone) => chats.some((chat) => chat.phone === phone),
  fn: (chats, phone) => chats.find((chat) => chat.phone === phone)!.chatId,
});

sample({
  clock: validPhone,
  source: { chats: chatModel.$chats, credentials: sessionModel.$credentials },
  filter: ({ chats, credentials }, phone) =>
    credentials !== null && !chats.some((chat) => chat.phone === phone),
  fn: ({ credentials }, phone) => ({ credentials: credentials!, phone }),
  target: checkAccountFx,
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

// Чат с таким chatId мог появиться раньше из входящих — тогда только дополняем выбор.
sample({ clock: accountFound, target: chatModel.chatAdded });

const chatReady = sample({
  clock: [existingChatFound, accountFound.map(({ chatId }) => chatId)],
});

sample({ clock: chatReady, target: [chatModel.chatSelected, formClosed] });
