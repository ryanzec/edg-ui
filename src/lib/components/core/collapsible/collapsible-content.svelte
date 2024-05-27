<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  export let meltRoot: AnyMeltElement;
  export let meltContent: AnyMeltElement;
  export let isOpened: Writable<boolean>;
</script>

<div data-id="collapsible-content" use:melt={$meltRoot} class="relative">
  {#if $isOpened}
    <div use:melt={$meltContent} transition:slide>
      <slot />
    </div>
  {/if}
</div>
