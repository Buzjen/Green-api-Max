import { styled } from '@linaria/react';
import { theme } from '../theme/theme';

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${theme.textSecondary};
`;

export const StyledInput = styled.input`
  height: 44px;
  padding: 0 14px;
  border: 1px solid ${theme.border};
  border-radius: 12px;
  background: ${theme.input};
  color: ${theme.text};
  font: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &::placeholder {
    color: ${theme.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px ${theme.accentSoft};
  }
`;

export const Hint = styled.span`
  font-size: 12px;
  color: ${theme.textTertiary};
`;
