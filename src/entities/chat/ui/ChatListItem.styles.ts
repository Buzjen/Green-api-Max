import { styled } from '@linaria/react';
import { ellipsis, theme } from '@/shared/ui/theme';

export const Item = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${theme.hover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.accent};
    outline-offset: -2px;
  }

  &[data-active='true'] {
    background: ${theme.accentSoft};
  }
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const Title = styled.div`
  flex: 1;
  font-weight: 600;
  ${ellipsis}
`;

export const Time = styled.div`
  flex-shrink: 0;
  font-size: 12px;
  color: ${theme.textTertiary};
`;

export const Preview = styled.div`
  font-size: 14px;
  color: ${theme.textSecondary};
  ${ellipsis}
`;
