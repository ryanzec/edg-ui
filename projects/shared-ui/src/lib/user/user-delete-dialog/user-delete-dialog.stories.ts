import type { Meta, StoryObj } from '@storybook/angular';
import { UserDeleteDialog, type UserDeleteData } from './user-delete-dialog';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Button } from '../../core/button/button';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'story-user-delete-dialog-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserDeleteDialog, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-button label="Open Delete Dialog" (click)="openDialog()" />

      @if (lastAction()) {
        <div class="p-4 bg-secondary-soft rounded-lg">
          <p class="text-sm font-medium">Last Action: {{ lastAction() }}</p>
          <p class="text-xs text-muted mt-1">User: {{ lastUser()?.name }} (ID: {{ lastUser()?.id }})</p>
        </div>
      }

      <org-user-delete-dialog #userDeleteDialog />
    </div>
  `,
  host: {},
})
export class UserDeleteDialogStory {
  protected readonly lastAction = signal<string>('');
  protected readonly lastUser = signal<UserDeleteData | null>(null);

  @ViewChild('userDeleteDialog')
  public readonly userDeleteDialog!: UserDeleteDialog;

  protected openDialog(): void {
    const dialogRef = this.userDeleteDialog.openDialog({
      user: {
        id: '123',
        name: 'John Doe',
      },
    });

    if (!dialogRef) {
      return;
    }

    dialogRef.componentInstance?.deleteConfirmed.subscribe((user: UserDeleteData) => {
      this.lastAction.set('Delete Confirmed');
      this.lastUser.set(user);
      console.log('Delete confirmed for user:', user);
    });

    dialogRef.componentInstance?.cancelConfirmed.subscribe((user: UserDeleteData) => {
      this.lastAction.set('Cancel Confirmed');
      this.lastUser.set(user);
      console.log('Cancel confirmed for user:', user);
      dialogRef.close();
    });
  }
}

@Component({
  selector: 'story-user-delete-dialog-story-processing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserDeleteDialog, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-button label="Open Delete Dialog (Processing State)" (click)="openDialog()" />

      @if (lastAction()) {
        <div class="p-4 bg-secondary-soft rounded-lg">
          <p class="text-sm font-medium">Last Action: {{ lastAction() }}</p>
          <p class="text-xs text-muted mt-1">User: {{ lastUser()?.name }} (ID: {{ lastUser()?.id }})</p>
        </div>
      }

      <org-user-delete-dialog #userDeleteDialog />
    </div>
  `,
  host: {},
})
export class UserDeleteDialogStoryProcessing {
  protected readonly lastAction = signal<string>('');
  protected readonly lastUser = signal<UserDeleteData | null>(null);

  @ViewChild('userDeleteDialog')
  public readonly userDeleteDialog!: UserDeleteDialog;

  protected openDialog(): void {
    const dialogRef = this.userDeleteDialog.openDialog({
      user: {
        id: '456',
        name: 'Jane Smith',
      },
    });

    if (!dialogRef) {
      return;
    }

    dialogRef.componentInstance?.deleteConfirmed.subscribe((user: UserDeleteData) => {
      this.lastAction.set('Delete Confirmed');
      this.lastUser.set(user);
      console.log('Delete confirmed for user:', user);
      console.log('Simulating processing...');

      requestAnimationFrame(() => {
        dialogRef.componentInstance?.setProcessing(true);

        setTimeout(() => {
          dialogRef.componentInstance?.setProcessing(false);
          console.log('Processing complete!');
          dialogRef.close();
        }, 2000);
      });
    });

    dialogRef.componentInstance?.cancelConfirmed.subscribe((user: UserDeleteData) => {
      this.lastAction.set('Cancel Confirmed');
      this.lastUser.set(user);
      console.log('Cancel confirmed for user:', user);
      dialogRef.close();
    });
  }
}

const meta: Meta<UserDeleteDialog> = {
  title: 'User/Components/User Delete Dialog',
  component: UserDeleteDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## User Delete Dialog

  A confirmation dialog component for deleting users. The component applies \`DialogBrainDirective\` as a host directive and exposes \`openDialog()\` / \`closeDialog()\` directly — consumers render \`<org-user-delete-dialog>\` and call \`openDialog()\` on a \`@ViewChild\` reference, no separate dialog controller required.

  ### Features
  - Displays user name in confirmation message
  - Separate events for delete and cancel confirmation
  - Processing state support with loading indicator
  - Disables buttons and escape key during processing
  - Dialog remains open until explicitly closed by caller
  - Danger button styling for delete action

  ### Usage Example
  \`\`\`typescript
  const dialogRef = this.userDeleteDialog.openDialog({
    user: { id: '123', name: 'John Doe' },
  });

  dialogRef.componentInstance?.deleteConfirmed.subscribe((user) => {
    // Handle delete confirmation
    // Dialog stays open - close when ready
    dialogRef.close();
  });

  dialogRef.componentInstance?.cancelConfirmed.subscribe((user) => {
    // Handle cancel
    dialogRef.close();
  });
  \`\`\`

  ### Key Behaviors
  - **Delete Button**: Danger colored, shows loading spinner when processing
  - **Cancel Button**: Neutral colored, disabled when processing
  - **Escape Key**: Disabled when processing for safety
  - **Events**: Emit user data (id and name) for tracking
  - **Dialog Control**: Caller is responsible for closing the dialog
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<UserDeleteDialog>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default user delete dialog. Click a button to see the corresponding event fire. The dialog remains open - caller controls closing.',
      },
    },
  },
  render: () => ({
    template: `<story-user-delete-dialog-story />`,
    moduleMetadata: {
      imports: [UserDeleteDialogStory],
    },
  }),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different dialog states: default (ready) and processing.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="User Delete Dialog - States" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Default State</div>
            <story-user-delete-dialog-story />
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Processing State</div>
            <story-user-delete-dialog-story-processing />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Default State</strong>: Both buttons enabled, escape key enabled</li>
          <li><strong>Processing State</strong>: Both buttons disabled, delete shows loading, escape disabled</li>
          <li><strong>User Name</strong>: Displayed in confirmation message</li>
          <li><strong>Event Tracking</strong>: Last action and user data displayed below buttons</li>
          <li><strong>Console Logging</strong>: Check console for event details</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        UserDeleteDialogStory,
        UserDeleteDialogStoryProcessing,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
