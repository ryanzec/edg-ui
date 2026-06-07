import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { logManager } from '@organization/shared-utils';

/**
 * represents a single option in the combobox
 */
export type ComboboxOption = {
  /** the display label for the option */
  label: string;
  /** the internal unique value for the option */
  value: string | number;
  /** whether the option is selectable */
  disabled: boolean;
  /** the group label for organizing options */
  groupLabel: string;
  /** indicates if this option is a newly created option */
  isNew?: boolean;
};

/**
 * input type for creating or updating options (allows partial defaults)
 */
export type ComboboxOptionInput = {
  label: string;
  value: string | number;
  disabled?: boolean;
  groupLabel?: string;
};

/**
 * grouped options structure
 */
export type ComboboxGroupedOptions = {
  groupLabel: string;
  options: ComboboxOption[];
};

/**
 * configuration for the combobox store
 */
export type ComboboxConfig = {
  /** whether multiple values can be selected */
  isMultiSelect: boolean;
  /** whether new options can be created from input */
  allowNewOptions: boolean;
  /** whether to filter out already selected values from options */
  filterSelectedOptions: boolean;
  /** option filter function for options */
  optionFilter: ((inputValue: string, option: ComboboxOption) => boolean) | null;
  /** when false, skips the store's own option matching so externally-supplied (e.g. server-filtered) options pass through untouched */
  enableFiltering: boolean;
};

/**
 * internal state for the combobox store
 */
type ComboboxState = {
  options: ComboboxOption[];
  selectedValues: (string | number)[];
  inputValue: string;
  focusedOption: ComboboxOption | null;
  config: ComboboxConfig;
  isInitialized: boolean;
  isOpened: boolean;
};

/**
 * index information for focused option in grouped view
 */
export type FocusedOptionGroupIndex = {
  groupIndex: number;
  optionIndex: number;
};

/**
 * manages state and operations for a single/multi-select combobox/autocomplete
 */
@Injectable()
export class ComboboxStore {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<ComboboxState>({
    options: [],
    selectedValues: [],
    inputValue: '',
    focusedOption: null,
    config: {
      isMultiSelect: false,
      allowNewOptions: false,
      filterSelectedOptions: true,
      optionFilter: null,
      enableFiltering: true,
    },
    isInitialized: false,
    isOpened: false,
  });

  // computed properties for readonly access
  public readonly isInitialized = computed<boolean>(() => this._state().isInitialized);
  public readonly options = computed<ComboboxOption[]>(() => this._state().options);
  public readonly selectedValues = computed<(string | number)[]>(() => this._state().selectedValues);
  public readonly inputValue = computed<string>(() => this._state().inputValue);
  public readonly focusedOption = computed<ComboboxOption | null>(() => this._state().focusedOption);
  public readonly config = computed<ComboboxConfig>(() => this._state().config);
  public readonly isMultiSelect = computed<boolean>(() => this._state().config.isMultiSelect);
  public readonly allowNewOptions = computed<boolean>(() => this._state().config.allowNewOptions);
  public readonly isOpened = computed<boolean>(() => this._state().isOpened);

  /**
   * returns selected options including synthetic options for new values
   */
  public readonly selectedOptions = computed<ComboboxOption[]>(() => {
    const state = this._state();
    const selectedOptions: ComboboxOption[] = [];

    for (const value of state.selectedValues) {
      const existingOption = state.options.find((opt) => opt.value === value);

      if (existingOption) {
        selectedOptions.push(existingOption);
        continue;
      }

      if (state.config.allowNewOptions) {
        selectedOptions.push({
          label: String(value),
          value,
          disabled: false,
          groupLabel: 'Uncategorized',
          isNew: true,
        });
      }
    }

    return selectedOptions;
  });

  /**
   * returns filtered options based on input value and configuration
   */
  public readonly filteredOptions = computed<ComboboxOption[]>(() => {
    const state = this._state();
    let filtered = [...state.options];

    // skip option matching entirely when filtering is disabled (e.g. async / server-filtered options)
    if (state.config.enableFiltering) {
      // apply custom option filter if provided, otherwise use default label search
      if (state.config.optionFilter) {
        filtered = filtered.filter((option) => state.config.optionFilter!(state.inputValue, option));
      }

      if (!state.config.optionFilter && state.inputValue) {
        const searchValue = state.inputValue.toLowerCase();
        filtered = filtered.filter((option) => option.label.toLowerCase().includes(searchValue));
      }
    }

    // filter out selected options if configured
    if (state.config.filterSelectedOptions) {
      filtered = filtered.filter((option) => !state.selectedValues.includes(option.value));
    }

    return filtered;
  });

  /**
   * returns all options organized into groups, without any filtering applied.
   * use filteredGroupedOptions when rendering a dropdown that responds to user input.
   */
  public readonly groupedOptions = computed<ComboboxGroupedOptions[]>(() => {
    return this._groupOptions(this._state().options);
  });

  /**
   * returns filtered and grouped options
   */
  public readonly filteredGroupedOptions = computed<ComboboxGroupedOptions[]>(() => {
    return this._groupOptions(this.filteredOptions());
  });

  // event subjects
  private readonly _inputValueChangedSubject = new Subject<string>();
  private readonly _selectedValuesChangedSubject = new Subject<(string | number)[]>();
  private readonly _focusedOptionChangedSubject = new Subject<ComboboxOption | null>();
  private readonly _isOpenedChangedSubject = new Subject<boolean>();

  // public observables
  public readonly inputValueChanged$ = this._inputValueChangedSubject.asObservable();
  public readonly selectedValuesChanged$ = this._selectedValuesChangedSubject.asObservable();
  public readonly focusedOptionChanged$ = this._focusedOptionChangedSubject.asObservable();
  public readonly isOpenedChanged$ = this._isOpenedChangedSubject.asObservable();

  constructor() {
    this._destroyRef.onDestroy(() => {
      this._inputValueChangedSubject.complete();
      this._selectedValuesChangedSubject.complete();
      this._focusedOptionChangedSubject.complete();
      this._isOpenedChangedSubject.complete();
    });
  }

  /**
   * initializes the store with options and configuration
   */
  public initialize(optionsInput: ComboboxOptionInput[] = [], config: Partial<ComboboxConfig> = {}): void {
    const normalizedOptions = this._normalizeAndSortOptions(optionsInput);

    this._state.set({
      options: normalizedOptions,
      selectedValues: [],
      inputValue: '',
      focusedOption: null,
      config: {
        isMultiSelect: config.isMultiSelect ?? false,
        allowNewOptions: config.allowNewOptions ?? false,
        filterSelectedOptions: config.filterSelectedOptions ?? true,
        optionFilter: config.optionFilter ?? null,
        enableFiltering: config.enableFiltering ?? true,
      },
      isInitialized: true,
      isOpened: false,
    });
  }

  /**
   * updates the options list, maintaining existing selections if they still exist
   */
  public setOptions(optionsInput: ComboboxOptionInput[]): void {
    if (!this._assertInitialized('setOptions')) {
      return;
    }

    const normalizedOptions = this._normalizeAndSortOptions(optionsInput);
    const state = this._state();

    // maintain selections that still exist in new options
    const optionValues = new Set(normalizedOptions.map((opt) => opt.value));
    const maintainedSelections = state.selectedValues.filter(
      (value) => optionValues.has(value) || state.config.allowNewOptions
    );

    // clear focused option if it no longer exists
    const focusedStillExists =
      state.focusedOption && normalizedOptions.some((opt) => opt.value === state.focusedOption!.value);

    this._state.update((currentState) => ({
      ...currentState,
      options: normalizedOptions,
      selectedValues: maintainedSelections,
      focusedOption: focusedStillExists ? state.focusedOption : null,
    }));

    if (maintainedSelections.length !== state.selectedValues.length) {
      this._selectedValuesChangedSubject.next(maintainedSelections);
    }

    if (!focusedStillExists && state.focusedOption) {
      this._focusedOptionChangedSubject.next(null);
    }
  }

  /**
   * retrieves an option by its value
   */
  public getOptionByValue(value: string | number): ComboboxOption | undefined {
    return this._state().options.find((option) => option.value === value);
  }

  /**
   * sets the selected values
   */
  public setSelectedValues(values: (string | number)[]): void {
    if (!this._assertInitialized('setSelectedValues')) {
      return;
    }

    const state = this._state();
    let finalValues = values;

    // enforce single selection if not multi-select
    if (!state.config.isMultiSelect && values.length > 1) {
      logManager.error({
        type: 'combobox-store-invalid-selection',
        message: 'attempted to set multiple values on a single-select combobox',
        values,
      });
      finalValues = [values[0]];
    }

    // validate values exist in options or new options are allowed
    if (!state.config.allowNewOptions) {
      const validValues = new Set(state.options.map((opt) => opt.value));
      const invalidValues = finalValues.filter((value) => !validValues.has(value));

      if (invalidValues.length > 0) {
        logManager.error({
          type: 'combobox-store-invalid-values',
          message: 'attempted to select values that do not exist in options',
          invalidValues,
          options: state.options,
        });
        finalValues = finalValues.filter((value) => validValues.has(value));
      }
    }

    this._state.update((currentState) => {
      // update input value based on selection
      let newInputValue = currentState.inputValue;

      if (!currentState.config.isMultiSelect && finalValues.length === 1) {
        const selectedOption = this.getOptionByValue(finalValues[0]);
        newInputValue = selectedOption?.label ?? String(finalValues[0]);
      }

      if (currentState.config.isMultiSelect && finalValues.length !== currentState.selectedValues.length) {
        newInputValue = '';
      }

      return {
        ...currentState,
        selectedValues: finalValues,
        inputValue: newInputValue,
      };
    });

    this._selectedValuesChangedSubject.next(finalValues);

    // emit input value change if it changed
    if (this._state().inputValue !== state.inputValue) {
      this._inputValueChangedSubject.next(this._state().inputValue);
    }
  }

  /**
   * sets the input value. `emitChange` allows the caller (e.g. the brain's character-threshold gating) to update
   * the displayed input value without emitting the `inputValueChanged$` event.
   */
  public setInputValue(value: string, emitChange = true): void {
    if (!this._assertInitialized('setInputValue')) {
      return;
    }

    const previousValue = this._state().inputValue;

    this._state.update((state) => ({
      ...state,
      inputValue: value,
    }));

    if (value !== previousValue && emitChange) {
      this._inputValueChangedSubject.next(value);
    }
  }

  /**
   * clears the input value
   */
  public clearInputValue(): void {
    if (!this._assertInitialized('clearInputValue')) {
      return;
    }

    this.setInputValue('');
  }

  /**
   * sets the focused option
   */
  public setFocusedOption(option: ComboboxOption | null): void {
    if (!this._assertInitialized('setFocusedOption')) {
      return;
    }

    const previousOption = this._state().focusedOption;

    this._state.update((state) => ({
      ...state,
      focusedOption: option,
    }));

    if (option !== previousOption) {
      this._focusedOptionChangedSubject.next(option);
    }
  }

  /**
   * gets the index of the focused option in the filtered options list
   */
  public getFocusedOptionIndex(): number {
    if (!this._assertInitialized('getFocusedOptionIndex')) {
      return -1;
    }

    const state = this._state();

    if (!state.focusedOption) {
      return -1;
    }

    return this.filteredOptions().findIndex((opt) => opt.value === state.focusedOption!.value);
  }

  /**
   * gets the group and option index of the focused option in the filtered grouped options
   */
  public getFocusedOptionGroupIndex(): FocusedOptionGroupIndex {
    if (!this._assertInitialized('getFocusedOptionGroupIndex')) {
      return { groupIndex: -1, optionIndex: -1 };
    }

    const state = this._state();

    if (!state.focusedOption) {
      return { groupIndex: -1, optionIndex: -1 };
    }

    const groupedOptions = this.filteredGroupedOptions();

    for (let groupIndex = 0; groupIndex < groupedOptions.length; groupIndex++) {
      const group = groupedOptions[groupIndex];
      const optionIndex = group.options.findIndex((opt) => opt.value === state.focusedOption!.value);

      if (optionIndex !== -1) {
        return { groupIndex, optionIndex };
      }
    }

    return { groupIndex: -1, optionIndex: -1 };
  }

  /**
   * focuses the next option in the filtered list
   */
  public focusNext(): void {
    if (!this._assertInitialized('focusNext')) {
      return;
    }

    const filtered = this.filteredOptions();

    if (filtered.length === 0) {
      return;
    }

    const currentIndex = this.getFocusedOptionIndex();
    const nextIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;

    this.setFocusedOption(filtered[nextIndex]);
  }

  /**
   * focuses the previous option in the filtered list
   */
  public focusPrevious(): void {
    if (!this._assertInitialized('focusPrevious')) {
      return;
    }

    const filtered = this.filteredOptions();

    if (filtered.length === 0) {
      return;
    }

    const currentIndex = this.getFocusedOptionIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;

    this.setFocusedOption(filtered[previousIndex]);
  }

  /**
   * focuses the first option in the filtered list
   */
  public focusFirst(): void {
    if (!this._assertInitialized('focusFirst')) {
      return;
    }

    const filtered = this.filteredOptions();

    if (filtered.length > 0) {
      this.setFocusedOption(filtered[0]);
    }
  }

  /**
   * focuses the last option in the filtered list
   */
  public focusLast(): void {
    if (!this._assertInitialized('focusLast')) {
      return;
    }

    const filtered = this.filteredOptions();

    if (filtered.length > 0) {
      this.setFocusedOption(filtered[filtered.length - 1]);
    }
  }

  /**
   * focuses the next option in the filtered grouped list
   */
  public groupFocusNext(): void {
    if (!this._assertInitialized('groupFocusNext')) {
      return;
    }

    const groupedOptions = this.filteredGroupedOptions();

    if (groupedOptions.length === 0) {
      return;
    }

    const { groupIndex, optionIndex } = this.getFocusedOptionGroupIndex();

    // if nothing focused or not found, focus first option
    if (groupIndex === -1 || optionIndex === -1) {
      if (groupedOptions[0].options.length > 0) {
        this.setFocusedOption(groupedOptions[0].options[0]);
      }

      return;
    }

    const currentGroup = groupedOptions[groupIndex];

    // if there's a next option in the current group
    if (optionIndex < currentGroup.options.length - 1) {
      this.setFocusedOption(currentGroup.options[optionIndex + 1]);

      return;
    }

    // move to the first option of the next group
    const nextGroupIndex = groupIndex < groupedOptions.length - 1 ? groupIndex + 1 : 0;

    if (groupedOptions[nextGroupIndex].options.length > 0) {
      this.setFocusedOption(groupedOptions[nextGroupIndex].options[0]);
    }
  }

  /**
   * focuses the previous option in the filtered grouped list
   */
  public groupFocusPrevious(): void {
    if (!this._assertInitialized('groupFocusPrevious')) {
      return;
    }

    const groupedOptions = this.filteredGroupedOptions();

    if (groupedOptions.length === 0) {
      return;
    }

    const { groupIndex, optionIndex } = this.getFocusedOptionGroupIndex();

    // if nothing focused or not found, focus last option
    if (groupIndex === -1 || optionIndex === -1) {
      const lastGroup = groupedOptions[groupedOptions.length - 1];

      if (lastGroup.options.length > 0) {
        this.setFocusedOption(lastGroup.options[lastGroup.options.length - 1]);
      }

      return;
    }

    // if there's a previous option in the current group
    if (optionIndex > 0) {
      this.setFocusedOption(groupedOptions[groupIndex].options[optionIndex - 1]);

      return;
    }

    // move to the last option of the previous group
    const previousGroupIndex = groupIndex > 0 ? groupIndex - 1 : groupedOptions.length - 1;
    const previousGroup = groupedOptions[previousGroupIndex];

    if (previousGroup.options.length > 0) {
      this.setFocusedOption(previousGroup.options[previousGroup.options.length - 1]);
    }
  }

  /**
   * focuses the first option in the filtered grouped list
   */
  public groupFocusFirst(): void {
    if (!this._assertInitialized('groupFocusFirst')) {
      return;
    }

    const groupedOptions = this.filteredGroupedOptions();

    if (groupedOptions.length > 0 && groupedOptions[0].options.length > 0) {
      this.setFocusedOption(groupedOptions[0].options[0]);
    }
  }

  /**
   * focuses the last option in the filtered grouped list
   */
  public groupFocusLast(): void {
    if (!this._assertInitialized('groupFocusLast')) {
      return;
    }

    const groupedOptions = this.filteredGroupedOptions();

    if (groupedOptions.length > 0) {
      const lastGroup = groupedOptions[groupedOptions.length - 1];

      if (lastGroup.options.length > 0) {
        this.setFocusedOption(lastGroup.options[lastGroup.options.length - 1]);
      }
    }
  }

  /**
   * updates the full configuration
   */
  public setConfig(config: Partial<ComboboxConfig>): void {
    this._state.update((state) => ({
      ...state,
      config: {
        ...state.config,
        ...config,
      },
    }));
  }

  /**
   * sets whether multiple selection is enabled
   */
  public setIsMultiSelect(isMultiSelect: boolean): void {
    const state = this._state();

    // if switching to single select and multiple values are selected, keep only the first
    if (!isMultiSelect && state.selectedValues.length > 1) {
      this.setSelectedValues([state.selectedValues[0]]);
    }

    this._state.update((currentState) => ({
      ...currentState,
      config: {
        ...currentState.config,
        isMultiSelect,
      },
    }));
  }

  /**
   * sets whether new options can be created
   */
  public setAllowNewOptions(allowNewOptions: boolean): void {
    this._state.update((state) => ({
      ...state,
      config: {
        ...state.config,
        allowNewOptions,
      },
    }));
  }

  /**
   * sets whether to filter out selected options
   */
  public setFilterSelectedOptions(filterSelectedOptions: boolean): void {
    this._state.update((state) => ({
      ...state,
      config: {
        ...state.config,
        filterSelectedOptions,
      },
    }));
  }

  /**
   * sets the option filter function
   */
  public setOptionFilter(filter: ((inputValue: string, option: ComboboxOption) => boolean) | null): void {
    this._state.update((state) => ({
      ...state,
      config: {
        ...state.config,
        optionFilter: filter,
      },
    }));
  }

  /**
   * sets the opened state of the combobox
   */
  public setIsOpened(isOpened: boolean): void {
    if (!this._assertInitialized('setIsOpened')) {
      return;
    }

    const previousValue = this._state().isOpened;
    const previousFocusedOption = this._state().focusedOption;

    this._state.update((state) => ({
      ...state,
      isOpened,
      focusedOption: isOpened ? state.focusedOption : null,
    }));

    if (isOpened !== previousValue) {
      this._isOpenedChangedSubject.next(isOpened);
    }

    // emit focused option change if it was reset when closing
    if (!isOpened && previousFocusedOption !== null) {
      this._focusedOptionChangedSubject.next(null);
    }
  }

  /**
   * opens the combobox
   */
  public open(): void {
    if (!this._assertInitialized('open')) {
      return;
    }

    this.setIsOpened(true);
  }

  /**
   * closes the combobox
   */
  public close(): void {
    if (!this._assertInitialized('close')) {
      return;
    }

    this.setIsOpened(false);
  }

  /**
   * toggles the opened state of the combobox
   */
  public toggle(): void {
    if (!this._assertInitialized('toggle')) {
      return;
    }

    this.setIsOpened(!this._state().isOpened);
  }

  /**
   * asserts the store has been initialized before an operation proceeds
   */
  private _assertInitialized(operation: string): boolean {
    if (!this._state().isInitialized) {
      logManager.error({
        type: 'combobox-store-not-initialized',
        message: `attempted to call '${operation}' before store was initialized`,
      });

      return false;
    }

    return true;
  }

  /**
   * normalizes option inputs and sorts them alphabetically by label
   */
  private _normalizeAndSortOptions(optionsInput: ComboboxOptionInput[]): ComboboxOption[] {
    const normalized = optionsInput.map((option) => ({
      label: option.label,
      value: option.value,
      disabled: option.disabled ?? false,
      groupLabel: option.groupLabel ?? 'Uncategorized',
    }));

    return normalized.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * groups options by their group label, sorted alphabetically
   */
  private _groupOptions(options: ComboboxOption[]): ComboboxGroupedOptions[] {
    const groupMap = new Map<string, ComboboxOption[]>();

    for (const option of options) {
      const group = groupMap.get(option.groupLabel) ?? [];
      group.push(option);
      groupMap.set(option.groupLabel, group);
    }

    const grouped = Array.from(groupMap.entries()).map(([groupLabel, groupOptions]) => ({
      groupLabel,
      options: groupOptions,
    }));

    return grouped.sort((a, b) => a.groupLabel.localeCompare(b.groupLabel));
  }
}
