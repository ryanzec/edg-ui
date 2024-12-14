<script lang="ts">
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import { writable } from 'svelte/store';

  type MyComboboxValue = {
    value: string;
    display: string;
    meta: { testing: string };
  };

  const options: MyComboboxValue[] = [];

  for (let i = 1; i <= 50; i++) {
    const baseValues = ['option', 'test', 'other'];
    options.push({
      value: `${i}`,
      display: `${baseValues[i % 3]} ${i}`,
      meta: { testing: `testing ${i}` },
    });
  }
  const selected = writable<MyComboboxValue[]>([]);
</script>

<Combobox class="mt-[500px]" name="value" label="large options" {options} {selected} useFiltering />
<!-- for manaul testing -->
<pre>{JSON.stringify($selected, null, 2)}</pre>
<!-- for automated testing -->
<pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
