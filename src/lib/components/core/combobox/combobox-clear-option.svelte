<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  /* global TOptionValue */
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  type Props = {
    display?: string;
    clearOptionAction: ComboboxStore<TOptionValue>['clearOptionAction'];
  };

  let { display = '', clearOptionAction }: Props = $props();
</script>

{#if display}
  <li
    data-id="clear-option"
    use:clearOptionAction
    class="data-combobox-drop-down-selected:bg-brand-subtle data-combobox-highlighted:bg-surface-tertiary relative flex cursor-pointer scroll-my-2 items-center gap-2 px-2 py-1 last:rounded-b-none data-disabled:opacity-50"
  >
    <div>
      <span class="font-medium">{display}</span>
    </div>
  </li>
{/if}
