import { type Meta, type StoryObj } from '@storybook/angular';
import { AfterViewInit, Component, signal } from '@angular/core';
import { UserForm, type UserFormData } from './user-form';
import { type User } from '@organization/shared-utils';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const meta: Meta<UserForm> = {
  title: 'User/Components/User Form',
  component: UserForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## User Form Component

  A form component for creating and editing user information including name, email, and role assignments.

  ### Features
  - Name and email input fields
  - Role selection via checkboxes (Member and Admin)
  - Real-time validation with Angular Reactive Forms
  - Support for both creating new users and editing existing users
  - Preserves non-assignable roles when updating existing users
  - Error message display for all fields
  - Processing state support to disable form during submission
  - Accessible form controls

  ### Validation
  - **Name**: Required
  - **Email**: Required, must be valid email format
  - **Roles**: At least one role must be selected
  - **Member Role**: Always visible and readonly (disabled)
  - **Admin Role**: Can be toggled on/off

  ### Usage Examples
  \`\`\`html
  <!-- Create new user -->
  <org-user-form
    (formSubmitted)="onCreateUser($event)"
  />

  <!-- Edit existing user -->
  <org-user-form
    [existingUser]="user"
    (formSubmitted)="onUpdateUser($event)"
  />

  <!-- With processing state -->
  <org-user-form
    [isProcessing]="isSubmitting"
    (formSubmitted)="onCreateUser($event)"
  />
  \`\`\`

  \`\`\`typescript
  // In your component
  onCreateUser(formData: UserFormData) {
    console.log('Create user:', formData);
    // Call your API to create user
  }

  onUpdateUser(formData: UserFormData) {
    console.log('Update user:', formData);
    // Call your API to update user
  }
  \`\`\`

  ### Events
  - **formSubmitted**: Emitted when the form is successfully submitted with valid data (emits \`UserFormData\`)

  ### Form Structure
  The form uses Angular Reactive Forms with the following controls:
  - \`name\`: Text input with required validator
  - \`email\`: Email input with required and email validators
  - \`roles\`: Group of checkboxes for role selection
  - Both name and email fields validate on change and show errors when touched
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<UserForm>;

const formSubmitted = (formData: UserFormData) => {
  console.log('Form submitted:', formData);
};

export const Default: Story = {
  args: {
    existingUser: null,
    formSubmitted: formSubmitted,
  },
  argTypes: {
    formSubmitted: {
      action: 'formSubmitted',
      description: 'Emits when the form is successfully submitted with valid data',
    },
    existingUser: {
      control: 'object',
      description: 'Existing user data to populate the form for editing',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default user form for creating a new user. Try entering user information and submitting to see validation in action.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-user-form
        [existingUser]="existingUser"
        (formSubmitted)="formSubmitted($event)"
      ></org-user-form>
    `,
    moduleMetadata: {
      imports: [UserForm],
    },
  }),
};

export const WithExistingUser: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form populated with existing user data for editing. The Member role is disabled/readonly.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-with-existing-user-story></story-user-form-with-existing-user-story>',
    moduleMetadata: {
      imports: [UserFormWithExistingUserStory],
    },
  }),
};

export const ValidationStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different validation states: empty form with errors, invalid email, missing roles, and valid form ready to submit.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Validation States" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Empty Form (with errors shown)</div>
            <story-user-form-validation-empty-story />
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Invalid Email</div>
            <story-user-form-validation-invalid-story />
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">No Roles Selected</div>
            <story-user-form-validation-no-roles-story />
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Valid Form</div>
            <story-user-form-validation-valid-story />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
          <li><strong>Empty Form</strong>: Shows "required" errors when submitted without input</li>
          <li><strong>Invalid Email</strong>: Shows email format validation error</li>
          <li><strong>No Roles</strong>: Shows role selection validation error</li>
          <li><strong>Valid Form</strong>: No errors, ready to submit</li>
          <li>Validation triggers on submit to avoid interrupting user during typing</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        UserFormValidationEmptyStory,
        UserFormValidationInvalidStory,
        UserFormValidationNoRolesStory,
        UserFormValidationValidStory,
      ],
    },
  }),
};

export const WithNonAssignableRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Form with an existing user that has non-assignable roles (like internal_user). These roles are preserved when the form is submitted.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-with-non-assignable-roles-story></story-user-form-with-non-assignable-roles-story>',
    moduleMetadata: {
      imports: [UserFormWithNonAssignableRolesStory],
    },
  }),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example with event logging. Fill out the form and submit to see the emitted event data in the console and event log below.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-interactive-story></story-user-form-interactive-story>',
    moduleMetadata: {
      imports: [UserFormInteractiveStory],
    },
  }),
};

export const ProcessingState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Form in processing state. All inputs are disabled and the submit button shows a loading spinner. This prevents duplicate submissions while an API call is in progress.',
      },
    },
  },
  render: () => ({
    template: '<story-user-form-processing-state-story></story-user-form-processing-state-story>',
    moduleMetadata: {
      imports: [UserFormProcessingStateStory],
    },
  }),
};

export const ProcessingStateInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example demonstrating processing state management. Submit the form to see it enter processing state for 2 seconds, simulating an API call.',
      },
    },
  },
  render: () => ({
    template:
      '<story-user-form-processing-state-interactive-story></story-user-form-processing-state-interactive-story>',
    moduleMetadata: {
      imports: [UserFormProcessingStateInteractiveStory],
    },
  }),
};

@Component({
  selector: 'story-user-form-with-existing-user-story',
  template: `<org-user-form [existingUser]="existingUser" (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormWithExistingUserStory {
  public existingUser: User = {
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

  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }
}

@Component({
  selector: 'story-user-form-validation-empty-story',
  template: `<org-user-form (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormValidationEmptyStory implements AfterViewInit {
  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const userFormElement = document.querySelector('org-user-form-validation-empty-story org-user-form');

      if (userFormElement) {
        const userFormComponent = (window as any).ng.getComponent(userFormElement) as UserForm;

        userFormComponent.userForm.markAllAsTouched();
      }
    }, 100);
  }
}

@Component({
  selector: 'story-user-form-validation-invalid-story',
  template: `<org-user-form (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormValidationInvalidStory implements AfterViewInit {
  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const userFormElement = document.querySelector('org-user-form-validation-invalid-story org-user-form');

      if (userFormElement) {
        const userFormComponent = (window as any).ng.getComponent(userFormElement) as UserForm;

        userFormComponent.userForm.patchValue({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'invalid-email',
          roles: {
            user: true,
            admin: false,
            owner: false,
          },
          permissions: {
            read: false,
            write: false,
            delete: false,
            api: false,
          },
        });
        userFormComponent.userForm.markAllAsTouched();
      }
    }, 100);
  }
}

@Component({
  selector: 'story-user-form-validation-no-roles-story',
  template: `<org-user-form (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormValidationNoRolesStory implements AfterViewInit {
  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const userFormElement = document.querySelector('org-user-form-validation-no-roles-story org-user-form');

      if (userFormElement) {
        const userFormComponent = (window as any).ng.getComponent(userFormElement) as UserForm;

        userFormComponent.userForm.patchValue({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          roles: {
            user: false,
            admin: false,
            owner: false,
          },
          permissions: {
            read: false,
            write: false,
            delete: false,
            api: false,
          },
        });
        userFormComponent.userForm.markAllAsTouched();
      }
    }, 100);
  }
}

@Component({
  selector: 'story-user-form-validation-valid-story',
  template: `<org-user-form (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormValidationValidStory implements AfterViewInit {
  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const userFormElement = document.querySelector('org-user-form-validation-valid-story org-user-form');

      if (userFormElement) {
        const userFormComponent = (window as any).ng.getComponent(userFormElement) as UserForm;

        userFormComponent.userForm.patchValue({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          roles: {
            user: true,
            admin: true,
            owner: false,
          },
          permissions: {
            read: true,
            write: false,
            delete: false,
            api: false,
          },
        });
      }
    }, 100);
  }
}

@Component({
  selector: 'story-user-form-with-non-assignable-roles-story',
  template: `<org-user-form [existingUser]="existingUser" (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormWithNonAssignableRolesStory {
  public existingUser: User = {
    id: 'user-789',
    firstName: 'Special',
    lastName: 'User',
    email: 'special@example.com',
    roles: ['user', 'admin'],
    permissions: ['read'],
    requirePasswordChange: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    deletedAt: null,
  };

  public onSubmit(data: UserFormData): void {
    console.log('Submit (should preserve internal_user):', data);
  }
}

@Component({
  selector: 'story-user-form-interactive-story',
  template: `
    <div class="flex flex-col gap-1.5 p-1 max-w-base">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-xl font-semibold">Interactive User Form</h3>
        <div class="text-sm text-muted">Fill out the form and submit to see event logging in action.</div>
      </div>

      <org-user-form (formSubmitted)="onFormSubmit($event)"></org-user-form>

      <div class="flex flex-col gap-0.5">
        <h4 class="font-medium">Event Log:</h4>
        <div class="p-0.75 bg-secondary-soft rounded text-sm font-mono max-h-48 overflow-y-auto">
          @for (event of events(); track $index) {
            <div class="mb-0.5">
              <div class="font-bold text-primary">{{ event.timestamp }}</div>
              <div class="text-muted">Name: {{ event.firstName }} {{ event.lastName }}</div>
              <div class="text-muted">Email: {{ event.email }}</div>
              <div class="text-muted">Roles: {{ event.roles.join(', ') }}</div>
              <div class="text-muted">Permissions: {{ event.permissions.join(', ') }}</div>
              @if (event.id) {
                <div class="text-muted">ID: {{ event.id }}</div>
              }
            </div>
          }
          @if (events().length === 0) {
            <div class="text-muted">No form submissions yet. Fill out the form and click the submit button.</div>
          }
        </div>
      </div>
    </div>
  `,
  imports: [UserForm],
})
class UserFormInteractiveStory {
  public events = signal<
    {
      timestamp: string;
      id?: string;
      firstName: string;
      lastName: string;
      email: string;
      roles: string[];
      permissions: string[];
    }[]
  >([]);

  public onFormSubmit(data: UserFormData): void {
    const timestamp = new Date().toLocaleTimeString();

    this.events.update((events) => [
      {
        timestamp,
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      },
      ...events.slice(0, 4),
    ]);
  }
}

@Component({
  selector: 'story-user-form-processing-state-story',
  template: `<org-user-form [isProcessing]="true" (formSubmitted)="onSubmit($event)"></org-user-form>`,
  imports: [UserForm],
})
class UserFormProcessingStateStory implements AfterViewInit {
  public onSubmit(data: UserFormData): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const userFormElement = document.querySelector('org-user-form-processing-state-story org-user-form');

      if (userFormElement) {
        const userFormComponent = (window as any).ng.getComponent(userFormElement) as UserForm;

        userFormComponent.userForm.patchValue({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          roles: {
            user: true,
            admin: true,
            owner: false,
          },
          permissions: {
            read: true,
            write: false,
            delete: false,
            api: false,
          },
        });
      }
    }, 100);
  }
}

@Component({
  selector: 'story-user-form-processing-state-interactive-story',
  template: `
    <div class="flex flex-col gap-1.5 p-1 max-w-base">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-xl font-semibold">Processing State Management</h3>
        <div class="text-sm text-muted">
          Submit the form to see it enter processing state for 2 seconds, simulating an API call.
        </div>
      </div>

      <org-user-form [isProcessing]="isProcessing()" (formSubmitted)="onFormSubmit($event)"></org-user-form>

      <div class="flex flex-col gap-0.5">
        <h4 class="font-medium">
          Current State: <span class="font-mono">{{ isProcessing() ? 'Processing' : 'Idle' }}</span>
        </h4>
        <div class="text-sm text-muted">
          @if (isProcessing()) {
            Form is locked during processing...
          } @else {
            Form is ready for input
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
            <div class="text-muted">No form submissions yet. Fill out the form and click the submit button.</div>
          }
        </div>
      </div>
    </div>
  `,
  imports: [UserForm],
})
class UserFormProcessingStateInteractiveStory {
  public isProcessing = signal<boolean>(false);
  public events = signal<
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

  public onFormSubmit(data: UserFormData): void {
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

    setTimeout(() => {
      this.isProcessing.set(false);
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
    }, 2000);
  }
}
