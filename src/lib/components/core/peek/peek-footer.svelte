<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type PeekFooterProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: PeekFooterProps = $props();
</script>

<div data-id="footer" class="gap-xs border-outline p-base flex justify-end border-t" {...rest}>
  {@render children?.()}
</div>
