<script lang="ts">
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import { writable } from 'svelte/store';

  type MyComboboxValue = {
    value: string;
    display: string;
    meta: {
      testing: string;
    };
  };

  const options: MyComboboxValue[] = [
    {
      value: '1',
      display: 'Option 1',
      meta: { testing: 'testing' },
    },
    {
      value: '2',
      display: 'Option 2',
      meta: { testing: 'testing' },
    },
    {
      value: '3',
      display: 'Option 3',
      meta: { testing: 'testing' },
    },
    {
      value: '4',
      display: 'Option 4',
      meta: { testing: 'testing' },
    },
  ];
  const selected = writable<MyComboboxValue[]>([]);
  const selectedChanged = writable(0);

  selected.subscribe(() => {
    $selectedChanged += 1;
  });
</script>

<Combobox name="value" label="selected change" {options} {selected} />
<div>selected changed statement fired: <span data-id="selected-change-count">{$selectedChanged}</span></div>
