import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Card } from '../card/card';
import { CardContent } from '../card/card-content';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import type { GlobalNotificationData } from '../global-notification-manager/global-notification-manager';
import { GlobalNotificationBrainDirective } from '../../brain/global-notification-brain/global-notification-brain';

@Component({
  selector: 'org-global-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, CardContent, Button, ButtonIcon],
  templateUrl: './global-notification.html',
  styleUrl: './global-notification.css',
  hostDirectives: [
    {
      directive: GlobalNotificationBrainDirective,
      inputs: ['globalNotificationConfig: notification'],
      outputs: ['globalNotificationClosed: closed'],
    },
  ],
  host: {
    '[style.animation]': 'animationStyle()',
  },
})
export class GlobalNotification {
  protected readonly brain = inject(GlobalNotificationBrainDirective, { self: true });

  /** the notification data describing message, color, auto-close, and animation. */
  public readonly notification = input.required<GlobalNotificationData>();

  /** emitted after the fade-out animation completes so the parent can remove the notification from the manager. */
  public readonly closed = output<string>();

  /** the css animation value to apply based on the brain's current removing state. */
  protected readonly animationStyle = computed<string>(() => {
    const duration = `${this.notification().animationDuration}s`;

    // using forwards to keep the animation in the end state
    return this.brain.isRemoving()
      ? `fade-out ${duration} ease-in-out normal forwards`
      : `fade-in ${duration} ease-in-out normal forwards`;
  });

  /** triggers the fade-out animation via the brain */
  protected startClose(): void {
    this.brain.startClose();
  }
}
