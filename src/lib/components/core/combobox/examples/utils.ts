import ComboboxAsyncExample from '$lib/components/core/combobox/examples/combobox-async-example.svelte';
import ComboboxClearOnEscapeExample from '$lib/components/core/combobox/examples/combobox-clear-on-escape-example.svelte';
import ComboboxFilteringExample from '$lib/components/core/combobox/examples/combobox-filtering-example.svelte';
import ComboboxMultipleFilteringExample from '$lib/components/core/combobox/examples/multiple/combobox-multiple-filtering-example.svelte';
import ComboboxMultiplePreselectedExample from '$lib/components/core/combobox/examples/multiple/combobox-multiple-preselected-example.svelte';
import ComboboxMultipleSimpleExample from '$lib/components/core/combobox/examples/multiple/combobox-multiple-simple-example.svelte';
import ComboboxPreselectedExample from '$lib/components/core/combobox/examples/combobox-preselected-example.svelte';
import ComboboxSelectedChangedExample from '$lib/components/core/combobox/examples/combobox-selected-changed-example.svelte';
import ComboboxSimpleExample from '$lib/components/core/combobox/examples/combobox-simple-example.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
import ComboboxMultipleClearOnEscapeExample from '$lib/components/core/combobox/examples/multiple/combobox-multiple-clear-on-escape-example.svelte';

export const comboboxExampleItems: DevNavigationItem = {
  display: 'Combobox',
  items: [
    {
      display: 'Async',
      component: ComboboxAsyncExample,
    },
    {
      display: 'Clear on Escape',
      component: ComboboxClearOnEscapeExample,
    },
    {
      display: 'Filtering',
      component: ComboboxFilteringExample,
    },
    {
      display: 'Preselected',
      component: ComboboxPreselectedExample,
    },
    {
      display: 'Selected Change',
      component: ComboboxSelectedChangedExample,
    },
    {
      display: 'Simple',
      component: ComboboxSimpleExample,
    },
    {
      display: 'Multiple',
      items: [
        {
          display: 'Simple',
          component: ComboboxMultipleSimpleExample,
        },
        {
          display: 'Filtering',
          component: ComboboxMultipleFilteringExample,
        },
        {
          display: 'Preselected',
          component: ComboboxMultiplePreselectedExample,
        },
        {
          display: 'Clear on Escape',
          component: ComboboxMultipleClearOnEscapeExample,
        },
      ],
    },
  ],
};
