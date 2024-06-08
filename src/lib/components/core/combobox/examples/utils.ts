import DevAsyncExample from '$lib/components/core/combobox/examples/dev-async-example.svelte';
import DevClearOnEscapeExample from '$lib/components/core/combobox/examples/dev-clear-on-escape-example.svelte';
import DevFilteringExample from '$lib/components/core/combobox/examples/dev-filtering-example.svelte';
import DevMultipleFilteringExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-filtering-example.svelte';
import DevMultiplePreselectedExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-preselected-example.svelte';
import DevMultipleSimpleExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-simple-example.svelte';
import DevPreselectedExample from '$lib/components/core/combobox/examples/dev-preselected-example.svelte';
import DevSelectedChangedExample from '$lib/components/core/combobox/examples/dev-selected-changed-example.svelte';
import DevSimpleExample from '$lib/components/core/combobox/examples/dev-simple-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import DevMultipleClearOnEscapeExample from '$lib/components/core/combobox/examples/multiple/dev-multiple-clear-on-escape-example.svelte';
import DevNoSelectedInlineExample from '$lib/components/core/combobox/examples/multiple/dev-no-selected-inline-example.svelte';
import DevGroupedFilteringExample from '$lib/components/core/combobox/examples/grouped/dev-grouped-filtering-example.svelte';
import DevGroupedAsyncExample from '$lib/components/core/combobox/examples/grouped/dev-grouped-async-example.svelte';

export const comboboxExampleItems: DevNavigationItem = {
  display: 'Combobox',
  items: [
    {
      display: 'Async',
      component: DevAsyncExample,
    },
    {
      display: 'Clear on Escape',
      component: DevClearOnEscapeExample,
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
          display: 'Clear on Escape',
          component: DevMultipleClearOnEscapeExample,
        },
        {
          display: 'No Selected Inline',
          component: DevNoSelectedInlineExample,
        },
      ],
    },
  ],
};
