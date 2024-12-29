<script lang="ts">
  import TooltipContent from '$lib/components/core/tooltip/tooltip-content.svelte';
  import TooltipHandle from '$lib/components/core/tooltip/tooltip-handle.svelte';
  import { createTooltipStore } from '$lib/components/core/tooltip/store';
  import type { OffsetOptions } from '@floating-ui/dom';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLSpanElement> & {
    handle?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
    offsetOptions?: OffsetOptions;
  };

  let { handle, content, offsetOptions = {}, ...rest }: Props = $props();

  const { tooltipAction } = createTooltipStore();
</script>

<span data-id="tooltip" use:tooltipAction={{ offsetOptions }} {...rest}>
  <TooltipHandle>{@render handle?.()}</TooltipHandle>
  <TooltipContent>{@render content?.()}</TooltipContent>
</span>
