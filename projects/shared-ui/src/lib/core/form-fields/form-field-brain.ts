import { Directive, computed, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { v4 as uuidv4 } from 'uuid';

/** default value for the validationMessage input */
export const FORM_FIELD_VALIDATION_MESSAGE_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the form-field component. owns the validation message state, derives whether a
 * validation message is currently active, and exposes the static a11y attributes (aria-live, aria-atomic) plus a
 * stable id consumers use to wire up aria-describedby on their interactive surface. carries no styling, template,
 * or styling-related host bindings — the presentation reads these to drive the inner validation live-region.
 */
@Directive({
  selector: '[orgFormFieldBrain]',
  exportAs: 'orgFormFieldBrain',
})
export class FormFieldBrainDirective {
  /** stable unique id for the validation live-region; consumers reference this from aria-describedby */
  public readonly validationMessageId = `form-field-validation-${uuidv4()}`;

  /** the validation message to render in the field's live region */
  public readonly validationMessage = input<string | undefined, string | null | undefined>(
    FORM_FIELD_VALIDATION_MESSAGE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether the field currently has a non-empty validation message */
  public readonly hasValidationMessage = computed<boolean>(() => !!this.validationMessage()?.trim());

  /** static aria-live value for the validation live-region element */
  public readonly ariaLive = 'polite' as const;

  /** static aria-atomic value for the validation live-region element */
  public readonly ariaAtomic = 'true' as const;
}
