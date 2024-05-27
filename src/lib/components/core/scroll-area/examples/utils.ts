import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import ScrollAreaSimpleExamples from '$lib/components/core/scroll-area/examples/scroll-area-simple-examples.svelte';

export const scrollAreaExampleItems: DevNavigationItem = {
  display: 'Scroll Area',
  items: [
    {
      display: 'Simple',
      component: ScrollAreaSimpleExamples,
    },
  ],
};
