import { ChangeDetectionStrategy, Component, computed, forwardRef, inject } from '@angular/core';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';
import { Avatar } from './avatar';
import { AvatarStack } from './avatar-stack';

/** total number of distinct background colors cycled through based on the first label character. */
const AVATAR_COLOR_COUNT = 8;

@Component({
  selector: 'org-avatar-shape',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-shape.html',
  styleUrl: './avatar-shape.css',
  host: {
    '[attr.data-size]': 'avatarComponent.size()',
    '[attr.data-shape]': 'avatarComponent.shape()',
    '[attr.data-stacked]': 'isStacked() ? "true" : null',
    '[attr.data-color-index]': 'colorIndex()',
  },
})
export class AvatarShape {
  /** reference to the parent avatar component for shared shape/size context. */
  protected readonly avatarComponent = inject<Avatar>(forwardRef(() => Avatar));

  /** reference to the parent avatar's brain directive for label-derived initials. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** @internal optional ancestor avatar stack, used to auto-enable the stacked ring when present. */
  private readonly _avatarStackComponent = inject(AvatarStack, { optional: true });

  /** resolved stacked state — true when rendered inside an avatar stack ancestor. */
  protected readonly isStacked = computed<boolean>(() => !!this._avatarStackComponent);

  /** background color index (0-7) derived from the first character of the parent label; falls back to 0 when empty. */
  protected readonly colorIndex = computed<number>(() => {
    const label = this.avatarBrainDirective.label().trim();

    if (!label) {
      return 0;
    }

    return (label.toLowerCase().codePointAt(0) ?? 0) % AVATAR_COLOR_COUNT;
  });
}
