import { Component, computed, inject, InjectionToken, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { FormFieldBrainDirective } from '../../brain/form-field-brain/form-field-brain';
import { FORM_FIELDS_COMPONENT } from './form-fields';

/** default value for the reserveValidationSpace input */
export const FORM_FIELD_RESERVE_VALIDATION_SPACE_DEFAULT: boolean | undefined = undefined;

/** injection token for accessing the FormField component */
export const FORM_FIELD_COMPONENT = new InjectionToken<FormField>('FormField');

@Component({
  selector: 'org-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-fields.css',
  hostDirectives: [
    {
      directive: FormFieldBrainDirective,
      inputs: ['validationMessage'],
    },
  ],
  providers: [{ provide: FORM_FIELD_COMPONENT, useExisting: FormField }],
})
export class FormField {
  /** reference to the optional parent form-fields component for inheriting settings */
  private readonly _formFields = inject(FORM_FIELDS_COMPONENT, { optional: true });

  /** brain directive providing the validation state and live-region a11y wiring */
  public readonly brain = inject(FormFieldBrainDirective, { self: true });

  /** whether to reserve space for the validation message area even when no message is present */
  public reserveValidationSpace = input<boolean | undefined, boolean | null | undefined>(
    FORM_FIELD_RESERVE_VALIDATION_SPACE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether to render the validation message area, falling back to the parent form-fields setting */
  protected readonly effectiveReserveValidationSpace = computed<boolean>(() => {
    return this.reserveValidationSpace() ?? !!this._formFields?.reserveValidationSpace();
  });
}
