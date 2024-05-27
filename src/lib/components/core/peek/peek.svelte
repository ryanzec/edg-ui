<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import Overlay from '../overlay/overlay.svelte';
  import { createEventDispatcher } from 'svelte';

  type CustomEvents = {
    closed: void;
  };

  const dispatchEvent = createEventDispatcher<CustomEvents>();

  export let hasOverlay: boolean = true;
  export let isOpened: Writable<boolean>;
  export let isResizable: boolean = false;
  export let meltOverlay: AnyMeltElement;
  export let meltPortalled: AnyMeltElement;
  export let meltContent: AnyMeltElement;

  let peekElement: HTMLElement;
  let xResizeLeft = 0;
  let isDragging = false;
  let dragXStart = 0;
  let dragWidthStart = 0;

  const handleWindowMouseMove = (event: MouseEvent) => {
    const moveDiff = event.pageX - dragXStart;

    peekElement.style.width = `${dragWidthStart + moveDiff * -1}px`;
  };

  const handleWindowMouseUp = () => {
    isDragging = false;
    document.body.style.userSelect = 'initial';
    document.body.style.cursor = 'auto';

    window.removeEventListener('mouseup', handleWindowMouseUp);
    window.removeEventListener('mousemove', handleWindowMouseMove);
  };

  const handlePeekMouseDown = (event: MouseEvent) => {
    const peekBoundingRect = peekElement.getBoundingClientRect();

    xResizeLeft = peekBoundingRect.x;
    isDragging = event.pageX >= xResizeLeft && event.pageX <= xResizeLeft + 5;

    if (!isDragging) {
      return;
    }

    dragXStart = event.pageX;
    dragWidthStart = peekBoundingRect.width;

    document.body.style.userSelect = 'none';

    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('mousemove', handleWindowMouseMove);
  };

  const handlePeekMouseMove = (event: MouseEvent) => {
    xResizeLeft = peekElement.getBoundingClientRect().x;

    let isDraggingArea = event.pageX >= xResizeLeft && event.pageX <= xResizeLeft + 5;

    if (!isDraggingArea) {
      document.body.style.cursor = 'auto';

      return;
    }

    document.body.style.cursor = 'ew-resize';
  };

  $: {
    if (!peekElement || !isResizable) {
      break $;
    }

    peekElement.addEventListener('mousemove', handlePeekMouseMove);
    peekElement.addEventListener('mousedown', handlePeekMouseDown);
  }

  $: if ($isOpened === false) {
    dispatchEvent('closed');
  }
</script>

{#if $isOpened}
  <div data-id="peek" use:melt={$meltPortalled}>
    {#if hasOverlay}<Overlay {meltOverlay} />{/if}
    <div
      use:melt={$meltContent}
      bind:this={peekElement}
      class="fixed right-0 top-0 z-50 flex h-screen w-[350px] flex-col border-l border-outline bg-surface-pure p-4"
      transition:fly={{
        x: 350,
        duration: 300,
        opacity: 1,
      }}
    >
      <slot />
    </div>
  </div>
{/if}
