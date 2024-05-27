import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DropDownFullExample from '$lib/components/core/drop-down/examples/drop-down-full-example.svelte';

export const dropDownExampleItems: DevNavigationItem = {
  display: 'DropDown',
  items: [
    {
      display: 'Full',
      component: DropDownFullExample,
    },
  ],
};
