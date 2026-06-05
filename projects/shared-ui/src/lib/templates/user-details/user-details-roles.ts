import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { RadioGroup } from '../../core/radio/radio-group';
import { UserDetailsRoleCard } from './user-details-role-card';
import type { UserDetailsRoleOption } from './user-details-types';

@Component({
  selector: 'org-user-details-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, BoxContent, BoxHeader, RadioGroup, ReactiveFormsModule, UserDetailsRoleCard],
  templateUrl: './user-details-roles.html',
  host: {
    class: 'block',
  },
})
export class UserDetailsRoles {
  /** the FormGroup containing the primaryRole control */
  public readonly formGroup = input.required<FormGroup>();

  /** the available role options */
  public readonly roleOptions = input.required<UserDetailsRoleOption[]>();
}
