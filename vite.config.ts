import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // the typescript error does not actually effect anything so ignoring for now
  // @ts-expect-error reference: https://github.com/sveltejs/kit/issues/10802
  plugins: [sveltekit()],
  test: { include: ['src/**/*.unit.{js,ts}'] },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
