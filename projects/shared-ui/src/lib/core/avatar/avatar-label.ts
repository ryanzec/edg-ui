import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';
import { Avatar } from './avatar';

/** default value for the subLabel input. */
export const AVATAR_LABEL_SUB_LABEL_DEFAULT: string | undefined = undefined;

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
  /** reference to the parent avatar component for shared size context. */
  protected readonly avatarComponent = inject<Avatar>(forwardRef(() => Avatar));

  /** reference to the parent avatar's brain directive for the display label. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** optional secondary text displayed below the main label. */
  public subLabel = input<string | undefined, string | null | undefined>(AVATAR_LABEL_SUB_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
