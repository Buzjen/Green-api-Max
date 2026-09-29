import { describe, expect, it } from 'vitest';
import { formatRecent, isSameDay } from './date';

describe('date', () => {
  const noon = new Date(2026, 8, 29, 12, 0).getTime();

  it('isSameDay сравнивает календарные дни', () => {
    expect(isSameDay(noon, new Date(2026, 8, 29, 23, 59).getTime())).toBe(true);
    expect(isSameDay(noon, new Date(2026, 8, 30, 0, 1).getTime())).toBe(false);
  });

  it('formatRecent показывает время для сегодняшних и дату для старых', () => {
    expect(formatRecent(noon, noon)).toBe('12:00');
    expect(formatRecent(new Date(2026, 8, 28).getTime(), noon)).toMatch(/28/);
  });
});
