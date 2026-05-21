import { Component, InjectionToken, input } from '@angular/core';
import type { FormFieldLabelOrientation } from './form-field';

/** default value for the reserveValidationSpace input */
export const FORM_FIELDS_RESERVE_VALIDATION_SPACE_DEFAULT = true;

/** default value for the labelOrientation input */
export const FORM_FIELDS_LABEL_ORIENTATION_DEFAULT: FormFieldLabelOrientation = 'vertical';

/** default value for the labelOrientation input */
export const FORM_FIELDS_ORIENTATION_DEFAULT: FormFieldLabelOrientation = 'vertical';

/** injection token for accessing the FormFields component */
export const FORM_FIELDS_COMPONENT = new InjectionToken<FormFields>('FormFields');

/** container component that groups form fields with consistent vertical spacing and shared settings */
@Component({
  selector: 'org-form-fields',
  imports: [],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.css',
  providers: [{ provide: FORM_FIELDS_COMPONENT, useExisting: FormFields }],
  host: {
    '[attr.data-orientation]': 'orientation()',
  },
})
export class FormFields {
  /** whether child form fields should reserve space for validation messages by default */
  public reserveValidationSpace = input<boolean>(FORM_FIELDS_RESERVE_VALIDATION_SPACE_DEFAULT);

  /** default layout direction applied to child form field label / input pair that don't set their own labelOrientation */
  public labelOrientation = input<FormFieldLabelOrientation>(FORM_FIELDS_LABEL_ORIENTATION_DEFAULT);

  /** the orientation for the form fields */
  public orientation = input<FormFieldLabelOrientation>(FORM_FIELDS_ORIENTATION_DEFAULT);
}
