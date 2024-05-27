import ButtonCircleExample from '$lib/components/core/button/examples/button-circle-example.svelte';
import ButtonDisabledExample from '$lib/components/core/button/examples/button-disabled-example.svelte';
import ButtonGhostExample from '$lib/components/core/button/examples/button-ghost-example.svelte';
import ButtonLoadingExample from '$lib/components/core/button/examples/button-loading-example.svelte';
import ButtonOutlinedExample from '$lib/components/core/button/examples/button-outlined-example.svelte';
import ButtonPillExample from '$lib/components/core/button/examples/button-pill-example.svelte';
import ButtonPrePostItemsExample from '$lib/components/core/button/examples/button-pre-post-items-example.svelte';
import ButtonWeakExample from '$lib/components/core/button/examples/button-weak-example.svelte';
import ButtonFilledExample from '$lib/components/core/button/examples/button-filled-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const buttonExampleItems: DevNavigationItem = {
  display: 'Button',
  items: [
    {
      display: 'Circle',
      component: ButtonCircleExample,
    },
    {
      display: 'Disabled',
      component: ButtonDisabledExample,
    },
    {
      display: 'Filled',
      component: ButtonFilledExample,
    },
    {
      display: 'Ghost',
      component: ButtonGhostExample,
    },
    {
      display: 'Loading',
      component: ButtonLoadingExample,
    },
    {
      display: 'Outlined',
      component: ButtonOutlinedExample,
    },
    {
      display: 'Pill',
      component: ButtonPillExample,
    },
    {
      display: 'Pre / Post Items',
      component: ButtonPrePostItemsExample,
    },
    {
      display: 'Weak',
      component: ButtonWeakExample,
    },
  ],
};
