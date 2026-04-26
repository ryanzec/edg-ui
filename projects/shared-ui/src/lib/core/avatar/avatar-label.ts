import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Avatar } from './avatar';

/** default value for the subLabel input. */
export const AVATAR_LABEL_SUB_LABEL_DEFAULT: string | null = null;

@Component({
  selector: 'org-avatar-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-label.html',
  styleUrl: './avatar-label.css',
  host: {
    '[attr.data-size]': 'avatarComponent.size()',
  },
})
export class AvatarLabel {
  /** reference to the parent avatar component for shared label/size context. */
  protected readonly avatarComponent = inject(Avatar, { host: true });

  /** optional secondary text displayed below the main label. */
  public subLabel = input<string | null>(AVATAR_LABEL_SUB_LABEL_DEFAULT);
}
