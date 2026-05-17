import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';
import type { UserDetailsWorkSection } from './user-details-types';

/** validation messages keyed by control name within the work form group */
export type UserDetailsWorkErrors = {
  title?: string;
  department?: string;
  manager?: string;
};

/** default value for the errors input */
export const USER_DETAILS_WORK_ERRORS_DEFAULT: UserDetailsWorkErrors = {};

@Component({
  selector: 'org-user-details-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, FormField, FormFields, Input, Label, ReactiveFormsModule],
  templateUrl: './user-details-work.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsWork {
  /** the FormGroup slice for the work fields */
  public readonly formGroup = input.required<FormGroup>();

  /** the work data record (used for read-only fields like employeeId and startedAt) */
  public readonly work = input.required<UserDetailsWorkSection>();

  /** validation messages keyed by control name */
  public readonly errors = input<UserDetailsWorkErrors>(USER_DETAILS_WORK_ERRORS_DEFAULT);

  /** formatted start date (e.g. "Mar 4, 2022") */
  protected readonly startedAtFormatted = computed<string>(() => this.work().startedAt.toFormat('MMM d, yyyy'));
}
