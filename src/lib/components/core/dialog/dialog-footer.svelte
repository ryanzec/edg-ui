<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type DialogFooterProps = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: DialogFooterProps = $props();
</script>

<div data-id="footer" class={tailwindUtils.merge('px-sm py-xs gap-xs flex justify-end', extraClass)} {...rest}>
  {@render children?.()}
</div>
