import DevBasicExample from '$lib/components/core/card/examples/dev-basic-example.svelte';
import DevHeaderItemsExample from '$lib/components/core/card/examples/dev-header-items-example.svelte';
import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const cardExampleItems: DevNavigationItem = {
  display: 'Card',
  items: [
    {
      display: 'Basic',
      component: DevBasicExample,
    },
    {
      display: 'Header Items',
      component: DevHeaderItemsExample,
    },
  ],
};
