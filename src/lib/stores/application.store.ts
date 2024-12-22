import { browser } from '$app/environment';
import { localStorageCacheUtils } from '$lib/utils/local-storage-cache';
import { writable, type Readable } from 'svelte/store';

export enum ApplicationThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ApplicationOptions = { themeMode?: ApplicationThemeMode };

export type ApplicationStore = { themeMode: ApplicationThemeMode };

export type ApplicationStoreInstance = {
  subscribe: Readable<ApplicationStore>['subscribe'];
  setThemeMode: (themeMode: ApplicationThemeMode) => void;
};

const createApplicationStore = (options: ApplicationOptions = {}): ApplicationStoreInstance => {
  const isOSDarkMode = browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const overrideThemeMode = localStorageCacheUtils.get('themeMode') as ApplicationThemeMode;

  const store = writable<ApplicationStore>({
    themeMode:
      overrideThemeMode ?? options.themeMode ?? (isOSDarkMode ? ApplicationThemeMode.DARK : ApplicationThemeMode.LIGHT),
  });

  const setThemeMode = (themeMode: ApplicationThemeMode) => {
    localStorageCacheUtils.set('themeMode', themeMode);

    store.update((currentState) => {
      return {
        ...currentState,
        themeMode,
      };
    });
  };

  return {
    subscribe: store.subscribe,
    setThemeMode,
  };
};

export const applicationStore = createApplicationStore();
