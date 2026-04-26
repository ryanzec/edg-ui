import type { Meta, StoryObj } from '@storybook/angular';
import { FormField } from './form-field';
import { FormFields } from '../form-fields/form-fields';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Input } from '../input/input';
import { Label } from '../label/label';

const meta: Meta<FormField> = {
  title: 'Core/Components/Form Field',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
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
type Story = StoryObj<FormField>;

export const Default: Story = {
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

export const ValidationMessage: Story = {
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

export const ReserveValidationSpace: Story = {
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
