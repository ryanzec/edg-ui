import DevFilledExample from '$lib/components/core/callout/examples/dev-filled-example.svelte';
import DevWeakExample from '$lib/components/core/callout/examples/dev-weak-example.svelte';
import DevIconExample from '$lib/components/core/callout/examples/dev-icon-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const calloutExampleItems: DevNavigationItem = {
  display: 'Callout',
  items: [
    {
      display: 'Filled',
      component: DevFilledExample,
    },
    {
      display: 'Weak',
      component: DevWeakExample,
    },
    {
      display: 'Icon',
      component: DevIconExample,
    },
  ],
};
