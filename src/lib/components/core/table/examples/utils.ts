import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevSquareExample from '$lib/components/core/table/examples/dev-square-example.svelte';
import DevRoundedExample from '$lib/components/core/table/examples/dev-rounded-example.svelte';
import DevSelectableExample from '$lib/components/core/table/examples/dev-selectable-example.svelte';
import DevScrollableExample from '$lib/components/core/table/examples/dev-scrollable-example.svelte';
import DevLargeListExample from '$lib/components/core/table/examples/dev-large-list-example.svelte';
import DevFixedHeaderExample from '$lib/components/core/table/examples/dev-fixed-header-example.svelte';

export const tableExampleItems: DevNavigationItem = {
  display: 'Table',
  items: [
    {
      display: 'Square',
      component: DevSquareExample,
    },
    {
      display: 'Rounded',
      component: DevRoundedExample,
    },
    {
      display: 'Selectable',
      component: DevSelectableExample,
    },
    {
      display: 'Scrollable',
      component: DevScrollableExample,
    },
    {
      display: 'Large List',
      component: DevLargeListExample,
    },
    {
      display: 'Fixed Header',
      component: DevFixedHeaderExample,
    },
  ],
};
