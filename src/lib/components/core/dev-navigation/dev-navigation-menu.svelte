<script lang="ts">
  import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
  import { devNavigationStore } from '$lib/components/core/dev-navigation/store';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import DevNavigationMenuGroup from '$lib/components/core/dev-navigation/dev-navigation-menu-group.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  type Props = {
    isNested?: boolean;
    items?: DevNavigationItem[];
    parent?: string;
  };

  let { isNested = false, items = [], parent = '' }: Props = $props();

  const handleDisplayComponent = (item: DevNavigationItem) => {
    devNavigationStore.setActiveComponent(item.component);

    $page.url.searchParams.set('component', `${parent}${item.display}`);

    goto($page.url.toString());
  };
</script>

<div
  class={tailwindUtils.merge('border-outline p-sm flex flex-1 flex-col', {
    'border-r': isNested === false,
    'ml-xs': isNested,
    'w-[200px]': isNested === false,
  })}
>
  <div class="flex flex-col">
    {#each items as item}
      <div>
        {#if item.items && item.items.length > 0}
          <DevNavigationMenuGroup {item} />
        {:else}
          <button
            type="button"
            class="cursor-pointer"
            onclick={() => {
              handleDisplayComponent(item);
            }}
          >
            {item.display}
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>
