<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { OffsetOptions } from '@floating-ui/dom';

  export type TooltipProps = HTMLAttributes<HTMLSpanElement> & {
    handle?: Snippet;
    content?: Snippet;
    offsetOptions?: OffsetOptions;
  };
</script>

<script lang="ts">
  import TooltipContent from '$lib/components/core/tooltip/tooltip-content.svelte';
  import TooltipHandle from '$lib/components/core/tooltip/tooltip-handle.svelte';
  import { createTooltipStore } from '$lib/components/core/tooltip/store';
  import type { HTMLAttributes } from 'svelte/elements';

  let { handle, content, offsetOptions = {}, ...rest }: TooltipProps = $props();

  const { tooltipAction } = createTooltipStore();
</script>

<span data-id="tooltip" use:tooltipAction={{ offsetOptions }} {...rest}>
  <TooltipHandle>{@render handle?.()}</TooltipHandle>
  <TooltipContent>{@render content?.()}</TooltipContent>
</span>
