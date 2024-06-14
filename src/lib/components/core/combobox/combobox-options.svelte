<script lang="ts" generics="TOptionValue extends { display: string; }">
  import ComboboxClearOption from '$lib/components/core/combobox/combobox-clear-option.svelte';
  import ComboboxOptionsGroup from '$lib/components/core/combobox/combobox-options-group.svelte';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';

  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  /* global TOptionValue */
  import type { ComboboxOptionComponent, ComboboxOptionsActionOptions } from '$lib/components/core/combobox/utils';
  import LoaderIcon from '$lib/components/core/icons/loader-icon.svelte';

  export let options: TOptionValue[];
  export let groupedOptions: Record<string, TOptionValue[]> | undefined = undefined;
  export let optionsAction: ComboboxStore<TOptionValue>['optionsAction'];
  export let optionAction: ComboboxStore<TOptionValue>['optionAction'];
  export let isLoading: boolean = false;
  export let optionComponent: ComboboxOptionComponent<TOptionValue> | undefined = undefined;
  export let inputValue: string = '';
  export let showMenuCharacterThreshold: number;
  export let optionsActionOptions: ComboboxOptionsActionOptions = {};
  export let clearOptionDisplay: string = '';
  export let clearOptionAction: ComboboxStore<TOptionValue>['clearOptionAction'] | undefined = undefined;

  let indexOffsets: Record<string, number> = {};

  // we need the correct element index in order for the combobox options to work properly so this handle
  // tracking the offsets when groups are used since there are extra elements that does count
  $: {
    if (!groupedOptions) {
      break $;
    }

    const objectKeys = Object.keys(groupedOptions);
    indexOffsets = { [objectKeys[0]]: 0 };

    for (let i = 1; i < objectKeys.length; i++) {
      indexOffsets[objectKeys[i]] = indexOffsets[objectKeys[i - 1]] + groupedOptions[objectKeys[i]].length;
    }
  }

  $: isGrouped = groupedOptions && Object.keys(groupedOptions).length > 0;
  $: totalOptionsCount =
    groupedOptions && isGrouped
      ? Object.values(groupedOptions).reduce((collector, groupOptions) => collector + groupOptions.length, 0)
      : options.length;
  $: passesThresholdCheck = inputValue.length >= showMenuCharacterThreshold;
</script>

<div
  data-id="options"
  use:optionsAction={optionsActionOptions}
  class="absolute z-10 flex max-h-[300px] flex-col overflow-hidden rounded-b-lg border bg-surface-pure"
>
  <div class="flex max-h-full flex-col gap-0 overflow-y-auto">
    {#if isLoading}
      <!-- the rotating icon can cause scrolling so just hidding the overflow to avoid that -->
      <div data-id="loading-option" class="oferflow relative flex items-center gap-2 overflow-hidden px-2 py-1">
        <LoaderIcon class="animate-spin" /> Loading...
      </div>
    {:else if totalOptionsCount === 0 || !passesThresholdCheck}
      {#if inputValue && passesThresholdCheck}
        <div data-id="no-results-option" class="relative px-2 py-1">No results found</div>
      {:else}
        <div data-id="type-to-search-option" class="relative px-2 py-1">
          Type at least {showMenuCharacterThreshold} characters for results...
        </div>
      {/if}
    {:else if groupedOptions && isGrouped}
      {#if clearOptionDisplay && clearOptionAction}
        <ComboboxClearOption display={clearOptionDisplay} {clearOptionAction} />
      {/if}
      {#each Object.entries(groupedOptions) as [header, options]}
        <ComboboxOptionsGroup {header} {optionComponent} {options} {optionAction} indexOffset={indexOffsets[header]} />
      {/each}
    {:else}
      {#if clearOptionDisplay && clearOptionAction}
        <ComboboxClearOption display={clearOptionDisplay} {clearOptionAction} />
      {/if}
      <ComboboxOptionsGroup {optionComponent} {options} {optionAction} />
    {/if}
  </div>
</div>
