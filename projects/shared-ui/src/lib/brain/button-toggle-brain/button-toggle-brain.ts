import { Directive, computed, input, output, signal } from '@angular/core';

/** default value for the value input */
export const BUTTON_TOGGLE_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const BUTTON_TOGGLE_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the button-toggle component. owns the selected value state, the form-controlled flag,
 * the form-disabled state set via the reactive-forms `setDisabledState` callback, and the public selection api
 * consumed by the presentation layer. carries no styling or template.
 */
@Directive({
  selector: '[orgButtonToggleBrain]',
  exportAs: 'orgButtonToggleBrain',
})
export class ButtonToggleBrainDirective {
  private readonly _isFormControlled = signal<boolean>(false);
  private readonly _internalValue = signal<string>(BUTTON_TOGGLE_VALUE_DEFAULT);
  private readonly _formDisabled = signal<boolean>(false);

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(BUTTON_TOGGLE_VALUE_DEFAULT);

  /** whether the entire toggle is disabled by its consumer */
  public readonly disabled = input<boolean>(BUTTON_TOGGLE_DISABLED_DEFAULT);

  /** emits the newly selected value when an item is selected via this brain */
  public readonly changed = output<string>();

  /** the resolved current value — uses internal state when form-controlled, otherwise the value input */
  public readonly currentValue = computed<string>(() => {
    if (this._isFormControlled()) {
      return this._internalValue();
    }

    return this.value();
  });

  /** the resolved current disabled state (consumer-disabled OR form-disabled) */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._formDisabled());

  /** marks the toggle as reactive-forms-controlled and switches `currentValue` to the internal source */
  public setFormControlled(): void {
    this._isFormControlled.set(true);
  }

  /** sets the internal value (used by writeValue from reactive forms) */
  public setInternalValue(value: string): void {
    this._internalValue.set(value ?? BUTTON_TOGGLE_VALUE_DEFAULT);
  }

  /** sets the form-disabled state (called by setDisabledState from reactive forms) */
  public setFormDisabled(disabled: boolean): void {
    this._formDisabled.set(disabled);
  }

  /** selects the given value and emits the change; gated by disabled and short-circuits when already selected */
  public selectValue(value: string): void {
    if (this.isDisabled()) {
      return;
    }

    if (value === this.currentValue()) {
      return;
    }

    this._internalValue.set(value);
    this.changed.emit(value);
  }
}
