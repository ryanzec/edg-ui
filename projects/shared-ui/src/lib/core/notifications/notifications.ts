import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { NotificationManager } from '../notification-manager/notification-manager';
import { NotificationItem } from './notification-item';

export const allNotificationsXPositions = ['left', 'center', 'right'] as const;

export type NotificationsXPosition = (typeof allNotificationsXPositions)[number];

/** default horizontal position for the notification container */
export const NOTIFICATIONS_X_POSITION_DEFAULT: NotificationsXPosition = 'center';

export const allNotificationsYPositions = ['top', 'bottom'] as const;

export type NotificationsYPosition = (typeof allNotificationsYPositions)[number];

/** default vertical position for the notification container */
export const NOTIFICATIONS_Y_POSITION_DEFAULT: NotificationsYPosition = 'top';

@Component({
  selector: 'org-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItem],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  host: {
    '[attr.data-x-position]': 'xPosition()',
    '[attr.data-y-position]': 'yPosition()',
    'aria-live': 'polite',
    'aria-label': 'Notifications',
  },
})
export class Notifications {
  /** injected manager used to read and mutate the notification queue */
  private _notificationManager = inject(NotificationManager);

  /** horizontal position of the notification container */
  public xPosition = input<NotificationsXPosition>(NOTIFICATIONS_X_POSITION_DEFAULT);

  /** vertical position of the notification container */
  public yPosition = input<NotificationsYPosition>(NOTIFICATIONS_Y_POSITION_DEFAULT);

  /** reactive list of all active notifications from the manager */
  protected notifications = this._notificationManager.notifications;

  /**
   * removes the notification with the given id from the manager queue.
   */
  protected onClosed(id: string): void {
    this._notificationManager.remove(id);
  }
}
