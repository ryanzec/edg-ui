import { type Meta, type StoryObj } from '@storybook/angular';
import { Component, ViewChild, signal } from '@angular/core';
import { UserFormDialog } from './user-form-dialog';
import { type User } from '@organization/shared-utils';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Button } from '../../core/button/button';
import { type UserFormData } from '../user-form/user-form';

const meta: Meta<UserFormDialog> = {
  title: 'User/Components/User Form Dialog',
  component: UserFormDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## User Form Dialog Component

  A dialog wrapper component for the UserForm that provides a consistent dialog interface for creating and editing users. The component applies \`DialogBrainDirective\` as a host directive, so consumers render \`<org-user-form-dialog>\` directly in their template and call \`openDialog()\` on a \`@ViewChild\` reference — no separate dialog controller is needed.

  ### Features
  - Wraps the UserForm component in a Dialog container
  - Dynamic dialog title based on whether editing or creating
  - Proxies form submission events to parent
  - Supports all UserForm inputs and outputs
  - Processing state management via public setProcessing method
  - Integrates with Angular CDK Dialog system
  - Accessible dialog with proper focus management

  ### Dialog Titles
  - **Create User**: Shown when no existing user is provided
  - **Edit User**: Shown when editing an existing user

  ### Usage Examples
  \`\`\`typescript
  import { UserFormDialog } from '@organization/shared-ui';

  @Component({
    template: \`
      <org-button label="Create User" (click)="openUserDialog()" />
      <org-user-form-dialog #userFormDialog />
    \`,
    imports: [Button, UserFormDialog]
  })
  export class MyComponent {
    @ViewChild('userFormDialog')
    public userFormDialog!: UserFormDialog;

    openUserDialog() {
      this.userFormDialog.openDialog({ existingUser: null });
    }
  }
  \`\`\`

  ### Dialog Data Structure
  \`\`\`typescript
  type UserFormDialogData = {
    existingUser?: User | null;
    hasRoundedCorners?: boolean;
  };
  \`\`\`

  ### Public Methods
  - **openDialog(data)**: Opens the dialog with the supplied data, returns the cdk \`DialogRef\`
  - **closeDialog()**: Programmatically closes the open dialog
  - **setProcessing(isProcessing: boolean)**: Sets the processing state of the dialog form (also gates the escape key)

  ### Events
  - **formSubmitted**: Emitted when the form is successfully submitted (emits \`UserFormData\`)
  - **closed**: Emitted whenever the dialog is closed by any means

  ### Notes
  - The dialog does not automatically close on form submission - parent component is responsible for closing
  - Use setProcessing(true) when making API calls to prevent duplicate submissions
  - When processing, both escape key and backdrop clicks are disabled to prevent accidental closure
  - Click outside dialog is disabled by default to prevent accidental closure
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<UserFormDialog>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default dialog for creating a new user. Click the button to open the dialog.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-dialog-default-story></story-user-form-dialog-default-story>',
    moduleMetadata: {
      imports: [UserFormDialogDefaultStory],
    },
  }),
};

export const CreateAndEditUser: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of dialogs for creating a new user vs editing an existing user.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Create vs Edit User Dialog" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Create New User Dialog</div>
            <story-user-form-dialog-create-story />
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Edit Existing User Dialog</div>
            <story-user-form-dialog-edit-story />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Create Dialog</strong>: Shows "Create User" title with empty form</li>
          <li><strong>Edit Dialog</strong>: Shows "Edit User" title with pre-populated form data</li>
          <li>Dialog does not close automatically on submission</li>
          <li>Click outside dialog is disabled to prevent accidental closure</li>
          <li>Form validation and submission work the same as standalone UserForm</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        UserFormDialogCreateStory,
        UserFormDialogEditStory,
      ],
    },
  }),
};

export const WithEventLogging: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing how form submission events are proxied through the dialog. Open the dialog, fill out the form, and submit to see events logged.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-dialog-interactive-story></story-user-form-dialog-interactive-story>',
    moduleMetadata: {
      imports: [UserFormDialogInteractiveStory],
    },
  }),
};

export const ProcessingStateManagement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example demonstrating processing state management. Open the dialog and submit the form to see it enter processing state for 2 seconds, simulating an API call. During processing, the form is disabled, and escape key/backdrop clicks are prevented to avoid accidental closure.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-dialog-processing-state-story></story-user-form-dialog-processing-state-story>',
    moduleMetadata: {
      imports: [UserFormDialogProcessingStateStory],
    },
  }),
};

@Component({
  selector: 'story-user-form-dialog-default-story',
  template: `
    <org-button label="Open Create User Dialog" (click)="openDialog()" />
    <org-user-form-dialog #userFormDialog />
  `,
  imports: [Button, UserFormDialog],
})
class UserFormDialogDefaultStory {
  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  protected openDialog(): void {
    this.userFormDialog.openDialog({
      existingUser: null,
      hasRoundedCorners: true,
    });
  }
}

@Component({
  selector: 'story-user-form-dialog-create-story',
  template: `
    <org-button label="Open Create User Dialog" (click)="openDialog()" />
    <org-user-form-dialog #userFormDialog />
  `,
  imports: [Button, UserFormDialog],
})
class UserFormDialogCreateStory {
  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  protected openDialog(): void {
    this.userFormDialog.openDialog({
      existingUser: null,
      hasRoundedCorners: true,
    });
  }
}

@Component({
  selector: 'story-user-form-dialog-edit-story',
  template: `
    <org-button label="Open Edit User Dialog" (click)="openDialog()" />
    <org-user-form-dialog #userFormDialog />
  `,
  imports: [Button, UserFormDialog],
})
class UserFormDialogEditStory {
  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  protected existingUser: User = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: ['user', 'admin'],
    permissions: ['read', 'write'],
    requirePasswordChange: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    deletedAt: null,
  };

  protected openDialog(): void {
    this.userFormDialog.openDialog({
      existingUser: this.existingUser,
      hasRoundedCorners: true,
    });
  }
}

@Component({
  selector: 'story-user-form-dialog-interactive-story',
  template: `
    <div class="flex flex-col gap-1.5 p-1 max-w-base">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-xl font-semibold">Interactive User Form Dialog</h3>
        <div class="text-sm text-muted">
          Open the dialog, fill out the form, and submit. Check the browser console to see the formSubmitted event.
        </div>
      </div>

      <org-button label="Open Create User Dialog" (click)="openCreateDialog()" />
      <org-button label="Open Edit User Dialog" (click)="openEditDialog()" />

      <div class="flex flex-col gap-0.5 p-0.75 bg-info-soft rounded text-sm">
        <div class="font-medium">Note:</div>
        <div>
          The formSubmitted event is logged to the browser console. In a real application, the parent component would
          listen to this event and handle the submission (e.g., make an API call, close the dialog, show a success
          message).
        </div>
      </div>

      <org-user-form-dialog #userFormDialog />
    </div>
  `,
  imports: [Button, UserFormDialog],
})
class UserFormDialogInteractiveStory {
  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  protected existingUser: User = {
    id: 'user-456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    roles: ['user'],
    permissions: ['read'],
    requirePasswordChange: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    deletedAt: null,
  };

  protected openCreateDialog(): void {
    this.userFormDialog.openDialog({
      existingUser: null,
      hasRoundedCorners: true,
    });
  }

  protected openEditDialog(): void {
    this.userFormDialog.openDialog({
      existingUser: this.existingUser,
      hasRoundedCorners: true,
    });
  }
}

@Component({
  selector: 'story-user-form-dialog-processing-state-story',
  template: `
    <div class="flex flex-col gap-1.5 p-1 max-w-base">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-xl font-semibold">Processing State Management</h3>
        <div class="text-sm text-muted">
          Open the dialog and submit the form to see it enter processing state for 2 seconds, simulating an API call.
          The form will be disabled and escape key/backdrop clicks prevented during processing.
        </div>
      </div>

      <org-button label="Open Create User Dialog" (click)="openDialog()" />

      <div class="flex flex-col gap-0.5">
        <h4 class="font-medium">
          Current State: <span class="font-mono">{{ isProcessing() ? 'Processing' : 'Idle' }}</span>
        </h4>
        <div class="text-sm text-muted">
          @if (isProcessing()) {
            Dialog form is locked during processing...
          } @else {
            Dialog form is ready for input
          }
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <h4 class="font-medium">Event Log:</h4>
        <div class="p-0.75 bg-secondary-soft rounded text-sm font-mono max-h-48 overflow-y-auto">
          @for (event of events(); track $index) {
            <div class="mb-0.5">
              <div class="font-bold text-primary">{{ event.timestamp }} - {{ event.status }}</div>
              <div class="text-muted">Name: {{ event.firstName }} {{ event.lastName }}</div>
              <div class="text-muted">Email: {{ event.email }}</div>
              <div class="text-muted">Roles: {{ event.roles.join(', ') }}</div>
              <div class="text-muted">Permissions: {{ event.permissions.join(', ') }}</div>
            </div>
          }
          @if (events().length === 0) {
            <div class="text-muted">No form submissions yet. Open the dialog and submit the form.</div>
          }
        </div>
      </div>

      <org-user-form-dialog #userFormDialog (closed)="onDialogClosed()" />
    </div>
  `,
  imports: [Button, UserFormDialog],
})
class UserFormDialogProcessingStateStory {
  @ViewChild('userFormDialog')
  public userFormDialog!: UserFormDialog;

  protected isProcessing = signal<boolean>(false);
  protected events = signal<
    {
      timestamp: string;
      status: string;
      firstName: string;
      lastName: string;
      email: string;
      roles: string[];
      permissions: string[];
    }[]
  >([]);

  protected openDialog(): void {
    const dialogRef = this.userFormDialog.openDialog({
      existingUser: null,
      hasRoundedCorners: true,
    });

    if (!dialogRef || !dialogRef.componentInstance) {
      return;
    }

    const componentInstance = dialogRef.componentInstance as UserFormDialog;

    componentInstance.formSubmitted.subscribe((data: UserFormData) => {
      this.onFormSubmit(data, componentInstance);
    });
  }

  protected onDialogClosed(): void {
    this.isProcessing.set(false);
  }

  protected onFormSubmit(data: UserFormData, componentInstance: UserFormDialog): void {
    const timestamp = new Date().toLocaleTimeString();

    this.events.update((events) => [
      {
        timestamp,
        status: 'Submitted',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      },
      ...events.slice(0, 9),
    ]);

    this.isProcessing.set(true);
    componentInstance.setProcessing(true);

    setTimeout(() => {
      const completeTimestamp = new Date().toLocaleTimeString();

      this.events.update((events) => [
        {
          timestamp: completeTimestamp,
          status: 'Completed',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles,
          permissions: data.permissions,
        },
        ...events.slice(0, 9),
      ]);

      this.isProcessing.set(false);
      componentInstance.setProcessing(false);
      this.userFormDialog.closeDialog();
    }, 2000);
  }
}
