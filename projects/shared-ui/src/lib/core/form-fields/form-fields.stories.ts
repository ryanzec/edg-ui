import type { Meta, StoryObj } from '@storybook/angular';
import { FormFields } from './form-fields';
import { FormField } from './form-field';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { Textarea } from '../textarea/textarea';
import { Checkbox } from '../checkbox/checkbox';

const meta: Meta<FormFields> = {
  title: 'Core/Components/Form Fields',
  component: FormFields,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Form Fields Component

  A simple container component for grouping form fields with consistent vertical spacing.

  ### Features
  - Consistent vertical spacing between form elements (0.375rem / 6px)
  - Flexbox column layout for vertical stacking
  - Content projection for flexible form field arrangements
  - Works with any form elements (inputs, textareas, checkboxes, etc.)

  ### Usage Examples
  \`\`\`html
  <!-- Basic usage with inputs -->
  <org-form-fields>
    <org-form-field>
      <org-label label="Name" htmlFor="name-input" />
      <org-input name="name-input" placeholder="Enter your name" />
    </org-form-field>

    <org-form-field>
      <org-label label="Email" htmlFor="email-input" />
      <org-input name="email-input" type="email" placeholder="Enter your email" />
    </org-form-field>
  </org-form-fields>

  <!-- With different form elements -->
  <org-form-fields>
    <org-form-field>
      <org-label label="Description" htmlFor="description-textarea" />
      <org-textarea name="description-textarea" placeholder="Enter description..." />
    </org-form-field>

    <org-form-field>
      <org-checkbox name="accept-terms" value="yes">Accept terms and conditions</org-checkbox>
    </org-form-field>
  </org-form-fields>
  \`\`\`

  ## Form Field Component

  A container component for a single form field with optional validation message display.

  ### Features
  - Groups a label and input together
  - Displays validation messages below the input
  - Optionally reserves vertical space for the validation message to prevent layout shift
  - Inherits the reservation space setting from a parent org-form-fields if not explicitly set

  ### Usage Examples
  \`\`\`html
  <!-- basic usage -->
  <org-form-field>
    <org-label label="Email" htmlFor="email-input" />
    <org-input name="email-input" type="email" />
  </org-form-field>

  <!-- with validation -->
  <org-form-field validationMessage="Please enter a valid email">
    <org-label label="Email" htmlFor="email-input" />
    <org-input name="email-input" type="email" />
  </org-form-field>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FormFields>;
type FormFieldStory = StoryObj<FormField>;

export const Default: Story = {
  args: {
    reserveValidationSpace: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default form fields container with basic text inputs. Use the controls below to interact with the component.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Form Fields"
        currentState="Default"
      >
        <org-storybook-example-container-section label="Basic Text Inputs">
          <org-form-fields>
            <org-form-field>
              <org-label label="First Name" htmlFor="first-name-input" />
              <org-input name="first-name-input" placeholder="Enter your first name" />
            </org-form-field>

            <org-form-field>
              <org-label label="Last Name" htmlFor="last-name-input" />
              <org-input name="last-name-input" placeholder="Enter your last name" />
            </org-form-field>

            <org-form-field>
              <org-label label="Email" htmlFor="email-input" />
              <org-input name="email-input" type="email" placeholder="Enter your email" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithMixedFormElements: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form fields container with different types of form elements (inputs, textareas, checkboxes).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Mixed Form Elements"
        currentState="Showing various form element types with consistent spacing"
      >
        <org-storybook-example-container-section label="Text Input + Textarea + Checkbox">
          <org-form-fields>
            <org-form-field>
              <org-label label="Name" htmlFor="name-input-mixed" />
              <org-input name="name-input-mixed" placeholder="Enter your name" />
            </org-form-field>

            <org-form-field>
              <org-label label="Email" htmlFor="email-input-mixed" />
              <org-input name="email-input-mixed" type="email" placeholder="Enter your email" />
            </org-form-field>

            <org-form-field>
              <org-label label="Message" htmlFor="message-textarea-mixed" />
              <org-textarea name="message-textarea-mixed" placeholder="Enter your message..." />
            </org-form-field>

            <org-form-field>
              <org-checkbox name="subscribe-checkbox-mixed" value="subscribe">Subscribe to newsletter</org-checkbox>
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>All form elements maintain consistent vertical spacing (gap-1)</li>
          <li>Works seamlessly with inputs, textareas, checkboxes, and labels</li>
          <li>Labels and their corresponding inputs are grouped naturally</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        FormFields,
        FormField,
        Label,
        Input,
        Textarea,
        Checkbox,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const WithValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form fields container with validation messages displayed under inputs.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="With Validation Messages"
        currentState="Showing form fields with validation errors"
      >
        <org-storybook-example-container-section label="Valid and Invalid Inputs">
          <org-form-fields>
            <org-form-field>
              <org-label label="Email (Valid)" htmlFor="email-valid-input" />
              <org-input name="email-valid-input" type="email" placeholder="Enter email" value="user@example.com" />
            </org-form-field>

            <org-form-field validationMessage="Please enter a valid email address">
              <org-label label="Email (Invalid)" htmlFor="email-invalid-input" />
              <org-input
                name="email-invalid-input"
                type="email"
                placeholder="Enter email"
                value="invalid@"
              />
            </org-form-field>

            <org-form-field validationMessage="Password must be at least 8 characters">
              <org-label label="Password (Invalid)" htmlFor="password-invalid-input" />
              <org-input
                name="password-invalid-input"
                type="password"
                placeholder="Enter password"
                value="123"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Validation messages appear below their respective inputs</li>
          <li>Spacing remains consistent even with validation messages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MultipleGroups: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Multiple form fields groups can be used to organize related fields into sections.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Multiple Form Field Groups"
        currentState="Showing multiple form field containers for organizing sections"
      >
        <org-storybook-example-container-section label="Personal Information + Account Details">
          <div class="flex flex-col gap-6">
            <div>
              <h3 class="mb-2 font-semibold">Personal Information</h3>
              <org-form-fields>
                <org-form-field>
                  <org-label label="First Name" htmlFor="first-name-multi" />
                  <org-input name="first-name-multi" placeholder="Enter first name" />
                </org-form-field>

                <org-form-field>
                  <org-label label="Last Name" htmlFor="last-name-multi" />
                  <org-input name="last-name-multi" placeholder="Enter last name" />
                </org-form-field>
              </org-form-fields>
            </div>

            <div>
              <h3 class="mb-2 font-semibold">Account Details</h3>
              <org-form-fields>
                <org-form-field>
                  <org-label label="Username" htmlFor="username-multi" />
                  <org-input name="username-multi" placeholder="Enter username" />
                </org-form-field>

                <org-form-field>
                  <org-label label="Password" htmlFor="password-multi" />
                  <org-input name="password-multi" type="password" placeholder="Enter password" />
                </org-form-field>
              </org-form-fields>
            </div>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Multiple form-fields containers can be used to organize form sections</li>
          <li>Each container maintains its own internal spacing</li>
          <li>Additional spacing between containers should be handled externally</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ReserveValidationSpace: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how reserveValidationSpace controls whether child form-fields reserve space for validation messages by default. When true (default), all fields maintain consistent height regardless of validation state. When false, fields collapse the validation area when no message is present.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Reserve Validation Space"
        currentState="Comparing reserveValidationSpace true vs false"
      >
        <org-storybook-example-container-section label="reserveValidationSpace=true (default) — space always reserved">
          <org-form-fields [reserveValidationSpace]="true">
            <org-form-field>
              <org-label label="First Name" htmlFor="rvs-true-first-name" />
              <org-input name="rvs-true-first-name" placeholder="Enter first name" />
            </org-form-field>

            <org-form-field validationMessage="Last name is required">
              <org-label label="Last Name" htmlFor="rvs-true-last-name" />
              <org-input name="rvs-true-last-name" placeholder="Enter last name" />
            </org-form-field>

            <org-form-field>
              <org-label label="Email" htmlFor="rvs-true-email" />
              <org-input name="rvs-true-email" type="email" placeholder="Enter email" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="reserveValidationSpace=false — space only used when message is present">
          <org-form-fields [reserveValidationSpace]="false">
            <org-form-field>
              <org-label label="First Name" htmlFor="rvs-false-first-name" />
              <org-input name="rvs-false-first-name" placeholder="Enter first name" />
            </org-form-field>

            <org-form-field validationMessage="Last name is required">
              <org-label label="Last Name" htmlFor="rvs-false-last-name" />
              <org-input name="rvs-false-last-name" placeholder="Enter last name" />
            </org-form-field>

            <org-form-field>
              <org-label label="Email" htmlFor="rvs-false-email" />
              <org-input name="rvs-false-email" type="email" placeholder="Enter email" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>With reserveValidationSpace=true, all fields have the same height regardless of whether a validation message is shown</li>
          <li>With reserveValidationSpace=false, fields without a validation message collapse the validation area, reducing vertical height</li>
          <li>Individual form-field reserveValidationSpace inputs override the parent form-fields setting</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithInputIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form fields container works seamlessly with inputs that have pre and post icons.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="With Input Icons"
        currentState="Form fields with icon-enhanced inputs"
      >
        <org-storybook-example-container-section label="Inputs With Icons">
          <org-form-fields>
            <org-form-field>
              <org-label label="Search" htmlFor="search-icon-input" />
              <org-input name="search-icon-input" preIcon="search" placeholder="Search..." />
            </org-form-field>

            <org-form-field>
              <org-label label="Email" htmlFor="email-icon-input" />
              <org-input name="email-icon-input" preIcon="mail" type="email" placeholder="Enter email" />
            </org-form-field>

            <org-form-field>
              <org-label label="Password" htmlFor="password-icon-input" />
              <org-input
                name="password-icon-input"
                type="password"
                [showPasswordToggle]="true"
                placeholder="Enter password"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Icons in inputs don't affect the consistent spacing</li>
          <li>Works with pre-icons, post-icons, and password toggles</li>
          <li>Labels align properly regardless of input icon configuration</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FormFieldDefault: FormFieldStory = {
  args: {
    validationMessage: null,
    reserveValidationSpace: null,
  },
  argTypes: {
    validationMessage: {
      control: 'text',
      description: 'The validation message to display below the field',
    },
    reserveValidationSpace: {
      control: 'select',
      options: [null, true, false],
      description:
        'Whether to reserve space for the validation message area. When null, inherits from a parent org-form-fields or defaults to false.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default form field with a label and input. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-storybook-example-container
        title="Form Field"
        currentState="Default"
      >
        <org-storybook-example-container-section label="Basic Usage">
          <org-form-field [validationMessage]="validationMessage" [reserveValidationSpace]="reserveValidationSpace">
            <org-label label="Email" htmlFor="default-email-input" />
            <org-input name="default-email-input" type="email" placeholder="Enter your email" />
          </org-form-field>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormField, FormFields, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FormFieldValidationMessage: FormFieldStory = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the validationMessage input. When provided, the message is displayed below the input.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation Message"
        currentState="Showing with and without validation messages"
      >
        <org-storybook-example-container-section label="No Message vs With Message">
          <org-form-fields>
            <org-form-field>
              <org-label label="Valid Field" htmlFor="valid-field-input" />
              <org-input name="valid-field-input" placeholder="No validation error" />
            </org-form-field>

            <org-form-field validationMessage="This field is required">
              <org-label label="Invalid Field" htmlFor="invalid-field-input" />
              <org-input name="invalid-field-input" placeholder="Has a validation error" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Validation message appears below the input when the validationMessage input is set</li>
          <li>No layout shift occurs because space is reserved by default via the parent org-form-fields</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormField, FormFields, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FormFieldReserveValidationSpace: FormFieldStory = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the reserveValidationSpace input. When true, vertical space is always reserved below the input to prevent layout shift when a validation message appears. Overrides the parent org-form-fields setting when explicitly set.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Reserve Validation Space"
        currentState="Comparing reserved vs non-reserved validation space"
      >
        <org-storybook-example-container-section label="Reserved Space (Default via org-form-fields)">
          <org-form-fields>
            <org-form-field>
              <org-label label="First Name" htmlFor="reserve-first-name-input" />
              <org-input name="reserve-first-name-input" placeholder="Space reserved below" />
            </org-form-field>

            <org-form-field>
              <org-label label="Last Name" htmlFor="reserve-last-name-input" />
              <org-input name="reserve-last-name-input" placeholder="Space reserved below" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Reserved Space (Explicit Override)">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="false">
              <org-label label="First Name" htmlFor="no-reserve-first-name-input" />
              <org-input name="no-reserve-first-name-input" placeholder="No space reserved below" />
            </org-form-field>

            <org-form-field [reserveValidationSpace]="false">
              <org-label label="Last Name" htmlFor="no-reserve-last-name-input" />
              <org-input name="no-reserve-last-name-input" placeholder="No space reserved below" />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Reserved Space (Explicit True on Standalone)">
          <org-form-field [reserveValidationSpace]="true">
            <org-label label="First Name" htmlFor="standalone-reserve-first-name-input" />
            <org-input name="standalone-reserve-first-name-input" placeholder="Explicit reserveValidationSpace true, no parent org-form-fields" />
          </org-form-field>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Reserved space (default): validation area is always rendered, keeping layout stable</li>
          <li>No reserved space: validation area only renders when a message is present, causing layout shift</li>
          <li>The reserveValidationSpace input on org-form-field overrides the parent org-form-fields setting</li>
          <li>Explicit true on standalone: reserveValidationSpace can be set directly without a parent org-form-fields</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [FormField, FormFields, Label, Input, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
