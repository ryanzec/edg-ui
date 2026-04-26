import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  GlobalNotificationManager,
  GLOBAL_NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT,
  GLOBAL_NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT,
} from './global-notification-manager';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-global-notification-manager-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container title="Global Notification Manager" currentState="Interactive service API demo">
      <org-storybook-example-container-section label="Add Notifications">
        <div class="flex flex-wrap gap-2">
          <org-button color="info" size="sm" (click)="addInfo()">Add Info</org-button>
          <org-button color="safe" size="sm" (click)="addSuccess()">Add Success</org-button>
          <org-button color="warning" size="sm" (click)="addWarning()">Add Warning</org-button>
          <org-button color="danger" size="sm" (click)="addPermanent()">Add Permanent (no auto-close)</org-button>
          <org-button color="neutral" size="sm" (click)="manager.clear()">Clear All</org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Current State">
        <div class="flex flex-col gap-1">
          <div class="text-sm"><strong>Count:</strong> {{ manager.notifications().length }}</div>
          @for (notification of manager.notifications(); track notification.id) {
            <div class="flex gap-2 text-sm items-center">
              <span
                ><strong>{{ notification.id.slice(0, 8) }}...</strong></span
              >
              <span>{{ notification.message }}</span>
              <span>(color: {{ notification.color ?? 'none' }}, canClose: {{ notification.canClose }})</span>
              <org-button color="danger" size="sm" (click)="manager.remove(notification.id)">Remove</org-button>
            </div>
          }
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Add Info / Success / Warning</strong>: auto-close after {{ defaultAutoCloseIn }}ms</li>
        <li><strong>Add Permanent</strong>: no auto-close, must be removed manually</li>
        <li><strong>Remove</strong>: immediately removes a single notification by id</li>
        <li><strong>Clear All</strong>: removes all notifications at once</li>
        <li><strong>Default animation duration</strong>: {{ defaultAnimationDuration }}s</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class GlobalNotificationManagerDemo {
  public readonly manager = inject(GlobalNotificationManager);
  public readonly defaultAutoCloseIn = GLOBAL_NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT;
  public readonly defaultAnimationDuration = GLOBAL_NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT;

  public addInfo(): void {
    this.manager.add({
      message: 'This is an info notification',
      color: 'info',
      canClose: true,
    });
  }

  public addSuccess(): void {
    this.manager.add({
      message: 'Operation completed successfully',
      color: 'safe',
      canClose: true,
    });
  }

  public addWarning(): void {
    this.manager.add({
      message: 'This is a warning notification',
      color: 'warning',
      canClose: true,
    });
  }

  public addPermanent(): void {
    this.manager.add({
      message: 'This notification requires manual dismissal',
      color: 'danger',
      canClose: false,
      autoCloseIn: 0,
    });
  }
}

const meta: Meta<GlobalNotificationManager> = {
  title: 'Core/Services/Global Notification Manager',
  component: GlobalNotificationManager,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## GlobalNotificationManager Service

  A signal-based service that manages the global notification queue. Consumers add, remove, update,
  and clear notifications; the \`GlobalNotifications\` component reads the queue reactively to render them.

  ### Features
  - Signal-based reactive state management
  - Add notifications with optional color, auto-close duration, and close button
  - Remove a single notification by id
  - Partially update an existing notification by id
  - Clear all notifications at once

  ### State Properties
  - **notifications**: computed list of all active \`GlobalNotificationData\` entries

  ### Methods
  - **add(notification)**: enqueue a new notification, returns the generated id
  - **remove(id)**: dequeue the notification with the given id
  - **update(id, updates)**: partially update the notification with the given id
  - **clear()**: dequeue all notifications

  ### Default Values
  - **animationDuration**: ${GLOBAL_NOTIFICATION_MANAGER_ANIMATION_DURATION_DEFAULT}s
  - **autoCloseIn**: ${GLOBAL_NOTIFICATION_MANAGER_AUTO_CLOSE_IN_DEFAULT}ms

  ### Usage Example
  \`\`\`typescript
  private readonly _notificationManager = inject(GlobalNotificationManager);

  showError(message: string): void {
    this._notificationManager.add({ message, color: 'danger', canClose: true });
  }
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<GlobalNotificationManager>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo of the GlobalNotificationManager service. Use buttons to add, remove, and clear notifications.',
      },
    },
  },
  render: () => ({
    template: `<story-global-notification-manager-demo />`,
    moduleMetadata: {
      imports: [GlobalNotificationManagerDemo],
    },
  }),
};
