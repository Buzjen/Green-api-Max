const light = {
  accent: '#3b6ff5',
  accentHover: '#2f5fe0',
  accentSoft: 'rgba(59, 111, 245, 0.12)',
  onAccent: '#ffffff',
  gradientAccent: 'linear-gradient(135deg, #4f8cff 0%, #7a5cff 100%)',

  text: '#0f1419',
  textSecondary: '#5c6670',
  textTertiary: '#8e98a3',

  surface: '#ffffff',
  surfaceMuted: '#f3f5f8',
  input: '#ffffff',
  hover: 'rgba(15, 20, 25, 0.05)',
  border: '#d9dee5',
  borderSoft: '#e9ecf0',

  chatBg: '#eef1f6',
  bubbleIn: '#ffffff',
  bubbleOut: '#dfe9ff',
  dayBadge: 'rgba(255, 255, 255, 0.85)',

  success: '#2bb56b',
  danger: '#e5484d',
  dangerSoft: 'rgba(229, 72, 77, 0.1)',

  shadowBubble: '0 1px 1px rgba(15, 20, 25, 0.06)',
  shadowCard: '0 8px 32px rgba(15, 20, 25, 0.08)',
};

type Token = keyof typeof light;

const dark: Partial<Record<Token, string>> = {
  accent: '#5b8cff',
  accentHover: '#7aa2ff',
  accentSoft: 'rgba(91, 140, 255, 0.16)',

  text: '#e8ebef',
  textSecondary: '#a3acb6',
  textTertiary: '#737d88',

  surface: '#17191d',
  surfaceMuted: '#202329',
  input: '#22252b',
  hover: 'rgba(255, 255, 255, 0.06)',
  border: '#33373e',
  borderSoft: '#262930',

  chatBg: '#0f1114',
  bubbleIn: '#22252b',
  bubbleOut: '#2a3d6b',
  dayBadge: 'rgba(34, 37, 43, 0.9)',

  dangerSoft: 'rgba(229, 72, 77, 0.16)',

  shadowBubble: 'none',
  shadowCard: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

const UPPERCASE_LETTER = /[A-Z]/g;

const varName = (token: string) =>
  `--${token.replace(UPPERCASE_LETTER, (char) => `-${char.toLowerCase()}`)}`;

const declare = (values: Partial<Record<Token, string>>) =>
  Object.entries(values)
    .map(([token, value]) => `${varName(token)}: ${value};`)
    .join('\n');

/** Значения темы в виде CSS-переменных — для объявления в :root. */
export const lightThemeVars = declare(light);
export const darkThemeVars = declare(dark);

/** Ссылки на токены для стилей: `color: ${theme.accent}`. */
export const theme = Object.fromEntries(
  Object.keys(light).map((token) => [token, `var(${varName(token)})`]),
) as Record<Token, string>;

export const media = {
  tablet: '@media (max-width: 1024px)',
  mobile: '@media (max-width: 767px)',
};

/** Однострочный текст с многоточием. */
export const ellipsis = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const focusRing = `
  outline: 2px solid ${theme.accent};
  outline-offset: 2px;
`;
