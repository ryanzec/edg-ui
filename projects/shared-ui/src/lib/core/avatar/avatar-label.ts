import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';

/** default value for the subLabel input. */
export const AVATAR_LABEL_SUB_LABEL_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-avatar-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-label.html',
  styleUrl: './avatar-label.css',
})
export class AvatarLabel {
  /** reference to the parent avatar's brain directive for the display label. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** optional secondary text displayed below the main label. */
  public subLabel = input<string | undefined, string | null | undefined>(AVATAR_LABEL_SUB_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
