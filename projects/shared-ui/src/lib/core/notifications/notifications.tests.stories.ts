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
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Notifications, type NotificationsPosition } from './notifications';
import { NotificationItem } from './notification-item';
import { NotificationManager } from '../notification-manager/notification-manager';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';
import type { CardColor } from '../card/card';
import type { IconName } from '../icon/icon-brain';

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
  selector: 'story-notifications-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-add-default" (click)="add('default')">add-default</button>
      <button type="button" data-testid="ctl-add-danger" (click)="add('danger')">add-danger</button>
      <button type="button" data-testid="ctl-add-warning" (click)="add('warning')">add-warning</button>
      <button type="button" data-testid="ctl-add-safe" (click)="add('safe')">add-safe</button>
      <button type="button" data-testid="ctl-add-primary" (click)="add('primary')">add-primary</button>
      <button type="button" data-testid="ctl-add-custom-icon" (click)="add('custom-icon')">add-custom-icon</button>
      <button type="button" data-testid="ctl-add-avatar" (click)="add('avatar')">add-avatar</button>
      <button type="button" data-testid="ctl-add-no-close" (click)="add('no-close')">add-no-close</button>
      <button type="button" data-testid="ctl-add-no-auto-close" (click)="add('no-auto-close')">
        add-no-auto-close
      </button>
      <button type="button" data-testid="ctl-add-short-auto-close" (click)="add('short-auto-close')">
        add-short-auto-close
      </button>
      <button type="button" data-testid="ctl-add-reset-on-hover" (click)="add('reset-on-hover')">
        add-reset-on-hover
      </button>
      <button type="button" data-testid="ctl-add-title-only" (click)="add('title-only')">add-title-only</button>
      <button type="button" data-testid="ctl-add-message-only" (click)="add('message-only')">add-message-only</button>
      <button type="button" data-testid="ctl-clear" (click)="clear()">clear</button>
      <button type="button" data-testid="ctl-position-top-left" (click)="position.set('top-left')">
        position-top-left
      </button>
      <button type="button" data-testid="ctl-position-bottom-center" (click)="position.set('bottom-center')">
        position-bottom-center
      </button>
      <button type="button" data-testid="ctl-position-bottom-right" (click)="position.set('bottom-right')">
        position-bottom-right
      </button>
      <button type="button" data-testid="ctl-aria-label-custom" (click)="ariaLabel.set('Custom alerts')">
        aria-label-custom
      </button>
    </div>
  `,
})
class StoryNotificationsTestsShell implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  protected readonly position = signal<NotificationsPosition>('top-right');
  protected readonly ariaLabel = signal<string>('Notifications');

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

  protected add(variant: AddVariant): void {
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

  protected clear(): void {
    this._manager.clear();
  }

  protected onCloseRequested(id: string): void {
    this.closeRequestedCount.update((value) => value + 1);
    this.lastClosedId.set(id);
  }
}

@Component({
  selector: 'story-notification-item-direct-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItem],
  host: { class: 'block' },
  template: `
    <org-notification-item
      data-testid="item"
      [id]="id()"
      [title]="title()"
      [message]="message()"
      [color]="color()"
      [icon]="icon()"
      [avatarUrl]="avatarUrl()"
      [canClose]="canClose()"
      [autoCloseIn]="autoCloseIn()"
      [closeButtonAriaLabel]="closeButtonAriaLabel()"
      [resetTimerOnHover]="resetTimerOnHover()"
      (closed)="onClosed($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button
        type="button"
        data-testid="ctl-close-aria-label-custom"
        (click)="closeButtonAriaLabel.set('Dismiss toast')"
      >
        close-aria-label-custom
      </button>
      <button type="button" data-testid="ctl-can-close-off" (click)="canClose.set(false)">can-close-off</button>
      <button type="button" data-testid="ctl-auto-close-200" (click)="autoCloseIn.set(200)">auto-close-200</button>
      <button type="button" data-testid="ctl-reset-on-hover-on" (click)="resetTimerOnHover.set(true)">
        reset-on-hover-on
      </button>
    </div>
  `,
})
class StoryNotificationItemDirectShell {
  protected readonly id = signal<string>('test-id');
  protected readonly title = signal<string>('item title');
  protected readonly message = signal<string>('item message');
  protected readonly color = signal<CardColor | undefined>('info');
  protected readonly icon = signal<IconName | undefined>(undefined);
  protected readonly avatarUrl = signal<string | undefined>(undefined);
  protected readonly canClose = signal<boolean>(true);
  protected readonly autoCloseIn = signal<number | undefined>(0);
  protected readonly closeButtonAriaLabel = signal<string>('Close notification');
  protected readonly resetTimerOnHover = signal<boolean>(false);

  protected readonly closedCount = signal<number>(0);
  protected readonly lastClosedId = signal<string | null>(null);

  protected readonly readout = computed<string>(() => {
    return [`closedCount=${this.closedCount()}`, `lastClosedId=${this.lastClosedId() ?? 'none'}`].join('\n');
  });

  protected onClosed(id: string): void {
    this.closedCount.update((value) => value + 1);
    this.lastClosedId.set(id);
  }
}

@Component({
  selector: 'story-notifications-content-template-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <ng-template [orgTypedContext]="idType" #contentTemplate let-id>
      <div data-testid="content-template-body">custom body for {{ id }}</div>
    </ng-template>

    <org-notifications data-testid="notifications" />

    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-add-content-template" (click)="addWithContent()">add-content</button>
    </div>
  `,
})
class StoryNotificationsContentTemplateShell implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  protected readonly idType: string[] = [];

  protected readonly contentTemplateRef = viewChild.required<TemplateRef<{ $implicit: string }>>('contentTemplate');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected addWithContent(): void {
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
  selector: 'story-notifications-actions-template-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <ng-template [orgTypedContext]="idType" #actionsTemplate let-id>
      <button type="button" data-testid="action-button">action for {{ id }}</button>
    </ng-template>

    <org-notifications data-testid="notifications" />

    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-add-actions-template" (click)="addWithActions()">add-actions</button>
    </div>
  `,
})
class StoryNotificationsActionsTemplateShell implements OnDestroy {
  private readonly _manager = inject(NotificationManager);

  protected readonly idType: string[] = [];

  protected readonly actionsTemplateRef = viewChild.required<TemplateRef<{ $implicit: string }>>('actionsTemplate');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected addWithActions(): void {
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

const meta: Meta = {
  title: 'Core/Components/Notifications/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-notifications-tests-shell />`,
  moduleMetadata: { imports: [StoryNotificationsTestsShell] },
});

const renderDirectShell: Story['render'] = () => ({
  template: `<story-notification-item-direct-shell />`,
  moduleMetadata: { imports: [StoryNotificationItemDirectShell] },
});

const renderContentTemplateShell: Story['render'] = () => ({
  template: `<story-notifications-content-template-shell />`,
  moduleMetadata: { imports: [StoryNotificationsContentTemplateShell] },
});

const renderActionsTemplateShell: Story['render'] = () => ({
  template: `<story-notifications-actions-template-shell />`,
  moduleMetadata: { imports: [StoryNotificationsActionsTemplateShell] },
});

/** queries the rendered notification item element under the notifications host */
const queryItem = (host: HTMLElement): HTMLElement | null => host.querySelector('org-notification-item');

/** completes the close lifecycle by firing the leave-animation end on the item host */
const completeLeaveAnimation = (item: HTMLElement): void => {
  fireEvent.animationEnd(item, { animationName: 'notification-leave' });
};

export const RendersDefaultDataPosition: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await expect(host.getAttribute('data-position')).toBe('top-right');
  },
};

export const ReflectsPositionInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-position-top-left'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBe('top-left'));

    await userEvent.click(canvas.getByTestId('ctl-position-bottom-center'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBe('bottom-center'));

    await userEvent.click(canvas.getByTestId('ctl-position-bottom-right'));

    await waitFor(() => expect(host.getAttribute('data-position')).toBe('bottom-right'));
  },
};

export const HostHasAriaLivePolite: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await expect(host.getAttribute('aria-live')).toBe('polite');
  },
};

export const HostHasDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await expect(host.getAttribute('aria-label')).toBe('Notifications');
  },
};

export const HostReflectsCustomAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-custom'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Custom alerts'));
  },
};

export const EmptyManagerRendersNoItems: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await expect(host.querySelectorAll('org-notification-item').length).toBe(0);
  },
};

export const RendersOneNotificationItemPerManagerEntry: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(host.querySelectorAll('org-notification-item').length).toBe(1));

    await userEvent.click(canvas.getByTestId('ctl-add-safe'));

    await waitFor(() => expect(host.querySelectorAll('org-notification-item').length).toBe(2));
  },
};

export const ClosingItemRemovesFromManager: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;
    const closeButton = item.querySelector('.close button') as HTMLButtonElement;

    await userEvent.click(closeButton);
    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
  },
};

export const ClosingItemEmitsCloseRequested: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;
    const idMatch = readout.textContent?.match(/firstId=([^\n]+)/);
    const addedId = idMatch?.[1] ?? '';
    const closeButton = item.querySelector('.close button') as HTMLButtonElement;

    await userEvent.click(closeButton);
    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('closeRequestedCount=1'));
    await expect(readout.textContent).toContain(`lastClosedId=${addedId}`);
  },
};

export const DefaultDataColorIsInfo: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-color')).toBe('info'));
  },
};

export const ReflectsExplicitColorAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-danger'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-color')).toBe('danger'));
  },
};

export const DataStateAbsentByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    await expect(queryItem(host)?.getAttribute('data-state')).toBeNull();
  },
};

export const DataStateBecomesLeavingAfterCloseClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;
    const closeButton = item.querySelector('.close button') as HTMLButtonElement;

    await userEvent.click(closeButton);

    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));
  },
};

export const DataShowCloseIsOneWhenCanCloseTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-show-close')).toBe('1'));
  },
};

export const DataShowCloseIsZeroWhenCanCloseFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-no-close'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-show-close')).toBe('0'));
  },
};

export const DataHasProgressIsOneWhenAutoCloseSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-has-progress')).toBe('1'));
  },
};

export const DataHasProgressIsZeroWhenNoAutoClose: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-no-auto-close'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-has-progress')).toBe('0'));
  },
};

export const RoleStatusForNonUrgentIntents: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('status'));
  },
};

export const RoleAlertForDanger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-danger'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('alert'));
  },
};

export const RoleAlertForWarning: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-warning'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('role')).toBe('alert'));
  },
};

export const RendersTitleAndMessage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const title = item.querySelector('.title') as HTMLElement;
      const description = item.querySelector('.description') as HTMLElement;

      expect(title.textContent?.trim()).toBe('default');
      expect(description.textContent?.trim()).toBe('default body');
    });
  },
};

export const TitleOnlyOmitsDescription: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-title-only'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.title')).not.toBeNull();
      expect(item.querySelector('.description')).toBeNull();
    });
  },
};

export const MessageOnlyOmitsTitle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-message-only'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.title')).toBeNull();
      expect(item.querySelector('.description')).not.toBeNull();
    });
  },
};

export const RendersIntentDefaultIconForDanger: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-danger'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const icon = item.querySelector('.media org-icon') as HTMLElement;

      expect(icon.getAttribute('data-icon')).toBe('circle-x');
    });
  },
};

export const RendersIntentDefaultIconForSafe: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-safe'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const icon = item.querySelector('.media org-icon') as HTMLElement;

      expect(icon.getAttribute('data-icon')).toBe('circle-check');
    });
  },
};

export const ExplicitIconOverridesIntentDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-custom-icon'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const icon = item.querySelector('.media org-icon') as HTMLElement;

      expect(icon.getAttribute('data-icon')).toBe('sparkles');
    });
  },
};

export const RendersAvatarWhenAvatarUrlProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-avatar'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const img = item.querySelector('.media img.avatar') as HTMLImageElement;

      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
    });
  },
};

export const IconNotRenderedInMediaWhenAvatarProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-avatar'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.media img.avatar')).not.toBeNull();
      expect(item.querySelector('.media org-icon')).toBeNull();
    });
  },
};

export const RendersContentTemplateAndHidesTitleMessage: Story = {
  render: renderContentTemplateShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-content-template'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('[data-testid="content-template-body"]')).not.toBeNull();
      expect(item.querySelector('.title')).toBeNull();
      expect(item.querySelector('.description')).toBeNull();
    });
  },
};

export const RendersActionsTemplate: Story = {
  render: renderActionsTemplateShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-actions-template'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.actions [data-testid="action-button"]')).not.toBeNull();
    });
  },
};

export const RendersCloseButtonWhenCanClose: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.close')).not.toBeNull();
    });
  },
};

export const OmitsCloseButtonWhenCanCloseFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-no-close'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.close')).toBeNull();
    });
  },
};

export const RendersProgressBarWhenAutoCloseGreaterThanZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.progress')).not.toBeNull();
    });
  },
};

export const OmitsProgressBarWhenNoAutoClose: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-no-auto-close'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;

      expect(item.querySelector('.progress')).toBeNull();
    });
  },
};

export const CloseButtonHasDefaultAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => {
      const item = queryItem(host) as HTMLElement;
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
    });
  },
};

export const CloseButtonReflectsCustomAriaLabel: Story = {
  render: renderDirectShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = await canvas.findByTestId('item');

    await userEvent.click(canvas.getByTestId('ctl-close-aria-label-custom'));

    await waitFor(() => {
      const closeButton = item.querySelector('.close button') as HTMLButtonElement;

      expect(closeButton.getAttribute('aria-label')).toBe('Dismiss toast');
    });
  },
};

export const ClickingCloseStartsCloseFlow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;
    const closeButton = item.querySelector('.close button') as HTMLButtonElement;

    await userEvent.click(closeButton);

    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));
  },
};

export const AnimationEndCompletesCloseAndRemovesFromManager: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-default'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;
    const closeButton = item.querySelector('.close button') as HTMLButtonElement;

    await userEvent.click(closeButton);
    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'));

    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
    await expect(readout.textContent).toContain('closeRequestedCount=1');
  },
};

export const AutoCloseTimerRemovesNotification: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)?.getAttribute('data-state')).toBe('leaving'), { timeout: 2000 });

    const item = queryItem(host) as HTMLElement;

    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
  },
};

export const MouseEnterPausesAutoCloseTimer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;

    fireEvent.mouseEnter(item);

    // wait well past the 200ms auto-close; while hovered the timer must remain paused
    await new Promise((resolve) => setTimeout(resolve, 600));

    await expect(item.getAttribute('data-state')).toBeNull();
    await expect(readout.textContent).toContain('count=1');
  },
};

export const MouseLeaveResumesAutoCloseTimer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;

    fireEvent.mouseEnter(item);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fireEvent.mouseLeave(item);

    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'), { timeout: 2000 });

    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
  },
};

export const FocusInPausesAutoCloseTimer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;

    fireEvent.focusIn(item);

    await new Promise((resolve) => setTimeout(resolve, 600));

    await expect(item.getAttribute('data-state')).toBeNull();
    await expect(readout.textContent).toContain('count=1');
  },
};

export const FocusOutResumesAutoCloseTimer: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-add-short-auto-close'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;

    fireEvent.focusIn(item);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fireEvent.focusOut(item);

    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'), { timeout: 2000 });

    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
  },
};

export const ResetTimerOnHoverRestartsFullDurationOnLeave: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('notifications');
    const readout = await canvas.findByTestId('readout');

    // 300ms auto-close + resetTimerOnHover=true
    await userEvent.click(canvas.getByTestId('ctl-add-reset-on-hover'));

    await waitFor(() => expect(queryItem(host)).not.toBeNull());

    const item = queryItem(host) as HTMLElement;

    // pause near the end of the timer so without reset it would expire quickly after resume
    fireEvent.mouseEnter(item);
    await new Promise((resolve) => setTimeout(resolve, 250));
    fireEvent.mouseLeave(item);

    // with reset-on-hover the full 300ms restarts on leave, so the notification must still be present
    // 150ms after the resume (which would be ~50ms past expiry without the reset)
    await new Promise((resolve) => setTimeout(resolve, 150));

    await expect(item.getAttribute('data-state')).toBeNull();
    await expect(readout.textContent).toContain('count=1');

    // confirm the timer still fires after the fresh duration elapses
    await waitFor(() => expect(item.getAttribute('data-state')).toBe('leaving'), { timeout: 2000 });

    completeLeaveAnimation(item);

    await waitFor(() => expect(readout.textContent).toContain('count=0'));
  },
};
