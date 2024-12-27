<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    meltOverlay: AnyMeltElement;
    children?: import('svelte').Snippet;
  };

  let { meltOverlay, children, ...rest }: Props = $props();
</script>

<div
  data-id="overlay"
  use:melt={$meltOverlay}
  class="bg-overlay-background/50 inset-none z-overlay fixed backdrop-blur-xs"
  {...rest}
>
  {@render children?.()}
</div>
