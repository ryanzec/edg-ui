<script lang="ts">
  // @todo(feature) support passing in width (as a class name probably)
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import Overlay from '../overlay/overlay.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = {
    hasOverlay?: boolean;
    isOpened: Writable<boolean>;
    isResizable?: boolean;
    meltOverlay: AnyMeltElement;
    meltPortalled: AnyMeltElement;
    meltContent: AnyMeltElement;
    onOpened?: () => void;
    onClosed?: () => void;
    children?: import('svelte').Snippet;
    class?: string;
  };

  let {
    hasOverlay = true,
    isOpened,
    isResizable = false,
    meltOverlay,
    meltPortalled,
    meltContent,
    onOpened,
    onClosed,
    children,
    class: extraClass = '',
  }: Props = $props();

  let peekElement: HTMLElement | undefined = $state();
  let xResizeLeft = 0;
  let isDragging = false;
  let dragXStart = 0;
  let dragWidthStart = 0;

  const handleWindowMouseMove = (event: MouseEvent) => {
    if (!peekElement) {
      return;
    }

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
    if (!peekElement) {
      return;
    }

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
    if (!peekElement) {
      return;
    }

    xResizeLeft = peekElement.getBoundingClientRect().x;

    let isDraggingArea = event.pageX >= xResizeLeft && event.pageX <= xResizeLeft + 5;

    if (!isDraggingArea) {
      document.body.style.cursor = 'auto';

      return;
    }

    document.body.style.cursor = 'ew-resize';
  };

  isOpened.subscribe((newIsOpened) => {
    newIsOpened ? onOpened?.() : onClosed?.();
  });

  // since we have to wait for the peek element to be available, we need to use $effect
  $effect(() => {
    if (!peekElement || !isResizable) {
      return;
    }

    peekElement.addEventListener('mousemove', handlePeekMouseMove);
    peekElement.addEventListener('mousedown', handlePeekMouseDown);
  });
</script>

{#if $isOpened}
  <div data-id="peek" use:melt={$meltPortalled}>
    {#if hasOverlay}<Overlay {meltOverlay} />{/if}
    <div
      use:melt={$meltContent}
      bind:this={peekElement}
      class={tailwindUtils.merge(
        'border-outline bg-surface-pure top-none right-none z-dialog p-base fixed flex h-screen w-[350px] flex-col border-l',
        extraClass,
      )}
      transition:fly={{
        x: 350,
        duration: 300,
        opacity: 1,
      }}
    >
      {@render children?.()}
    </div>
  </div>
{/if}
