import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSimpleExample from '$lib/components/core/list/examples/dev-simple-example.svelte';
import DevIconsExample from '$lib/components/core/list/examples/dev-icons-example.svelte';

export const listExampleItems: DevNavigationItem = {
  display: 'List',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
    {
      display: 'Icons',
      component: DevIconsExample,
    },
  ],
};
