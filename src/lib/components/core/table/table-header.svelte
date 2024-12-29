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
    'p-xs bg-surface-tertiary border-outline border-b text-left [:not(:first-child)]:border-l',
    extraClass,
  )}
  {...rest}>{@render children?.()}</th
>
