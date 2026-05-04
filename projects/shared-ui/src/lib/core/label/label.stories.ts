import type { Meta, StoryObj } from '@storybook/angular';
import { Label } from './label';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';
import { Input } from '../input/input';

const meta: Meta<Label> = {
  title: 'Core/Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Label Component

  A label component designed to be used in connection with input elements. It features a text label with optional loading indicator and slot projection for additional content.

  ### Features
  - Required label text
  - Optional required field indicator (*)
  - Optional loading indicator
  - Slot projection for additional content (placed after label text/loading indicator)
  - Inline-flex layout for seamless integration
  - Fully accessible
  - Light and dark theme support

  ### Usage Examples
  \`\`\`html
  <!-- Basic label -->
  <org-label htmlFor="username" label="Username" />

  <!-- Required field -->
  <org-label htmlFor="email" label="Email" [isRequired]="true" />

  <!-- With loading indicator -->
  <org-label htmlFor="fetching-data" label="Fetching data..." [isLoading]="true" />

  <!-- With slot projection -->
  <org-label htmlFor="username" label="Username">
    <span class="text-muted">(optional)</span>
  </org-label>

  <!-- Combined features -->
  <org-label htmlFor="processing" label="Processing" [isLoading]="true" [isRequired]="true">
    <span class="text-muted">(validating)</span>
  </org-label>
  \`\`\`

  ### Notes
  - The label text is always displayed
  - Loading indicator appears after the label text when isLoading is true
  - Slot content is projected after the label text and loading indicator on the same line
  - Uses inline-flex for seamless integration with form layouts
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Label>;

export const Default: Story = {
  args: {
    label: 'Username',
    isLoading: false,
    isRequired: false,
    htmlFor: 'username',
    asLabel: true,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The main label text (required)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether to display a loading indicator',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether to display a required field indicator (*)',
    },
    htmlFor: {
      control: 'text',
      description: 'The HTML for attribute for the label',
    },
    asLabel: {
      control: 'boolean',
      description: 'Whether to render as a native label element; false renders as a div',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default label with just the label text. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-label
        [label]="label"
        [isLoading]="isLoading"
        [isRequired]="isRequired"
        [htmlFor]="htmlFor"
        [asLabel]="asLabel"
      />
    `,
    moduleMetadata: {
      imports: [Label],
    },
  }),
};

export const WithLoadingIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of labels with and without loading indicators.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Loading Indicator Variants"
        currentState="Comparing labels with and without loading indicators"
      >
        <org-storybook-example-container-section label="Without Loading">
          <org-label htmlFor="username" label="Username" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Loading">
          <org-label htmlFor="fetching-data" label="Fetching data..." [isLoading]="true" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Processing">
          <org-label htmlFor="processing-request" label="Processing request" [isLoading]="true" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Without Loading</strong>: Displays only the label text</li>
          <li><strong>With Loading</strong>: Displays a spinning loading indicator after the label text</li>
          <li><strong>Processing</strong>: Shows loading indicator for longer operations</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithRequiredIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of labels with and without required field indicators.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Required Field Indicator"
        currentState="Comparing labels with and without required indicators"
      >
        <org-storybook-example-container-section label="Optional Field">
          <org-label htmlFor="username" label="Username" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Required Field">
          <org-label htmlFor="email" label="Email" [isRequired]="true" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Required with Loading">
          <org-label htmlFor="validating-email" label="Validating email" [isRequired]="true" [isLoading]="true" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Optional Field</strong>: Displays only the label text</li>
          <li><strong>Required Field</strong>: Displays a red asterisk (*) after the label text</li>
          <li><strong>Required with Loading</strong>: Combines required indicator with loading state</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithSlotProjection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples showing the slot projection feature with different types of content.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Slot Projection"
        currentState="Comparing labels with different projected content"
      >
        <org-storybook-example-container-section label="With Optional Text">
          <org-label htmlFor="phone-number" label="Phone Number">
            <span class="text-muted">(optional)</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Info Badge">
          <org-label htmlFor="api-key" label="API Key">
            <span class="rounded-sm bg-info-soft px-1 py-0.5 text-3xs text-info">NEW</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Required with Help Text">
          <org-label htmlFor="password" label="Password" [isRequired]="true">
            <span class="text-muted">(8+ chars)</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Multiple Elements">
          <org-label htmlFor="username" label="Username">
            <span class="rounded-sm bg-info-soft px-1 py-0.5 text-3xs text-info">NEW</span>
            <span class="text-muted">(3-20 chars)</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Right Aligned Content">
          <org-label htmlFor="email" label="Email" [isRequired]="true" class="w-full">
            <div class="ml-auto">
              <span class="text-muted">(verified)</span>
            </div>
          </org-label>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Optional Text</strong>: Indicates optional fields or provides guidance</li>
          <li><strong>Info Badge</strong>: Highlights new or special features</li>
          <li><strong>Required with Help Text</strong>: Combines required indicator with help text using slot projection</li>
          <li><strong>Multiple Elements</strong>: Shows combining different types of content</li>
          <li><strong>Right Aligned Content</strong>: Shows how to align projected content to the right</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CombinedFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples combining loading indicator, required indicator, and slot projection.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Combined Features"
        currentState="Combining loading indicator, required indicator, and slot projection"
      >
        <org-storybook-example-container-section label="Loading with Required">
          <org-label htmlFor="validating" label="Validating..." [isLoading]="true" [isRequired]="true" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Loading with Info">
          <org-label htmlFor="checking-availability" label="Checking availability" [isLoading]="true">
            <span class="text-muted">(realtime)</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Required with Slot">
          <org-label htmlFor="password" label="Password" [isRequired]="true">
            <span class="text-muted">(8+ chars)</span>
          </org-label>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="All Features">
          <org-label htmlFor="processing-data" label="Processing data" [isLoading]="true" [isRequired]="true">
            <span class="rounded-sm bg-caution-soft px-1 py-0.5 text-3xs text-caution">BETA</span>
          </org-label>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Loading with Required</strong>: Shows validation in progress for required field</li>
          <li><strong>Loading with Info</strong>: Indicates realtime validation with loading state and additional info</li>
          <li><strong>Required with Slot</strong>: Combines required indicator with projected help text</li>
          <li><strong>All Features</strong>: Demonstrates all features working together</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FormContexts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples of labels in various form contexts.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Form Contexts"
        currentState="Labels in different form scenarios"
      >
        <org-storybook-example-container-section label="Login Form">
          <div class="flex flex-col gap-2">
            <org-label htmlFor="email-address" label="Email Address" [isRequired]="true" />
            <org-label htmlFor="password" label="Password" [isRequired]="true" />
            <org-label htmlFor="remember-me" label="Remember Me" />
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Registration Form">
          <div class="flex flex-col gap-2">
            <org-label htmlFor="full-name" label="Full Name" [isRequired]="true" />
            <org-label htmlFor="email" label="Email" [isRequired]="true" />
            <org-label htmlFor="company" label="Company">
              <span class="text-muted">(optional)</span>
            </org-label>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Settings Form">
          <div class="flex flex-col gap-2">
            <org-label htmlFor="display-name" label="Display Name" />
            <org-label htmlFor="email-notifications" label="Email Notifications" />
            <org-label htmlFor="two-factor-authentication" label="Two-Factor Authentication">
              <span class="rounded-sm bg-safe-soft px-1 py-0.5 text-3xs text-safe">SECURE</span>
            </org-label>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Login Form</strong>: Basic required fields with asterisks</li>
          <li><strong>Registration Form</strong>: Mix of required and optional fields</li>
          <li><strong>Settings Form</strong>: Fields with informational badges</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AsDiv: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of the label rendered as a native label element versus a div element.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="As Label vs As Div"
        currentState="Comparing the label element output based on the asLabel input"
      >
        <org-storybook-example-container-section label="As Label (default)">
          <org-label htmlFor="some-input" label="Username" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="As Div">
          <org-label [asLabel]="false" label="Username" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>As Label</strong>: Renders a native label element associated to the input via htmlFor</li>
          <li><strong>As Div</strong>: Renders a div element when no form control association is needed</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const RealWorldExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A realistic example showing labels used with actual form inputs.',
      },
    },
  },
  render: () => ({
    props: {
      onSubmit: () => {
        console.log('form submitted');
      },
    },
    template: `
      <org-storybook-example-container
        title="Real World Example"
        currentState="Complete form with labels and inputs"
      >
        <org-storybook-example-container-section label="User Profile Form">
          <div class="flex w-sm flex-col gap-3">
            <div class="flex flex-col gap-1">
              <org-label htmlFor="full-name" label="Full Name" [isRequired]="true" />
              <org-input name="full-name" type="text" placeholder="John Doe" />
            </div>

            <div class="flex flex-col gap-1">
              <org-label htmlFor="email-address" label="Email Address" [isRequired]="true" />
              <org-input name="email-address" type="email" placeholder="john@example.com" />
            </div>

            <div class="flex flex-col gap-1">
              <org-label htmlFor="phone-number" label="Phone Number">
                <span class="text-muted">(optional)</span>
              </org-label>
              <org-input name="phone-number" type="tel" placeholder="+1 (555) 000-0000" />
            </div>

            <div class="flex flex-col gap-1">
              <org-label htmlFor="company" label="Company">
                <span class="text-muted">(optional)</span>
              </org-label>
              <org-input name="company" type="text" placeholder="Acme Inc." />
            </div>

            <org-button color="primary" (clicked)="onSubmit()">
              Save Profile
            </org-button>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Shows labels properly associated with form inputs</li>
          <li>Required fields marked with asterisks</li>
          <li>Optional fields clearly indicated</li>
          <li>Consistent spacing and alignment</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Label, Input, Button, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
