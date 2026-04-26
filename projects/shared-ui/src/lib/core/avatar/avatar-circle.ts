import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Avatar } from './avatar';

/** default value for the stacked input. */
export const AVATAR_CIRCLE_STACKED_DEFAULT = false;

@Component({
  selector: 'org-avatar-circle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-circle.html',
  styleUrl: './avatar-circle.css',
  host: {
    '[attr.data-size]': 'avatarComponent.size()',
    '[attr.data-stacked]': 'stacked() ? "true" : null',
  },
})
export class AvatarCircle {
  /** reference to the parent avatar component for shared label/size context. */
  protected readonly avatarComponent = inject(Avatar, { host: true });

  /** when true, draws a thick ring using the page background color for overlapping stacks. */
  public stacked = input<boolean>(AVATAR_CIRCLE_STACKED_DEFAULT);

  /** one or two uppercase initials derived from the parent avatar label. */
  protected readonly initials = computed<string>(() => {
    const label = this.avatarComponent.label();

    if (!label) {
      return '';
    }

    const words = label.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  });
}
