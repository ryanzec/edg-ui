<script lang="ts">
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import { writable } from 'svelte/store';

  type MyComboboxValue = {
    value: string;
    display: string;
    meta: { testing: string };
  };

  const groupedOptions: Record<string, MyComboboxValue[]> = {
    'Group One': [
      {
        value: '1',
        display: 'Option 1-1',
        meta: { testing: 'testing1-1' },
      },
      {
        value: '2',
        display: 'Option 1-2',
        meta: { testing: 'testing1-2' },
      },
      {
        value: '3',
        display: 'Option 1-3',
        meta: { testing: 'testing1-3' },
      },
      {
        value: '4',
        display: 'Option 1-4',
        meta: { testing: 'testing1-4' },
      },
    ],
    'Group Two': [
      {
        value: '21',
        display: 'Option 2-1',
        meta: { testing: 'testing2-1' },
      },
      {
        value: '22',
        display: 'Option 2-2',
        meta: { testing: 'testing2-2' },
      },
      {
        value: '23',
        display: 'Option 2-3',
        meta: { testing: 'testing2-3' },
      },
      {
        value: '24',
        display: 'Option 2-4',
        meta: { testing: 'testing2-4' },
      },
    ],
  };
  const selected = writable<MyComboboxValue[]>([]);
</script>

<Combobox name="value" label="grouped filtering" {groupedOptions} {selected} useFiltering isMultiple />
<!-- for manual testing -->
<pre>{JSON.stringify($selected, null, 2)}</pre>
<!-- for automated testing -->
<pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
