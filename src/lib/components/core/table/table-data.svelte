<script module lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TableHeaderProps = HTMLAttributes<HTMLTableCellElement> & { children: Snippet };
</script>

<script lang="ts">
  let { children, class: extraClass = '', ...rest }: TableHeaderProps = $props();
</script>

<td
  class={tailwindUtils.merge('bg-surface-pure p-xs border-outline [:not(:last-child)]:border-r', extraClass)}
  {...rest}>{@render children()}</td
>
