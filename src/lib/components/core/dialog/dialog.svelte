<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import Overlay from '$lib/components/core/overlay/overlay.svelte';

  interface Props {
    isOpened: Writable<boolean>;
    meltPortalled: AnyMeltElement;
    meltOverlay: AnyMeltElement;
    meltContent: AnyMeltElement;
    onOpened?: () => void;
    onClosed?: () => void;
    children?: import('svelte').Snippet;
  }

  let { isOpened, meltPortalled, meltOverlay, meltContent, onOpened, onClosed, children }: Props = $props();

  isOpened.subscribe((newIsOpened) => {
    newIsOpened ? onOpened?.() : onClosed?.();
  });
</script>

{#if $isOpened}
  <div data-id="dialog" use:melt={$meltPortalled}>
    <Overlay {meltOverlay} />
    <div
      class="fixed left-1/2 top-1/2 z-dialog max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-pure p-4 shadow-lg"
      use:melt={$meltContent}
    >
      {@render children?.()}
    </div>
  </div>
{/if}
