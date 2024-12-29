<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type CardFooterProps = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, ...rest }: CardFooterProps = $props();
</script>

<div {...rest}>
  {@render children()}
</div>
