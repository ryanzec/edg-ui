import type { Meta, StoryObj } from '@storybook/angular';
import { UserDeleteDialog, type UserDeleteData } from './user-delete-dialog';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../../core/button/button';
import { DialogController } from '../../core/dialog/dialog-controller';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'story-user-delete-dialog-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogController, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-button (click)="openDialog()">Open Delete Dialog</org-button>

      @if (lastAction()) {
        <div class="p-4 bg-secondary-background-subtle rounded-lg">
          <p class="text-sm font-medium">Last Action: {{ lastAction() }}</p>
          <p class="text-xs text-text-subtle mt-1">User: {{ lastUser()?.name }} (ID: {{ lastUser()?.id }})</p>
        </div>
      }

      <org-dialog-controller [dialogComponent]="UserDeleteDialogComponent" #dialogControllerComponent />
    </div>
  `,
  host: {},
})
export class UserDeleteDialogStory {
  protected readonly UserDeleteDialogComponent = UserDeleteDialog;
  protected readonly lastAction = signal<string>('');
  protected readonly lastUser = signal<UserDeleteData | null>(null);

  @ViewChild('dialogControllerComponent')
  public readonly dialogControllerComponent!: DialogController<UserDeleteDialog>;

  protected openDialog(): void {
    const dialogRef = this.dialogControllerComponent.openDialog({
      user: {
        id: '123',
        name: 'John Doe',
      },
      dialogController: this.dialogControllerComponent,
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
  imports: [DialogController, Button],
  template: `
    <div class="flex flex-col gap-4">
      <org-button (click)="openDialog()">Open Delete Dialog (Processing State)</org-button>

      @if (lastAction()) {
        <div class="p-4 bg-secondary-background-subtle rounded-lg">
          <p class="text-sm font-medium">Last Action: {{ lastAction() }}</p>
          <p class="text-xs text-text-subtle mt-1">User: {{ lastUser()?.name }} (ID: {{ lastUser()?.id }})</p>
        </div>
      }

      <org-dialog-controller [dialogComponent]="UserDeleteDialogComponent" #dialogControllerComponent />
    </div>
  `,
  host: {},
})
export class UserDeleteDialogStoryProcessing {
  protected readonly UserDeleteDialogComponent = UserDeleteDialog;
  protected readonly lastAction = signal<string>('');
  protected readonly lastUser = signal<UserDeleteData | null>(null);

  @ViewChild('dialogControllerComponent')
  public readonly dialogControllerComponent!: DialogController<UserDeleteDialog>;

  protected openDialog(): void {
    const dialogRef = this.dialogControllerComponent.openDialog({
      user: {
        id: '456',
        name: 'Jane Smith',
      },
      dialogController: this.dialogControllerComponent,
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

  A confirmation dialog component for deleting users. This component follows the DIALOG_DATA pattern and provides a safe way to confirm user deletion with proper processing state management.

  ### Features
  - Displays user name in confirmation message
  - Separate events for delete and cancel confirmation
  - Processing state support with loading indicator
  - Disables buttons and escape key during processing
  - Dialog remains open until explicitly closed by caller
  - Danger button styling for delete action

  ### Usage Example
  \`\`\`typescript
  const dialogRef = this.dialogController.openDialog({
    user: { id: '123', name: 'John Doe' },
    isProcessing: false,
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
      <org-storybook-example-container
        title="User Delete Dialog - States"
        currentState="Comparing different dialog states"
      >
        <org-storybook-example-container-section label="Default State">
          <story-user-delete-dialog-story />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Processing State">
          <story-user-delete-dialog-story-processing />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Default State</strong>: Both buttons enabled, escape key enabled</li>
          <li><strong>Processing State</strong>: Both buttons disabled, delete shows loading, escape disabled</li>
          <li><strong>User Name</strong>: Displayed in confirmation message</li>
          <li><strong>Event Tracking</strong>: Last action and user data displayed below buttons</li>
          <li><strong>Console Logging</strong>: Check console for event details</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        UserDeleteDialogStory,
        UserDeleteDialogStoryProcessing,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};
