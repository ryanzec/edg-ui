import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { GlobalNotificationManager } from '../global-notification-manager/global-notification-manager';
import { GlobalNotification } from './global-notification';

export const allGlobalNotificationsXPositions = ['left', 'center', 'right'] as const;

export type GlobalNotificationsXPosition = (typeof allGlobalNotificationsXPositions)[number];

/** default horizontal position for the notification container */
export const GLOBAL_NOTIFICATIONS_X_POSITION_DEFAULT: GlobalNotificationsXPosition = 'center';

export const allGlobalNotificationsYPositions = ['top', 'bottom'] as const;

export type GlobalNotificationsYPosition = (typeof allGlobalNotificationsYPositions)[number];

/** default vertical position for the notification container */
export const GLOBAL_NOTIFICATIONS_Y_POSITION_DEFAULT: GlobalNotificationsYPosition = 'top';

@Component({
  selector: 'org-global-notifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlobalNotification],
  templateUrl: './global-notifications.html',
  styleUrl: './global-notifications.css',
  host: {
    '[attr.data-x-position]': 'xPosition()',
    '[attr.data-y-position]': 'yPosition()',
    'aria-live': 'polite',
    'aria-label': 'Notifications',
  },
})
export class GlobalNotifications {
  /** injected manager used to read and mutate the notification queue */
  private _globalNotificationManager = inject(GlobalNotificationManager);

  /** horizontal position of the notification container */
  public xPosition = input<GlobalNotificationsXPosition>(GLOBAL_NOTIFICATIONS_X_POSITION_DEFAULT);

  /** vertical position of the notification container */
  public yPosition = input<GlobalNotificationsYPosition>(GLOBAL_NOTIFICATIONS_Y_POSITION_DEFAULT);

  /** reactive list of all active notifications from the manager */
  protected notifications = this._globalNotificationManager.notifications;

  /**
   * removes the notification with the given id from the manager queue.
   */
  protected onClosed(id: string): void {
    this._globalNotificationManager.remove(id);
  }
}
