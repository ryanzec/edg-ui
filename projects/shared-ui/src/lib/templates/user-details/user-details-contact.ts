import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';
import type { UserDetailsContactSection } from './user-details-types';

/** validation messages keyed by control name within the contact form group */
export type UserDetailsContactErrors = {
  workEmail?: string;
  personalEmail?: string;
  phone?: string;
  location?: string;
};

/** default value for the errors input */
export const USER_DETAILS_CONTACT_ERRORS_DEFAULT: UserDetailsContactErrors = {};

@Component({
  selector: 'org-user-details-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent, BoxHeader, FormField, FormFields, Input, Label, ReactiveFormsModule],
  templateUrl: './user-details-contact.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsContact {
  /** the FormGroup slice for the contact fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the contact data record (used for read-only display state like verified checkmark) */
  public readonly contact = input.required<UserDetailsContactSection>();

  /** validation messages keyed by control name */
  public readonly errors = input<UserDetailsContactErrors>(USER_DETAILS_CONTACT_ERRORS_DEFAULT);
}
