import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    reactRefresh(),
    checker({
      // use TypeScript check
      typescript: true,
      eslint: {
        // lint .ts and .tsx
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  build: {
    sourcemap: true,
    minify: true,
    target: 'chrome58',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '{{projectName}}'.replace(/-/g, '_').toUpperCase(),
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', 'antd', 'axios', 'qs', '@gmsoft/auth-sdk'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          axios: 'axios',
          qs: 'Qs',
          '@gmsoft/auth-sdk': 'AuthSDK',
        },
      },
    },
  },
});
