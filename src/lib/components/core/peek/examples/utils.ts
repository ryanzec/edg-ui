import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevResizeableExample from '$lib/components/core/peek/examples/dev-resizeable-example.svelte';
import DevSimpleExample from '$lib/components/core/peek/examples/dev-simple-example.svelte';

export const peekExampleItems: DevNavigationItem = {
  display: 'Peek',
  items: [
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
    {
      display: 'Resizable',
      component: DevResizeableExample,
    },
  ],
};
