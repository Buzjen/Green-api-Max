import { styled } from '@linaria/react';
import { ellipsis, media, theme } from '@/shared/ui/theme';

export const Window = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: ${theme.chatBg};
`;

export const Placeholder = styled(Window)`
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${theme.textTertiary};
`;

/** Подпись-«плашка» поверх фона чата. */
export const Pill = styled.div`
  padding: 6px 14px;
  border-radius: 14px;
  background: ${theme.surface};
  color: ${theme.textSecondary};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 8px 16px;
  border-bottom: 1px solid ${theme.borderSoft};
  background: ${theme.surface};

  ${media.mobile} {
    gap: 10px;
    padding: 8px 12px;
  }
`;

/** Кнопка «назад» видна только на мобильных. */
export const BackSlot = styled.div`
  display: none;
  margin-left: -8px;

  ${media.mobile} {
    display: block;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Title = styled.div`
  font-weight: 600;
  ${ellipsis}
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 13px;
  color: ${theme.textSecondary};
`;

export const Messages = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 16px 8px;

  ${media.mobile} {
    padding: 12px 10px 8px;
  }
`;

export const NoMessages = styled(Messages)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const MessagesInner = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 820px;
  margin: 0 auto;
`;

export const Day = styled.div`
  align-self: center;
  margin: 12px 0 8px;
  padding: 3px 12px;
  border-radius: 12px;
  background: ${theme.dayBadge};
  color: ${theme.textSecondary};
  font-size: 13px;
`;

export const Footer = styled.div`
  padding: 8px 16px 16px;

  & > * {
    max-width: 820px;
    margin: 0 auto;
  }

  ${media.mobile} {
    padding: 8px 10px calc(10px + env(safe-area-inset-bottom));
  }
`;
