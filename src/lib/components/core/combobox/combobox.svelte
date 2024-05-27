<script lang="ts" generics="TOptionValue extends { display: string; }">
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
  // the `label` for each option must be unique for this to work properly
  export let options: TOptionValue[] = [];
  export let selected: Writable<TOptionValue[]>;
  export let optionComponent: ComboboxOptionComponent<TOptionValue> | undefined = undefined;
  export let name: string;
  export let id: string = name;
  export let isMultiple: boolean = false;
  export let getOptions: ((inputValue: string) => Promise<TOptionValue[]>) | undefined = undefined;
  export let resultsDelay: number = getOptions ? COMBOBOX_DEFAULT_DELAY : 0;
  export let clearOnEscape: boolean = false;
  export let useFiltering: boolean = false;
  export let filter: (inputValue: string, options: TOptionValue[]) => TOptionValue[] =
    comboboxComponentUtils.defaultFilter;

  // @todo(feature) character threshold
  // @todo(feature) allow new value
  // @todo(feature) validation state

  let extraClass: string = '';
  export { extraClass as class };

  // this holds the input value that is actively being used (since there can be a delay in the getOptions function)
  let activeInputValue = '';

  const {
    isOpened,
    inputValue,
    optionsElement,
    labelAction,
    inputAction,
    optionsAttachedAction,
    optionsAction,
    optionAction,
    comboboxUtils,
  } = createComboboxStore({
    selected,
    isMultiple,
  });

  const filterOptions = (inputValue: string): TOptionValue[] => {
    if (!useFiltering) {
      return options;
    }

    let filteredOptions = filter(inputValue, options);

    if (isMultiple) {
      filteredOptions = comboboxComponentUtils.removeSelectedOptions(filteredOptions, $selected);
    }

    return filteredOptions;
  };

  let isLoading = false;
  let finalOptions = useFiltering ? filterOptions($inputValue) : options;

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

    if (!inputValue) {
      finalOptions = options;

      return;
    }

    if (getOptions) {
      isLoading = true;
      finalOptions = await getOptions(inputValue);
      isLoading = false;

      // we do an early return as when getting options async, the async process should handle the filtering
      return;
    }

    finalOptions = filterOptions(inputValue);
  }, resultsDelay);

  // keep options up to date with what is typed in the input
  $: {
    getOptionsDebounced($inputValue);
  }

  // the selected options could effect the results of the filter so we need to make sure they are kept in sync
  selected.subscribe(() => {
    finalOptions = filterOptions($inputValue);
  });

  // make sure only one option is selected when not in multiple selection mode
  $: if (isMultiple === false && $selected.length > 1) {
    loggerUtils.warn(
      'combobox compoenent: attempt to set multiple values for a single select combobox, only using the first passed in value',
    );

    $selected = [$selected[0]];
  }

  $: if (isMultiple === false && $isOpened === false && $selected.length > 0) {
    $inputValue = $selected[0].display;
    activeInputValue = $inputValue;
  }
</script>

<div
  data-id="combobox"
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
      class="flex w-full rounded-lg border border-outline bg-surface-pure px-3 text-surface-on-base focus:border-outline-active data-[state=open]:rounded-b-none"
    >
      <div class="relative flex flex-1 flex-wrap items-center gap-2">
        <!-- the data-state should be provided by mely automatically but seems like that might be a bug -->
        {#if isMultiple && $selected.length > 0}
          {#each $selected as selectedOption}
            <div data-id="selected-indicator" class="flex-shrink-0">
              {selectedOption.display}
              <button data-id="remove-trigger" on:click={() => comboboxUtils.removeOption(selectedOption)}>X</button>
            </div>
          {/each}
        {/if}
        <input
          use:inputAction
          {id}
          type="text"
          class="min-h-10 flex-1 items-center justify-between outline-0"
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
      {isLoading}
      {optionsAction}
      {optionAction}
      inputValue={activeInputValue}
    />
  {/if}
</div>
