import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Radio } from '../../core/radio/radio';
import { Tag } from '../../core/tags/tag';
import type { UserDetailsRoleOption } from './user-details-types';

@Component({
  selector: 'org-user-details-role-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio, Tag],
  templateUrl: './user-details-role-card.html',
  styleUrl: './user-details-role-card.css',
  host: {
    class: 'block',
  },
})
export class UserDetailsRoleCard {
  /** the role option this card represents */
  public readonly option = input.required<UserDetailsRoleOption>();
}
