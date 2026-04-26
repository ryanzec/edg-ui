import { Component, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';
import { ComponentSize } from '../types/component-types';

/** available size variants for the avatar stack component. */
export const allAvatarStackSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar stack component. */
export type AvatarStackSize = (typeof allAvatarStackSizes)[number];

/** default value for the size input. */
export const AVATAR_STACK_SIZE_DEFAULT: AvatarStackSize = 'base';

@Component({
  selector: 'org-avatar-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styleUrl: './avatar-stack.css',
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class AvatarStack {
  /** the overlap size variant; set to null to disable overlap styling. */
  public size = input<AvatarStackSize | null>(AVATAR_STACK_SIZE_DEFAULT);
}
