const NON_DIGITS = /\D/g;

const RU_CODE = '7';
const BY_CODE = '375';
/** Длина полного номера вместе с кодом страны. */
const RU_LENGTH = 11;
const BY_LENGTH = 12;
/** Российский номер без кода страны: 9991234567. */
const RU_LOCAL_LENGTH = 10;
/** Внутренний префикс вместо кода страны: 89991234567. */
const RU_TRUNK_PREFIX = '8';
const RU_MOBILE_PREFIX = '9';

const RU_PHONE = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/;
const BY_PHONE = /^375(\d{2})(\d{3})(\d{2})(\d{2})$/;

/**
 * Приводит номер к международному формату без «+»:
 * 79991234567 или 375291234567. Возвращает null, если номер
 * не российский/белорусский (ограничение CheckAccount в MAX).
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(NON_DIGITS, '');
  if (digits.length === RU_LENGTH && digits.startsWith(RU_TRUNK_PREFIX))
    digits = `${RU_CODE}${digits.slice(RU_TRUNK_PREFIX.length)}`;
  if (
    digits.length === RU_LOCAL_LENGTH &&
    digits.startsWith(RU_MOBILE_PREFIX)
  ) {
    digits = `${RU_CODE}${digits}`;
  }

  if (digits.length === RU_LENGTH && digits.startsWith(RU_CODE)) return digits;
  if (digits.length === BY_LENGTH && digits.startsWith(BY_CODE)) return digits;
  return null;
}

/** 79991234567 → +7 999 123-45-67; 375291234567 → +375 29 123-45-67. */
export function formatPhone(phone: string): string {
  const d = phone.replace(NON_DIGITS, '');
  if (RU_PHONE.test(d)) return d.replace(RU_PHONE, `+${RU_CODE} $1 $2-$3-$4`);
  if (BY_PHONE.test(d)) return d.replace(BY_PHONE, `+${BY_CODE} $1 $2-$3-$4`);
  return d ? `+${d}` : phone;
}
