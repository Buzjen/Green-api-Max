import { allSettled, fork } from 'effector';
import { describe, expect, it, vi } from 'vitest';
import { chatModel } from '@/entities/chat';
import { sessionModel } from '@/entities/session';
import {
  $error,
  $isFormOpen,
  chatCreateRequested,
  checkAccountFx,
  formOpened,
} from './create-chat';

const credentials = { apiUrl: 'https://x', idInstance: '1', apiTokenInstance: 't' };

function setup(result: { exist: boolean; chatId: string }) {
  const check = vi.fn(async () => ({ ...result, fromCache: false }));
  const scope = fork({
    values: [[sessionModel.$credentials, credentials]],
    handlers: [[checkAccountFx, check]],
  });
  return { scope, check };
}

describe('create chat by phone', () => {
  it('создаёт и выбирает чат по chatId из CheckAccount', async () => {
    const { scope, check } = setup({ exist: true, chatId: '10000000' });
    await allSettled(formOpened, { scope });
    await allSettled(chatCreateRequested, { scope, params: '8 (999) 123-45-67' });

    expect(check).toHaveBeenCalledWith({ credentials, phone: '79991234567' });
    expect(scope.getState(chatModel.$chats)).toMatchObject([
      { chatId: '10000000', phone: '79991234567', title: '+7 999 123-45-67' },
    ]);
    expect(scope.getState(chatModel.$activeChatId)).toBe('10000000');
    expect(scope.getState($isFormOpen)).toBe(false);
  });

  it('показывает ошибку, если номер не в MAX', async () => {
    const { scope } = setup({ exist: false, chatId: '' });
    await allSettled(chatCreateRequested, { scope, params: '79991234567' });
    expect(scope.getState($error)).toBe('Номер не зарегистрирован в MAX');
    expect(scope.getState(chatModel.$chats)).toEqual([]);
  });

  it('не вызывает CheckAccount для невалидного номера', async () => {
    const { scope, check } = setup({ exist: true, chatId: '1' });
    await allSettled(chatCreateRequested, { scope, params: '+1 555 000' });
    expect(check).not.toHaveBeenCalled();
    expect(scope.getState($error)).not.toBeNull();
  });

  it('не вызывает CheckAccount повторно для существующего чата', async () => {
    const { scope, check } = setup({ exist: true, chatId: '1' });
    await allSettled(chatModel.chatAdded, {
      scope,
      params: { chatId: '555', phone: '79991234567', title: 'x' },
    });
    await allSettled(chatCreateRequested, { scope, params: '+79991234567' });
    expect(check).not.toHaveBeenCalled();
    expect(scope.getState(chatModel.$activeChatId)).toBe('555');
  });
});
