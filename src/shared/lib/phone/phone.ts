/**
 * Приводит номер к международному формату без «+»:
 * 79991234567 или 375291234567. Возвращает null, если номер
 * не российский/белорусский (ограничение CheckAccount в MAX).
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8'))
    digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith('9')) digits = `7${digits}`;

  if (digits.length === 11 && digits.startsWith('7')) return digits;
  if (digits.length === 12 && digits.startsWith('375')) return digits;
  return null;
}

const RU_PHONE = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/;
const BY_PHONE = /^375(\d{2})(\d{3})(\d{2})(\d{2})$/;

/** 79991234567 → +7 999 123-45-67; 375291234567 → +375 29 123-45-67. */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (RU_PHONE.test(d)) return d.replace(RU_PHONE, '+7 $1 $2-$3-$4');
  if (BY_PHONE.test(d)) return d.replace(BY_PHONE, '+375 $1 $2-$3-$4');
  return d ? `+${d}` : phone;
}
