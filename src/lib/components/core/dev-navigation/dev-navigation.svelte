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
  import Button from '../button/button.svelte';
  import { applicationStore, ApplicationThemeMode } from '$lib/stores/application.store';

  type Props = { items?: DevNavigationItem[] };

  let { items = [] }: Props = $props();

  devNavigationStore.parseForComponent($page.url.searchParams.get('component'), items);

  const handleToggleThemeMode = () => {
    applicationStore.setThemeMode(
      $applicationStore.themeMode === ApplicationThemeMode.LIGHT
        ? ApplicationThemeMode.DARK
        : ApplicationThemeMode.LIGHT,
    );
  };
</script>

<div class="flex h-full w-full">
  <ScrollArea class="h-full">
    <div class="flex h-full flex-col">
      <Button onclick={handleToggleThemeMode}>Toggle Theme Mode</Button>
      <DevNavigationMenu class="p-sm" {items} />
    </div>
  </ScrollArea>
  <ScrollArea class="h-full flex-1">
    <div data-id="component-container" class="p-sm flex-1">
      {#if $devNavigationStore.activeComponent}
        {@const SvelteComponent = $devNavigationStore.activeComponent}
        <SvelteComponent />
      {/if}
    </div>
  </ScrollArea>
</div>
