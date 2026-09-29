import { styled } from '@linaria/react';
import { focusRing, theme } from '@/shared/ui/theme';

export const Container = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const Field = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 10px 16px;
  border-radius: 22px;
  background: ${theme.input};
  box-shadow: ${theme.shadowBubble};
`;

export const Textarea = styled.textarea`
  max-height: 180px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${theme.text};
  font: inherit;
  line-height: 1.4;
  resize: none;
  outline: none;

  &::placeholder {
    color: ${theme.textTertiary};
  }
`;

export const Counter = styled.span`
  align-self: flex-end;
  font-size: 11px;
  color: ${theme.textTertiary};

  &[data-over='true'] {
    color: ${theme.danger};
  }
`;

export const SendButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: ${theme.accent};
  color: ${theme.onAccent};
  cursor: pointer;
  transition:
    opacity 0.15s,
    transform 0.05s;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:focus-visible {
    ${focusRing}
  }
`;
