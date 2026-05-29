import {
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  type TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Notifications, type NotificationsPosition } from './notifications';
import { NotificationManager } from '../notification-manager/notification-manager';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';

type AddVariant =
  | 'default'
  | 'danger'
  | 'warning'
  | 'safe'
  | 'primary'
  | 'custom-icon'
  | 'avatar'
  | 'no-close'
  | 'no-auto-close'
  | 'short-auto-close'
  | 'reset-on-hover'
  | 'title-only'
  | 'message-only';

@Component({
  selector: 'test-notifications-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications],
  host: { class: 'block' },
  template: `
    <org-notifications
      data-testid="notifications"
      [position]="position()"
      [ariaLabel]="ariaLabel()"
      (closeRequested)="onCloseRequested($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class NotificationsHost implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  public readonly position = signal<NotificationsPosition>('top-right');
  public readonly ariaLabel = signal<string>('Notifications');

  protected readonly closeRequestedCount = signal<number>(0);
  protected readonly lastClosedId = signal<string | null>(null);

  protected readonly readout = computed<string>(() => {
    const notifications = this._manager.notifications();
    const first = notifications[0];

    return [
      `count=${notifications.length}`,
      `closeRequestedCount=${this.closeRequestedCount()}`,
      `lastClosedId=${this.lastClosedId() ?? 'none'}`,
      `firstId=${first?.id ?? 'none'}`,
      `firstTitle=${first?.title ?? 'none'}`,
    ].join('\n');
  });

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  public add(variant: AddVariant): void {
    switch (variant) {
      case 'default':
        this._manager.add({ title: 'default', message: 'default body', color: 'info', canClose: true, autoCloseIn: 0 });
        break;
      case 'danger':
        this._manager.add({ title: 'danger', color: 'danger', canClose: true, autoCloseIn: 0 });
        break;
      case 'warning':
        this._manager.add({ title: 'warning', color: 'warning', canClose: true, autoCloseIn: 0 });
        break;
      case 'safe':
        this._manager.add({ title: 'safe', color: 'safe', canClose: true, autoCloseIn: 0 });
        break;
      case 'primary':
        this._manager.add({ title: 'primary', color: 'primary', canClose: true, autoCloseIn: 0 });
        break;
      case 'custom-icon':
        this._manager.add({
          title: 'custom icon',
          color: 'danger',
          icon: 'sparkles',
          canClose: true,
          autoCloseIn: 0,
        });
        break;
      case 'avatar':
        this._manager.add({
          title: 'avatar',
          color: 'primary',
          avatarUrl: 'https://example.com/avatar.png',
          canClose: true,
          autoCloseIn: 0,
        });
        break;
      case 'no-close':
        this._manager.add({ title: 'no close', color: 'info', canClose: false, autoCloseIn: 0 });
        break;
      case 'no-auto-close':
        this._manager.add({ title: 'no auto close', color: 'info', canClose: true, autoCloseIn: 0 });
        break;
      case 'short-auto-close':
        this._manager.add({ title: 'short', color: 'info', canClose: true, autoCloseIn: 200 });
        break;
      case 'reset-on-hover':
        this._manager.add({
          title: 'reset',
          color: 'info',
          canClose: true,
          autoCloseIn: 300,
          resetTimerOnHover: true,
        });
        break;
      case 'title-only':
        this._manager.add({ title: 'title only', color: 'info', canClose: true, autoCloseIn: 0 });
        break;
      case 'message-only':
        this._manager.add({ message: 'message only', color: 'info', canClose: true, autoCloseIn: 0 });
        break;
    }
  }

  protected onCloseRequested(id: string): void {
    this.closeRequestedCount.update((value) => value + 1);
    this.lastClosedId.set(id);
  }
}

@Component({
  selector: 'test-notifications-content-template-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <ng-template [orgTypedContext]="idType" #contentTemplate let-id>
      <div data-testid="content-template-body">custom body for {{ id }}</div>
    </ng-template>

    <org-notifications data-testid="notifications" />
  `,
})
class NotificationsContentTemplateHost implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  protected readonly idType: string[] = [];

  protected readonly contentTemplateRef = viewChild.required<TemplateRef<{ $implicit: string }>>('contentTemplate');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  public addWithContent(): void {
    this._manager.add({
      title: 'should be hidden',
      message: 'should also be hidden',
      contentTemplate: this.contentTemplateRef(),
      color: 'info',
      canClose: true,
      autoCloseIn: 0,
    });
  }
}

@Component({
  selector: 'test-notifications-actions-template-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <ng-template [orgTypedContext]="idType" #actionsTemplate let-id>
      <button type="button" data-testid="action-button">action for {{ id }}</button>
    </ng-template>

    <org-notifications data-testid="notifications" />
  `,
})
class NotificationsActionsTemplateHost implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  protected readonly idType: string[] = [];

  protected readonly actionsTemplateRef = viewChild.required<TemplateRef<{ $implicit: string }>>('actionsTemplate');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  public addWithActions(): void {
    this._manager.add({
      title: 'with actions',
      message: 'has an actions row',
      actionsTemplate: this.actionsTemplateRef(),
      color: 'info',
      canClose: true,
      autoCloseIn: 0,
    });
  }
}

describe('Notifications (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  /** queries the rendered notification item element under the notifications host */
  const queryItem = (host: HTMLElement): HTMLElement | null => host.querySelector('org-notification-item');

  /** completes the close lifecycle by dispatching the leave-animation end on the item host */
  const completeLeaveAnimation = (item: HTMLElement): void => {
    item.dispatchEvent(new AnimationEvent('animationend', { animationName: 'notification-leave', bubbles: true }));
  };

  /** waits up to the timeout for the readout to contain the expected substring */
  const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('container host attributes', () => {
    it('renders the default data-position', () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      expect(host.getAttribute('data-position')).toBe('top-right');
    });

    it('reflects the position input', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.position.set('top-left');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('top-left');

      fixture.componentInstance.position.set('bottom-center');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('bottom-center');

      fixture.componentInstance.position.set('bottom-right');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('bottom-right');
    });

    it('has aria-live polite', () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      expect(host.getAttribute('aria-live')).toBe('polite');
    });

    it('has the default aria-label', () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      expect(host.getAttribute('aria-label')).toBe('Notifications');
    });

    it('reflects a custom aria-label', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.ariaLabel.set('Custom alerts');
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('Custom alerts');
    });
  });

  describe('manager-driven rendering', () => {
    it('renders no items for an empty manager', () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      expect(host.querySelectorAll('org-notification-item').length).toBe(0);
    });

    it('renders one notification item per manager entry', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(host.querySelectorAll('org-notification-item').length).toBe(1));

      fixture.componentInstance.add('safe');
      await waitFor(() => expect(host.querySelectorAll('org-notification-item').length).toBe(2));
    });

    it('removes the notification from the manager when closed', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      await userEvent.click(closeButton);
      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
    });

    it('emits closeRequested when an item is closed', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const idMatch = readout.textContent?.match(/firstId=([^\n]+)/);
      const addedId = idMatch?.[1] ?? '';
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      await userEvent.click(closeButton);
      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('closeRequestedCount=1'));
      expect(readout.textContent).toContain(`lastClosedId=${addedId}`);
    });
  });

  describe('item color and role', () => {
    it('uses data-color info by default', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-color')).toBe('info'));
    });

    it('reflects an explicit color attribute', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('danger');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-color')).toBe('danger'));
    });

    it('uses role status for non-urgent intents', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('status'));
    });

    it('uses role alert for danger', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('danger');
      await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('alert'));
    });

    it('uses role alert for warning', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('warning');
      await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('alert'));
    });
  });

  describe('item state attributes', () => {
    it('omits data-state by default', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      expect(queryItem(host)?.getAttribute('data-state')).toBeNull();
    });

    it('sets data-state to leaving after a close click', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      await userEvent.click(closeButton);

      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));
    });

    it('sets data-show-close to 1 when canClose is true', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-show-close')).toBe('1'));
    });

    it('sets data-show-close to 0 when canClose is false', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('no-close');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-show-close')).toBe('0'));
    });

    it('sets data-has-progress to 1 when auto-close is set', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-has-progress')).toBe('1'));
    });

    it('sets data-has-progress to 0 when no auto-close', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('no-auto-close');
      await waitFor(() => expect(queryItem(host)?.getAttribute('data-has-progress')).toBe('0'));
    });
  });

  describe('item content', () => {
    it('renders the title and message', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const title = item.querySelector('.title') as HTMLElement;
        const description = item.querySelector('.description') as HTMLElement;

        expect(title.textContent?.trim()).toBe('default');
        expect(description.textContent?.trim()).toBe('default body');
      });
    });

    it('omits the description when title only', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('title-only');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.title')).not.toBeNull();
        expect(item.querySelector('.description')).toBeNull();
      });
    });

    it('omits the title when message only', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('message-only');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.title')).toBeNull();
        expect(item.querySelector('.description')).not.toBeNull();
      });
    });

    it('renders the intent-default icon for danger', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('danger');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const icon = item.querySelector('.media org-icon') as HTMLElement;

        expect(icon.getAttribute('data-icon')).toBe('circle-x');
      });
    });

    it('renders the intent-default icon for safe', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('safe');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const icon = item.querySelector('.media org-icon') as HTMLElement;

        expect(icon.getAttribute('data-icon')).toBe('circle-check');
      });
    });

    it('lets an explicit icon override the intent default', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('custom-icon');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const icon = item.querySelector('.media org-icon') as HTMLElement;

        expect(icon.getAttribute('data-icon')).toBe('sparkles');
      });
    });

    it('renders an avatar when avatarUrl is provided', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('avatar');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const img = item.querySelector('.media img.avatar') as HTMLImageElement;

        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
      });
    });

    it('does not render an icon in the media slot when an avatar is provided', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('avatar');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.media img.avatar')).not.toBeNull();
        expect(item.querySelector('.media org-icon')).toBeNull();
      });
    });

    it('renders a content template and hides the title and message', async () => {
      const fixture = createFixture(NotificationsContentTemplateHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.addWithContent();
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('[data-testid="content-template-body"]')).not.toBeNull();
        expect(item.querySelector('.title')).toBeNull();
        expect(item.querySelector('.description')).toBeNull();
      });
    });

    it('renders an actions template', async () => {
      const fixture = createFixture(NotificationsActionsTemplateHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.addWithActions();
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.actions [data-testid="action-button"]')).not.toBeNull();
      });
    });
  });

  describe('close button', () => {
    it('renders the close button when canClose is true', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.close')).not.toBeNull();
      });
    });

    it('omits the close button when canClose is false', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('no-close');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.close')).toBeNull();
      });
    });

    it('has the default close button aria-label', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;
        const closeButton = item.querySelector('.close button') as HTMLButtonElement;

        expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
      });
    });

    it('exposes the close button aria-label through the parent', async () => {
      // note: the source story (CloseButtonReflectsCustomAriaLabel) drove a custom close-button
      // aria-label through a direct NotificationItem shell, but closeButtonAriaLabel is not part of
      // the manager's NotificationData nor forwarded by notifications.html, so a custom value cannot
      // be exercised through the parent. this asserts the aria-label surface that is reachable.
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
    });
  });

  describe('progress bar', () => {
    it('renders the progress bar when auto-close is greater than zero', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.progress')).not.toBeNull();
      });
    });

    it('omits the progress bar when there is no auto-close', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('no-auto-close');
      await waitFor(() => {
        const item = queryItem(host) as HTMLElement;

        expect(item.querySelector('.progress')).toBeNull();
      });
    });
  });

  describe('close lifecycle', () => {
    it('starts the close flow on close click', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      await userEvent.click(closeButton);

      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));
    });

    it('completes the close on animation end and removes from the manager', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('default');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      await userEvent.click(closeButton);
      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
      expect(readout.textContent).toContain('closeRequestedCount=1');
    });
  });

  describe('auto-close timer', () => {
    it('removes the notification when the auto-close timer expires', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      // the virtual cursor may have been parked over the notification's fixed-position corner by a
      // prior test, firing a real mouseenter that pauses the auto-close timer with no matching
      // mouseleave; drive a clean pause/resume cycle so the timer deterministically runs to completion.
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await flush(fixture);
      await sleep(100);
      item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await flush(fixture);

      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
    });

    it('pauses the auto-close timer on mouse enter', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await flush(fixture);

      // wait well past the 200ms auto-close; while hovered the timer must remain paused
      await sleep(600);
      await flush(fixture);

      expect(item.getAttribute('data-state')).toBeNull();
      expect(readout.textContent).toContain('count=1');
    });

    it('resumes the auto-close timer on mouse leave', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await flush(fixture);
      await sleep(100);
      item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await flush(fixture);

      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
    });

    it('pauses the auto-close timer on focus in', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      item.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await flush(fixture);

      await sleep(600);
      await flush(fixture);

      expect(item.getAttribute('data-state')).toBeNull();
      expect(readout.textContent).toContain('count=1');
    });

    it('resumes the auto-close timer on focus out', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.add('short-auto-close');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      item.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await flush(fixture);
      await sleep(100);
      item.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await flush(fixture);

      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
    });

    it('restarts the full duration on leave when resetTimerOnHover is set', async () => {
      const fixture = createFixture(NotificationsHost);
      const host = queryByTestId(fixture, 'notifications');
      const readout = queryByTestId(fixture, 'readout');

      // 300ms auto-close + resetTimerOnHover=true
      fixture.componentInstance.add('reset-on-hover');
      await waitFor(() => expect(queryItem(host)).not.toBeNull());

      const item = queryItem(host) as HTMLElement;

      // pause near the end of the timer so without reset it would expire quickly after resume
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await flush(fixture);
      await sleep(250);
      item.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await flush(fixture);

      // with reset-on-hover the full 300ms restarts on leave, so the notification must still be present
      // 150ms after the resume (which would be ~50ms past expiry without the reset)
      await sleep(150);
      await flush(fixture);

      expect(item.getAttribute('data-state')).toBeNull();
      expect(readout.textContent).toContain('count=1');

      // confirm the timer still fires after the fresh duration elapses
      await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

      completeLeaveAnimation(item);

      await waitFor(() => expect(readout.textContent).toContain('count=0'));
    });
  });
});
