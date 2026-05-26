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
let storybookTheme = systemTheme;

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
  storybookTheme = globals.theme;

  if (!uiThemeManager) {
    console.log('uiThemeManager not found, returning Story()');

    return Story();
  }

  uiThemeManager.setDarkMode(storybookTheme === 'dark');

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
        // wildcard route lets stories use router.navigateByUrl() to demo router-driven behaviors without
        // needing to register real routes per story
        provideRouter([{ path: '**', children: [] }]),
        provideAppInitializer(() => {
          uiThemeManager = inject(UiThemeManager);
          uiThemeManager.setDarkMode(storybookTheme === 'dark');
          dateUtils.configureTimezone('UTC');

          return Promise.resolve();
          //   const globalService = inject(FeatureFlagStore);
          //   const client = LDClient.initialize(LAUNCH_DARKLY_CLIENT_ID, LAUNCH_DARKLY_CONTEXT, { hash: LAUNCH_DARKLY_HASH });
          //   return globalService.initialize(client);
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
