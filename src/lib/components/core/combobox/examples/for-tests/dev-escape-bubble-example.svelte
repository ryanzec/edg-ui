<script lang="ts">
  import { keyPressedAction } from '$lib/actions/key-pressed-action';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import { writable } from 'svelte/store';

  let escapeTriggered = false;

  const handleEscape = () => {
    escapeTriggered = true;
  };

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

<div
  tabindex="-1"
  use:keyPressedAction={{
    key: 'Escape',
    callback: handleEscape,
  }}
>
  <div>escape triggered: <span data-id="external-escape-trigger">{escapeTriggered}</span></div>
  <Combobox name="value" label="simple" {options} {selected} clearOptionDisplay="None" />
  <!-- for manaul testing -->
  <pre>{JSON.stringify($selected, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
  <div data-id="click-outside-tester" class="p-36">click outside tester</div>
</div>
