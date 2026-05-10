import type { Meta, StoryObj } from '@storybook/angular';
import {
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  TemplateRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Notifications, NotificationsPosition, allNotificationsPositions } from './notifications';
import { NotificationManager } from '../notification-manager/notification-manager';
import { Button } from '../button/button';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Link } from '../link/link';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { allComponentColors, ComponentColor } from '../types/component-types';

type LiveDemoIconChoice = 'intent-default' | 'custom';
type LiveDemoAutoCloseChoice = 'none' | '2s' | '5s';

const liveDemoPositionItems: ButtonToggleItem[] = allNotificationsPositions.map((position) => ({
  label: position,
  value: position,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoIconItems: ButtonToggleItem[] = [
  { label: 'intent-default', value: 'intent-default', buttonColor: 'primary' },
  { label: 'custom (sparkles)', value: 'custom', buttonColor: 'primary' },
];

const liveDemoAutoCloseItems: ButtonToggleItem[] = [
  { label: 'none', value: 'none', buttonColor: 'primary' },
  { label: '2s', value: '2s', buttonColor: 'primary' },
  { label: '5s', value: '5s', buttonColor: 'primary' },
];

@Component({
  selector: 'story-notifications-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button],
  template: `
    <div class="flex flex-col gap-2">
      <org-button color="primary" label="Push notification" (click)="push()" />
      <org-notifications [position]="position()" />
    </div>
  `,
})
class NotificationsDefaultStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  public position = input<NotificationsPosition>('top-right');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected push(): void {
    this._manager.add({
      title: 'Backup complete',
      message: 'Your last 24 hours of work is safe.',
      color: 'info',
      canClose: true,
      autoCloseIn: 5000,
    });
  }
}

const meta: Meta<Notifications> = {
  title: 'Core/Components/Notifications',
  component: Notifications,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Notifications Component

  A fixed corner stack that hosts one or more toast notifications. Each toast has a left intent rail, leading icon or avatar, title, optional description, optional action buttons, a close button, and an optional countdown progress bar.

  ### Features
  - **One look only**: subtle surface with a left intent rail + tinted leading glyph
  - **One size only**: variation is via \`[data-color]\` (intent) and \`[position]\` (stack location)
  - **Pause-on-hover / focus**: hovering or focusing a toast pauses its auto-close timer; \`resetTimerOnHover\` restarts it
  - **Progress bar**: countdown progress is rendered when \`autoCloseIn\` is set
  - **Avatar variant**: pass \`avatarUrl\` to swap the leading icon for a circular avatar
  - **Custom content**: pass a \`contentTemplate\` to render arbitrary body content
  - **Action row**: pass an \`actionsTemplate\` for buttons / links below the description
  - **Reduced-motion**: enter / leave animations collapse to 1ms under \`prefers-reduced-motion: reduce\`

  ### Position Options
  - \`top-left\`, \`top-center\`, \`top-right\` (default: \`top-right\`)
  - \`bottom-left\`, \`bottom-center\`, \`bottom-right\` (newest sits at the bottom edge, older toasts float up)

  ### Color (intent) Options
  - **info**, **safe**, **caution**, **warning**, **danger**, **primary**, **secondary**, **neutral**

  ### Usage Examples
  \`\`\`html
  <!-- Basic usage -->
  <org-notifications />

  <!-- Positioned at bottom-right -->
  <org-notifications position="bottom-right" />
  \`\`\`

  \`\`\`ts
  this.notificationManager.add({
    title: 'Backup complete',
    message: 'Your last 24h is safe.',
    color: 'safe',
    canClose: true,
    autoCloseIn: 5000,
  });
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Notifications>;

export const Default: Story = {
  args: {
    position: 'top-right',
  },
  argTypes: {
    position: {
      control: 'select',
      options: allNotificationsPositions,
      description: 'Stack position of the notification container',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default notification stack with full controls. Click the button to push a sample notification.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<story-notifications-default [position]="position" />`,
    moduleMetadata: {
      imports: [NotificationsDefaultStory],
    },
  }),
};

@Component({
  selector: 'story-notifications-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Notifications,
    Button,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        align-items: flex-start;
        justify-content: flex-start;
        min-height: 18rem; /* 288px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Push a notification with the configured options. Hover the toast to see the pause-on-hover and progress-bar behaviour in action."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Position">
            <org-button-toggle [items]="positionItems" formControlName="position" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color (intent)">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon">
            <org-button-toggle [items]="iconItems" formControlName="icon" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Auto-close">
            <org-button-toggle [items]="autoCloseItems" formControlName="autoClose" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Avatar">
            <org-checkbox-toggle name="live-demo-avatar" value="avatar" formControlName="useAvatar">
              {{ liveDemoForm.controls.useAvatar.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Can close">
            <org-checkbox-toggle name="live-demo-can-close" value="can-close" formControlName="canClose">
              {{ liveDemoForm.controls.canClose.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Reset timer on hover">
            <org-checkbox-toggle
              name="live-demo-reset-timer"
              value="reset-timer"
              formControlName="resetTimerOnHover"
            >
              {{ liveDemoForm.controls.resetTimerOnHover.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="flex gap-2">
              <org-button color="primary" label="Push notification" (click)="push()" />
              <org-button color="neutral" label="Clear all" (click)="clear()" />
            </div>
            <org-notifications [position]="liveDemoForm.controls.position.value" />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class NotificationsLiveDemoStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  protected readonly positionItems = liveDemoPositionItems;
  protected readonly colorItems = liveDemoColorItems;
  protected readonly iconItems = liveDemoIconItems;
  protected readonly autoCloseItems = liveDemoAutoCloseItems;

  protected readonly liveDemoForm = new FormGroup({
    position: new FormControl<NotificationsPosition>('top-right', { nonNullable: true }),
    color: new FormControl<ComponentColor>('info', { nonNullable: true }),
    icon: new FormControl<LiveDemoIconChoice>('intent-default', { nonNullable: true }),
    autoClose: new FormControl<LiveDemoAutoCloseChoice>('5s', { nonNullable: true }),
    useAvatar: new FormControl<boolean>(false, { nonNullable: true }),
    canClose: new FormControl<boolean>(true, { nonNullable: true }),
    resetTimerOnHover: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected push(): void {
    const form = this.liveDemoForm.value;
    const autoCloseIn = form.autoClose === '2s' ? 2000 : form.autoClose === '5s' ? 5000 : 0;

    this._manager.add({
      title: 'Backup complete',
      message: 'Your last 24 hours of work is safe.',
      color: form.color,
      icon: form.icon === 'custom' ? 'sparkles' : undefined,
      avatarUrl: form.useAvatar ? 'https://i.pravatar.cc/64?img=12' : undefined,
      canClose: form.canClose ?? true,
      autoCloseIn,
      resetTimerOnHover: form.resetTimerOnHover ?? false,
    });
  }

  protected clear(): void {
    this._manager.clear();
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every input on the notification (position, intent color, leading icon / avatar, auto-close, manual close, reset-timer-on-hover) then push toasts to observe behaviour.',
      },
    },
  },
  render: () => ({
    template: `<story-notifications-live-demo />`,
    moduleMetadata: {
      imports: [NotificationsLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-notifications-intents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button],
  template: `
    <div class="flex flex-wrap gap-2">
      <org-button color="info" label="Info" (click)="push('info')" />
      <org-button color="safe" label="Safe" (click)="push('safe')" />
      <org-button color="caution" label="Caution" (click)="push('caution')" />
      <org-button color="warning" label="Warning" (click)="push('warning')" />
      <org-button color="danger" label="Danger" (click)="push('danger')" />
      <org-button color="primary" label="Primary" (click)="push('primary')" />
      <org-button color="secondary" label="Secondary" (click)="push('secondary')" />
      <org-button color="neutral" label="Neutral" (click)="push('neutral')" />
      <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
    </div>
    <org-notifications position="top-right" />
  `,
})
class NotificationsIntentsStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  private readonly _titlesByColor: Record<ComponentColor, string> = {
    info: 'New version available',
    safe: 'Changes saved',
    caution: 'Trial ends in 3 days',
    warning: 'High API usage',
    danger: 'Backup failed',
    primary: 'Workspace upgraded',
    secondary: 'Settings updated',
    neutral: 'Settings updated',
  };

  private readonly _messagesByColor: Record<ComponentColor, string> = {
    info: 'Version 1.4 is rolling out across your workspace this week.',
    safe: 'Mobile redesign was published 2 minutes ago.',
    caution: 'Add a payment method to keep your workspace active.',
    warning: "You're at 92% of this hour's request budget.",
    danger: "We couldn't reach the connector. Try again or open the status page.",
    primary: 'Your Pro features are live for everyone in Org.',
    secondary: 'SAML SSO is now required for all members.',
    neutral: 'SAML SSO is now required for all members.',
  };

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected push(color: ComponentColor): void {
    this._manager.add({
      title: this._titlesByColor[color],
      message: this._messagesByColor[color],
      color,
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected clear(): void {
    this._manager.clear();
  }
}

@Component({
  selector: 'story-notifications-composition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button, Link, TypedContextDirective],
  template: `
    <ng-template [orgTypedContext]="idType" #linkBody let-id>
      Sync failed. <org-link (clicked)="dismiss(id)">Open status page</org-link> for details.
    </ng-template>

    <ng-template [orgTypedContext]="idType" #cautionActions let-id>
      <org-button color="primary" variant="soft" size="sm" label="Add card" (click)="dismiss(id)" />
      <org-button color="neutral" variant="text" size="sm" label="Remind later" (click)="dismiss(id)" />
    </ng-template>

    <ng-template [orgTypedContext]="idType" #mentionActions let-id>
      <org-button color="primary" variant="soft" size="sm" label="Reply" (click)="dismiss(id)" />
    </ng-template>

    <div class="flex flex-wrap gap-2">
      <org-button color="safe" label="Title only" (click)="titleOnly()" />
      <org-button color="info" label="Title + description" (click)="titleAndDescription()" />
      <org-button color="caution" label="With actions" (click)="withActions()" />
      <org-button color="danger" label="Inline link in body" (click)="inlineLink()" />
      <org-button color="primary" label="Avatar (mention)" (click)="avatarMention()" />
      <org-button color="neutral" label="No close · auto-dismiss" (click)="autoDismissOnly()" />
      <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
    </div>
    <org-notifications position="top-right" />
  `,
})
class NotificationsCompositionStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  protected readonly idType: string[] = [];

  protected readonly linkBodyRef = viewChild.required<TemplateRef<{ $implicit: string }>>('linkBody');
  protected readonly cautionActionsRef = viewChild.required<TemplateRef<{ $implicit: string }>>('cautionActions');
  protected readonly mentionActionsRef = viewChild.required<TemplateRef<{ $implicit: string }>>('mentionActions');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected titleOnly(): void {
    this._manager.add({ title: 'Changes saved', color: 'safe', canClose: true, autoCloseIn: 0 });
  }

  protected titleAndDescription(): void {
    this._manager.add({
      title: 'New version available',
      message: 'Version 1.4 is rolling out across your workspace this week.',
      color: 'info',
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected withActions(): void {
    this._manager.add({
      title: 'Trial ends in 3 days',
      message: 'Add a payment method to keep your workspace active.',
      color: 'caution',
      actionsTemplate: this.cautionActionsRef(),
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected inlineLink(): void {
    this._manager.add({
      title: 'Sync failed',
      contentTemplate: this.linkBodyRef(),
      color: 'danger',
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected avatarMention(): void {
    this._manager.add({
      title: 'Sam Park mentioned you',
      message: `"let's land this before Friday"`,
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
      color: 'primary',
      actionsTemplate: this.mentionActionsRef(),
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected autoDismissOnly(): void {
    this._manager.add({
      title: 'High API usage',
      message: "You're at 92% of this hour's request budget.",
      color: 'warning',
      canClose: false,
      autoCloseIn: 5000,
    });
  }

  protected dismiss(id: string): void {
    this._manager.remove(id);
  }

  protected clear(): void {
    this._manager.clear();
  }
}

@Component({
  selector: 'story-notifications-positions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button, ButtonToggle],
  styles: [
    `
      :host {
        display: block;
      }
      .positions-stage {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        align-items: flex-start;
        min-height: 20rem; /* 320px */
      }
    `,
  ],
  template: `
    <div class="positions-stage">
      <div class="flex gap-2 items-center">
        <span class="text-sm font-medium">Position:</span>
        <org-button-toggle [items]="positionItems" [value]="currentPosition()" (changed)="changePosition($event)" buttonSize="sm" />
      </div>
      <div class="flex gap-2">
        <org-button color="info" label="Push info" (click)="push('info')" />
        <org-button color="safe" label="Push safe" (click)="push('safe')" />
        <org-button color="warning" label="Push warning" (click)="push('warning')" />
        <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
      </div>
      <org-notifications [position]="currentPosition()" />
    </div>
  `,
})
class NotificationsPositionsStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  protected readonly positionItems = liveDemoPositionItems;

  protected readonly currentPosition = signal<NotificationsPosition>('top-right');

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected changePosition(position: string): void {
    this.currentPosition.set(position as NotificationsPosition);
  }

  protected push(color: ComponentColor): void {
    this._manager.add({
      title: color.charAt(0).toUpperCase() + color.slice(1) + ' notification',
      message: 'Position: ' + this.currentPosition(),
      color,
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected clear(): void {
    this._manager.clear();
  }
}

@Component({
  selector: 'story-notifications-auto-close',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button],
  template: `
    <div class="flex flex-wrap gap-2">
      <org-button color="info" label="Auto-close 2s" (click)="autoClose(2000)" />
      <org-button color="safe" label="Auto-close 5s" (click)="autoClose(5000)" />
      <org-button color="warning" label="Auto-close 10s" (click)="autoClose(10000)" />
      <org-button color="danger" label="Manual close only" (click)="manualClose()" />
      <org-button color="neutral" label="No close button" (click)="noClose()" />
      <org-button color="primary" label="Reset timer on hover (5s)" (click)="resetOnHover()" />
      <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
    </div>
    <org-notifications position="top-right" />
  `,
})
class NotificationsAutoCloseStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected autoClose(autoCloseIn: number): void {
    this._manager.add({
      title: `Auto-close in ${autoCloseIn / 1000}s`,
      message: 'Hover this toast to pause the countdown; leave to resume.',
      color: 'info',
      canClose: true,
      autoCloseIn,
    });
  }

  protected manualClose(): void {
    this._manager.add({
      title: 'Manual close only',
      message: 'This notification stays until you close it.',
      color: 'danger',
      canClose: true,
      autoCloseIn: 0,
    });
  }

  protected noClose(): void {
    this._manager.add({
      title: 'No close button',
      message: 'Cannot be dismissed manually.',
      color: 'neutral',
      canClose: false,
      autoCloseIn: 0,
    });
  }

  protected resetOnHover(): void {
    this._manager.add({
      title: 'Reset timer on hover',
      message: 'Hovering restarts the full countdown when you leave.',
      color: 'primary',
      canClose: true,
      autoCloseIn: 5000,
      resetTimerOnHover: true,
    });
  }

  protected clear(): void {
    this._manager.clear();
  }
}

@Component({
  selector: 'story-notifications-update-dynamically',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button],
  template: `
    <div class="flex flex-wrap gap-2">
      <org-button
        color="info"
        label="Add persistent"
        [disabled]="!!notificationId()"
        (click)="addPersistent()"
      />
      <org-button
        color="safe"
        label="Update to closeable success"
        [disabled]="!notificationId()"
        (click)="updateToSuccess()"
      />
      <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
    </div>
    <org-notifications position="top-right" />
  `,
})
class NotificationsUpdateDynamicallyStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  protected readonly notificationId = signal<string | null>(null);

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected addPersistent(): void {
    const id = this._manager.add({
      title: 'Working…',
      message: 'This notification is persistent and cannot be closed.',
      color: 'info',
      canClose: false,
      autoCloseIn: 0,
    });

    this.notificationId.set(id);
  }

  protected updateToSuccess(): void {
    const id = this.notificationId();

    if (!id) {
      return;
    }

    this._manager.update(id, {
      title: 'Done!',
      message: 'This notification is now a closeable success notification.',
      color: 'safe',
      canClose: true,
      autoCloseIn: 5000,
    });

    this.notificationId.set(null);
  }

  protected clear(): void {
    this.notificationId.set(null);
    this._manager.clear();
  }
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every notification axis — intents, body composition (title-only, title+description, with actions, inline link, avatar, no-close auto-dismiss), stack positions, auto-close behaviours, dynamic update, and accessibility contract — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Intents"
            description="Seven intents alias the shared semantic ramp. Surface, border, and type stay subtle across all of them; only the rail and leading glyph carry the color so a stack of mixed intents reads as a quiet column."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-notifications-intents />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>info</strong>: rolling-update style messaging</li>
            <li><strong>safe</strong>: success / saved state</li>
            <li><strong>caution</strong>: low-urgency warning (yellow)</li>
            <li><strong>warning</strong>: higher-urgency warning (orange) — uses <code>role="alert"</code></li>
            <li><strong>danger</strong>: destructive / error — uses <code>role="alert"</code></li>
            <li><strong>primary / secondary / neutral</strong>: brand / generic announcements</li>
            <li><strong>Surface / border / type</strong> stay subtle across every intent; only the rail and leading glyph carry the color</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Composition"
            description="Every slot is optional. Combinations cover the cases the team actually ships: title only, title + description, body + actions, avatar instead of icon, no close, with or without the auto-dismiss progress bar."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-notifications-composition />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Title only</strong>: pass only <code>title</code>; the description row is omitted</li>
            <li><strong>Title + description</strong>: pass <code>title</code> + <code>message</code></li>
            <li><strong>With actions</strong>: pass an <code>actionsTemplate</code> for inline buttons / links</li>
            <li><strong>Inline link in body</strong>: pass a <code>contentTemplate</code> for arbitrary body content with embedded <code>org-link</code></li>
            <li><strong>Avatar variant</strong>: pass <code>avatarUrl</code> to swap the leading icon for a circular avatar</li>
            <li><strong>No close · auto-dismiss</strong>: set <code>canClose: false</code> with a positive <code>autoCloseIn</code> to show the progress bar without a close button</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Positions"
            description="Pick a corner, push a toast onto the stack. Top-anchored stacks grow downward; bottom-anchored stacks grow upward."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-notifications-positions />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>top-left / top-center / top-right</strong>: newest toast sits at the top edge; older toasts float below it</li>
            <li><strong>bottom-left / bottom-center / bottom-right</strong>: newest toast sits at the bottom edge; older toasts float above it (column-reverse layout)</li>
            <li>The stack container is <strong>pointer-events transparent</strong> — empty stacks never block the page</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Auto-close behaviours"
            description="Auto-close timer with pause-on-hover, manual-only close, no close button, and reset-timer-on-hover."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-notifications-auto-close />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Auto-close</strong>: pass <code>autoCloseIn</code> in milliseconds; the progress bar ticks down accordingly</li>
            <li><strong>Pause on hover / focus</strong>: hovering or focusing a toast pauses its timer; leaving / blurring resumes from the captured remaining time</li>
            <li><strong>Reset timer on hover</strong>: set <code>resetTimerOnHover: true</code> so leaving the toast restarts the full countdown instead of resuming</li>
            <li><strong>Manual close only</strong>: set <code>autoCloseIn: 0</code></li>
            <li><strong>No close button</strong>: set <code>canClose: false</code></li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Update dynamically"
            description="NotificationManager.update() lets you mutate an existing notification in place — useful for long-running operations that resolve to a success / failure state."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-notifications-update-dynamically />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Add persistent</strong>: creates an info notification with <code>canClose: false</code> and no auto-close</li>
            <li><strong>Update to closeable success</strong>: applies a partial update — color → <code>safe</code>, <code>canClose: true</code>, <code>autoCloseIn: 5000</code></li>
            <li><strong>Button states</strong>: the add button disables once a notification exists; the update button enables only while one is active</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Accessibility"
            description="The stack container is a polite aria-live region; high-urgency intents (danger / warning) use role='alert' to interrupt screen-reader speech."
          />
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Live region</strong>: the stack container has <code>aria-live="polite"</code> and an <code>aria-label</code> input (default <code>"Notifications"</code>) so screen readers announce new toasts</li>
            <li><strong>Role mapping</strong>: <code>info / safe / caution / primary / secondary / neutral</code> use <code>role="status"</code>; <code>danger / warning</code> use <code>role="alert"</code> to interrupt assistive-tech speech for high-urgency intents</li>
            <li><strong>Close button</strong>: rendered with an <code>aria-label</code> (default <code>"Close notification"</code>); the icon is decorative</li>
            <li><strong>Reduced motion</strong>: under <code>prefers-reduced-motion: reduce</code> the enter / leave animations collapse to 1ms so the lifecycle stays intact while the visible motion is removed</li>
            <li><strong>Focus pause</strong>: focusing a toast (e.g. tabbing to the close button) pauses its auto-close timer so it doesn't disappear out from under the user</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        NotificationsIntentsStory,
        NotificationsCompositionStory,
        NotificationsPositionsStory,
        NotificationsAutoCloseStory,
        NotificationsUpdateDynamicallyStory,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-notifications-link-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Notifications, Button, Link, TypedContextDirective],
  template: `
    <ng-template [orgTypedContext]="notificationIdType" #linkContent let-notificationId>
      Your changes were not saved.
      <org-link (clicked)="onLinkClicked(notificationId)">Click here to retry</org-link>
    </ng-template>

    <div class="flex flex-wrap gap-2">
      <org-button color="info" label="Add notification with link" (click)="add()" />
      <org-button color="neutral" variant="ghost" label="Clear" (click)="clear()" />
    </div>

    <org-notifications position="top-right" />
  `,
})
class NotificationsLinkActionStory implements OnDestroy {
  private _manager = inject(NotificationManager);

  protected readonly linkContentRef = viewChild.required<TemplateRef<{ $implicit: string }>>('linkContent');

  /** sentinel array used purely for template-context type inference by `TypedContextDirective` */
  protected readonly notificationIdType: string[] = [];

  public ngOnDestroy(): void {
    this._manager.clear();
  }

  protected add(): void {
    this._manager.add({
      contentTemplate: this.linkContentRef(),
      color: 'info',
      canClose: false,
      autoCloseIn: 0,
    });
  }

  protected onLinkClicked(notificationId: string): void {
    console.log('link clicked, closing notification', notificationId);
    this._manager.remove(notificationId);
  }

  protected clear(): void {
    this._manager.clear();
  }
}

export const LinkAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Notification rendering an org-link inside its body via a contentTemplate; clicking the link logs to the console and dismisses the notification.',
      },
    },
  },
  render: () => ({
    template: `<story-notifications-link-action />`,
    moduleMetadata: {
      imports: [NotificationsLinkActionStory],
    },
  }),
};
