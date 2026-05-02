import { Directive, input, model, output } from '@angular/core';

/** default value for the checked model */
export const CHECKBOX_CHECKED_DEFAULT = false;

/** default value for the indeterminate model */
export const CHECKBOX_INDETERMINATE_DEFAULT = false;

/** default value for the disabled input */
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
  public readonly checked = model<boolean>(CHECKBOX_CHECKED_DEFAULT);

  /** whether the checkbox is in an indeterminate state */
  public readonly indeterminate = model<boolean>(CHECKBOX_INDETERMINATE_DEFAULT);

  /** whether the checkbox is disabled */
  public readonly disabled = input<boolean>(CHECKBOX_DISABLED_DEFAULT);

  /** emitted with the new checked value whenever a user interaction toggles the checkbox */
  public readonly changed = output<boolean>();

  /** emitted whenever a user interaction completes (i.e. the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

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
