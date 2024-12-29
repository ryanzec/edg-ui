<script module lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TableHeaderProps = HTMLAttributes<HTMLTableCellElement> & { children?: Snippet };
</script>

<script lang="ts">
  let { children, class: extraClass = '', ...rest }: TableHeaderProps = $props();
</script>

<th
  class={tailwindUtils.merge(
    'p-xs border-outline bg-surface-tertiary text-left [:not(:last-child)]:border-r',
    extraClass,
  )}
  {...rest}>{@render children?.()}</th
>
