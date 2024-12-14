<script lang="ts" module>
  import type { Component } from 'svelte';

  export type DevNavigationItem = {
    display: string;
    items?: DevNavigationItem[];
    component?: Component;
  };
</script>

<script lang="ts">
  import DevNavigationMenu from '$lib/components/core/dev-navigation/dev-navigation-menu.svelte';
  import { devNavigationStore } from '$lib/components/core/dev-navigation/store';
  import { page } from '$app/stores';
  import ScrollArea from '$lib/components/core/scroll-area/scroll-area.svelte';

  type Props = { items?: DevNavigationItem[] };

  let { items = [] }: Props = $props();

  devNavigationStore.parseForComponent($page.url.searchParams.get('component'), items);
</script>

<div class="flex h-full w-full">
  <ScrollArea class="h-full">
    <DevNavigationMenu class="p-3" {items} />
  </ScrollArea>
  <div data-id="component-container" class="flex-1 p-3">
    {#if $devNavigationStore.activeComponent}
      {@const SvelteComponent = $devNavigationStore.activeComponent}
      <SvelteComponent />
    {/if}
  </div>
</div>
