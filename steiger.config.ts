import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // В маленьком приложении у каждой фичи/виджета ровно один потребитель,
      // но разделение по слайсам сохраняется намеренно — ради границ ответственности.
      'fsd/insignificant-slice': 'off',
    },
  },
]);
