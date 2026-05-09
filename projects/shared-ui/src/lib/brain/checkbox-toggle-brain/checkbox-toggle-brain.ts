import { Directive, computed, inject, input, output } from '@angular/core';
import { FORM_FIELD_COMPONENT } from '../../core/form-fields/form-field';

/** default value for the checked input */
export const CHECKBOX_TOGGLE_CHECKED_DEFAULT = false;

/** default value for the disabled input */
export const CHECKBOX_TOGGLE_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the checkbox-toggle component. owns the click and keyboard interaction handlers,
 * focus management (tabindex), and all aria attributes (role, aria-checked, aria-disabled, aria-describedby,
 * aria-invalid). emits `changed` with the requested next value on user interaction so the presentation can wire
 * up reactive forms. attaches to the inner `label` element so its host bindings land on the interactive surface.
 */
@Directive({
  selector: 'label[orgCheckboxToggleBrain]',
  exportAs: 'orgCheckboxToggleBrain',
  host: {
    role: 'switch',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeyDown($event)',
  },
})
export class CheckboxToggleBrainDirective {
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true });

  /** whether the checkbox-toggle is currently checked */
  public readonly checked = input<boolean>(CHECKBOX_TOGGLE_CHECKED_DEFAULT);

  /** whether the checkbox-toggle is disabled by its consumer or by reactive forms */
  public readonly disabled = input<boolean>(CHECKBOX_TOGGLE_DISABLED_DEFAULT);

  /** emitted with the requested next checked value whenever a user interaction toggles the checkbox-toggle */
  public readonly changed = output<boolean>();

  /** emitted whenever a user interaction completes (the equivalent of blur for ControlValueAccessor onTouched) */
  public readonly touched = output<void>();

  /** whether the parent form field has an active validation message */
  public readonly hasValidationMessage = computed<boolean>(() => !!this._formField?.brain.hasValidationMessage());

  /** the aria-describedby id linking to the validation message when present */
  public readonly ariaDescribedBy = computed<string | null>(() => {
    if (!this.hasValidationMessage()) {
      return null;
    }

    return this._formField?.brain.validationMessageId ?? null;
  });

  /** the aria-invalid value when a validation message is present */
  public readonly ariaInvalid = computed<boolean | null>(() => {
    if (!this.hasValidationMessage()) {
      return null;
    }

    return true;
  });

  /** handles click interaction, emitting the requested next checked value */
  protected handleClick(event: Event): void {
    event.preventDefault();

    if (this.disabled()) {
      return;
    }

    this.changed.emit(!this.checked());
    this.touched.emit();
  }

  /** handles keyboard interaction, triggering a click toggle on space or enter */
  protected handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    this.handleClick(event);
  }
}
