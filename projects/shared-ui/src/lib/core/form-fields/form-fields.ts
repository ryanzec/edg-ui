import { Component, InjectionToken, input } from '@angular/core';

/** default value for the reserveValidationSpace input */
export const FORM_FIELDS_RESERVE_VALIDATION_SPACE_DEFAULT = true;

/** injection token for accessing the FormFields component */
export const FORM_FIELDS_COMPONENT = new InjectionToken<FormFields>('FormFields');

/** container component that groups form fields with consistent vertical spacing and shared settings */
@Component({
  selector: 'org-form-fields',
  imports: [],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.css',
  providers: [{ provide: FORM_FIELDS_COMPONENT, useExisting: FormFields }],
})
export class FormFields {
  /** whether child form fields should reserve space for validation messages by default */
  public reserveValidationSpace = input<boolean>(FORM_FIELDS_RESERVE_VALIDATION_SPACE_DEFAULT);
}
