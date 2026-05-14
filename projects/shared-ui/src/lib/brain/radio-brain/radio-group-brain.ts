import { Directive, computed, input, output, signal } from '@angular/core';

/**
 * shape required of any radio that wants to register with the radio group brain. kept free of any
 * `org` / `brain` naming so it stays a generic contract. registrants drive their own selected-state by
 * reading the group brain's `currentValue()` reactively, so the group never has to call back into them.
 */
export type RegisterableRadio = {
  /** the value the radio represents */
  value(): string;
};

/** default value for the value input */
export const RADIO_GROUP_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const RADIO_GROUP_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the radio-group component. owns the selected value state, the form-controlled
 * flag, the validation context that cascades to children, and a registry of child radio brains for bookkeeping.
 *
 * arrow-key navigation is intentionally NOT handled here — the presentation renders real `<input type="radio">`
 * elements that share a `name`, and the browser handles arrow-key routing within that name natively.
 *
 * child radios drive their own selected-state by reactively reading `currentValue()`, so this brain never has
 * to call back into them — that avoids reading required inputs (like a child's `value`) at registration time,
 * which would throw NG0950.
 */
@Directive({
  selector: '[orgRadioGroupBrain]',
  exportAs: 'orgRadioGroupBrain',
  host: {
    '[attr.role]': '"radiogroup"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class RadioGroupBrainDirective {
  /** whether the group is currently controlled by reactive forms */
  private readonly _isFormControlled = signal<boolean>(false);

  /** internal signal holding the currently selected value */
  private readonly _internalValue = signal<string>(RADIO_GROUP_VALUE_DEFAULT);

  /** registered child radios; bookkeeping only — children drive their own selected state reactively */
  private readonly _registered = new Set<RegisterableRadio>();

  /** validation message presence (driven by the presentation from a parent form-field) */
  private readonly _hasValidationMessage = signal<boolean>(false);

  /** validation message dom id (driven by the presentation from a parent form-field) */
  private readonly _validationMessageId = signal<string | null>(null);

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

  /** whether the group currently has a validation message (used by child radios for aria-invalid cascade) */
  public readonly hasValidationMessage = computed<boolean>(() => this._hasValidationMessage());

  /** the validation message dom id (used by child radios for aria-describedby cascade) */
  public readonly validationMessageId = computed<string | null>(() => this._validationMessageId());

  /** registers a child radio for bookkeeping; the child syncs its own selected state via an effect */
  public registerRadio(radio: RegisterableRadio): void {
    this._registered.add(radio);
  }

  /** unregisters a previously-registered child radio */
  public unregisterRadio(radio: RegisterableRadio): void {
    this._registered.delete(radio);
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

  /** sets the validation context that cascades to all registered child radios */
  public setValidationContext(hasMessage: boolean, messageId: string | null): void {
    this._hasValidationMessage.set(hasMessage);
    this._validationMessageId.set(messageId);
  }
}
