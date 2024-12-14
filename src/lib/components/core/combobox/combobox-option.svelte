<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  interface Props {
    option: TOptionValue;
    optionIndex: number;
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
  }

  let { option, optionIndex, optionAction }: Props = $props();
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
  </div>
</li>
