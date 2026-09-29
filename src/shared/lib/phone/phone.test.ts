import { describe, expect, it } from 'vitest';
import { formatPhone, normalizePhone } from './phone';

describe('normalizePhone', () => {
  it.each([
    ['+7 (999) 123-45-67', '79991234567'],
    ['89991234567', '79991234567'],
    ['79991234567', '79991234567'],
    ['9991234567', '79991234567'],
    ['+375 (29) 123-45-67', '375291234567'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(['', '123', '+1 555 123 4567', '+49 30 1234567', '799912345678'])(
    'отклоняет %s',
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    },
  );
});

describe('formatPhone', () => {
  it('форматирует российский номер', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67');
  });

  it('форматирует белорусский номер', () => {
    expect(formatPhone('375291234567')).toBe('+375 29 123-45-67');
  });
});
