import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevFullExample from '$lib/components/core/drop-down/examples/dev-full-example.svelte';

export const dropDownExampleItems: DevNavigationItem = {
  display: 'DropDown',
  items: [
    {
      display: 'Full',
      component: DevFullExample,
    },
  ],
};
