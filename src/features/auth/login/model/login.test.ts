import { allSettled, fork } from 'effector';
import { describe, expect, it } from 'vitest';
import { sessionModel } from '@/entities/session';
import { $error, fieldChanged, loginSubmitted } from './login';

async function fill(scope: ReturnType<typeof fork>, idInstance: string, apiTokenInstance: string) {
  await allSettled(fieldChanged, { scope, params: { name: 'idInstance', value: idInstance } });
  await allSettled(fieldChanged, {
    scope,
    params: { name: 'apiTokenInstance', value: apiTokenInstance },
  });
}

describe('login', () => {
  it('стартует сессию с вычисленным apiUrl', async () => {
    const scope = fork();
    await fill(scope, ' 3100123456 ', 'token');
    await allSettled(loginSubmitted, { scope });
    expect(scope.getState(sessionModel.$credentials)).toEqual({
      idInstance: '3100123456',
      apiTokenInstance: 'token',
      apiUrl: 'https://3100.api.green-api.com',
    });
  });

  it('не стартует сессию с невалидными данными', async () => {
    const scope = fork();
    await fill(scope, 'abc', 'token');
    await allSettled(loginSubmitted, { scope });
    expect(scope.getState(sessionModel.$credentials)).toBeNull();
    expect(scope.getState($error)).toMatch(/idInstance/);
  });

  it('показывает причину отказа API', async () => {
    const scope = fork();
    await allSettled(sessionModel.sessionFailed, { scope, params: 'Неверные данные' });
    expect(scope.getState($error)).toBe('Неверные данные');
  });
});
