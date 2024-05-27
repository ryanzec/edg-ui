<script lang="ts">
  import TooltipContent from '$lib/components/core/tooltip/tooltip-content.svelte';
  import TooltipHandle from '$lib/components/core/tooltip/tooltip-handle.svelte';
  import { createTooltipStore } from '$lib/components/core/tooltip/store';

  const { tooltipAction } = createTooltipStore();
</script>

<span data-id="tooltip" use:tooltipAction>
  <TooltipHandle><slot name="handle" /></TooltipHandle>
  <TooltipContent><slot name="content" /></TooltipContent>
</span>
