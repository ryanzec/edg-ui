<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<div data-id="content" class="p-base flex-1" {...rest}>{@render children?.()}</div>
