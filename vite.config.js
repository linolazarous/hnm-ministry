import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        '@sentry/react',
        '@sentry/tracing'
      ],
      output: {
        manualChunks: {
          sentry: ['@sentry/react', '@sentry/tracing'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
