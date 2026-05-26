import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT, NotificationManager } from './notification-manager';

describe('NotificationManager', () => {
  let manager: NotificationManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    manager = TestBed.inject(NotificationManager);
  });

  it('should be created', () => {
    expect(manager).toBeTruthy();
  });

  describe('initial state', () => {
    it('exposes an empty notifications queue', () => {
      expect(manager.notifications()).toEqual([]);
    });
  });

  describe('add', () => {
    it('returns a non-empty id', () => {
      const id = manager.add({ title: 'one', color: 'info', canClose: true });

      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('pushes the notification onto the queue', () => {
      manager.add({ title: 'one', message: 'body', color: 'info', canClose: true });

      const notifications = manager.notifications();

      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe('one');
      expect(notifications[0].message).toBe('body');
      expect(notifications[0].color).toBe('info');
      expect(notifications[0].canClose).toBe(true);
    });

    it('applies the default autoCloseIn when omitted', () => {
      manager.add({ title: 'default-auto-close', color: 'info', canClose: true });

      expect(manager.notifications()[0].autoCloseIn).toBe(NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT);
    });

    it('preserves an explicit autoCloseIn', () => {
      manager.add({ title: 'explicit', color: 'info', canClose: true, autoCloseIn: 7500 });

      expect(manager.notifications()[0].autoCloseIn).toBe(7500);
    });

    it('preserves an explicit zero autoCloseIn', () => {
      manager.add({ title: 'zero', color: 'info', canClose: true, autoCloseIn: 0 });

      expect(manager.notifications()[0].autoCloseIn).toBe(0);
    });

    it('preserves all provided fields', () => {
      manager.add({
        title: 'full',
        message: 'full message',
        color: 'danger',
        canClose: false,
        autoCloseIn: 1234,
        icon: 'sparkles',
        avatarUrl: 'https://example.com/avatar.png',
      });

      const notification = manager.notifications()[0];

      expect(notification.title).toBe('full');
      expect(notification.message).toBe('full message');
      expect(notification.color).toBe('danger');
      expect(notification.canClose).toBe(false);
      expect(notification.autoCloseIn).toBe(1234);
      expect(notification.icon).toBe('sparkles');
      expect(notification.avatarUrl).toBe('https://example.com/avatar.png');
    });

    it('assigns unique ids across calls', () => {
      const firstId = manager.add({ title: 'first', color: 'info', canClose: true });
      const secondId = manager.add({ title: 'second', color: 'info', canClose: true });

      expect(firstId).not.toBe(secondId);
    });
  });

  describe('remove', () => {
    it('drops the matching notification by id', () => {
      const id = manager.add({ title: 'one', color: 'info', canClose: true });

      manager.remove(id);

      expect(manager.notifications()).toEqual([]);
    });

    it('leaves other notifications intact', () => {
      const firstId = manager.add({ title: 'first', color: 'info', canClose: true });
      manager.add({ title: 'second', color: 'primary', canClose: true });

      manager.remove(firstId);

      const notifications = manager.notifications();

      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe('second');
      expect(notifications[0].color).toBe('primary');
    });

    it('is a no-op for an unknown id', () => {
      manager.add({ title: 'one', color: 'info', canClose: true });

      manager.remove('non-existent-id');

      const notifications = manager.notifications();

      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe('one');
    });
  });

  describe('update', () => {
    it('applies partial changes to the matching notification by id', () => {
      const id = manager.add({ title: 'original', message: 'original body', color: 'info', canClose: true });

      manager.update(id, { title: 'updated', color: 'safe', canClose: false });

      const notification = manager.notifications()[0];

      expect(notification.title).toBe('updated');
      expect(notification.color).toBe('safe');
      expect(notification.canClose).toBe(false);
    });

    it('leaves unchanged fields intact', () => {
      const id = manager.add({ title: 'original', message: 'original body', color: 'info', canClose: true });

      manager.update(id, { title: 'updated' });

      const notification = manager.notifications()[0];

      expect(notification.message).toBe('original body');
      expect(notification.color).toBe('info');
      expect(notification.canClose).toBe(true);
    });

    it('only affects the target notification', () => {
      const firstId = manager.add({ title: 'first', color: 'info', canClose: true });
      manager.add({ title: 'second', color: 'primary', canClose: true });

      manager.update(firstId, { title: 'first-updated' });

      const notifications = manager.notifications();

      expect(notifications[0].title).toBe('first-updated');
      expect(notifications[1].title).toBe('second');
      expect(notifications[1].color).toBe('primary');
    });

    it('is a no-op for an unknown id', () => {
      manager.add({ title: 'one', color: 'info', canClose: true });

      manager.update('non-existent-id', { title: 'should not apply' });

      expect(manager.notifications()[0].title).toBe('one');
    });
  });

  describe('clear', () => {
    it('empties a queue with multiple notifications', () => {
      manager.add({ title: 'first', color: 'info', canClose: true });
      manager.add({ title: 'second', color: 'primary', canClose: true });

      manager.clear();

      expect(manager.notifications()).toEqual([]);
    });
  });
});
