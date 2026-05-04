import { type Meta, type StoryObj } from '@storybook/angular';
import { AfterViewInit, Component, signal } from '@angular/core';
import { LoginForm } from './login-form';
import { AuthenticationAuthenticateRequest } from '@organization/shared-types';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<LoginForm> = {
  title: 'Authentication/Components/Login Form',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Login Form Component

  A comprehensive login form component with email/password validation, password visibility toggle, and Zod schema validation.

  ### Features
  - Email and password input fields
  - Real-time validation with Angular Reactive Forms
  - Zod schema validation on submit
  - Password visibility toggle
  - Error message display
  - Accessible form controls
  - Card-based layout
  - Submit button with loading state support

  ### Validation
  - **Email**: Required, must be valid email format
  - **Password**: Required
  - **Schema Validation**: Uses Zod for additional runtime validation
  - **Error Display**: Shows validation errors below each field

  ### Usage Examples
  \`\`\`html
  <!-- Basic login form -->
  <org-login-form
    (loginSubmitted)="onLogin($event)"
  />
  \`\`\`

  \`\`\`typescript
  // In your component
  onLogin(credentials: AuthenticationAuthenticateRequest) {
    console.log('Login attempt:', credentials);
    // Call your authentication service
    this.authService.login(credentials).subscribe({
      next: (response) => console.log('Login successful'),
      error: (error) => console.error('Login failed', error)
    });
  }
  \`\`\`

  ### Events
  - **loginSubmitted**: Emitted when the form is successfully submitted with valid credentials (emits \`AuthenticationAuthenticateRequest\`)

  ### Form Structure
  The form uses Angular Reactive Forms with the following controls:
  - \`email\`: Email input with required and email validators
  - \`password\`: Password input with required validator
  - Both fields validate on submit to avoid annoying users during typing
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<LoginForm>;

const loginSubmitted = (requestData: AuthenticationAuthenticateRequest) => {
  console.log('Login submitted:', requestData);
};

export const Default: Story = {
  args: {
    loginSubmitted: loginSubmitted,
  },
  argTypes: {
    loginSubmitted: {
      action: 'loginSubmitted',
      description: 'Emits when the form is successfully submitted with valid credentials',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default login form with empty fields. Try entering credentials and submitting to see validation in action.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-login-form (loginSubmitted)="loginSubmitted($event)"></org-login-form>
    `,
    moduleMetadata: {
      imports: [LoginForm],
    },
  }),
};

export const ValidationStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different validation states: empty form with errors, invalid email, and valid form ready to submit.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation States"
        currentState="Comparing empty, invalid, and valid form states"
      >
        <org-storybook-example-container-section label="Empty Form (with errors shown)">
          <story-login-form-validation-empty-story />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid Email">
          <story-login-form-validation-invalid-story />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Valid Form">
          <story-login-form-validation-valid-story />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Empty Form</strong>: Shows "required" errors when submitted without input</li>
          <li><strong>Invalid Email</strong>: Shows email format validation error</li>
          <li><strong>Valid Form</strong>: No errors, ready to submit</li>
          <li>Validation triggers on submit to avoid interrupting user during typing</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        LoginFormValidationEmptyStory,
        LoginFormValidationInvalidStory,
        LoginFormValidationValidStory,
      ],
    },
  }),
};

export const PasswordVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of password field with visibility hidden and visible using the eye icon toggle.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Password Visibility"
        currentState="Comparing hidden and visible password states"
      >
        <org-storybook-example-container-section label="Password Hidden (default)">
          <story-login-form-password-hidden-story />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Password Visible (toggled)">
          <story-login-form-password-visible-story />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Hidden</strong>: Password characters are masked (default state)</li>
          <li><strong>Visible</strong>: Password is shown in plain text after clicking eye icon</li>
          <li>Eye icon toggles between eye and eye-slash based on visibility state</li>
          <li>Useful for users to verify they typed their password correctly</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        StorybookExampleContainer,
        StorybookExampleContainerSection,
        LoginFormPasswordHiddenStory,
        LoginFormPasswordVisibleStory,
      ],
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
    template: '<story-login-form-interactive-story></story-login-form-interactive-story>',
    moduleMetadata: {
      imports: [LoginFormInteractiveStory],
    },
  }),
};

// Helper components for stories
@Component({
  selector: 'story-login-form-validation-empty-story',
  template: `<org-login-form (loginSubmitted)="onSubmit($event)"></org-login-form>`,
  imports: [LoginForm],
})
class LoginFormValidationEmptyStory implements AfterViewInit {
  public onSubmit(data: AuthenticationAuthenticateRequest): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    // Trigger validation to show errors
    setTimeout(() => {
      const loginFormElement = document.querySelector('org-login-form-validation-empty-story org-login-form');

      if (loginFormElement) {
        const loginFormComponent = (window as any).ng.getComponent(loginFormElement) as LoginForm;

        loginFormComponent.loginForm.markAllAsTouched();
      }
    }, 100);
  }
}

@Component({
  selector: 'story-login-form-validation-invalid-story',
  template: `<org-login-form (loginSubmitted)="onSubmit($event)"></org-login-form>`,
  imports: [LoginForm],
})
class LoginFormValidationInvalidStory implements AfterViewInit {
  public onSubmit(data: AuthenticationAuthenticateRequest): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const loginFormElement = document.querySelector('org-login-form-validation-invalid-story org-login-form');

      if (loginFormElement) {
        const loginFormComponent = (window as any).ng.getComponent(loginFormElement) as LoginForm;

        loginFormComponent.loginForm.patchValue({
          email: 'invalid-email',
          password: 'password123',
        });
        loginFormComponent.loginForm.markAllAsTouched();
      }
    }, 100);
  }
}

@Component({
  selector: 'story-login-form-validation-valid-story',
  template: `<org-login-form (loginSubmitted)="onSubmit($event)"></org-login-form>`,
  imports: [LoginForm],
})
class LoginFormValidationValidStory implements AfterViewInit {
  public onSubmit(data: AuthenticationAuthenticateRequest): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const loginFormElement = document.querySelector('org-login-form-validation-valid-story org-login-form');

      if (loginFormElement) {
        const loginFormComponent = (window as any).ng.getComponent(loginFormElement) as LoginForm;

        loginFormComponent.loginForm.patchValue({
          email: 'user@example.com',
          password: 'password123',
        });
      }
    }, 100);
  }
}

@Component({
  selector: 'story-login-form-password-hidden-story',
  template: `<org-login-form (loginSubmitted)="onSubmit($event)"></org-login-form>`,
  imports: [LoginForm],
})
class LoginFormPasswordHiddenStory implements AfterViewInit {
  public onSubmit(data: AuthenticationAuthenticateRequest): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const loginFormElement = document.querySelector('org-login-form-password-hidden-story org-login-form');

      if (loginFormElement) {
        const loginFormComponent = (window as any).ng.getComponent(loginFormElement) as LoginForm;

        loginFormComponent.loginForm.patchValue({
          email: 'user@example.com',
          password: 'mySecretPassword123',
        });
      }
    }, 100);
  }
}

@Component({
  selector: 'story-login-form-password-visible-story',
  template: `<org-login-form (loginSubmitted)="onSubmit($event)"></org-login-form>`,
  imports: [LoginForm],
})
class LoginFormPasswordVisibleStory implements AfterViewInit {
  public onSubmit(data: AuthenticationAuthenticateRequest): void {
    console.log('Submit:', data);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const loginFormElement = document.querySelector('org-login-form-password-visible-story org-login-form');

      if (loginFormElement) {
        const loginFormComponent = (window as any).ng.getComponent(loginFormElement) as LoginForm;

        loginFormComponent.loginForm.patchValue({
          email: 'user@example.com',
          password: 'mySecretPassword123',
        });
        loginFormComponent.showPassword = true;
      }
    }, 100);
  }
}

@Component({
  selector: 'story-login-form-interactive-story',
  template: `
    <div class="flex flex-col gap-6 p-4 max-w-base">
      <div class="flex flex-col gap-2">
        <h3 class="text-xl font-semibold">Interactive Login Form</h3>
        <div class="text-sm text-muted">Fill out the form and submit to see event logging in action.</div>
      </div>

      <org-login-form (loginSubmitted)="onLoginSubmit($event)"></org-login-form>

      <!-- Event Log -->
      <div class="flex flex-col gap-2">
        <h4 class="font-medium">Event Log:</h4>
        <div class="p-3 bg-secondary-soft rounded text-sm font-mono max-h-48 overflow-y-auto">
          @for (event of events(); track $index) {
            <div class="mb-2">
              <div class="font-bold text-primary">{{ event.timestamp }}</div>
              <div class="text-muted">Email: {{ event.email }}</div>
              <div class="text-muted">Password: {{ event.password }}</div>
            </div>
          }
          @if (events().length === 0) {
            <div class="text-muted">No login attempts yet. Fill out the form and click "Sign In" to see events.</div>
          }
        </div>
      </div>
    </div>
  `,
  imports: [LoginForm],
})
class LoginFormInteractiveStory {
  public events = signal<{ timestamp: string; email: string; password: string }[]>([]);

  public onLoginSubmit(data: AuthenticationAuthenticateRequest): void {
    const timestamp = new Date().toLocaleTimeString();

    this.events.update((events) => [{ timestamp, email: data.email, password: data.password }, ...events.slice(0, 4)]);
  }
}
