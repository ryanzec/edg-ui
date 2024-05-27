<script lang="ts" generics="TOptionValue extends { display: string; }">
  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  /* global TOptionValue */
  import type { ComboboxOptionComponent } from '$lib/components/core/combobox/utils';
  import LoaderIcon from '$lib/components/core/icons/loader-icon.svelte';
  import ComboboxOption from '$lib/components/core/combobox/combobox-option.svelte';

  export let options: TOptionValue[];
  export let optionsAction: ComboboxStore<TOptionValue>['optionsAction'];
  export let optionAction: ComboboxStore<TOptionValue>['optionAction'];
  export let isLoading: boolean = false;
  export let optionComponent: ComboboxOptionComponent<TOptionValue> | undefined = undefined;
  export let inputValue: string = '';
</script>

<!-- while I dislike negative margin, there does not seem to be a way to tweak the placement of the menu otherwise -->
<ul
  data-id="options"
  use:optionsAction
  class="absolute z-10 flex max-h-[300px] flex-col overflow-hidden rounded-b-lg border"
>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-surface-pure" tabindex="0">
    {#if isLoading}
      <!-- the rotating icon can cause scrolling so just hidding the overflow to avoid that -->
      <li data-id="loading-option" class="oferflow relative flex items-center gap-2 overflow-hidden px-2 py-1">
        <LoaderIcon class="animate-spin" /> Loading...
      </li>
    {:else}
      {#each options as option, index (option.display)}
        <svelte:component this={optionComponent || ComboboxOption} {option} optionIndex={index} {optionAction} />
      {:else}
        {#if inputValue}
          <li data-id="no-results-option" class="relative py-1 px-2">No results found</li>
        {:else}
          <li data-id="type-to-search-option" class="relative py-1 px-2">Start typing to search...</li>
        {/if}
      {/each}
    {/if}
  </div>
</ul>
