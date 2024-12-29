<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TableHeaderProps = HTMLAttributes<HTMLTableRowElement> & {
    children: Snippet;
    isSelectable?: boolean;
    isSelected?: boolean;
    onSelected?: (id: string) => void;
    id?: string;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import Checkbox from '../form/checkbox.svelte';
  import TableData from './table-data.svelte';

  let {
    children,
    isSelectable = false,
    isSelected = $bindable(),
    class: extraClass = '',
    onSelected,
    id,
    ...rest
  }: TableHeaderProps = $props();
</script>

<tr class={tailwindUtils.merge('border-outline', extraClass, { 'is-selected': isSelected })} {...rest}>
  {#if isSelectable && isSelected !== undefined && onSelected && id}
    <!-- setting thw width to 1px will make the table data element only take up the width of the content -->
    <TableData class="w-[1px]">
      <Checkbox
        showLabel={false}
        bind:checked={isSelected}
        name={`table-select-id-${id}`}
        value={id}
        onchange={() => onSelected(id)}
      />
    </TableData>
  {/if}
  {@render children()}
</tr>
