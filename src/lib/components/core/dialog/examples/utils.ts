import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSimpleExample from '$lib/components/core/dialog/examples/dev-simple-example.svelte';

export const dialogExampleItems: DevNavigationItem = {
  display: 'Dialog',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
  ],
};
