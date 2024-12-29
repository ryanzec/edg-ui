<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLLIElement> & {
    display?: string;
    clearOptionAction: ComboboxStore<TOptionValue>['clearOptionAction'];
  };

  let { display = '', clearOptionAction, ...rest }: Props = $props();
</script>

{#if display}
  <li
    data-id="clear-option"
    use:clearOptionAction
    class="data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-surface-tertiary scroll-my-xs gap-xs px-xs py-2xs data-disabled:opacity-disabled relative flex cursor-pointer items-center last:rounded-b-none"
    {...rest}
  >
    <div>
      <span>{display}</span>
    </div>
  </li>
{/if}
