import { Directive, computed, input, output, signal } from '@angular/core';

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the radio-group component. owns the selected value state, the form-controlled flag,
 * and the public selection / focus-navigation api consumed by child radio components. takes a `getOrderedValues`
 * lookup as a setter (the presentation pushes its contentChildren-derived ordered list of values), so the brain can
 * compute next / previous selection without depending on any specific child component type.
 */
@Directive({
  selector: '[orgRadioGroupBrain]',
  exportAs: 'orgRadioGroupBrain',
})
export class RadioGroupBrainDirective {
  /** whether the group is currently controlled by reactive forms */
  private readonly _isFormControlled = signal<boolean>(false);

  /** internal signal holding the currently selected value */
  private readonly _internalValue = signal<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** lookup the presentation pushes in to provide the ordered list of selectable values */
  private _getOrderedValues: () => string[] = () => [];

  /** the externally bound value input (used in non-form binding) */
  public readonly value = input<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** whether all radios in the group are disabled */
  public readonly disabled = input<boolean>(RADIO_GROUP_DISABLED_DEFAULT);

  /** emits the newly selected value when a radio is selected via this brain */
  public readonly valueChange = output<string>();

  /** the resolved current value — uses internal state when form-controlled, otherwise the value input */
  public readonly currentValue = computed<string>(() => {
    if (this._isFormControlled()) {
      return this._internalValue();
    }

    return this.value();
  });

  /** registers the lookup the brain uses to resolve the ordered list of values for next/previous navigation */
  public setOrderedValuesProvider(provider: () => string[]): void {
    this._getOrderedValues = provider;
  }

  /** marks the group as reactive-forms-controlled and switches `currentValue` to the internal source */
  public setFormControlled(): void {
    this._isFormControlled.set(true);
  }

  /** sets the internal value (used by writeValue from reactive forms) */
  public setInternalValue(value: string): void {
    this._internalValue.set(value ?? RADIO_GROUP_VALUE_DEFAULT);
  }

  /** selects the given value and emits the change; gated by disabled */
  public selectValue(value: string): void {
    if (this.disabled()) {
      return;
    }

    this._internalValue.set(value);
    this.valueChange.emit(value);
  }

  /** selects the value after the given current value, wrapping around */
  public selectNext(currentValue: string): void {
    if (this.disabled()) {
      return;
    }

    const values = this._getOrderedValues();

    if (values.length === 0) {
      return;
    }

    const currentIndex = values.indexOf(currentValue);
    const nextIndex = (currentIndex + 1) % values.length;
    this.selectValue(values[nextIndex]);
  }

  /** selects the value before the given current value, wrapping around */
  public selectPrevious(currentValue: string): void {
    if (this.disabled()) {
      return;
    }

    const values = this._getOrderedValues();

    if (values.length === 0) {
      return;
    }

    const currentIndex = values.indexOf(currentValue);
    const previousIndex = (currentIndex - 1 + values.length) % values.length;
    this.selectValue(values[previousIndex]);
  }
}
