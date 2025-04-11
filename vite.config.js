import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        }
      })
    ],
    define: {
      'process.env': {
        VITE_MAGIC_PUB_KEY: JSON.stringify(env.VITE_MAGIC_PUB_KEY),
        VITE_STRIPE_PUB_KEY: JSON.stringify(env.VITE_STRIPE_PUB_KEY),
        VITE_API_BASE_URL: JSON.stringify(env.VITE_API_BASE_URL)
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/.netlify/functions': {
          target: 'http://localhost:8888',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      sourcemap: true,
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1600
    }
  };
});