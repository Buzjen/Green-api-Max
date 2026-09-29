import { allSettled, fork } from 'effector';
import { describe, expect, it } from 'vitest';
import { $messagesByChat, messageAdded, messageStatusUpdated } from './message';
import type { Message } from './types';

const incoming: Message = {
  id: 'm1',
  idMessage: 'm1',
  chatId: '100',
  text: 'Привет',
  timestamp: 1,
  direction: 'incoming',
  status: 'received',
};

describe('message model', () => {
  it('не добавляет дубликаты по idMessage', async () => {
    const scope = fork();
    await allSettled(messageAdded, { scope, params: incoming });
    await allSettled(messageAdded, {
      scope,
      params: { ...incoming, id: 'other' },
    });
    expect(scope.getState($messagesByChat)['100']).toHaveLength(1);
  });

  it('обновляет статус оптимистичного сообщения и не дублирует его эхо', async () => {
    const scope = fork();
    await allSettled(messageAdded, {
      scope,
      params: {
        ...incoming,
        id: 'tmp',
        idMessage: null,
        direction: 'outgoing',
        status: 'sending',
      },
    });
    await allSettled(messageStatusUpdated, {
      scope,
      params: { chatId: '100', id: 'tmp', status: 'sent', idMessage: 'srv-1' },
    });
    await allSettled(messageAdded, {
      scope,
      params: {
        ...incoming,
        id: 'srv-1',
        idMessage: 'srv-1',
        direction: 'outgoing',
      },
    });

    const messages = scope.getState($messagesByChat)['100'];
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      id: 'tmp',
      idMessage: 'srv-1',
      status: 'sent',
    });
  });
});
