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
    
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/css/_variables.scss";`
      }
    }
  }
});
