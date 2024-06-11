<script lang="ts" generics="TOptionValue extends { display: string; }">
  import Badge from '$lib/components/core/badge/badge.svelte';

  /* global TOptionValue */
  import debounce from 'debounce';
  import { loggerUtils } from '$lib/utils/logger';
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
  } from '$lib/components/core/combobox/utils';
  import { type Writable } from 'svelte/store';
  import ComboboxOptions from '$lib/components/core/combobox/combobox-options.svelte';
  import { clickOutsideAction } from '$lib/actions/click-outside-action';

  export let label: string;
  export let placeholder: string = 'Select...';
  // the `display` for each option must be unique for this to work properly
  export let options: TOptionValue[] = [];
  export let groupedOptions: Record<string, TOptionValue[]> | undefined = undefined;
  export let selected: Writable<TOptionValue[]>;
  export let optionComponent: ComboboxOptionComponent<TOptionValue> | undefined = undefined;
  export let name: string;
  export let id: string = name;
  export let isMultiple: boolean = false;
  export let getOptions: ((inputValue: string) => Promise<TOptionValue[]>) | undefined = undefined;
  export let getGroupedOptions: ((inputValue: string) => Promise<Record<string, TOptionValue[]>>) | undefined =
    undefined;
  export let resultsDelay: number = getOptions || getGroupedOptions ? COMBOBOX_DEFAULT_DELAY : 0;
  export let clearOnEscape: boolean = false;
  export let useFiltering: boolean = false;
  export let filter: (inputValue: string, options: TOptionValue[]) => TOptionValue[] =
    comboboxComponentUtils.defaultFilter;
  export let inlineSelectedOptions: boolean = true;
  export let showCharacterThreshold: number = getOptions || getGroupedOptions ? 3 : 0;

  // @todo(feature) character threshold
  // @todo(feature) allow new value

  let extraClass: string = '';
  export { extraClass as class };

  // this holds the input value that is actively being used (since there can be a delay in getting option asyncly)
  let activeInputValue = '';

  const {
    isOpened,
    inputValue,
    inputIsDirty,
    optionsElement,
    labelAction,
    inputAction,
    optionsAttachedAction,
    optionsAction,
    optionAction,
    containerAction,
    comboboxUtils,
  } = createComboboxStore({
    selected,
    isMultiple,
  });

  const filterOptions = (inputValue: string): TOptionValue[] => {
    if (!useFiltering || !$inputIsDirty) {
      return options;
    }

    let filteredOptions = filter(inputValue, options);

    if (isMultiple) {
      filteredOptions = comboboxComponentUtils.removeSelectedOptions(filteredOptions, $selected);
    }

    return filteredOptions;
  };

  const filterGroupedOptions = (inputValue: string): Record<string, TOptionValue[]> | undefined => {
    if (!useFiltering || !groupedOptions || !$inputIsDirty) {
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

  let isLoading = false;
  let finalOptions = useFiltering ? filterOptions($inputValue) : options;
  let finalGroupedOptions = useFiltering ? filterGroupedOptions($inputValue) : groupedOptions;

  $: isAsync = !!(getOptions || getGroupedOptions);

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

    if (inputValue.length < showCharacterThreshold) {
      return;
    }

    if (!inputValue) {
      finalOptions = options;
      finalGroupedOptions = groupedOptions;

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
    finalGroupedOptions = filterGroupedOptions($inputValue);
  }, resultsDelay);

  // keep options up to date with what is typed in the input
  $: {
    getOptionsDebounced($inputValue);
  }

  // the selected options could effect the results of the filter so we need to make sure they are kept in sync
  selected.subscribe(() => {
    finalOptions = filterOptions($inputValue);
    finalGroupedOptions = filterGroupedOptions($inputValue);
  });

  // make sure only one option is selected when not in multiple selection mode
  $: if (isMultiple === false && $selected.length > 1) {
    loggerUtils.warn(
      'combobox compoenent: attempt to set multiple values for a single select combobox, only using the first passed in value',
    );

    $selected = [$selected[0]];
  }

  // make sure the input value is updated properly when the options menu is closed
  $: if (isMultiple === false && $isOpened === false && $selected.length > 0) {
    $inputValue = $selected[0].display;
    activeInputValue = $inputValue;
  }

  // when using async options, if the input is cleared, we don't want the options to show up since the values seems
  // wierd when nothing has been typed (to get relevant options, something probably needed to be typed)
  $: if (isAsync && $inputValue.length < showCharacterThreshold) {
    finalOptions = [];
    finalGroupedOptions = undefined;
    comboboxUtils.clearActiveOption();

    // this need to update immediately otherwise component of use the data above will have a slight delay of old
    // content since the callback to get the async options, that also sets this, runs on a delay
    activeInputValue = '';
  }
</script>

<div
  data-id="combobox"
  use:containerAction
  use:clickOutsideAction={{ callback: handleClickOutside }}
  use:keyPressedAction={{
    key: 'Escape',
    callback: () => {
      if ($isOpened) {
        comboboxUtils.closeMenu();

        return;
      }

      if (clearOnEscape) {
        $selected = [];
        $inputValue = '';
        activeInputValue = '';

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

      comboboxUtils.increaseActiveOption();
    },
  }}
  use:keyPressedAction={{
    key: 'ArrowUp',
    callback: comboboxUtils.decreaseActiveOption,
  }}
  use:keyPressedAction={{
    key: 'Enter',
    callback: comboboxUtils.selectActiveOption,
  }}
>
  <div class="flex-col gap-1 {extraClass}">
    <Label for={id} use={labelAction}>{label}</Label>
    <div
      use:optionsAttachedAction
      class="flex w-full rounded-lg border border-outline bg-surface-pure px-2 py-1 text-surface-on-base focus:border-outline-active data-[state=open]:rounded-b-none"
    >
      <div class="relative flex flex-1 flex-wrap items-center gap-2">
        {#if isMultiple && inlineSelectedOptions && $selected.length > 0}
          {#each $selected as selectedOption}
            <Badge data-id="selected-indicator">
              {selectedOption.display}
              <button data-id="remove-trigger" on:click={() => comboboxUtils.removeOption(selectedOption)}>X</button>
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
          <ChevronUpIcon class="size-4" />
        {:else}
          <ChevronDownIcon class="size-4" />
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
      {showCharacterThreshold}
    />
  {/if}
</div>
