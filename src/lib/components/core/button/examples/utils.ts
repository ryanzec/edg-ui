import DevCircleExample from '$lib/components/core/button/examples/dev-circle-example.svelte';
import DevDisabledExample from '$lib/components/core/button/examples/dev-disabled-example.svelte';
import DevGhostExample from '$lib/components/core/button/examples/dev-ghost-example.svelte';
import DevLoadingExample from '$lib/components/core/button/examples/dev-loading-example.svelte';
import DevOutlinedExample from '$lib/components/core/button/examples/dev-outlined-example.svelte';
import DevPillExample from '$lib/components/core/button/examples/dev-pill-example.svelte';
import DevPrePostItemsExample from '$lib/components/core/button/examples/dev-pre-post-items-example.svelte';
import DevWeakExample from '$lib/components/core/button/examples/dev-weak-example.svelte';
import DevFilledExample from '$lib/components/core/button/examples/dev-filled-example.svelte';
import DevToggleExample from '$lib/components/core/button/examples/dev-toggle-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const buttonExampleItems: DevNavigationItem = {
  display: 'Button',
  items: [
    {
      display: 'Circle',
      component: DevCircleExample,
    },
    {
      display: 'Disabled',
      component: DevDisabledExample,
    },
    {
      display: 'Filled',
      component: DevFilledExample,
    },
    {
      display: 'Ghost',
      component: DevGhostExample,
    },
    {
      display: 'Loading',
      component: DevLoadingExample,
    },
    {
      display: 'Outlined',
      component: DevOutlinedExample,
    },
    {
      display: 'Pill',
      component: DevPillExample,
    },
    {
      display: 'Pre / Post Items',
      component: DevPrePostItemsExample,
    },
    {
      display: 'Weak',
      component: DevWeakExample,
    },
    {
      display: 'Toggle',
      component: DevToggleExample,
    },
  ],
};
