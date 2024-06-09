<script lang="ts" generics="TOptionValue extends { display: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  export let option: TOptionValue;
  export let optionIndex: number;
  export let optionAction: ComboboxStore<TOptionValue>['optionAction'];
</script>

<li
  data-id="option"
  use:optionAction={{
    option,
    optionIndex,
  }}
  class="relative flex cursor-pointer scroll-my-2 items-center gap-2 px-2 py-1 last:rounded-b-none data-[combobox-drop-down-selected]:bg-brand-subtle data-[combobox-highlighted]:bg-surface-tertiary data-[disabled]:opacity-50"
>
  <div>
    <span class="font-medium">{option.display}</span>
    <a href="http://www.goggle.com" target="_blank" rel="noreferrer" on:click|stopPropagation>Link</a>
  </div>
</li>
