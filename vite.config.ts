import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // Тесты проверяют модели и не рендерят компоненты,
    // поэтому извлекать стили Linaria там незачем
    !process.env.VITEST && wyw({ include: ['**/*.{ts,tsx}'] }),
    react(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
  },
});
