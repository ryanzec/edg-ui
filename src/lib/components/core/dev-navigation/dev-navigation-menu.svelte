<script lang="ts">
  import type { DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';
  import { devNavigationStore } from '$lib/components/core/dev-navigation/store';
  import Typography from '$lib/components/core/typography/typography.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { twMerge } from 'tailwind-merge';

  export let isNested: boolean = false;
  export let items: DevNavigationItem[] = [];
  export let parent: string = '';

  let extraClass: string = '';
  export { extraClass as class };

  const handleDisplayComponent = (item: DevNavigationItem) => {
    devNavigationStore.setActiveComponent(item.component);

    $page.url.searchParams.set('component', `${parent}${item.display}`);

    goto($page.url.toString());
  };
</script>

<div
  class={twMerge('flex flex-col border-outline', extraClass)}
  class:ml-2={isNested}
  class:w-48={isNested === false}
  class:border-r={isNested === false}
>
  <div class="flex flex-col">
    {#each items as item}
      {#if item.items && item.items.length > 0}
        <Typography>{item.display}</Typography>
        <svelte:self items={item.items} isNested parent={`${parent}${item.display}.`} />
      {:else}
        <button
          type="button"
          on:click={() => {
            handleDisplayComponent(item);
          }}
        >
          {item.display}
        </button>
      {/if}
    {/each}
  </div>
</div>
