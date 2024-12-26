<script lang="ts" generics="TOptionValue extends { display: string; value: string; }">
  import Badge from '$lib/components/core/badge/badge.svelte';

  /* global TOptionValue */
  import debounce from 'debounce';
  import { keyPressedAction } from '$lib/actions/key-pressed-action';
  import { domUtils } from '$lib/utils/dom';
  import { createComboboxStore } from '$lib/components/core/combobox/store';
  import ChevronDownIcon from '$lib/components/core/icons/chevron-down-icon.svelte';
  import ChevronUpIcon from '$lib/components/core/icons/chevron-up-icon.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import {
    COMBOBOX_DEFAULT_DELAY,
    comboboxComponentUtils,
    type ComboboxOptionComponent,
    type ComboboxOptionsActionOptions,
  } from '$lib/components/core/combobox/utils';
  import { writable, type Writable } from 'svelte/store';
  import ComboboxOptions from '$lib/components/core/combobox/combobox-options.svelte';
  import { clickOutsideAction } from '$lib/actions/click-outside-action';

  // @todo(feature) character threshold
  // @todo(feature) allow new value

  type Props = {
    label: string;
    placeholder?: string;
    // the `value` for each option must be unique for this to work properly
    options?: TOptionValue[];
    groupedOptions?: Record<string, TOptionValue[]> | undefined;
    selected: Writable<TOptionValue[]>;
    optionComponent?: ComboboxOptionComponent<TOptionValue> | undefined;
    name: string;
    id?: string;
    isMultiple?: boolean;
    getOptions?: ((inputValue: string) => Promise<TOptionValue[]>) | undefined;
    getGroupedOptions?: ((inputValue: string) => Promise<Record<string, TOptionValue[]>>) | undefined;
    resultsDelay?: number;
    useFiltering?: boolean;
    filter?: (inputValue: string, options: TOptionValue[]) => TOptionValue[];
    showInlineSelectedOptions?: boolean;
    showMenuCharacterThreshold?: number;
    optionsActionOptions?: ComboboxOptionsActionOptions;
    clearOptionDisplay?: string;
    onSelectedChanged?: ((selected: TOptionValue[]) => void) | undefined;
    class?: string;
  };

  let {
    label,
    placeholder = 'Select...',
    options = [],
    groupedOptions = undefined,
    selected,
    optionComponent = undefined,
    name,
    id = name,
    isMultiple = false,
    getOptions = undefined,
    getGroupedOptions = undefined,
    resultsDelay = getOptions || getGroupedOptions ? COMBOBOX_DEFAULT_DELAY : 0,
    useFiltering = false,
    filter = comboboxComponentUtils.defaultFilter,
    showInlineSelectedOptions = true,
    showMenuCharacterThreshold = getOptions || getGroupedOptions ? 3 : 0,
    optionsActionOptions = {},
    clearOptionDisplay = '',
    onSelectedChanged = undefined,
    class: extraClass = '',
  }: Props = $props();

  // this holds the input value that is actively being used (since there can be a delay in getting option asyncly)
  let activeInputValue = $state('');
  let optionCount: Writable<number> = writable(0);

  const {
    isOpened,
    inputValue,
    inputIsDirty,
    inputElement,
    optionsElement,
    containerAction,
    labelAction,
    inputAction,
    optionsAttachedAction,
    optionsAction,
    optionAction,
    clearOptionAction,
    comboboxUtils,
  } = createComboboxStore({
    selected,
    optionCount,
    isMultiple,
  });

  const filterOptions = (inputValue: string): TOptionValue[] => {
    if (!useFiltering || (!isMultiple && !$inputIsDirty)) {
      return options;
    }

    let filteredOptions = filter(inputValue, options);

    if (isMultiple) {
      filteredOptions = comboboxComponentUtils.removeSelectedOptions(filteredOptions, $selected);
    }

    return filteredOptions;
  };

  const filterGroupedOptions = (inputValue: string): Record<string, TOptionValue[]> | undefined => {
    if (!useFiltering || !groupedOptions || (!isMultiple && !$inputIsDirty)) {
      return groupedOptions;
    }

    let filteredGroupedOptions: Record<string, TOptionValue[]> = {};

    Object.keys(groupedOptions).forEach((key) => {
      filteredGroupedOptions[key] = filter(inputValue, groupedOptions[key]);
    });

    if (isMultiple) {
      filteredGroupedOptions = comboboxComponentUtils.removeGroupedSelectedOptions(filteredGroupedOptions, $selected);
    }

    return filteredGroupedOptions;
  };

  let isLoading = $state(false);
  let finalOptions = $state(useFiltering ? filterOptions($inputValue) : options);
  let finalGroupedOptions = $state(useFiltering ? filterGroupedOptions($inputValue) : groupedOptions);

  const handleClickOutside = (clickedElement: HTMLElement) => {
    if (!$isOpened || !$optionsElement) {
      return;
    }

    if (domUtils.isElementChildOf(clickedElement, $optionsElement)) {
      return;
    }

    comboboxUtils.closeMenu();
  };

  let getOptionsDebounced = debounce(async (inputValue: string) => {
    activeInputValue = inputValue;

    if (inputValue.length < showMenuCharacterThreshold) {
      return;
    }

    if (!inputValue) {
      // multiple mode can filter out selected option so in that case, we need to run the filter
      finalOptions = isMultiple ? filterOptions(inputValue) : options;
      finalGroupedOptions = isMultiple ? filterGroupedOptions(inputValue) : groupedOptions;

      return;
    }

    if (getOptions) {
      isLoading = true;
      finalOptions = await getOptions(inputValue);
      finalGroupedOptions = undefined;
      isLoading = false;

      // we do an early return as when getting options async, the async process should handle the filtering
      return;
    }

    if (getGroupedOptions) {
      isLoading = true;
      finalGroupedOptions = await getGroupedOptions(inputValue);
      finalOptions = [];
      isLoading = false;

      // we do an early return as when getting options async, the async process should handle the filtering
      return;
    }

    finalOptions = filterOptions(inputValue);
    finalGroupedOptions = filterGroupedOptions(inputValue);
  }, resultsDelay);

  // the selected options could effect the results of the filter so we need to make sure they are kept in sync
  selected.subscribe((newSelected) => {
    finalOptions = filterOptions($inputValue);
    finalGroupedOptions = filterGroupedOptions($inputValue);

    // since the input for multiple mode does not persist any selected value in it, we need to clear it here
    if (isMultiple) {
      $inputValue = '';
      activeInputValue = '';
    }

    if (isMultiple === false && newSelected.length > 1) {
      selected.set([newSelected[0]]);
    }

    if (onSelectedChanged) {
      onSelectedChanged(newSelected);
    }
  });

  // make sure the input value is updated properly when the options menu is closed
  isOpened.subscribe((isOpened) => {
    if (isMultiple || isOpened || $selected.length === 0) {
      return;
    }

    $inputValue = $selected[0].display;
    activeInputValue = $inputValue;
  });

  inputValue.subscribe((newInputValue) => {
    getOptionsDebounced(newInputValue);
  });

  // @todo(refactor?) not sure if it is possible to refactor this $effect away as this is a value that needs to be
  // @todo(refactor?) passed to the combpobox store
  $effect(() => {
    $optionCount =
      groupedOptions && finalGroupedOptions
        ? Object.values(finalGroupedOptions).reduce((collector, options) => collector + options.length, 0)
        : finalOptions.length;
  });
</script>

<div
  data-id="combobox"
  use:containerAction
  use:clickOutsideAction={{ callback: handleClickOutside }}
  use:keyPressedAction={{
    key: 'Escape',
    stopPropagation: true,
    callback: () => {
      if ($isOpened) {
        comboboxUtils.closeMenu();
        $inputElement?.blur();

        return;
      }
    },
  }}
  use:keyPressedAction={{
    key: 'ArrowDown',
    callback: () => {
      if (!$isOpened) {
        $isOpened = true;
        comboboxUtils.setActiveOption(0);

        return;
      }

      const newActiveOptionIndex = comboboxUtils.increaseActiveOption();

      comboboxUtils.scrollToOption(newActiveOptionIndex);
    },
  }}
  use:keyPressedAction={{
    key: 'ArrowUp',
    callback: () => {
      const newActiveOptionIndex = comboboxUtils.decreaseActiveOption();

      comboboxUtils.scrollToOption(newActiveOptionIndex);
    },
  }}
  use:keyPressedAction={{
    key: 'Enter',
    callback: comboboxUtils.selectActiveOption,
  }}
>
  <div class="gap-2xs flex-col {extraClass}">
    <Label for={id} use={labelAction}>{label}</Label>
    <!--
      while it is generally better / easier to just use a button for an element you want clickable, since this
      element can have also have buttons inside it, we use a div and add the required a11y attributes otherwise
      svelte weird out and causing weird rendering issue is this is part of the initial page load of the application
      aswell as a weird svelte warning
    -->
    <div
      use:optionsAttachedAction
      role="button"
      tabindex="-1"
      onkeypress={() => {}}
      onclick={() => $inputElement?.focus()}
      class="border-outline bg-surface-pure text-on-surface focus:border-outline-active rounded-base px-xs py-2xs flex w-full border data-[state=open]:rounded-b-none"
    >
      <div class="gap-xs relative flex flex-1 flex-wrap items-center">
        {#if isMultiple && showInlineSelectedOptions && $selected.length > 0}
          {#each $selected as selectedOption}
            <Badge data-id="selected-indicator">
              {selectedOption.display}
              <button
                data-id="remove-trigger"
                onclick={(event: Event) => {
                  event.stopPropagation();
                  comboboxUtils.removeOption(selectedOption);
                }}
              >
                X
              </button>
            </Badge>
          {/each}
        {/if}
        <input
          use:inputAction
          {id}
          type="text"
          class="flex-1 items-center justify-between outline-0"
          {placeholder}
          data-skip-input-event
          bind:value={$inputValue}
          {name}
          autocomplete="off"
        />
      </div>
      <div class="self-center">
        {#if $isOpened}
          <ChevronUpIcon />
        {:else}
          <ChevronDownIcon />
        {/if}
      </div>
    </div>
  </div>
  {#if $isOpened}
    <ComboboxOptions
      {optionComponent}
      options={finalOptions}
      groupedOptions={finalGroupedOptions}
      {isLoading}
      {optionsAction}
      {optionAction}
      inputValue={activeInputValue}
      {showMenuCharacterThreshold}
      {optionsActionOptions}
      clearOptionDisplay={isMultiple ? '' : clearOptionDisplay}
      {clearOptionAction}
    />
  {/if}
</div>
