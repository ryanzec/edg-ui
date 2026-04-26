import { Component, computed, inject, InjectionToken, input } from '@angular/core';
import { FORM_FIELDS_COMPONENT } from '../form-fields/form-fields';

/** default value for the validationMessage input */
export const FORM_FIELD_VALIDATION_MESSAGE_DEFAULT: string | null = null;

/** default value for the reserveValidationSpace input */
export const FORM_FIELD_RESERVE_VALIDATION_SPACE_DEFAULT: boolean | null = null;

/** injection token for accessing the FormField component */
export const FORM_FIELD_COMPONENT = new InjectionToken<FormField>('FormField');

@Component({
  selector: 'org-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  providers: [{ provide: FORM_FIELD_COMPONENT, useExisting: FormField }],
})
export class FormField {
  /** reference to the optional parent form-fields component for inheriting settings */
  private readonly _formFields = inject(FORM_FIELDS_COMPONENT, { optional: true, host: true });

  /** the validation message to display below the field */
  public validationMessage = input<string | null>(FORM_FIELD_VALIDATION_MESSAGE_DEFAULT);

  /** whether to reserve space for the validation message area even when no message is present */
  public reserveValidationSpace = input<boolean | null>(FORM_FIELD_RESERVE_VALIDATION_SPACE_DEFAULT);

  /** whether the field currently has a non-empty validation message */
  public readonly hasValidationMessage = computed<boolean>(() => !!this.validationMessage()?.trim());

  /** whether to render the validation message area, falling back to the parent form-fields setting */
  protected readonly finalReserveValidationSpace = computed<boolean>(() => {
    return this.reserveValidationSpace() ?? !!this._formFields?.reserveValidationSpace();
  });
}
