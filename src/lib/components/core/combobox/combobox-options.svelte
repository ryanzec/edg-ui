<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  import { run } from 'svelte/legacy';

  import ComboboxClearOption from '$lib/components/core/combobox/combobox-clear-option.svelte';
  import ComboboxOptionsGroup from '$lib/components/core/combobox/combobox-options-group.svelte';

  import type { ComboboxStore } from '$lib/components/core/combobox/store';

  /* global TOptionValue */
  import type { ComboboxOptionComponent, ComboboxOptionsActionOptions } from '$lib/components/core/combobox/utils';
  import LoaderIcon from '$lib/components/core/icons/loader-icon.svelte';

  interface Props {
    options: TOptionValue[];
    groupedOptions?: Record<string, TOptionValue[]> | undefined;
    optionsAction: ComboboxStore<TOptionValue>['optionsAction'];
    optionAction: ComboboxStore<TOptionValue>['optionAction'];
    isLoading?: boolean;
    optionComponent?: ComboboxOptionComponent<TOptionValue> | undefined;
    inputValue?: string;
    showMenuCharacterThreshold: number;
    optionsActionOptions?: ComboboxOptionsActionOptions;
    clearOptionDisplay?: string;
    clearOptionAction?: ComboboxStore<TOptionValue>['clearOptionAction'] | undefined;
  }

  let {
    options,
    groupedOptions = undefined,
    optionsAction,
    optionAction,
    isLoading = false,
    optionComponent = undefined,
    inputValue = '',
    showMenuCharacterThreshold,
    optionsActionOptions = {},
    clearOptionDisplay = '',
    clearOptionAction = undefined
  }: Props = $props();

  let indexOffsets: Record<string, number> = $state({});

  // we need the correct element index in order for the combobox options to work properly so this handle
  // tracking the offsets when groups are used since there are extra elements that does count
  run(() => {
    if (!groupedOptions) {
      return;
    }

    const objectKeys = Object.keys(groupedOptions);
    indexOffsets = { [objectKeys[0]]: 0 };

    for (let i = 1; i < objectKeys.length; i++) {
      indexOffsets[objectKeys[i]] = indexOffsets[objectKeys[i - 1]] + groupedOptions[objectKeys[i - 1]].length;
    }
  });

  let isGrouped = $derived(groupedOptions && Object.keys(groupedOptions).length > 0);
  let totalOptionsCount =
    $derived(groupedOptions && isGrouped
      ? Object.values(groupedOptions).reduce((collector, groupOptions) => collector + groupOptions.length, 0)
      : options.length);
  let passesThresholdCheck = $derived(inputValue.length >= showMenuCharacterThreshold);
</script>

<!--
  if the combobox is place in an element that can take focus and we don't have the tabindex -1, that will result
  in clicking on an option not working as the click will be seen as a click outside of the
  combobox and it will close the menu before the menu option click is triggered
-->
<div
  tabindex="-1"
  data-id="options"
  use:optionsAction={optionsActionOptions}
  class="absolute z-10 flex max-h-[300px] flex-col overflow-hidden overflow-y-auto rounded-b-lg border bg-surface-pure"
>
  <div class="flex max-h-full flex-col gap-0">
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
