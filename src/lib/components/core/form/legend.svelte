<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type LegendProps = HTMLAttributes<HTMLLegendElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: LegendProps = $props();
</script>

<legend {...rest}>{@render children?.()}</legend>
