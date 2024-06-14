<script lang="ts">
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import DevCustomOptionComponent from '$lib/components/core/combobox/examples/dev-custom-option-component.svelte';
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
</script>

<Combobox name="value" label="custom option" {options} {selected} optionComponent={DevCustomOptionComponent} />
<a href="#test">link to test tabbing closing</a>
<!-- for manaul testing -->
<pre>{JSON.stringify($selected, null, 2)}</pre>
<!-- for automated testing -->
<pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
<div data-id="click-outside-tester" class="p-36">click outside tester</div>
