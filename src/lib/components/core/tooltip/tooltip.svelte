<script lang="ts">
  import TooltipContent from '$lib/components/core/tooltip/tooltip-content.svelte';
  import TooltipHandle from '$lib/components/core/tooltip/tooltip-handle.svelte';
  import { createTooltipStore } from '$lib/components/core/tooltip/store';
  type Props = {
    handle?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
  };

  let { handle, content }: Props = $props();

  const { tooltipAction } = createTooltipStore();
</script>

<span data-id="tooltip" use:tooltipAction>
  <TooltipHandle>{@render handle?.()}</TooltipHandle>
  <TooltipContent>{@render content?.()}</TooltipContent>
</span>
