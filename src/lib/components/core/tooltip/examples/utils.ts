import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import TooltipSimpleExample from '$lib/components/core/tooltip/examples/tooltip-simple-example.svelte';

export const tooltipExampleItems: DevNavigationItem = {
  display: 'Tooltip',
  items: [
    {
      display: 'Simple',
      component: TooltipSimpleExample,
    },
  ],
};
