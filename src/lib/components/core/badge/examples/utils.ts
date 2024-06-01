import DevColorsExample from '$lib/components/core/badge/examples/dev-colors-example.svelte';
import DevShapesExample from '$lib/components/core/badge/examples/dev-shapes-example.svelte';
import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const badgeExampleItems: DevNavigationItem = {
  display: 'Badge',
  items: [
    {
      display: 'Colors',
      component: DevColorsExample,
    },
    {
      display: 'Shapes',
      component: DevShapesExample,
    },
  ],
};
