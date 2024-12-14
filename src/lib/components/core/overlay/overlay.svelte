<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    meltOverlay: AnyMeltElement;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { meltOverlay, children, ...rest }: Props = $props();
</script>

<div
  data-id="overlay"
  use:melt={$meltOverlay}
  class="bg-overlay-background/50 fixed inset-0 z-50 backdrop-blur-sm"
  transition:fade={{ duration: 150 }}
  {...rest}
>
  {@render children?.()}
</div>
