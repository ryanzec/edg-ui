<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLLegendElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<legend {...rest}>{@render children?.()}</legend>
