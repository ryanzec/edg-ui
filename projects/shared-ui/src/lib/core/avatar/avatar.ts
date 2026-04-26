import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ComponentSize } from '../types/component-types';

/** available size variants for the avatar component. */
export const allAvatarSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar component. */
export type AvatarSize = (typeof allAvatarSizes)[number];

/** default value for the size input. */
export const AVATAR_SIZE_DEFAULT: AvatarSize = 'base';

@Component({
  selector: 'org-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-clickable]': 'isClickable() ? "true" : null',
  },
})
export class Avatar {
  /** @internal emits when the avatar is clicked */
  private readonly _clicked$ = new Subject<MouseEvent>();

  /** the display name shared with child sub-components for initials generation and image alt text. */
  public label = input.required<string>();

  /** the size variant shared with child sub-components. */
  public size = input<AvatarSize>(AVATAR_SIZE_DEFAULT);

  /** emitted when the avatar is clicked; binding this output causes the avatar to render as a button. */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** true when at least one listener is bound to the clicked output. */
  protected readonly isClickable = computed<boolean>(() => this._clicked$.observed);

  /** forwards native click events on the button wrapper to the clicked output. */
  protected click(event: MouseEvent): void {
    this._clicked$.next(event);
  }
}
