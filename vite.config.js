import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'public/index.html')
        }
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
      postcss: {
        plugins: [
          postcssPresetEnv({
            stage: 3,
            features: {
              'nesting-rules': true
            },
            autoprefixer: { grid: true }
          }),
          cssnano({ preset: 'default' })
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@css/_variables.scss" as *;`
        }
      }
    },
    define: {
      'import.meta.env.VITE_STRIPE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY),
      'import.meta.env.VITE_FORMPREE_ENDPOINT': JSON.stringify(`https://formspree.io/f/${env.FORMPREE_ID}`),
      'import.meta.env.VITE_FORMPREE_ID': JSON.stringify(env.FORMPREE_ID)
    }
  };
});
