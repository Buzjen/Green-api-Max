import styles from './Avatar.module.css';

const PALETTE = [
  '#5b8def',
  '#9a6bf0',
  '#f07a5b',
  '#3fb68b',
  '#e8a93c',
  '#e25b8f',
  '#4bb3d6',
];

function pickColor(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (/^\d/.test(words[0])) return '#';
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function Avatar({
  name,
  seed,
  size = 48,
}: {
  name: string;
  seed: string;
  size?: number;
}) {
  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: pickColor(seed),
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
