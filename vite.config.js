import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      },
      external: [
        '@sentry/react',
        '@sentry/tracing',
        'aos' // Added AOS to external modules
      ],
      output: {
        manualChunks: {
          sentry: ['@sentry/react', '@sentry/tracing'],
          animations: ['aos'], // Group AOS separately
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
