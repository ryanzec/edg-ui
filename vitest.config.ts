import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const SOURCEMAP_MISSING_SOURCES_PATTERN = /^Sourcemap for ".+" points to missing source files$/;

// vitest overrides config.customLogger inside its own plugin's `config()` hook, so a top-level
// customLogger is always discarded. wrap the logger from `configResolved` instead — that runs after
// vitest has installed its logger, so our wrapper survives.
const suppressSourcemapMissingSourcesWarnings = (): Plugin => ({
  name: 'suppress-sourcemap-missing-sources-warnings',
  configResolved(config) {
    const { logger } = config;
    const originalWarn = logger.warn.bind(logger);
    const originalWarnOnce = logger.warnOnce.bind(logger);

    logger.warn = (message, options) => {
      if (SOURCEMAP_MISSING_SOURCES_PATTERN.test(message)) {
        return;
      }

      originalWarn(message, options);
    };

    logger.warnOnce = (message, options) => {
      if (SOURCEMAP_MISSING_SOURCES_PATTERN.test(message)) {
        return;
      }

      originalWarnOnce(message, options);
    };
  },
});

export default defineConfig({
  plugins: [suppressSourcemapMissingSourcesWarnings()],
});
