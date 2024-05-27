<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import Overlay from '$lib/components/core/overlay/overlay.svelte';
  import { createEventDispatcher } from 'svelte';

  type CustomEvents = {
    close: void;
  };

  const dispatchEvent = createEventDispatcher<CustomEvents>();

  export let isOpened: Writable<boolean>;
  export let meltPortalled: AnyMeltElement;
  export let meltOverlay: AnyMeltElement;
  export let meltContent: AnyMeltElement;

  $: if ($isOpened === false) {
    dispatchEvent('close');
  }
</script>

{#if $isOpened}
  <div data-id="dialog" use:melt={$meltPortalled}>
    <Overlay {meltOverlay} />
    <div
      class="fixed left-1/2 top-1/2 z-dialog max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-pure p-4 shadow-lg"
      use:melt={$meltContent}
    >
      <slot />
    </div>
  </div>
{/if}
