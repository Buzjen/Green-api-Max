import { styled } from '@linaria/react';
import { theme } from '@/shared/ui/theme';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: ${theme.surfaceMuted};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -4px -4px -4px 0;
`;

export const Title = styled.div`
  font-weight: 600;
`;
