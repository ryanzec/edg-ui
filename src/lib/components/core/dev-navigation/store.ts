import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import { writable } from 'svelte/store';
import * as _ from 'lodash-es';

export type DevNavigationStore = {
  activeComponent?: DevNavigationItem['component'];
};

const store = writable<DevNavigationStore>({});

const setActiveComponent = (component: DevNavigationStore['activeComponent']) => {
  store.update((currentState) => {
    return {
      ...currentState,
      activeComponent: component,
    };
  });
};

// items should probably be part of the store
const parseForComponent = (componentPath: string | null, items: DevNavigationItem[]) => {
  if (!componentPath) {
    return;
  }

  const parts = componentPath.split('.');
  let activeItem: DevNavigationItem | undefined = _.find(items, { display: parts[0] });

  for (let i = 1; i < parts.length; i++) {
    activeItem = _.find(activeItem?.items || [], { display: parts[i] });

    if (!activeItem) {
      activeItem = undefined;

      break;
    }
  }

  if (!activeItem) {
    return;
  }

  setActiveComponent(activeItem.component);
};

export const devNavigationStore = {
  subscribe: store.subscribe,
  setActiveComponent,
  parseForComponent,
};
