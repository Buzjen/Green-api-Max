import { describe, expect, it } from 'vitest';
import { validateLogin } from './validate';

const valid = { idInstance: '3100123456', apiTokenInstance: 'token', apiUrl: '' };

describe('validateLogin', () => {
  it('принимает корректные данные', () => {
    expect(validateLogin(valid)).toBeNull();
    expect(validateLogin({ ...valid, apiUrl: 'https://3100.api.green-api.com' })).toBeNull();
  });

  it('требует цифровой idInstance', () => {
    expect(validateLogin({ ...valid, idInstance: '31a' })).not.toBeNull();
  });

  it('требует токен', () => {
    expect(validateLogin({ ...valid, apiTokenInstance: '  ' })).not.toBeNull();
  });

  it('проверяет apiUrl', () => {
    expect(validateLogin({ ...valid, apiUrl: 'not a url' })).not.toBeNull();
  });
});
