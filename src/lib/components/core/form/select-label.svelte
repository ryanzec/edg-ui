<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLSpanElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<span {...rest}>{@render children?.()}</span>
