<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type CardProps = HTMLAttributes<HTMLDivElement> & { children: import('svelte').Snippet };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, class: extraClass = '', ...rest }: CardProps = $props();
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
