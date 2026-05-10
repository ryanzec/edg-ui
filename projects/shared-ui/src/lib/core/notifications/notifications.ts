import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { NotificationManager } from '../notification-manager/notification-manager';
import { NotificationsBrainDirective } from '../../brain/notifications-brain/notifications-brain';
import { NotificationItem } from './notification-item';

/** all valid stack position values */
export const allNotificationsPositions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

/** position variant for the notification stack */
export type NotificationsPosition = (typeof allNotificationsPositions)[number];

/** default position for the notification container */
export const NOTIFICATIONS_POSITION_DEFAULT: NotificationsPosition = 'top-right';

@Component({
  selector: 'org-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItem],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  hostDirectives: [
    {
      directive: NotificationsBrainDirective,
      inputs: ['ariaLabel'],
      outputs: ['closeRequested'],
    },
  ],
  host: {
    '[attr.data-position]': 'position()',
  },
})
export class Notifications {
  /** injected manager used to read and mutate the notification queue */
  private _notificationManager = inject(NotificationManager);

  protected readonly brain = inject(NotificationsBrainDirective, { self: true });

  /** stack position of the notification container */
  public position = input<NotificationsPosition>(NOTIFICATIONS_POSITION_DEFAULT);

  /** reactive list of all active notifications from the manager */
  protected notifications = this._notificationManager.notifications;

  /**
   * removes the notification with the given id from the manager queue and notifies the brain so external listeners
   * on the closeRequested output are kept in sync.
   */
  protected onClosed(id: string): void {
    this._notificationManager.remove(id);
    this.brain.requestClose(id);
  }
}
