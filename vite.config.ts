/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const input = {};

export default defineConfig(({ mode }) => {
  const DEV_MODE = mode === 'development';
  console.log(`mode:${mode}`);
  return {
    root: './src',
    esbuild: {
      pure: DEV_MODE ? [] : ['console.log'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "@/css/_mixin.scss";`,
        },
      },
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': 'https://milkmidi.vercel.app/',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // https://vitest.dev/config/#configuring-vitest
    test: {
      include: ['**/*.{test}.{js,ts}', '**/__tests__/*.{js,ts}'],
      globals: true,
    },
  };
});
