<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type DialogContentProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: DialogContentProps = $props();
</script>

<div data-id="content" class={tailwindUtils.merge('p-sm', extraClass)} {...rest}>
  {@render children?.()}
</div>
