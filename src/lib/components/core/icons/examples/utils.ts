import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevAllExample from '$lib/components/core/icons/examples/dev-all-example.svelte';

export const iconExampleItems: DevNavigationItem = {
  display: 'Icon',
  items: [
    {
      display: 'All',
      component: DevAllExample,
    },
  ],
};
