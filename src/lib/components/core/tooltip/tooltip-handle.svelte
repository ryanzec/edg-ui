<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type TooltipHandleProps = HTMLAttributes<HTMLSpanElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: TooltipHandleProps = $props();
</script>

<span data-id="handle" data-tooltip-handle {...rest}>{@render children?.()}</span>
