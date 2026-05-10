import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { ComponentSize } from '../types/component-types';
import { AvatarStack } from './avatar-stack';

/** available size variants for the avatar stack overflow pill. */
export const allAvatarStackOverflowSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar stack overflow pill. */
export type AvatarStackOverflowSize = (typeof allAvatarStackOverflowSizes)[number];

/** default value for the size input. */
export const AVATAR_STACK_OVERFLOW_SIZE_DEFAULT: AvatarStackOverflowSize = 'base';

@Component({
  selector: 'org-avatar-stack-overflow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-stack-overflow.html',
  styleUrl: './avatar-stack-overflow.css',
  host: {
    '[attr.data-size]': 'effectiveSize()',
  },
})
export class AvatarStackOverflow {
  /** @internal optional ancestor avatar stack used to inherit size when no explicit size is set. */
  private readonly _avatarStackComponent = inject(AvatarStack, { optional: true });

  /** the additional avatar count rendered inside the pill (will display as "+N"). */
  public count = input.required<number>();

  /** the size of the pill; falls back to the parent avatar stack size when omitted. */
  public size = input<AvatarStackOverflowSize | undefined>(undefined);

  /** resolved size — explicit input wins; otherwise inferred from the ancestor avatar stack; otherwise default. */
  protected readonly effectiveSize = computed<AvatarStackOverflowSize>(() => {
    return this.size() ?? this._avatarStackComponent?.size() ?? AVATAR_STACK_OVERFLOW_SIZE_DEFAULT;
  });
}
