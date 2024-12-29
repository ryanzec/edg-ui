<script module lang="ts">
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ComboboxOptionProps<
    TOptionValue extends {
      display: string;
      value: string;
    },
  > = HTMLAttributes<HTMLLIElement> & {
    option: TOptionValue;
    optionIndex: number;
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
  };
</script>

<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */

  import { tailwindUtils } from '$lib/utils/tailwind';

  let {
    option,
    optionIndex,
    optionAction,
    class: extraClass = '',
    ...rest
  }: ComboboxOptionProps<TOptionValue> = $props();
</script>

<li
  data-id="option"
  use:optionAction={{
    option,
    optionIndex,
  }}
  class={tailwindUtils.merge(
    'data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-neutral-subtle scroll-my-xs gap-xs px-xs py-2xs data-disabled:opacity-disabled border-outline relative flex cursor-pointer items-center border-t last:rounded-b-none',
    extraClass,
  )}
  {...rest}
>
  <div>
    <span>{option.display}</span>
  </div>
</li>
