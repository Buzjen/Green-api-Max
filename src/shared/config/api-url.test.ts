import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from './api-url';

describe('resolveApiUrl', () => {
  it('берёт хост из первых 4 цифр idInstance', () => {
    expect(resolveApiUrl('3100123456')).toBe('https://3100.api.green-api.com');
  });

  it('использует apiUrl, если он задан', () => {
    expect(resolveApiUrl('3100123456', 'https://7105.api.green-api.com/')).toBe(
      'https://7105.api.green-api.com',
    );
  });

  it('добавляет протокол к apiUrl без него', () => {
    expect(resolveApiUrl('3100123456', '7105.api.green-api.com')).toBe(
      'https://7105.api.green-api.com',
    );
  });
});
