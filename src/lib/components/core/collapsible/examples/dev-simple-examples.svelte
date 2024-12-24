<script lang="ts">
  import { createCollapsible } from '@melt-ui/svelte';
  import ChevronSelectorIcon from '$lib/components/core/icons/chevron-selector-icon.svelte';
  import XIcon from '$lib/components/core/icons/x-icon.svelte';
  import CollapsibleTrigger from '$lib/components/core/collapsible/collapsible-trigger.svelte';
  import CollapsibleContent from '$lib/components/core/collapsible/collapsible-content.svelte';
  import { collapsibleUtils } from '$lib/components/core/collapsible/utils';

  const {
    elements: { root, content, trigger },
    states: { open },
  } = createCollapsible(collapsibleUtils.buildCreateOptions());
</script>

<div>before content</div>
<CollapsibleTrigger meltTrigger={trigger}>
  <div>
    {#if $open}
      <XIcon class="size-base" />
    {:else}
      <ChevronSelectorIcon class="size-base" />
    {/if}
  </div>
</CollapsibleTrigger>
<div class="flex items-center">
  <span> @thomasglopes starred 3 repositories </span>
</div>
<CollapsibleContent meltContent={content} meltRoot={root} isOpened={open}>
  <div class="gap-xs flex flex-col">
    <div>
      <span>sveltejs/svelte</span>
    </div>
    <div>
      <span>sveltejs/kit</span>
    </div>
  </div>
</CollapsibleContent>
<div>after content</div>
