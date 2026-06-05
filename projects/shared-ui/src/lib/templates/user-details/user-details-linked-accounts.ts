import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';
import type { UserDetailsLinkedAccountsSection } from './user-details-types';

/** validation messages for the linked-accounts form group */
export type UserDetailsLinkedAccountsErrors = {
  website?: string;
  github?: string;
  linkedIn?: string;
};

/** default value for the errors input */
export const USER_DETAILS_LINKED_ACCOUNTS_ERRORS_DEFAULT: UserDetailsLinkedAccountsErrors = {};

@Component({
  selector: 'org-user-details-linked-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent, BoxHeader, FormField, FormFields, Input, Label, ReactiveFormsModule],
  templateUrl: './user-details-linked-accounts.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsLinkedAccounts {
  /** the FormGroup slice for the linked-accounts fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the linked-accounts data record (currently unused at template level — kept for parity) */
  public readonly linkedAccounts = input.required<UserDetailsLinkedAccountsSection>();

  /** validation messages keyed by control name */
  public readonly errors = input<UserDetailsLinkedAccountsErrors>(USER_DETAILS_LINKED_ACCOUNTS_ERRORS_DEFAULT);
}
