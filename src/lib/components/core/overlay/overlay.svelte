<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { fade } from 'svelte/transition';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = HTMLAttributes<HTMLDivElement> & {
    children?: import('svelte').Snippet;
    isFixed?: boolean;
  };

  let { children, isFixed = true, class: extraClass = '', ...rest }: Props = $props();
</script>

<div
  data-id="overlay"
  class={tailwindUtils.merge('bg-overlay-background/50 inset-none z-overlay backdrop-blur-xs', extraClass, {
    fixed: isFixed,
    absolute: !isFixed,
  })}
  transition:fade={{ duration: 150 }}
  {...rest}
>
  {@render children?.()}
</div>
