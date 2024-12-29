<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type PeekContentProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: PeekContentProps = $props();
</script>

<div data-id="content" class={tailwindUtils.merge('p-base flex-1', extraClass)} {...rest}>{@render children?.()}</div>
