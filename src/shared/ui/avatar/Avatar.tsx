import { styled } from '@linaria/react';

const PALETTE = [
  '#5b8def',
  '#9a6bf0',
  '#f07a5b',
  '#3fb68b',
  '#e8a93c',
  '#e25b8f',
  '#4bb3d6',
];

const HASH_MULTIPLIER = 31;
const NON_ALPHANUMERIC = /[^\p{L}\p{N}\s]/gu;
const WHITESPACE = /\s+/;
const STARTS_WITH_DIGIT = /^\d/;
const MAX_INITIALS = 2;
/** Размер шрифта инициалов относительно диаметра аватара. */
const FONT_SIZE_RATIO = 0.38;
const DEFAULT_SIZE = 48;

function pickColor(seed: string): string {
  let hash = 0;
  for (const char of seed)
    hash = (hash * HASH_MULTIPLIER + char.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string): string {
  const words = name
    .replace(NON_ALPHANUMERIC, ' ')
    .trim()
    .split(WHITESPACE)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (STARTS_WITH_DIGIT.test(words[0])) return '#';
  return words
    .slice(0, MAX_INITIALS)
    .map((word) => word[0].toUpperCase())
    .join('');
}

// Имена пропсов не совпадают с HTML-атрибутами, чтобы Linaria не пробросила их в DOM
const Circle = styled.span<{ diameter: number; bg: string }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #fff;
  font-size: ${({ diameter }) => Math.round(diameter * FONT_SIZE_RATIO)}px;
  font-weight: 600;
  user-select: none;
`;

interface AvatarProps {
  name: string;
  seed: string;
  size?: number;
}

export function Avatar({ name, seed, size = DEFAULT_SIZE }: AvatarProps) {
  return (
    <Circle diameter={size} bg={pickColor(seed)}>
      {initials(name)}
    </Circle>
  );
}
