import { ChangeDetectionStrategy, Component, type TemplateRef, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { Card } from '../card/card';
import type { CardColor } from '../card/card';
import { CardContent } from '../card/card-content';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { NotificationBrainDirective } from '../../brain/notification-brain/notification-brain';

/** default value for the message input */
export const NOTIFICATION_ITEM_MESSAGE_DEFAULT: string | undefined = undefined;

/** default value for the contentTemplate input */
export const NOTIFICATION_ITEM_CONTENT_TEMPLATE_DEFAULT: TemplateRef<{ $implicit: string }> | undefined = undefined;

/** default value for the color input */
export const NOTIFICATION_ITEM_COLOR_DEFAULT: CardColor | undefined = undefined;

/** default value for the canClose input */
export const NOTIFICATION_ITEM_CAN_CLOSE_DEFAULT = true;

/** default value for the animationDuration input (in seconds) */
export const NOTIFICATION_ITEM_ANIMATION_DURATION_DEFAULT = 0.3;

@Component({
  selector: 'org-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, Button, ButtonIcon, NgTemplateOutlet],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.css',
  hostDirectives: [
    {
      directive: NotificationBrainDirective,
      inputs: ['id', 'autoCloseIn', 'closeButtonAriaLabel'],
      outputs: ['closed'],
    },
  ],
  host: {
    '[style.animation]': 'animationStyle()',
    '(animationend)': 'onAnimationEnd()',
  },
})
export class NotificationItem {
  protected readonly brain = inject(NotificationBrainDirective, { self: true });

  /** the message text rendered in the notification body when no contentTemplate is provided */
  public readonly message = input<string | undefined, string | null | undefined>(NOTIFICATION_ITEM_MESSAGE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional template that overrides the default message rendering; receives the notification id as $implicit */
  public readonly contentTemplate = input<
    TemplateRef<{ $implicit: string }> | undefined,
    TemplateRef<{ $implicit: string }> | null | undefined
  >(NOTIFICATION_ITEM_CONTENT_TEMPLATE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the semantic color applied to the inner card */
  public readonly color = input<CardColor | undefined, CardColor | null | undefined>(NOTIFICATION_ITEM_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the close button is rendered, allowing the user to manually dismiss the notification */
  public readonly canClose = input<boolean>(NOTIFICATION_ITEM_CAN_CLOSE_DEFAULT);

  /** duration in seconds applied to the fade-in / fade-out animation */
  public readonly animationDuration = input<number>(NOTIFICATION_ITEM_ANIMATION_DURATION_DEFAULT);

  /** the css animation value to apply based on the brain's current removing state */
  protected readonly animationStyle = computed<string>(() => {
    const duration = `${this.animationDuration()}s`;

    // using forwards to keep the animation in the end state
    return this.brain.isRemoving()
      ? `fade-out ${duration} ease-in-out normal forwards`
      : `fade-in ${duration} ease-in-out normal forwards`;
  });

  /** triggers the fade-out animation via the brain */
  protected startClose(): void {
    this.brain.startClose();
  }

  /** notifies the brain when the host's fade-out animation has completed so it can emit the closed event */
  protected onAnimationEnd(): void {
    if (!this.brain.isRemoving()) {
      return;
    }

    this.brain.completeClose();
  }
}
