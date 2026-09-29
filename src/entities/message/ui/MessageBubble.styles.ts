import { styled } from '@linaria/react';
import { theme } from '@/shared/ui/theme';

export const Bubble = styled.div`
  position: relative;
  max-width: min(560px, 78%);
  padding: 8px 12px 6px;
  border-radius: 18px;
  background: ${theme.bubbleIn};
  box-shadow: ${theme.shadowBubble};
  line-height: 1.4;
  overflow-wrap: anywhere;

  &[data-error='true'] {
    outline: 1px solid ${theme.danger};
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;

  &[data-direction='incoming'] ${Bubble} {
    border-bottom-left-radius: 6px;
  }

  &[data-direction='outgoing'] {
    flex-direction: row-reverse;
  }

  &[data-direction='outgoing'] ${Bubble} {
    border-bottom-right-radius: 6px;
    background: ${theme.bubbleOut};
  }
`;

export const Text = styled.span`
  white-space: pre-wrap;
`;

export const Meta = styled.span`
  float: right;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 6px 0 -2px 12px;
  font-size: 11px;
  color: ${theme.textTertiary};
  user-select: none;
`;

export const Status = styled.span`
  color: ${theme.accent};

  &[data-error='true'] {
    color: ${theme.danger};
    font-weight: 700;
  }
`;

export const RetryButton = styled.button`
  display: inline-flex;
  padding: 6px;
  border: none;
  border-radius: 50%;
  background: ${theme.surface};
  color: ${theme.danger};
  cursor: pointer;
`;
