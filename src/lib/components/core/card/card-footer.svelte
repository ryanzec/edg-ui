<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };

  let { children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div class={extraClass} {...rest}>
  {@render children()}
</div>
