import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import viteImagemin from 'vite-plugin-imagemin'
// import { sentryVitePlugin } from 'vite-plugin-sentry'

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      svgo: true,
    }),
    // sentryVitePlugin({
    //   authToken: 'YOUR_SENTRY_AUTH_TOKEN',
    //   org: 'your-org',
    //   project: 'hnm-ministry',
    //   release: 'v2.0.0',
    //   include: './dist',
    // }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
