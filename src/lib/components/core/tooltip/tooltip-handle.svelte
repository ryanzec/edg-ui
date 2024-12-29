<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type TooltipHandleProps = HTMLAttributes<HTMLSpanElement> & {
    class?: string;
    children?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  let { class: extraClass = '', children, ...rest }: TooltipHandleProps = $props();
</script>

<span data-id="handle" class={extraClass} data-tooltip-handle {...rest}>{@render children?.()}</span>
