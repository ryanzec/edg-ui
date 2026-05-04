import { Injectable, signal, computed, type TemplateRef } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import type { CardColor } from '../card/card';

/** default animation duration in seconds for notification enter/exit transitions */
export const NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT = 0.3;

/** default auto-close delay in milliseconds */
export const NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT = 3000;

/** data shape for a notification stored in the manager */
export type NotificationData = {
  id: string;
  message?: string;
  contentTemplate?: TemplateRef<{ $implicit: string }>;
  autoCloseIn?: number;
  color?: CardColor;
  canClose: boolean;
  animationDuration: number;
};

/** data shape for adding a new notification — id and animationDuration are managed internally */
export type AddNotificationData = Omit<NotificationData, 'id' | 'animationDuration'> & {
  animationDuration?: number;
};

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
      animationDuration: NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT,
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
