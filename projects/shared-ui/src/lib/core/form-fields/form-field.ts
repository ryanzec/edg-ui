import { Component, computed, inject, InjectionToken, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { FormFieldBrainDirective } from '../../brain/form-field-brain/form-field-brain';
import { FORM_FIELDS_COMPONENT, FORM_FIELDS_LABEL_ORIENTATION_DEFAULT } from './form-fields';

/** all available form-field label orientation values */
export const allFormFieldLabelOrientations = ['vertical', 'horizontal'] as const;

/** the layout direction of a form field's projected content (label + control) */
export type FormFieldLabelOrientation = (typeof allFormFieldLabelOrientations)[number];

/** default value for the reserveValidationSpace input */
export const FORM_FIELD_RESERVE_VALIDATION_SPACE_DEFAULT: boolean | undefined = undefined;

/** default value for the labelOrientation input */
export const FORM_FIELD_LABEL_ORIENTATION_DEFAULT: FormFieldLabelOrientation | undefined = undefined;

/** injection token for accessing the FormField component */
export const FORM_FIELD_COMPONENT = new InjectionToken<FormField>('FormField');

@Component({
  selector: 'org-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  host: {
    '[attr.data-label-orientation]': 'effectiveLabelOrientation()',
  },
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

  /** the layout direction of the projected content (label + control); falls back to the parent form-fields setting */
  public labelOrientation = input<FormFieldLabelOrientation | undefined, FormFieldLabelOrientation | null | undefined>(
    FORM_FIELD_LABEL_ORIENTATION_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** whether to render the validation message area, falling back to the parent form-fields setting */
  protected readonly effectiveReserveValidationSpace = computed<boolean>(() => {
    return this.reserveValidationSpace() ?? !!this._formFields?.reserveValidationSpace();
  });

  /** resolved label orientation honoring the parent form-fields setting when one is not explicitly provided */
  protected readonly effectiveLabelOrientation = computed<FormFieldLabelOrientation>(() => {
    return this.labelOrientation() ?? this._formFields?.labelOrientation() ?? FORM_FIELDS_LABEL_ORIENTATION_DEFAULT;
  });
}
