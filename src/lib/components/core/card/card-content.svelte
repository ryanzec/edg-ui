<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type CardContentProps = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: CardContentProps = $props();
</script>

<div {...rest}>
  {@render children()}
</div>
