import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Your other externals...
      ],
      output: {
        manualChunks: {
          aos: ['aos'], // Group AOS separately
          // Your other chunks...
        }
      }
    }
  }
})
