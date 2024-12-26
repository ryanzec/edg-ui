<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div data-id="footer" class={tailwindUtils.merge('px-sm py-xs gap-xs flex justify-end', extraClass)} {...rest}>
  {@render children?.()}
</div>
