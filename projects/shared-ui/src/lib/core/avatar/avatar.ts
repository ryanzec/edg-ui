import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ComponentSize } from '../types/component-types';
import { AvatarBrainDirective } from '../../brain/avatar-brain/avatar-brain';
import { ButtonBrainDirective } from '../../brain/button-brain/button-brain';

/** available size variants for the avatar component. */
export const allAvatarSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar component. */
export type AvatarSize = (typeof allAvatarSizes)[number];

/** default value for the size input. */
export const AVATAR_SIZE_DEFAULT: AvatarSize = 'base';

@Component({
  selector: 'org-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ButtonBrainDirective],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  hostDirectives: [
    {
      directive: AvatarBrainDirective,
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-clickable]': 'avatarBrainDirective.isClickable() ? "true" : null',
  },
})
export class Avatar {
  /** reference to the host avatar brain directive owning click state and the clicked output. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** the display name shared with child sub-components for initials generation and image alt text. */
  public label = input.required<string>();

  /** the size variant shared with child sub-components. */
  public size = input<AvatarSize>(AVATAR_SIZE_DEFAULT);
}
