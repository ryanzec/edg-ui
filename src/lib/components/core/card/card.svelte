<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };

  let { children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div
  class={tailwindUtils.merge(
    'gap-sm px-sm py-xs bg-surface-pure border-outline flex flex-col rounded-sm border',
    extraClass,
  )}
  {...rest}
>
  {@render children()}
</div>
