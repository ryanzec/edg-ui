<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import MeltOverlay from '$lib/components/core/overlay/melt-overlay.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onDestroy } from 'svelte';

  type Props = HTMLAttributes<HTMLDivElement> & {
    isOpened: Writable<boolean>;
    meltPortalled: AnyMeltElement;
    meltOverlay: AnyMeltElement;
    meltContent: AnyMeltElement;
    onOpened?: () => void;
    onClosed?: () => void;
    children?: import('svelte').Snippet;
  };

  let {
    isOpened,
    meltPortalled,
    meltOverlay,
    meltContent,
    onOpened,
    onClosed,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  let dialogContainerElement: HTMLElement | undefined = $state();

  // this is not $state as we don't want this changing to cause effects and such to re-trigger
  let previousDialogContainerElement: HTMLElement | undefined = undefined;

  const resizeObserver = new ResizeObserver((entries) => {
    for (const _entry of entries) {
      updateOptionsMenuPosition();
    }
  });

  const updateOptionsMenuPosition = async () => {
    if (!dialogContainerElement) {
      return;
    }

    const clientRect = dialogContainerElement.getBoundingClientRect();
    const xTranslate = Math.floor(clientRect.width / 2);
    const yTranslate = Math.floor(clientRect.height / 2);

    // since translating by a percentage can result in fractional values, we need to round them and manually
    // set the styles instead of just using css with tailwind as if we don't, things like borders and such can
    // appear blurring / pixelated
    dialogContainerElement.style.translate = `-${xTranslate}px -${yTranslate}px`;
  };

  $effect(() => {
    if (dialogContainerElement) {
      // we need to store a copy of the element in order to make sure we can disconnect the resize observer when it
      // is removed
      previousDialogContainerElement = dialogContainerElement;
      resizeObserver.observe(dialogContainerElement);
    }

    return () => {
      if (previousDialogContainerElement) {
        resizeObserver.unobserve(previousDialogContainerElement);
      }

      previousDialogContainerElement = undefined;
    };
  });

  isOpened.subscribe((newIsOpened) => {
    newIsOpened ? onOpened?.() : onClosed?.();
  });

  onDestroy(() => {
    resizeObserver.disconnect();
  });
</script>

{#if $isOpened}
  <div data-id="dialog" use:melt={$meltPortalled}>
    <MeltOverlay {meltOverlay} />
    <div
      bind:this={dialogContainerElement}
      class={tailwindUtils.merge(
        'z-dialog bg-surface-pure fixed top-1/2 left-1/2 flex max-h-[85vh] w-[90vw] max-w-[450px] flex-col rounded-xl shadow-lg',
        extraClass,
      )}
      use:melt={$meltContent}
      {...rest}
    >
      {@render children?.()}
    </div>
  </div>
{/if}
