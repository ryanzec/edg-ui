<script module lang="ts">
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ComboboxClearOptionProps<
    TOptionValue extends {
      display: string;
      value: string;
    },
  > = HTMLAttributes<HTMLLIElement> & {
    display?: string;
    clearOptionAction: ComboboxStore<TOptionValue>['clearOptionAction'];
  };
</script>

<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */

  import { tailwindUtils } from '$lib/utils/tailwind';

  let {
    display = '',
    clearOptionAction,
    class: extraClass = '',
    ...rest
  }: ComboboxClearOptionProps<TOptionValue> = $props();
</script>

{#if display}
  <li
    data-id="clear-option"
    use:clearOptionAction
    class={tailwindUtils.merge(
      'data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-surface-tertiary scroll-my-xs gap-xs px-xs py-2xs data-disabled:opacity-disabled relative flex cursor-pointer items-center last:rounded-b-none',
      extraClass,
    )}
    {...rest}
  >
    <div>
      <span>{display}</span>
    </div>
  </li>
{/if}
