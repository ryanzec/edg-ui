import { Directive, computed, effect, input, output, signal } from '@angular/core';

/** default value for the checked input */
export const CHECKBOX_TOGGLE_CHECKED_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_TOGGLE_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the checkbox-toggle component. owns the internal checked state, the form-controlled
 * flag, the form-disabled state set via the reactive-forms `setDisabledState` callback, and the click / keyboard
 * event handlers that toggle the checked value.
 */
@Directive({
  selector: '[orgCheckboxToggleBrain]',
  exportAs: 'orgCheckboxToggleBrain',
})
export class CheckboxToggleBrainDirective {
  private readonly _isFormControlled = signal<boolean>(false);
  private readonly _internalChecked = signal<boolean>(false);
  private readonly _formDisabled = signal<boolean>(false);

  /** the checked input value (used in non-form binding); synced into internal state when not form-controlled */
  public readonly checked = input<boolean>(CHECKBOX_TOGGLE_CHECKED_DEFAULT);

  /** whether the checkbox-toggle is disabled by its consumer */
  public readonly disabled = input<boolean>(CHECKBOX_TOGGLE_DISABLED_DEFAULT);

  /** emitted with the new checked value whenever a user interaction toggles the checkbox-toggle */
  public readonly changed = output<boolean>();

  /** emitted whenever a user interaction completes (the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

  /** the resolved current checked state */
  public readonly isChecked = computed<boolean>(() => this._internalChecked());

  /** the resolved current disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._formDisabled());

  constructor() {
    // syncs the checked input to internal state when not form-controlled so non-form usage (e.g. storybook args) reflects changes
    effect(() => {
      if (!this._isFormControlled()) {
        this._internalChecked.set(this.checked());
      }
    });
  }

  /** marks the checkbox-toggle as reactive-forms-controlled, switching internal state away from the input */
  public setFormControlled(): void {
    this._isFormControlled.set(true);
  }

  /** sets the internal checked value (used by writeValue from reactive forms) */
  public setInternalChecked(value: boolean): void {
    this._internalChecked.set(value ?? false);
  }

  /** sets the form-disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._formDisabled.set(disabled);
  }

  /** handles click interaction, toggling the internal checked value */
  public handleClick(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();

      return;
    }

    event.preventDefault();

    const newChecked = !this._internalChecked();

    this._internalChecked.set(newChecked);
    this.changed.emit(newChecked);
    this.touched.emit();
  }

  /** handles keyboard interaction, triggering a click toggle on space or enter */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.handleClick(event);
  }
}
