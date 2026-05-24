const { getJestConfig } = require('@storybook/test-runner');

/**
 * @type {import('jest').Config}
 */
module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),

  // Overwrite the testMatch to only include files with a specific pattern
  testMatch: ['**/*.tests.stories.ts'],
};
