/** Склеивает CSS-классы, пропуская пустые: cx('a', active && 'b'). */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
