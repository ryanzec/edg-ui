import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import type { CardColor } from '../card/card';

/** default animation duration in seconds for notification enter/exit transitions */
export const GLOBAL_NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT = 0.3;

/** default auto-close delay in milliseconds */
export const GLOBAL_NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT = 3000;

/** data shape for a notification stored in the manager */
export type GlobalNotificationData = {
  id: string;
  message: string;
  autoCloseIn?: number;
  color?: CardColor;
  canClose: boolean;
  animationDuration: number;
};

/** data shape for adding a new notification — id and animationDuration are managed internally */
export type AddGlobalNotificationData = Omit<GlobalNotificationData, 'id' | 'animationDuration'> & {
  animationDuration?: number;
};

/** partial update shape for an existing notification identified by id */
export type UpdateGlobalNotificationData = Partial<Omit<GlobalNotificationData, 'id'>>;

type GlobalNotificationManagerState = {
  notifications: GlobalNotificationData[];
};

/**
 * root-level service that manages the global notification queue.
 * consumers can add, remove, update, and clear notifications reactively via signals.
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalNotificationManager {
  /** internal signal holding the full notification manager state */
  private _state = signal<GlobalNotificationManagerState>({
    notifications: [],
  });

  /** reactive list of all active notifications */
  public notifications = computed<GlobalNotificationData[]>(() => this._state().notifications);

  /**
   * adds a new notification to the queue and returns its generated id
   */
  public add(notification: AddGlobalNotificationData): string {
    const id = uuidv4();
    const newNotification: GlobalNotificationData = {
      animationDuration: GLOBAL_NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT,
      autoCloseIn: GLOBAL_NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT,
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
  public update(id: string, updates: UpdateGlobalNotificationData): void {
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
