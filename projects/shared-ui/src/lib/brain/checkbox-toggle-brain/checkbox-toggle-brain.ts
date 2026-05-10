import { Directive, computed, input, model, output, signal } from '@angular/core';

/** default value for the checked model */
export const CHECKBOX_TOGGLE_CHECKED_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_TOGGLE_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the checkbox-toggle component. owns the click and keyboard interaction handlers,
 * the state-mutation logic that drives the checked model, and the accessibility surface (role="switch",
 * aria-checked, aria-disabled, aria-invalid, aria-describedby) plus focus management (tabindex) for the
 * presentation to bind. composes the consumer-supplied `disabled` input with a separate form-disabled signal
 * (set via `setFormDisabled` from a ControlValueAccessor host) so reactive forms can disable the toggle without
 * the consumer needing to forward that state. emits a `changed` event whenever an interaction toggles the
 * value, so the presentation can wire up the reactive-forms ControlValueAccessor.
 */
@Directive({
  selector: '[orgCheckboxToggleBrain]',
  exportAs: 'orgCheckboxToggleBrain',
  host: {
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class CheckboxToggleBrainDirective {
  private readonly _formDisabled = signal<boolean>(false);
  private readonly _hasValidationMessage = signal<boolean>(false);
  private readonly _validationMessageId = signal<string | null>(null);

  /** whether the checkbox-toggle is currently checked */
  public readonly checked = model<boolean>(CHECKBOX_TOGGLE_CHECKED_DEFAULT);

  /** whether the checkbox-toggle is disabled by the consumer */
  public readonly disabled = input<boolean>(CHECKBOX_TOGGLE_DISABLED_DEFAULT);

  /** emitted with the new checked value whenever a user interaction toggles the checkbox-toggle */
  public readonly changed = output<boolean>();

  /** emitted whenever a user interaction completes (i.e. the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

  /** static aria role for the role-bearing presentation element */
  public readonly role = 'switch' as const;

  /** the resolved disabled state — combines the consumer-provided `disabled` input with the form-disabled signal */
  public readonly isDisabled = computed<boolean>(() => this.disabled() || this._formDisabled());

  /** the resolved aria-checked value */
  public readonly ariaChecked = computed<boolean>(() => this.checked());

  /** the resolved aria-disabled value, returning 'true' when disabled and null otherwise */
  public readonly ariaDisabled = computed<'true' | null>(() => {
    if (this.isDisabled()) {
      return 'true';
    }

    return null;
  });

  /** the resolved tabindex value, returning -1 when disabled and 0 otherwise */
  public readonly tabIndex = computed<number>(() => {
    if (this.isDisabled()) {
      return -1;
    }

    return 0;
  });

  /** the resolved aria-invalid value derived from the validation context */
  public readonly ariaInvalid = computed<boolean | null>(() => {
    if (this._hasValidationMessage()) {
      return true;
    }

    return null;
  });

  /** the resolved aria-describedby value derived from the validation context */
  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (!this._hasValidationMessage()) {
      return null;
    }

    return this._validationMessageId();
  });

  /** sets the checked value (used by the presentation when reactive forms write a value) */
  public setChecked(value: boolean): void {
    this.checked.set(value ?? false);
  }

  /** sets the form-disabled signal (used by the presentation when reactive forms call setDisabledState) */
  public setFormDisabled(disabled: boolean): void {
    this._formDisabled.set(disabled);
  }

  /** sets the validation context driving aria-invalid / aria-describedby */
  public setValidationContext(hasMessage: boolean, messageId: string | null): void {
    this._hasValidationMessage.set(hasMessage);
    this._validationMessageId.set(messageId);
  }

  /** handles click interaction, toggling checked state */
  public handleClick(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();

      return;
    }

    event.preventDefault();

    const newChecked = !this.checked();

    this.checked.set(newChecked);
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
