/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import glob from 'glob';
import path from 'path';
import { defineConfig } from 'vite';
import launchEditorMiddlewarePlugin from './internals/vite-launch-code-middleware';
import IndexGeneratePlugin from './internals/vite-plugins/index-generate';

const input = glob.sync(`./src/*.html`).reduce((acc, p) => {
  const entry = p.slice(p.lastIndexOf('/') + 1, p.length).replace('.html', '');
  acc[`${entry}`] = p;
  return acc;
}, {});

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
      ...(DEV_MODE
        ? [launchEditorMiddlewarePlugin()]
        : [
            IndexGeneratePlugin({
              template: './src/template.ejs',
            }),
          ]),
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
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        // input,
        output: {
          entryFileNames: 'assets/[name].min.js',
          chunkFileNames: 'assets/[name].chunk.min.js', // https://rollupjs.org/guide/en/#outputchunkfilenames
          assetFileNames: 'assets/[name].min[extname]', // https://rollupjs.org/guide/en/#outputassetfilenames
        },
      },
    },
    // https://vitest.dev/config/#configuring-vitest
    test: {
      include: ['**/*.{test}.{js,ts}', '**/__tests__/*.{js,ts}'],
      globals: true,
    },
  };
});
