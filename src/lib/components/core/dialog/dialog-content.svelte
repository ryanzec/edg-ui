<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind.js';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div data-id="content" class={tailwindUtils.merge('p-sm', extraClass)} {...rest}>
  {@render children?.()}
</div>
