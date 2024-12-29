<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, ...rest }: Props = $props();
</script>

<div data-id="footer" class="gap-xs border-outline p-base flex justify-end border-t" {...rest}>
  {@render children?.()}
</div>
