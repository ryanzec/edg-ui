import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { Textarea } from '../textarea/textarea';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { FormField } from './form-field';
import { FormFields } from './form-fields';

@Component({
  selector: 'story-form-field-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormFields,
    FormField,
    Input,
    Label,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 6rem; /* 96px */
      }
      .canvas-stage > org-form-fields {
        width: 100%;
        max-width: 36rem; /* 576px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All form fields below are real and interactive — hover, focus, press, or tab through them to see every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Validation message">
            <org-input
              name="live-demo-validation-message"
              formControlName="validationMessage"
              placeholder="Type a message to flip into the error state"
              ariaLabel="Validation message"
            />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Reserve validation space">
            <org-checkbox-toggle
              name="live-demo-reserve-validation-space"
              value="reserveValidationSpace"
              formControlName="reserveValidationSpace"
            >
              {{ liveDemoForm.controls.reserveValidationSpace.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Label orientation">
            <org-checkbox-toggle
              name="live-demo-label-orientation"
              value="labelOrientation"
              formControlName="labelOrientation"
            >
              {{ liveDemoForm.controls.labelOrientation.value ? 'horizontal' : 'vertical' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Container orientation">
            <org-checkbox-toggle
              name="live-demo-container-orientation"
              value="containerOrientation"
              formControlName="containerOrientation"
            >
              {{ liveDemoForm.controls.containerOrientation.value ? 'horizontal' : 'vertical' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-form-fields
              [labelOrientation]="liveDemoForm.controls.labelOrientation.value ? 'horizontal' : 'vertical'"
              [orientation]="liveDemoForm.controls.containerOrientation.value ? 'horizontal' : 'vertical'"
            >
              <org-form-field
                [validationMessage]="liveDemoForm.controls.validationMessage.value"
                [reserveValidationSpace]="liveDemoForm.controls.reserveValidationSpace.value"
              >
                <org-label text="Email" htmlFor="live-demo-form-field-email" />
                <org-input name="live-demo-form-field-email" type="email" placeholder="you@example.com" />
              </org-form-field>
              <org-form-field [reserveValidationSpace]="liveDemoForm.controls.reserveValidationSpace.value">
                <org-label text="Password" htmlFor="live-demo-form-field-password" />
                <org-input name="live-demo-form-field-password" type="password" placeholder="Enter your password" />
              </org-form-field>
            </org-form-fields>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class StoryFormFieldLiveDemo {
  protected readonly liveDemoForm = new FormGroup({
    validationMessage: new FormControl<string>('', { nonNullable: true }),
    reserveValidationSpace: new FormControl<boolean>(false, { nonNullable: true }),
    labelOrientation: new FormControl<boolean>(false, { nonNullable: true }),
    containerOrientation: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

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
      <org-label text="Name" htmlFor="name-input" />
      <org-input name="name-input" placeholder="Enter your name" />
    </org-form-field>

    <org-form-field>
      <org-label text="Email" htmlFor="email-input" />
      <org-input name="email-input" type="email" placeholder="Enter your email" />
    </org-form-field>
  </org-form-fields>

  <!-- With different form elements -->
  <org-form-fields>
    <org-form-field>
      <org-label text="Description" htmlFor="description-textarea" />
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
    <org-label text="Email" htmlFor="email-input" />
    <org-input name="email-input" type="email" />
  </org-form-field>

  <!-- with validation -->
  <org-form-field validationMessage="Please enter a valid email">
    <org-label text="Email" htmlFor="email-input" />
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
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Form Fields" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Basic Text Inputs</div>
          <org-form-fields>
            <org-form-field>
              <org-label text="First Name" htmlFor="first-name-input" />
              <org-input name="first-name-input" placeholder="Enter your first name" />
            </org-form-field>

            <org-form-field>
              <org-label text="Last Name" htmlFor="last-name-input" />
              <org-input name="last-name-input" placeholder="Enter your last name" />
            </org-form-field>

            <org-form-field>
              <org-label text="Email" htmlFor="email-input" />
              <org-input name="email-input" type="email" placeholder="Enter your email" />
            </org-form-field>
          </org-form-fields>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    `,
    moduleMetadata: {
      imports: [FormFields, FormField, Label, Input, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo of org-form-field. Type into the validation-message control to flip the field into its error state, and toggle reserve-validation-space to see how the layout reserves vertical room when no message is present.',
      },
    },
  },
  render: () => ({
    template: `<story-form-field-live-demo />`,
    moduleMetadata: {
      imports: [StoryFormFieldLiveDemo],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every form-fields / form-field axis — mixed form-element types, validation messaging across both wrapper and standalone usage, multi-group composition, reserved validation space (container default and per-field override), and inputs with pre/post icons — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Mixed Form Elements" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields>
              <org-form-field>
                <org-label text="Name" htmlFor="showcase-mixed-name" />
                <org-input name="showcase-mixed-name" placeholder="Enter your name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-mixed-email" />
                <org-input name="showcase-mixed-email" type="email" placeholder="Enter your email" />
              </org-form-field>

              <org-form-field>
                <org-label text="Message" htmlFor="showcase-mixed-message" />
                <org-textarea name="showcase-mixed-message" placeholder="Enter your message..." />
              </org-form-field>

              <org-form-field>
                <org-checkbox name="showcase-mixed-subscribe" value="subscribe">Subscribe to newsletter</org-checkbox>
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>All form elements maintain consistent vertical spacing (gap-1)</li>
            <li>Works seamlessly with inputs, textareas, checkboxes, and labels</li>
            <li>Labels and their corresponding inputs are grouped naturally</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="With Validation Messages" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields>
              <org-form-field>
                <org-label text="Email (Valid)" htmlFor="showcase-validation-email-valid" />
                <org-input
                  name="showcase-validation-email-valid"
                  type="email"
                  placeholder="Enter email"
                  value="user@example.com"
                />
              </org-form-field>

              <org-form-field validationMessage="Please enter a valid email address">
                <org-label text="Email (Invalid)" htmlFor="showcase-validation-email-invalid" />
                <org-input
                  name="showcase-validation-email-invalid"
                  type="email"
                  placeholder="Enter email"
                  value="invalid@"
                />
              </org-form-field>

              <org-form-field validationMessage="Password must be at least 8 characters">
                <org-label text="Password (Invalid)" htmlFor="showcase-validation-password-invalid" />
                <org-input
                  name="showcase-validation-password-invalid"
                  type="password"
                  placeholder="Enter password"
                  value="123"
                />
              </org-form-field>
            </org-form-fields>

            <org-form-fields>
              <org-form-field>
                <org-label text="Valid Field" htmlFor="showcase-validation-standalone-valid" />
                <org-input name="showcase-validation-standalone-valid" placeholder="No validation error" />
              </org-form-field>

              <org-form-field validationMessage="This field is required">
                <org-label text="Invalid Field" htmlFor="showcase-validation-standalone-invalid" />
                <org-input name="showcase-validation-standalone-invalid" placeholder="Has a validation error" />
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Validation messages appear below their respective inputs</li>
            <li>Spacing remains consistent even with validation messages</li>
            <li>Works for both grouped fields inside org-form-fields and standalone org-form-field usage</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Multiple Form Field Groups" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-6">
              <div>
                <h3 class="mb-2 font-semibold">Personal Information</h3>
                <org-form-fields>
                  <org-form-field>
                    <org-label text="First Name" htmlFor="showcase-multi-first-name" />
                    <org-input name="showcase-multi-first-name" placeholder="Enter first name" />
                  </org-form-field>

                  <org-form-field>
                    <org-label text="Last Name" htmlFor="showcase-multi-last-name" />
                    <org-input name="showcase-multi-last-name" placeholder="Enter last name" />
                  </org-form-field>
                </org-form-fields>
              </div>

              <div>
                <h3 class="mb-2 font-semibold">Account Details</h3>
                <org-form-fields>
                  <org-form-field>
                    <org-label text="Username" htmlFor="showcase-multi-username" />
                    <org-input name="showcase-multi-username" placeholder="Enter username" />
                  </org-form-field>

                  <org-form-field>
                    <org-label text="Password" htmlFor="showcase-multi-password" />
                    <org-input name="showcase-multi-password" type="password" placeholder="Enter password" />
                  </org-form-field>
                </org-form-fields>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Multiple form-fields containers can be used to organize form sections</li>
            <li>Each container maintains its own internal spacing</li>
            <li>Additional spacing between containers should be handled externally</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Reserve Validation Space" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields [reserveValidationSpace]="true">
              <org-form-field>
                <org-label text="First Name" htmlFor="showcase-rvs-true-first-name" />
                <org-input name="showcase-rvs-true-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field validationMessage="Last name is required">
                <org-label text="Last Name" htmlFor="showcase-rvs-true-last-name" />
                <org-input name="showcase-rvs-true-last-name" placeholder="Enter last name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-rvs-true-email" />
                <org-input name="showcase-rvs-true-email" type="email" placeholder="Enter email" />
              </org-form-field>
            </org-form-fields>

            <org-form-fields [reserveValidationSpace]="false">
              <org-form-field>
                <org-label text="First Name" htmlFor="showcase-rvs-false-first-name" />
                <org-input name="showcase-rvs-false-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field validationMessage="Last name is required">
                <org-label text="Last Name" htmlFor="showcase-rvs-false-last-name" />
                <org-input name="showcase-rvs-false-last-name" placeholder="Enter last name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-rvs-false-email" />
                <org-input name="showcase-rvs-false-email" type="email" placeholder="Enter email" />
              </org-form-field>
            </org-form-fields>

            <org-form-fields>
              <org-form-field [reserveValidationSpace]="false">
                <org-label text="First Name" htmlFor="showcase-rvs-override-first-name" />
                <org-input name="showcase-rvs-override-first-name" placeholder="No space reserved below" />
              </org-form-field>

              <org-form-field [reserveValidationSpace]="false">
                <org-label text="Last Name" htmlFor="showcase-rvs-override-last-name" />
                <org-input name="showcase-rvs-override-last-name" placeholder="No space reserved below" />
              </org-form-field>
            </org-form-fields>

            <org-form-field [reserveValidationSpace]="true">
              <org-label text="First Name" htmlFor="showcase-rvs-standalone-first-name" />
              <org-input
                name="showcase-rvs-standalone-first-name"
                placeholder="Explicit reserveValidationSpace=true, no parent org-form-fields"
              />
            </org-form-field>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>With reserveValidationSpace=true on org-form-fields, all child fields keep the same height regardless of validation state</li>
            <li>With reserveValidationSpace=false on org-form-fields, fields without a validation message collapse the validation area, causing layout shift</li>
            <li>Per-field [reserveValidationSpace]="false" overrides the parent org-form-fields setting</li>
            <li>Standalone org-form-field with explicit [reserveValidationSpace]="true" reserves space without a parent org-form-fields</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Horizontal Orientation" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields labelOrientation="horizontal">
              <org-form-field>
                <org-label text="First Name" htmlFor="showcase-orientation-parent-first-name" />
                <org-input name="showcase-orientation-parent-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Last Name" htmlFor="showcase-orientation-parent-last-name" />
                <org-input name="showcase-orientation-parent-last-name" placeholder="Enter last name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-orientation-parent-email" />
                <org-input name="showcase-orientation-parent-email" type="email" placeholder="Enter email" />
              </org-form-field>
            </org-form-fields>

            <org-form-fields>
              <org-form-field>
                <org-label text="First Name (default vertical)" htmlFor="showcase-orientation-override-first-name" />
                <org-input name="showcase-orientation-override-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field labelOrientation="horizontal">
                <org-label text="Last Name (per-field horizontal)" htmlFor="showcase-orientation-override-last-name" />
                <org-input name="showcase-orientation-override-last-name" placeholder="Enter last name" />
              </org-form-field>
            </org-form-fields>

            <org-form-fields labelOrientation="horizontal">
              <org-form-field>
                <org-label text="Username" htmlFor="showcase-orientation-validation-username" />
                <org-input name="showcase-orientation-validation-username" placeholder="Enter username" />
              </org-form-field>

              <org-form-field validationMessage="Password must be at least 8 characters">
                <org-label text="Password" htmlFor="showcase-orientation-validation-password" />
                <org-input
                  name="showcase-orientation-validation-password"
                  type="password"
                  placeholder="Enter password"
                  value="123"
                />
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>labelOrientation="horizontal" on org-form-fields cascades to all child fields, rendering label and control side-by-side</li>
            <li>Per-field [labelOrientation]="'horizontal'" overrides the parent org-form-fields setting</li>
            <li>Validation messages still render on their own line below the row in horizontal orientation</li>
            <li>Label and control are vertically centered in horizontal orientation</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Container Orientation" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields>
              <org-form-field>
                <org-label text="First Name" htmlFor="showcase-container-vertical-first-name" />
                <org-input name="showcase-container-vertical-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Last Name" htmlFor="showcase-container-vertical-last-name" />
                <org-input name="showcase-container-vertical-last-name" placeholder="Enter last name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-container-vertical-email" />
                <org-input name="showcase-container-vertical-email" type="email" placeholder="Enter email" />
              </org-form-field>
            </org-form-fields>

            <org-form-fields orientation="horizontal">
              <org-form-field>
                <org-label text="First Name" htmlFor="showcase-container-horizontal-first-name" />
                <org-input name="showcase-container-horizontal-first-name" placeholder="Enter first name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Last Name" htmlFor="showcase-container-horizontal-last-name" />
                <org-input name="showcase-container-horizontal-last-name" placeholder="Enter last name" />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-container-horizontal-email" />
                <org-input name="showcase-container-horizontal-email" type="email" placeholder="Enter email" />
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>orientation controls how the org-form-fields container stacks its child fields — default "vertical" stacks them in a column, "horizontal" arranges them in a row</li>
            <li>orientation is the container-level layout axis and is distinct from labelOrientation, which controls the label-vs-control direction inside each individual form field</li>
            <li>In horizontal orientation, child form fields are vertically center-aligned along the row</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="With Input Icons" />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields>
              <org-form-field>
                <org-label text="Search" htmlFor="showcase-icons-search" />
                <org-input name="showcase-icons-search" preIcon="search" placeholder="Search..." />
              </org-form-field>

              <org-form-field>
                <org-label text="Email" htmlFor="showcase-icons-email" />
                <org-input name="showcase-icons-email" preIcon="mail" type="email" placeholder="Enter email" />
              </org-form-field>

              <org-form-field>
                <org-label text="Password" htmlFor="showcase-icons-password" />
                <org-input
                  name="showcase-icons-password"
                  type="password"
                  [showPasswordToggle]="true"
                  placeholder="Enter password"
                />
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Icons in inputs don't affect the consistent spacing</li>
            <li>Works with pre-icons, post-icons, and password toggles</li>
            <li>Labels align properly regardless of input icon configuration</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        FormFields,
        FormField,
        Label,
        Input,
        Textarea,
        Checkbox,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
