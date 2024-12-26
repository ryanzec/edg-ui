<script lang="ts">
  import CollapsibleContent from '$lib/components/core/collapsible/collapsible-content.svelte';
  import CollapsibleTrigger from '$lib/components/core/collapsible/collapsible-trigger.svelte';
  import Typography from '$lib/components/core/typography/typography.svelte';
  import DevNavigationMenu from '$lib/components/core/dev-navigation/dev-navigation-menu.svelte';
  import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
  import ChevronDownIcon from '$lib/components/core/icons/chevron-down-icon.svelte';
  import ChevronUpIcon from '$lib/components/core/icons/chevron-up-icon.svelte';
  import { createCollapsible } from '@melt-ui/svelte';
  import { collapsibleUtils } from '$lib/components/core/collapsible/utils';

  type Props = { item: DevNavigationItem };

  let { item }: Props = $props();

  const {
    elements: { root, content, trigger },
    states: { open },
  } = createCollapsible(collapsibleUtils.buildCreateOptions());
</script>

<CollapsibleTrigger meltTrigger={trigger} class="w-full">
  <div class="gap-2xs flex cursor-pointer items-center">
    <Typography class="flex-1">{item.display}</Typography>
    {#if $open}
      <ChevronUpIcon class="ml-auto" />
    {:else}
      <ChevronDownIcon class="ml-auto" />
    {/if}
  </div>
</CollapsibleTrigger>
<CollapsibleContent meltContent={content} meltRoot={root} isOpened={open}>
  <DevNavigationMenu items={item.items} isNested parent={`${parent}${item.display}.`} />
</CollapsibleContent>
