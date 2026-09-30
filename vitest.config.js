import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  // Public images stay browser URLs in unit tests, not module imports.
  // In particular /team-masks.png must not become file:///team-masks.png on Windows.
  plugins: [vue({ template: { transformAssetUrls: false } })],
  test: { environment: 'jsdom', include: ['tests/unit/**/*.test.js'], clearMocks: true, restoreMocks: true }
});
