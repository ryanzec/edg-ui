<script lang="ts" context="module">
  import type { ComponentType, SvelteComponent } from 'svelte';

  export type DevNavigationItem = {
    display: string;
    items?: DevNavigationItem[];
    component?: ComponentType<SvelteComponent>;
  };
</script>

<script lang="ts">
  import DevNavigationMenu from '$lib/components/core/dev-navigation/dev-navigation-menu.svelte';
  import { devNavigationStore } from '$lib/components/core/dev-navigation/store';
  import { page } from '$app/stores';
  import ScrollArea from '$lib/components/core/scroll-area/scroll-area.svelte';

  export let items: DevNavigationItem[] = [];

  devNavigationStore.parseForComponent($page.url.searchParams.get('component'), items);
</script>

<div class="flex h-full w-full">
  <ScrollArea class="h-full">
    <DevNavigationMenu class="p-3" {items} />
  </ScrollArea>
  <div data-id="component-container" class="flex-1 p-3">
    {#if $devNavigationStore.activeComponent}
      <svelte:component this={$devNavigationStore.activeComponent} />
    {/if}
  </div>
</div>
