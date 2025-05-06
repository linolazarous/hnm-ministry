import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      },
      external: []
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@admin': resolve(__dirname, './src/admin'),
      '@components': resolve(__dirname, './src/components'),
      '@css': resolve(__dirname, './src/css'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@js': resolve(__dirname, './src/js'),
      '@lib': resolve(__dirname, './src/lib'),
      '@pages': resolve(__dirname, './src/pages'),
      '@payment': resolve(__dirname, './src/payment'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@css/_variables.scss";`
      }
    }
  }
});
