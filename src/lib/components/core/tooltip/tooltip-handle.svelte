<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLSpanElement> & {
    class?: string;
    children?: import('svelte').Snippet;
  };

  let { class: extraClass = '', children, ...rest }: Props = $props();
</script>

<span data-id="handle" class={extraClass} data-tooltip-handle {...rest}>{@render children?.()}</span>
