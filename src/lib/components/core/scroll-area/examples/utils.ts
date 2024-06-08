import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSimpleExamples from '$lib/components/core/scroll-area/examples/dev-simple-examples.svelte';

export const scrollAreaExampleItems: DevNavigationItem = {
  display: 'Scroll Area',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExamples,
    },
  ],
};
