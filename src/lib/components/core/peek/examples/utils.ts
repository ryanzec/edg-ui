import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import PeekResizeableExample from '$lib/components/core/peek/examples/peek-resizeable-example.svelte';
import PeekSimpleExample from '$lib/components/core/peek/examples/peek-simple-example.svelte';

export const peekExampleItems: DevNavigationItem = {
  display: 'Peek',
  items: [
    {
      display: 'Simple',
      component: PeekSimpleExample,
    },
    {
      display: 'Resizable',
      component: PeekResizeableExample,
    },
  ],
};
