import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSimpleExample from '$lib/components/core/tooltip/examples/dev-simple-example.svelte';

export const tooltipExampleItems: DevNavigationItem = {
  display: 'Tooltip',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
  ],
};
