<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type OverlayProps = HTMLAttributes<HTMLDivElement> & {
    children?: import('svelte').Snippet;
    isFixed?: boolean;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, isFixed = true, class: extraClass = '', ...rest }: OverlayProps = $props();
</script>

<div
  data-id="overlay"
  class={tailwindUtils.merge('bg-overlay-background/50 inset-none z-overlay backdrop-blur-xs', extraClass, {
    fixed: isFixed,
    absolute: !isFixed,
  })}
  {...rest}
>
  {@render children?.()}
</div>
