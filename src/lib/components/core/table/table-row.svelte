<script module lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type TableHeaderProps = HTMLAttributes<HTMLTableRowElement> & { children: Snippet };
</script>

<script lang="ts">
  let { children, class: extraClass = '', ...rest }: TableHeaderProps = $props();
</script>

<tr class={tailwindUtils.merge('border-outline only:border-b [:not(:last-child)]:border-b', extraClass)} {...rest}
  >{@render children()}</tr
>
