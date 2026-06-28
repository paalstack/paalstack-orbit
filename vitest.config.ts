/**
 * Vitest Configuration
 *
 * Sets up Vitest for testing React components in a Next.js project with:
 * - jsdom environment for DOM API support
 * - React Testing Library integration
 * - Code coverage reporting
 * - Path aliases from tsconfig.json
 */

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
  ],

  // Provide NEXT_PUBLIC_* env vars during tests when .env.local is absent (e.g. CI).
  // Real .env files override these when present.
  define: {
    'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify('https://api.example.com'),
    'process.env.NEXT_PUBLIC_APP_NAME': JSON.stringify('PaalStack'),
    'process.env.NEXT_PUBLIC_DEBUG_MODE': JSON.stringify('false'),
  },

  test: {
    environment: 'jsdom',

    setupFiles: ['./src/test/setup.ts'],

    globals: true,

    css: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.*',
        '**/*.spec.*',
        'dist/',
        '.next/',
        // App Router entry files — no testable logic
        'src/app/layout.tsx',
        'src/app/error.tsx',
        'src/app/loading.tsx',
        'src/app/not-found.tsx',
        // Static assets
        'src/assets/**',
        // Pure barrel re-export files — covered by their implementation tests
        'src/**/index.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next', '.idea', '.git', '.cache', 'src/test/e2e'],
  },
});
