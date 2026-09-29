import { styled } from '@linaria/react';
import { theme } from '@/shared/ui/theme';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Advanced = styled.details`
  summary {
    font-size: 14px;
    color: ${theme.textSecondary};
    cursor: pointer;
    user-select: none;
  }

  &[open] summary {
    margin-bottom: 12px;
  }
`;
