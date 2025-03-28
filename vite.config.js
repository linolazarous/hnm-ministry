import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      MAGIC_PUB_KEY: JSON.stringify(process.env.MAGIC_PUB_KEY),
      STRIPE_PUB_KEY: JSON.stringify(process.env.STRIPE_PUB_KEY)
    }
  },
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
});