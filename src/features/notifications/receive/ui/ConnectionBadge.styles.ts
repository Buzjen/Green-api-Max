import { styled } from '@linaria/react';
import { ellipsis, theme } from '@/shared/ui/theme';

export const Dot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.success};
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 13px;
  color: ${theme.textSecondary};

  &[data-status='offline'] {
    color: ${theme.danger};
  }

  &[data-status='offline'] ${Dot} {
    background: ${theme.danger};
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes pulse {
    50% {
      opacity: 0.3;
    }
  }
`;

export const Label = styled.span`
  ${ellipsis}
`;
