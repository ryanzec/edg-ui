import DevSimpleExamples from '$lib/components/core/collapsible/examples/dev-simple-examples.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const collapsibleExampleItems: DevNavigationItem = {
  display: 'Collapsible',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExamples,
    },
  ],
};
