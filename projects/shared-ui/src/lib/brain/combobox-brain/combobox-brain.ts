import { Directive, computed, inject, input, output, signal } from '@angular/core';
import { ComboboxStore, type ComboboxOption } from '../../core/combobox-store/combobox-store';

/** default value for the autoShowOption input */
export const COMBOBOX_AUTO_SHOW_OPTION_DEFAULT = true;

/** default value for the allowNewOptions input */
export const COMBOBOX_ALLOW_NEW_OPTIONS_DEFAULT = false;

/** default value for the isMultiSelect input */
export const COMBOBOX_IS_MULTI_SELECT_DEFAULT = false;

/** default value for the isGroupingEnabled input */
export const COMBOBOX_IS_GROUPING_ENABLED_DEFAULT = false;

/** default value for the disabled input */
export const COMBOBOX_DISABLED_DEFAULT = false;

/** the internal state shape for the combobox brain directive */
type ComboboxState = {
  isFocused: boolean;
  isFormControlled: boolean;
  isInitializing: boolean;
  isDisabledByForm: boolean;
};

/**
 * headless brain directive for the combobox component. owns the local interaction state, all event handlers
 * (input value / focus / click / blur, keyboard nav, option mouse handlers, inline-item-remove), and the
 * selection / new-option-suggestion derivation. injects the parent-provided `ComboboxStore` via the shared element
 * injector. presentation pushes input-focus / input-blur native callbacks into the brain via setter so the brain
 * stays decoupled from the `Input` component class.
 */
@Directive({
  selector: '[orgComboboxBrain]',
  exportAs: 'orgComboboxBrain',
})
export class ComboboxBrainDirective {
  private readonly _store = inject(ComboboxStore);

  private readonly _state = signal<ComboboxState>({
    isFocused: false,
    isFormControlled: false,
    isInitializing: true,
    isDisabledByForm: false,
  });

  private _focusInput: () => void = () => {
    // needed to be overridden by the consumer
  };

  private _blurInput: () => void = () => {
    // needed to be overridden by the consumer
  };

  /** auto-open / auto-show the dropdown when the input is focused / typed in */
  public readonly comboboxAutoShowOption = input<boolean>(COMBOBOX_AUTO_SHOW_OPTION_DEFAULT);

  /** allow a synthetic "new" option to be added when the input doesn't match any existing option */
  public readonly comboboxAllowNewOptions = input<boolean>(COMBOBOX_ALLOW_NEW_OPTIONS_DEFAULT);

  /** whether the combobox supports multi-selection */
  public readonly comboboxIsMultiSelect = input<boolean>(COMBOBOX_IS_MULTI_SELECT_DEFAULT);

  /** whether keyboard nav should respect option groups */
  public readonly comboboxIsGroupingEnabled = input<boolean>(COMBOBOX_IS_GROUPING_ENABLED_DEFAULT);

  /** whether the combobox is disabled by its consumer (combined with form-controlled disabled state) */
  public readonly comboboxDisabled = input<boolean>(COMBOBOX_DISABLED_DEFAULT);

  /** emitted when the input gains focus */
  public readonly comboboxFocused = output<void>();

  /** emitted when the input loses focus */
  public readonly comboboxBlurred = output<void>();

  /** emitted when the brain wants the presentation to update the overlay position (e.g. multi-select tag size change) */
  public readonly comboboxOverlayPositionUpdateRequested = output<void>();

  /** emitted with the new selected values when they change while the form is controlled and not initializing */
  public readonly comboboxSelectedValuesNotified = output<(string | number)[]>();

  /** whether the input currently has focus */
  public readonly isFocused = computed<boolean>(() => this._state().isFocused);

  /** the resolved disabled state */
  public readonly isDisabled = computed<boolean>(() => this.comboboxDisabled() || this._state().isDisabledByForm);

  /**
   * synthetic option to display when allowNewOptions is true and the input doesn't exactly match any existing option
   */
  public readonly newOptionSuggestion = computed<ComboboxOption | null>(() => {
    if (!this.comboboxAllowNewOptions()) {
      return null;
    }

    const inputValue = this._store.inputValue().trim();

    if (!inputValue) {
      return null;
    }

    const exactMatch = this._store.options().some((opt) => opt.label.toLowerCase() === inputValue.toLowerCase());

    if (exactMatch) {
      return null;
    }

    return {
      label: inputValue,
      value: inputValue,
      disabled: false,
      groupLabel: 'Uncategorized',
      isNew: true,
    };
  });

  /** registers the input-focus and input-blur native callbacks the brain calls on certain interactions */
  public setInputAccessors(focusInput: () => void, blurInput: () => void): void {
    this._focusInput = focusInput;
    this._blurInput = blurInput;
  }

  /** marks the combobox as form-controlled (called by registerOnChange in the presentation) */
  public setFormControlled(): void {
    this._state.update((state) => ({ ...state, isFormControlled: true }));
  }

  /** marks initialization as complete (called from ngAfterViewInit in the presentation) */
  public completeInitialization(): void {
    this._state.update((state) => ({ ...state, isInitializing: false }));
  }

  /** sets the form-controlled disabled state (called by setDisabledState in the presentation) */
  public setFormDisabled(disabled: boolean): void {
    this._state.update((state) => ({ ...state, isDisabledByForm: disabled }));
  }

  /** notifies the form-controlled callback of selected-value changes when initialized */
  public notifySelectedValuesIfFormControlled(values: (string | number)[]): void {
    const { isFormControlled, isInitializing } = this._state();

    if (!isFormControlled || isInitializing) {
      return;
    }

    this.comboboxSelectedValuesNotified.emit(values);
  }

  /** handles input value changes from the inner input */
  public handleInputValueChange(value: string): void {
    this._store.setInputValue(value);

    if (this.comboboxAutoShowOption() && value.length > 0 && !this._store.isOpened()) {
      this._store.open();
    }
  }

  /** handles input focus */
  public handleInputFocus(): void {
    this._state.update((state) => ({ ...state, isFocused: true }));
    this.comboboxFocused.emit();

    if (this.comboboxAutoShowOption()) {
      this._store.open();
    }
  }

  /** handles input click */
  public handleInputClick(): void {
    if (!this._state().isFocused) {
      this._focusInput();
    }

    if (!this._store.isOpened()) {
      this._store.open();
    }
  }

  /** handles input blur, also notifies form-controlled callback when no selection remains */
  public handleInputBlur(): void {
    this._state.update((state) => ({ ...state, isFocused: false }));
    this.comboboxBlurred.emit();

    this._store.close();

    const selectedOptions = this._store.selectedOptions();

    if (selectedOptions.length === 0) {
      this._store.clearInputValue();

      if (this._state().isFormControlled) {
        this.comboboxSelectedValuesNotified.emit([]);
      }

      return;
    }

    if (!this.comboboxIsMultiSelect()) {
      this._store.setInputValue(selectedOptions[0].label);

      return;
    }

    this._store.clearInputValue();
  }

  /** handles keyboard navigation */
  public handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    switch (key) {
      case 'Enter':
        event.preventDefault();
        this._enterKey();

        return;
      case 'ArrowDown':
        event.preventDefault();
        this._arrowDownKey();

        return;
      case 'ArrowUp':
        event.preventDefault();
        this._arrowUpKey();

        return;
      case 'Home':
        event.preventDefault();
        this._homeKey();

        return;
      case 'End':
        event.preventDefault();
        this._endKey();

        return;
      case 'Escape':
        event.preventDefault();
        this._escapeKey();

        return;
      case 'Tab':
        this._tabKey();

        return;
    }
  }

  /** prevents blur and selects the option on mousedown */
  public handleOptionMouseDown(event: MouseEvent, option: ComboboxOption): void {
    event.preventDefault();

    if (option.disabled) {
      return;
    }

    this._selectOption(option);
  }

  /** sets the focused option on hover */
  public handleOptionMouseEnter(_event: MouseEvent, option: ComboboxOption): void {
    this._store.setFocusedOption(option);
  }

  /** clears the focused option on hover-out */
  public handleOptionMouseLeave(_event: MouseEvent, _option: ComboboxOption): void {
    this._store.setFocusedOption(null);
  }

  /** removes a selected value via the inline tag's remove button (multi-select) */
  public handleInlineItemRemove(itemId: string): void {
    const currentSelected = this._store.selectedValues();
    const newSelected = currentSelected.filter((value) => String(value) !== itemId);
    this._store.setSelectedValues(newSelected);

    this._focusInput();
  }

  /** signals to the presentation that the overlay needs a position recalculation */
  public requestOverlayPositionUpdate(): void {
    this.comboboxOverlayPositionUpdateRequested.emit();
  }

  private _enterKey(): void {
    const focusedOption = this._store.focusedOption();

    if (focusedOption && !focusedOption.disabled) {
      this._selectOption(focusedOption);

      return;
    }

    const newOption = this.newOptionSuggestion();

    if (newOption) {
      this._selectOption(newOption);
    }
  }

  private _arrowDownKey(): void {
    if (!this._store.isOpened()) {
      this._store.open();
    }

    if (this.comboboxIsGroupingEnabled()) {
      if (!this._store.focusedOption()) {
        this._store.groupFocusFirst();

        return;
      }

      this._store.groupFocusNext();

      return;
    }

    if (!this._store.focusedOption()) {
      this._store.focusFirst();

      return;
    }

    this._store.focusNext();
  }

  private _arrowUpKey(): void {
    if (!this._store.isOpened()) {
      this._store.open();
    }

    if (this.comboboxIsGroupingEnabled()) {
      if (!this._store.focusedOption()) {
        this._store.groupFocusLast();

        return;
      }

      this._store.groupFocusPrevious();

      return;
    }

    if (!this._store.focusedOption()) {
      this._store.focusLast();

      return;
    }

    this._store.focusPrevious();
  }

  private _homeKey(): void {
    if (this.comboboxIsGroupingEnabled()) {
      this._store.groupFocusFirst();

      return;
    }

    this._store.focusFirst();
  }

  private _endKey(): void {
    if (this.comboboxIsGroupingEnabled()) {
      this._store.groupFocusLast();

      return;
    }

    this._store.focusLast();
  }

  private _escapeKey(): void {
    if (this._store.isOpened()) {
      this._store.close();

      return;
    }

    this._blurInput();
  }

  private _tabKey(): void {
    if (this._store.isOpened()) {
      this._store.close();
    }
  }

  private _selectOption(option: ComboboxOption): void {
    const currentSelected = this._store.selectedValues();

    if (this.comboboxIsMultiSelect()) {
      if (!currentSelected.includes(option.value)) {
        this._store.setSelectedValues([...currentSelected, option.value]);
      }

      this._store.clearInputValue();
      this._focusInput();

      return;
    }

    this._store.setSelectedValues([option.value]);
    this._store.close();
  }
}
