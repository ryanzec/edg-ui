<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type SelectLabelProps = HTMLAttributes<HTMLSpanElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: SelectLabelProps = $props();
</script>

<span {...rest}>{@render children?.()}</span>
