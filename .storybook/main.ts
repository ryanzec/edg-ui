import type { StorybookConfig } from '@storybook/angular';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.@(js|ts|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  // this is required to avoud having to restart storybook to get sass changes (still need to refresh page)
  webpackFinal: async (config) => {
    // Define the absolute path to your global stylesheet.
    const globalStylePath = path.resolve(__dirname, '../projects/shared-ui/src/lib/styles/styles.css');

    // Define our custom rule for the global stylesheet.
    // This uses the loader chain proven to enable hot-reloading.
    const globalStyleRule = {
      test: globalStylePath,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'resolve-url-loader',
          options: { sourceMap: true },
        },
      ],
    };

    // 3. Find the index of the original, problematic SCSS rule.
    const scssRuleIndex = config.module?.rules?.findIndex(
      // dx code, any is fine here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rule: any) => rule.test?.toString().includes('scss')
    );

    if (scssRuleIndex !== -1 && scssRuleIndex !== undefined && config.module?.rules) {
      // 4. Remove the original rule from the configuration.
      const [defaultScssRule] = config.module.rules.splice(scssRuleIndex, 1);

      // 5. Create a new "master" rule that uses 'oneOf'.
      const newMasterRule = {
        test: /\.scss$/,
        // 'oneOf' tells Webpack to use the FIRST matching rule and then stop.
        oneOf: [
          globalStyleRule, // It will try our custom rule first.
          // dx code, any is fine here
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultScssRule as any, // If it's not the global file, it will fall back to the default.
        ],
      };

      // 6. Add our new master rule back to the list.
      // dx code, any is fine here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.module.rules.push(newMasterRule as any);
    }

    config.module?.rules?.push({
      test: path.resolve(__dirname, '../.storybook/storybook-styles.css'),
      // test: /storybook-styles\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    config.module?.rules?.push({
      test: /@phosphor-icons.*\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    // config.module?.rules?.push({
    //   test: /@fontsource.*\.css$/,
    //   use: ['style-loader', 'css-loader'],
    // });

    return config;
  },
};

export default config;
