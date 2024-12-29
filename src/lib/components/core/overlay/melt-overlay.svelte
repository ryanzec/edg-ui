<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type MeltOverlayProps = HTMLAttributes<HTMLDivElement> & {
    meltOverlay: AnyMeltElement;
    children?: import('svelte').Snippet;
    isFixed?: boolean;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, meltOverlay, isFixed = true, class: extraClass = '', ...rest }: MeltOverlayProps = $props();
</script>

<div
  data-id="overlay"
  use:melt={$meltOverlay}
  class={tailwindUtils.merge('bg-overlay-background/50 inset-none z-overlay backdrop-blur-xs', extraClass, {
    fixed: isFixed,
    absolute: !isFixed,
  })}
  {...rest}
>
  {@render children?.()}
</div>
