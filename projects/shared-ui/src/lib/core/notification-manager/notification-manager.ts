import { Injectable, signal, computed, type TemplateRef } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import type { BoxColor } from '../box/box';
import type { IconName } from '../icon/icon-brain';

/** default auto-close delay in milliseconds */
export const NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT = 3000;

/** data shape for a notification stored in the manager */
export type NotificationData = {
  id: string;
  title?: string;
  message?: string;
  contentTemplate?: TemplateRef<{ $implicit: string }>;
  actionsTemplate?: TemplateRef<{ $implicit: string }>;
  icon?: IconName;
  avatarUrl?: string;
  autoCloseIn?: number;
  color?: BoxColor;
  canClose: boolean;
  resetTimerOnHover?: boolean;
};

/** data shape for adding a new notification — id is managed internally */
export type AddNotificationData = Omit<NotificationData, 'id'>;

/** partial update shape for an existing notification identified by id */
export type UpdateNotificationData = Partial<Omit<NotificationData, 'id'>>;

type NotificationManagerState = {
  notifications: NotificationData[];
};

/**
 * root-level service that manages the notification queue.
 * consumers can add, remove, update, and clear notifications reactively via signals.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationManager {
  /** internal signal holding the full notification manager state */
  private _state = signal<NotificationManagerState>({
    notifications: [],
  });

  /** reactive list of all active notifications */
  public notifications = computed<NotificationData[]>(() => this._state().notifications);

  /**
   * adds a new notification to the queue and returns its generated id
   */
  public add(notification: AddNotificationData): string {
    const id = uuidv4();
    const newNotification: NotificationData = {
      autoCloseIn: NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT,
      ...notification,
      id,
    };

    this._state.update((state) => ({
      ...state,
      notifications: [...state.notifications, newNotification],
    }));

    return id;
  }

  /**
   * removes the notification with the given id from the queue
   */
  public remove(id: string): void {
    this._state.update((state) => ({
      ...state,
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  }

  /**
   * applies partial updates to the notification with the given id
   */
  public update(id: string, updates: UpdateNotificationData): void {
    this._state.update((state) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, ...updates } : notification
      ),
    }));
  }

  /**
   * removes all notifications from the queue
   */
  public clear(): void {
    this._state.set({ notifications: [] });
  }
}
