import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [svgLoader(), sveltekit()],
  test: { include: ['src/**/*.unit.{js,ts}'] },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
