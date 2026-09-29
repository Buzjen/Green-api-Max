import { styled } from '@linaria/react';
import { ellipsis, theme } from '@/shared/ui/theme';

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: ${theme.surface};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 12px 8px 20px;
`;

export const Heading = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
`;

export const Instance = styled.div`
  font-size: 12px;
  color: ${theme.textTertiary};
  ${ellipsis}
`;

export const FormSlot = styled.div`
  padding: 4px 12px 8px;
`;

export const List = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  padding: 4px 8px 12px;
  overflow-y: auto;
`;

export const Empty = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: ${theme.textTertiary};
  text-align: center;
`;

export const EmptyText = styled.div`
  margin-bottom: 8px;
`;
