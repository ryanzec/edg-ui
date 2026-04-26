import { Directive, effect, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

/** default value for the orgFormDisabled input */
export const FORM_DISABLED_DIRECTIVE_ORG_FORM_DISABLED_DEFAULT = false;

/**
 * drives the disabled state of a reactive form control from the template. reactive forms treat the form control as
 * the source of truth for disabled state (and warn when `[disabled]` is bound alongside a form control), so this
 * directive calls `disable()` / `enable()` on the underlying control while also exposing `aria-disabled` on the host
 * for styling and accessibility hooks.
 */
@Directive({
  selector: '[orgFormDisabled]',
  host: {
    '[attr.aria-disabled]': 'orgFormDisabled() ? "true" : null',
  },
})
export class FormDisabledDirective {
  private readonly _ngControl = inject(NgControl);

  /** whether the associated reactive form control should be disabled */
  public orgFormDisabled = input<boolean>(FORM_DISABLED_DIRECTIVE_ORG_FORM_DISABLED_DEFAULT);

  constructor() {
    effect(() => {
      const isDisabled = this.orgFormDisabled();
      const control = this._ngControl.control;

      if (!control) {
        return;
      }

      if (isDisabled && !control.disabled) {
        control.disable({ emitEvent: false });

        return;
      }

      if (!isDisabled && control.disabled) {
        control.enable({ emitEvent: false });
      }
    });
  }
}
