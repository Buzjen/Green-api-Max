/**
 * Приводит номер к международному формату без «+»: 79991234567 или 375291234567.
 * Возвращает null, если номер не российский/белорусский (ограничение CheckAccount в MAX).
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;

  if (digits.length === 11 && digits.startsWith('7')) return digits;
  if (digits.length === 12 && digits.startsWith('375')) return digits;
  return null;
}

/** 79991234567 → +7 999 123-45-67; 375291234567 → +375 29 123-45-67. */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('7')) {
    return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`;
  }
  if (d.length === 12 && d.startsWith('375')) {
    return `+375 ${d.slice(3, 5)} ${d.slice(5, 8)}-${d.slice(8, 10)}-${d.slice(10)}`;
  }
  return d ? `+${d}` : phone;
}
