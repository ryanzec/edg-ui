import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarImageBrainDirective } from '../../brain/avatar-image-brain/avatar-image-brain';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';

@Component({
  selector: 'org-avatar-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-image.html',
  styleUrl: './avatar-image.css',
  hostDirectives: [
    {
      directive: AvatarImageBrainDirective,
      inputs: ['src', 'email', 'alt'],
    },
  ],
})
export class AvatarImage {
  /** @internal reference to the parent avatar's brain directive for label-based alt fallback. */
  private readonly _avatarBrainDirective = inject(AvatarBrainDirective);

  /** reference to the host avatar image brain directive owning load error state, image url resolution, and the alt accessibility label. */
  protected readonly avatarImageBrainDirective = inject(AvatarImageBrainDirective);

  /** resolved alt text — prefers the explicit alt input on the brain, falls back to the parent avatar label. */
  protected readonly effectiveAlt = computed<string>(() => {
    return this.avatarImageBrainDirective.alt() ?? this._avatarBrainDirective.label();
  });
}
