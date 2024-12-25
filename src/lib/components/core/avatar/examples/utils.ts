import DevTextExample from '$lib/components/core/avatar/examples/dev-text-example.svelte';
import DevImageExample from '$lib/components/core/avatar/examples/dev-image-example.svelte';
import DevStackedExample from '$lib/components/core/avatar/examples/dev-stacked-example.svelte';
import DevCountExample from '$lib/components/core/avatar/examples/dev-count-example.svelte';
import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const avatarExampleItems: DevNavigationItem = {
  display: 'Avatar',
  items: [
    {
      display: 'Text',
      component: DevTextExample,
    },
    {
      display: 'Image',
      component: DevImageExample,
    },
    {
      display: 'Stacked',
      component: DevStackedExample,
    },
    {
      display: 'Count',
      component: DevCountExample,
    },
  ],
};
