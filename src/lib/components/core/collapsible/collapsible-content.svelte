<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  interface Props {
    meltRoot: AnyMeltElement;
    meltContent: AnyMeltElement;
    isOpened: Writable<boolean>;
    children?: import('svelte').Snippet;
  }

  let {
    meltRoot,
    meltContent,
    isOpened,
    children
  }: Props = $props();
</script>

<div data-id="collapsible-content" use:melt={$meltRoot} class="relative">
  {#if $isOpened}
    <div use:melt={$meltContent} transition:slide>
      {@render children?.()}
    </div>
  {/if}
</div>
