import { Directive, computed, input, model, output, signal } from '@angular/core';

/** default value for the checked model */
export const CHECKBOX_CHECKED_DEFAULT = false;

/** default value for the indeterminate model */
export const CHECKBOX_INDETERMINATE_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the checkbox component. owns the click and keyboard interaction handlers, the
 * state-mutation logic that drives the checked / indeterminate models, and the accessibility surface (role,
 * aria-checked, aria-disabled, aria-invalid, aria-describedby) plus focus management (tabindex) for the
 * presentation to bind. emits a `changed` event whenever an interaction toggles the value, so the
 * presentation can wire up the reactive-forms ControlValueAccessor.
 */
@Directive({
  selector: '[orgCheckboxBrain]',
  exportAs: 'orgCheckboxBrain',
  host: {
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class CheckboxBrainDirective {
  private readonly _hasValidationMessage = signal<boolean>(false);
  private readonly _validationMessageId = signal<string | null>(null);

  /** whether the checkbox is currently checked */
  public readonly checked = model<boolean>(CHECKBOX_CHECKED_DEFAULT);

  /** whether the checkbox is in an indeterminate state */
  public readonly indeterminate = model<boolean>(CHECKBOX_INDETERMINATE_DEFAULT);

  /** whether the checkbox is disabled */
  public readonly disabled = input<boolean>(CHECKBOX_DISABLED_DEFAULT);

  /** emitted with the new checked value whenever a user interaction toggles the checkbox */
  public readonly changed = output<boolean>();

  /** emitted whenever a user interaction completes (i.e. the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

  /** static aria role for the role-bearing presentation element */
  public readonly role = 'checkbox' as const;

  /** the resolved aria-checked value, returning 'mixed' when in indeterminate state */
  public readonly ariaChecked = computed<'mixed' | boolean>(() => {
    if (this.indeterminate()) {
      return 'mixed';
    }

    return this.checked();
  });

  /** the resolved aria-disabled value, returning 'true' when disabled and null otherwise */
  public readonly ariaDisabled = computed<'true' | null>(() => {
    if (this.disabled()) {
      return 'true';
    }

    return null;
  });

  /** the resolved tabindex value, returning -1 when disabled and 0 otherwise */
  public readonly tabIndex = computed<number>(() => {
    if (this.disabled()) {
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

  /** sets the indeterminate value (used by the presentation when reactive forms write a value) */
  public setIndeterminate(value: boolean): void {
    this.indeterminate.set(value ?? false);
  }

  /** sets the validation context driving aria-invalid / aria-describedby */
  public setValidationContext(hasMessage: boolean, messageId: string | null): void {
    this._hasValidationMessage.set(hasMessage);
    this._validationMessageId.set(messageId);
  }

  /** handles click interaction, toggling checked / indeterminate state */
  public handleClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();

      return;
    }

    event.preventDefault();

    const newChecked = this.indeterminate() ? true : !this.checked();

    this.checked.set(newChecked);
    this.indeterminate.set(false);
    this.changed.emit(newChecked);
    this.touched.emit();
  }

  /** handles keyboard interaction, triggering a click toggle on space or enter */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.handleClick(event);
  }
}
