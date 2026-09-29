import { css } from '@linaria/core';
import { darkThemeVars, lightThemeVars, theme } from '@/shared/ui/theme';

export const globalStyles = css`
  :global() {
    :root {
      color-scheme: light;
      ${lightThemeVars}
    }

    @media (prefers-color-scheme: dark) {
      :root {
        color-scheme: dark;
        ${darkThemeVars}
      }
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    html,
    body,
    #root {
      height: 100%;
      margin: 0;
    }

    @supports (height: 100dvh) {
      #root {
        height: 100dvh;
      }
    }

    body {
      background: ${theme.surface};
      color: ${theme.text};
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
        Arial, sans-serif;
      font-size: 15px;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }
  }
`;
