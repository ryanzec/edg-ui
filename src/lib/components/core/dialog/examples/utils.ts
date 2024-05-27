import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DialogSimpleExample from '$lib/components/core/dialog/examples/dialog-simple-example.svelte';

export const dialogExampleItems: DevNavigationItem = {
  display: 'Dialog',
  items: [
    {
      display: 'Simple',
      component: DialogSimpleExample,
    },
  ],
};
