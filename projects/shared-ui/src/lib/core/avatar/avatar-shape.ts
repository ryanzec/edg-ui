import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';

@Component({
  selector: 'org-avatar-shape',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-shape.html',
  styleUrl: './avatar-shape.css',
})
export class AvatarShape {
  /** reference to the parent avatar's brain directive for label-derived initials. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);
}
