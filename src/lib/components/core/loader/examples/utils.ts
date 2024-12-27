import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevIconExample from '$lib/components/core/loader/examples/dev-icon-example.svelte';
import DevFullExample from '$lib/components/core/loader/examples/dev-full-example.svelte';

export const loaderExampleItems: DevNavigationItem = {
  display: 'Loader',
  items: [
    {
      display: 'Icon',
      component: DevIconExample,
    },
    {
      display: 'Full',
      component: DevFullExample,
    },
  ],
};
