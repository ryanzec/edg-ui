<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type CardContentProps = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };
</script>

<script lang="ts">
  let { children, class: extraClass = '', ...rest }: CardContentProps = $props();
</script>

<div class={extraClass} {...rest}>
  {@render children()}
</div>
