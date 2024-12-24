<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import Overlay from '$lib/components/core/overlay/overlay.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = {
    isOpened: Writable<boolean>;
    meltPortalled: AnyMeltElement;
    meltOverlay: AnyMeltElement;
    meltContent: AnyMeltElement;
    onOpened?: () => void;
    onClosed?: () => void;
    children?: import('svelte').Snippet;
    class?: string;
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
  }: Props = $props();

  isOpened.subscribe((newIsOpened) => {
    newIsOpened ? onOpened?.() : onClosed?.();
  });
</script>

{#if $isOpened}
  <div data-id="dialog" use:melt={$meltPortalled}>
    <Overlay {meltOverlay} />
    <div
      class={tailwindUtils.merge(
        'z-dialog bg-surface-pure gap-sm p-base fixed top-1/2 left-1/2 flex max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl shadow-lg',
        extraClass,
      )}
      use:melt={$meltContent}
    >
      {@render children?.()}
    </div>
  </div>
{/if}
