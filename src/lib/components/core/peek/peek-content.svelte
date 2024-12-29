<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type PeekContentProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: PeekContentProps = $props();
</script>

<div data-id="content" class="p-base flex-1" {...rest}>{@render children?.()}</div>
