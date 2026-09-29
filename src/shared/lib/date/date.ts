const timeFormat = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});
const shortDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
});
const dayFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

/** 14:05 */
export const formatTime = (timestamp: number) => timeFormat.format(timestamp);

/** 29 сентября */
export const formatDay = (timestamp: number) => dayFormat.format(timestamp);

export function isSameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

/**
 * Время для сегодняшних событий, иначе короткая дата:
 * «14:05» или «28 сент.».
 */
export function formatRecent(timestamp: number, now = Date.now()): string {
  return isSameDay(timestamp, now)
    ? formatTime(timestamp)
    : shortDateFormat.format(timestamp);
}
