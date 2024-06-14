import DevAsyncExample from '$lib/components/core/combobox/examples/dev-async-example.svelte';
import DevFilteringExample from '$lib/components/core/combobox/examples/dev-filtering-example.svelte';
import DevMultipleFilteringExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-filtering-example.svelte';
import DevMultiplePreselectedExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-preselected-example.svelte';
import DevMultipleSimpleExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-simple-example.svelte';
import DevPreselectedExample from '$lib/components/core/combobox/examples/dev-preselected-example.svelte';
import DevSelectedChangedExample from '$lib/components/core/combobox/examples/dev-selected-changed-example.svelte';
import DevSimpleExample from '$lib/components/core/combobox/examples/dev-simple-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevNoSelectedInlineExample from '$lib/components/core/combobox/examples/multiple/dev-no-selected-inline-example.svelte';
import DevGroupedFilteringExample from '$lib/components/core/combobox/examples/grouped/dev-grouped-filtering-example.svelte';
import DevGroupedAsyncExample from '$lib/components/core/combobox/examples/grouped/dev-grouped-async-example.svelte';
import DevCustomOptionExample from '$lib/components/core/combobox/examples/dev-custom-option-example.svelte';
import DevGroupedMultipleFilteringExample from '$lib/components/core/combobox/examples/grouped/dev-grouped-multiple-filtering-example.svelte';
import DevInFocusableExample from '$lib/components/core/combobox/examples/for-tests/dev-in-focusable-example.svelte';
import DevLargeOptionsExample from '$lib/components/core/combobox/examples/dev-large-options-example.svelte';
import DevMenuFlippingExample from '$lib/components/core/combobox/examples/for-tests/dev-menu-flipping-example.svelte';
import DevEscapeBubbleExample from '$lib/components/core/combobox/examples/for-tests/dev-escape-bubble-example.svelte';

export const comboboxExampleItems: DevNavigationItem = {
  display: 'Combobox',
  items: [
    {
      display: 'Async',
      component: DevAsyncExample,
    },
    {
      display: 'Filtering',
      component: DevFilteringExample,
    },
    {
      display: 'Preselected',
      component: DevPreselectedExample,
    },
    {
      display: 'Selected Change',
      component: DevSelectedChangedExample,
    },
    {
      display: 'Simple',
      component: DevSimpleExample,
    },
    {
      display: 'Custom Option Rendered',
      component: DevCustomOptionExample,
    },
    {
      display: 'Large Options',
      component: DevLargeOptionsExample,
    },
    {
      display: 'For Tests',
      items: [
        {
          display: 'In Focusable',
          component: DevInFocusableExample,
        },
        {
          display: 'Menu Flipping',
          component: DevMenuFlippingExample,
        },
        {
          display: 'Escape Bubble',
          component: DevEscapeBubbleExample,
        },
      ],
    },
    {
      display: 'Grouped',
      items: [
        {
          display: 'Filtering',
          component: DevGroupedFilteringExample,
        },
        {
          display: 'Async',
          component: DevGroupedAsyncExample,
        },
        {
          display: 'Filtering Multiple',
          component: DevGroupedMultipleFilteringExample,
        },
      ],
    },
    {
      display: 'Multiple',
      items: [
        {
          display: 'Simple',
          component: DevMultipleSimpleExample,
        },
        {
          display: 'Filtering',
          component: DevMultipleFilteringExample,
        },
        {
          display: 'Preselected',
          component: DevMultiplePreselectedExample,
        },
        {
          display: 'No Selected Inline',
          component: DevNoSelectedInlineExample,
        },
      ],
    },
  ],
};
