// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    // https://vite.dev/config/shared-options#resolve-tsconfigpaths
    tsconfigPaths: true,
  },
});
