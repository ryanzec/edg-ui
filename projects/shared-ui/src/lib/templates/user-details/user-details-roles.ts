import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { RadioGroup } from '../../core/radio/radio-group';
import { UserDetailsRoleCard } from './user-details-role-card';
import type { UserDetailsRoleOption } from './user-details-types';

@Component({
  selector: 'org-user-details-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, CardHeader, RadioGroup, ReactiveFormsModule, UserDetailsRoleCard],
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
