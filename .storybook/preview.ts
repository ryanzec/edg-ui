import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { withInterceptorsFromDi } from '@angular/common/http';
import { withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import '@phosphor-icons/web/regular/style.css';
import '@phosphor-icons/web/bold/style.css';
import '@phosphor-icons/web/fill/style.css';
// import '@fontsource/geist-sans/400.css';
// import '@fontsource/geist-sans/500.css';
// import '@fontsource/geist-sans/600.css';
// import '@fontsource/geist-sans/700.css';
import '../.storybook/storybook-styles.css';
import { dateUtils } from '@organization/shared-utils';
import { UiThemeManager } from '@organization/shared-ui';

let uiThemeManager: UiThemeManager | null = null;

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: systemTheme,
    toolbar: {
      items: ['light', 'dark'],
      dynamicTitle: true,
    },
  },
};

// dx code, any is fine here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withThemeDecorator = (Story: any, context: any) => {
  const { globals } = context;
  const newTheme = globals.theme;

  if (!uiThemeManager) {
    console.log('uiThemeManager not found, returning Story()');

    return Story();
  }

  uiThemeManager.setDarkMode(newTheme === 'dark');

  return Story();
};

const preview: Preview = {
  decorators: [
    withThemeDecorator,
    applicationConfig({
      providers: [
        provideZonelessChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideRouter([]),
        provideAppInitializer(() => {
          uiThemeManager = inject(UiThemeManager);
          dateUtils.configureTimezone('UTC');

          return Promise.resolve();
          //   const globalService = inject(FeatureFlagStore);
          //   return globalService.initialize(LAUNCH_DARKLY_CLIENT_ID, LAUNCH_DARKLY_CONTEXT, LAUNCH_DARKLY_HASH);
        }),
      ],
    }),
  ],
  parameters: {
    controls: {
      disableSaveFromUI: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
};

export default preview;
