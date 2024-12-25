<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: Snippet };

  let { children, ...rest }: Props = $props();
</script>

<!-- we exclude the last child so that the negative margin does not shift context outside of its container -->
<div {...rest} class="[&>:not(:last-child)]:-ml-sm flex flex-row-reverse justify-end">
  {@render children?.()}
</div>
