import { Directive, input, model, output } from '@angular/core';

/** default value for the checkboxChecked model */
export const CHECKBOX_CHECKED_DEFAULT = false;

/** default value for the checkboxIndeterminate model */
export const CHECKBOX_INDETERMINATE_DEFAULT = false;

/** default value for the checkboxDisabled input */
export const CHECKBOX_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the checkbox component. owns the click and keyboard interaction handlers and the
 * state-mutation logic that drives the checked / indeterminate models. emits a `changed` event whenever an
 * interaction toggles the value, so the presentation can wire up the reactive-forms ControlValueAccessor.
 */
@Directive({
  selector: '[orgCheckboxBrain]',
  exportAs: 'orgCheckboxBrain',
})
export class CheckboxBrainDirective {
  /** whether the checkbox is currently checked */
  public readonly checkboxChecked = model<boolean>(CHECKBOX_CHECKED_DEFAULT);

  /** whether the checkbox is in an indeterminate state */
  public readonly checkboxIndeterminate = model<boolean>(CHECKBOX_INDETERMINATE_DEFAULT);

  /** whether the checkbox is disabled */
  public readonly checkboxDisabled = input<boolean>(CHECKBOX_DISABLED_DEFAULT);

  /** emitted with the new checked value whenever a user interaction toggles the checkbox */
  public readonly checkboxChanged = output<boolean>();

  /** emitted whenever a user interaction completes (i.e. the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly checkboxTouched = output<void>();

  /** handles click interaction, toggling checked / indeterminate state */
  public handleClick(event: Event): void {
    if (this.checkboxDisabled()) {
      event.preventDefault();

      return;
    }

    event.preventDefault();

    const newChecked = this.checkboxIndeterminate() ? true : !this.checkboxChecked();

    this.checkboxChecked.set(newChecked);
    this.checkboxIndeterminate.set(false);
    this.checkboxChanged.emit(newChecked);
    this.checkboxTouched.emit();
  }

  /** handles keyboard interaction, triggering a click toggle on space or enter */
  public handleKeyDown(event: KeyboardEvent): void {
    if (this.checkboxDisabled()) {
      return;
    }

    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.handleClick(event);
  }
}
