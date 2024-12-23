import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: { include: ['src/**/*.unit.{js,ts}'] },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
