import { styled } from '@linaria/react';
import { theme } from '../theme/theme';

/** Ошибка формы. Пустые children не рендерятся. */
export const ErrorText = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  background: ${theme.dangerSoft};
  color: ${theme.danger};
  font-size: 14px;

  &:empty {
    display: none;
  }
`;
