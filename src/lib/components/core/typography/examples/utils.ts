import DevColorsExample from '$lib/components/core/typography/examples/dev-colors-example.svelte';
import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const typographyExampleItems: DevNavigationItem = {
  display: 'Typography',
  items: [
    {
      display: 'Colors',
      component: DevColorsExample,
    },
  ],
};
