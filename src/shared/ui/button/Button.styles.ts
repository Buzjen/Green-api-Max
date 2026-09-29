import { styled } from '@linaria/react';
import { focusRing, theme } from '../theme/theme';

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s,
    opacity 0.15s,
    transform 0.05s;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:focus-visible {
    ${focusRing}
  }

  &[data-variant='primary'] {
    background: ${theme.accent};
    color: ${theme.onAccent};
  }

  &[data-variant='primary']:hover:not(:disabled) {
    background: ${theme.accentHover};
  }

  &[data-variant='secondary'] {
    background: ${theme.accentSoft};
    color: ${theme.accent};
  }

  &[data-variant='icon'] {
    width: 40px;
    padding: 0;
    border-radius: 50%;
    background: transparent;
    color: ${theme.textSecondary};
  }

  &[data-variant='icon']:hover:not(:disabled) {
    background: ${theme.hover};
    color: ${theme.text};
  }

  &[data-block='true'] {
    width: 100%;
  }
`;
