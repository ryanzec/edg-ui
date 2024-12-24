<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  type Props = {
    option: TOptionValue;
    optionIndex: number;
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
  };

  let { option, optionIndex, optionAction }: Props = $props();
</script>

<li
  data-id="option"
  use:optionAction={{
    option,
    optionIndex,
  }}
  class="data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-surface-tertiary scroll-my-xs gap-xs px-xs py-2xs data-disabled:opacity-disabled relative flex cursor-pointer items-center last:rounded-b-none"
>
  <div>
    <span class="font-medium">{option.display}</span>
  </div>
</li>
