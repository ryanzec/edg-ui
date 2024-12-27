<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind.js';

  type Props = HTMLAttributes<HTMLDivElement> & { children?: import('svelte').Snippet };

  let { children, class: extraClass = '' }: Props = $props();
</script>

<div class={tailwindUtils.merge('gap-2xs flex flex-col', extraClass)}>
  {@render children?.()}
</div>
