import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSimpleExample from '$lib/components/core/table/examples/dev-simple-example.svelte';
import DevSelectableExample from '$lib/components/core/table/examples/dev-selectable-example.svelte';

export const tableExampleItems: DevNavigationItem = {
  display: 'Table',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
    {
      display: 'Selectable',
      component: DevSelectableExample,
    },
  ],
};
