import type { Meta, StoryObj } from '@storybook/angular';
import { Radio } from './radio';
import { RadioGroup } from './radio-group';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Label } from '../label/label';
import { FormFields } from '../form-fields/form-fields';
import { FormField } from '../form-fields/form-field';
import { FormDisabledDirective } from '../form-disabled-directive/form-disabled-directive';

const meta: Meta<Radio> = {
  title: 'Core/Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Radio Component

  A radio button component designed for use with the RadioGroup component. Features custom icon-based styling.

  ### Features
  - Custom icon-based visual representation (no default radio button)
  - Two states: unchecked and checked
  - Three size options: small, base, and large
  - Reactive forms integration via RadioGroup component
  - Accessible with proper ARIA attributes
  - Keyboard navigation support (Space and Enter keys)

  ### States
  - **Unchecked**: Shows circle icon
  - **Checked**: Shows check-circle icon

  ### Sizes
  - **Small**: Compact radio for tight spaces
  - **Base**: Standard radio size (default)
  - **Large**: Prominent radio for emphasis

  ### Usage Examples
  \`\`\`html
  <!-- Recommended: With reactive forms using RadioGroup -->
  <form [formGroup]="myForm">
    <org-form-fields>
      <org-form-field>
      <org-label [asLabel]="false" [label]="'Notifications'" />
        <org-radio-group formControlName="preference" name="preference">
          <org-radio value="option1">Option 1</org-radio>
          <org-radio value="option2">Option 2</org-radio>
          <org-radio value="option3">Option 3</org-radio>
        </org-radio-group>
      </org-form-field>
    </org-form-fields>
  </form>

  <!-- Different sizes -->
  <org-form-fields>
    <org-form-field>
      <org-radio-group formControlName="size" name="size">
        <org-radio value="small" size="sm">Small radio</org-radio>
        <org-radio value="base" size="base">Base radio</org-radio>
        <org-radio value="large" size="lg">Large radio</org-radio>
      </org-radio-group>
    </org-form-field>
  </org-form-fields>

  <!-- Standalone usage (for display purposes) -->
  <org-radio value="option1">Standalone radio</org-radio>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Radio>;

export const Default: Story = {
  args: {
    name: 'radio',
    value: 'value',
    size: 'sm',
  },
  argTypes: {
    name: {
      control: 'text',
      description:
        'The name attribute for the radio input element (optional, but recommended when not using RadioGroup)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for the radio input (required)',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the radio icon',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default radio component. Note: For interactive usage with forms, use the RadioGroup component (see ReactiveFormIntegration story).',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-radio
        [name]="name"
        [value]="value"
        [size]="size"
      >
        Radio Label
      </org-radio>
    `,
    moduleMetadata: {
      imports: [Radio],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three size variants: small, base, and large.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Radio Sizes"
        currentState="Comparing small, base, and large sizes"
      >
        <org-storybook-example-container-section label="Small">
          <org-radio name="radio-sizes" value="small" size="sm">
            Small radio
          </org-radio>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (Default)">
          <org-radio name="radio-sizes" value="base" size="base">
            Base radio
          </org-radio>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large">
          <org-radio name="radio-sizes" value="large" size="lg">
            Large radio
          </org-radio>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Small</strong>: Compact radio for tight spaces</li>
          <li><strong>Base</strong>: Standard radio size (default)</li>
          <li><strong>Large</strong>: Prominent radio for emphasis</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Radio, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-radio-states-story',
  template: `
    <org-storybook-example-container title="Radio States" [currentState]="'Selected: ' + statesForm.value.state">
      <org-storybook-example-container-section label="Unchecked">
        <form [formGroup]="statesForm">
          <org-radio-group formControlName="state" name="states">
            <org-radio value="unchecked">Unchecked radio</org-radio>
          </org-radio-group>
        </form>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Checked">
        <form [formGroup]="statesForm">
          <org-radio-group formControlName="state" name="states">
            <org-radio value="checked">Checked radio</org-radio>
          </org-radio-group>
        </form>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Unchecked</strong>: Shows circle icon</li>
        <li><strong>Checked</strong>: Shows circle-check-big icon</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [Radio, RadioGroup, StorybookExampleContainer, StorybookExampleContainerSection, ReactiveFormsModule],
})
class RadioStatesStory {
  public statesForm = new FormGroup({
    state: new FormControl('checked', { nonNullable: true }),
  });
}

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of radio states: unchecked and checked.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-states-story />`,
    moduleMetadata: {
      imports: [RadioStatesStory],
    },
  }),
};

@Component({
  selector: 'story-radio-grouped-story',
  template: `
    <org-storybook-example-container
      title="Grouped Radios"
      [currentState]="'Vertical: ' + verticalForm.value.vertical + ', Horizontal: ' + horizontalForm.value.horizontal"
    >
      <org-storybook-example-container-section label="Vertical Group (Column)">
        <form [formGroup]="verticalForm">
          <org-radio-group formControlName="vertical" name="radio-vertical">
            <org-radio value="option1">Option 1</org-radio>
            <org-radio value="option2">Option 2</org-radio>
            <org-radio value="option3">Option 3</org-radio>
            <org-radio value="option4">Option 4</org-radio>
          </org-radio-group>
        </form>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Horizontal Group (Row)">
        <form [formGroup]="horizontalForm">
          <div class="flex flex-row gap-1">
            <org-radio-group formControlName="horizontal" name="radio-horizontal">
              <org-radio value="h-option1">Option 1</org-radio>
              <org-radio value="h-option2">Option 2</org-radio>
              <org-radio value="h-option3">Option 3</org-radio>
            </org-radio-group>
          </div>
        </form>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Only one radio can be selected at a time within a group</li>
        <li>Arrow keys navigate between options within a group</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [Radio, RadioGroup, StorybookExampleContainer, StorybookExampleContainerSection, ReactiveFormsModule],
})
class RadioGroupedStory {
  public verticalForm = new FormGroup({
    vertical: new FormControl('option1', { nonNullable: true }),
  });

  public horizontalForm = new FormGroup({
    horizontal: new FormControl('h-option1', { nonNullable: true }),
  });
}

export const GroupedRadios: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Radios grouped using RadioGroup for proper selection management.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-grouped-story />`,
    moduleMetadata: {
      imports: [RadioGroupedStory],
    },
  }),
};

@Component({
  selector: 'story-radio-reactive-form-story',
  template: `
    <org-storybook-example-container
      title="Reactive Form Integration"
      [currentState]="'Form Valid: ' + radioForm.valid + ', Selected Value: ' + formValueDisplay()"
    >
      <org-storybook-example-container-section label="Radio Group in Form">
        <form [formGroup]="radioForm">
          <org-form-fields>
            <org-form-field>
              <org-label [asLabel]="false" [label]="'Notifications'" />
              <org-radio-group formControlName="preference" name="preference">
                <org-radio value="email">Email notifications</org-radio>
                <org-radio value="sms">SMS notifications</org-radio>
                <org-radio value="push">Push notifications</org-radio>
                <org-radio value="none">No notifications</org-radio>
              </org-radio-group>
            </org-form-field>
          </org-form-fields>
        </form>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Use <strong>org-radio-group</strong> with <strong>formControlName</strong> for reactive forms</li>
        <li>RadioGroup manages the selected value and syncs all child radios</li>
        <li>Form state updates automatically when radios are selected</li>
        <li>Only one radio can be selected at a time within a group</li>
        <li>Much simpler than manually managing checked states</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [
    Radio,
    Label,
    FormFields,
    FormField,
    RadioGroup,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    ReactiveFormsModule,
  ],
})
class RadioReactiveFormStory {
  public radioForm = new FormGroup({
    preference: new FormControl('email', { nonNullable: true }),
  });

  public formValueDisplay = signal<string>(JSON.stringify(this.radioForm.value.preference));

  constructor() {
    this.radioForm.valueChanges.subscribe(() => {
      this.formValueDisplay.set(JSON.stringify(this.radioForm.value.preference));
    });
  }
}

@Component({
  selector: 'story-radio-disabled-story',
  template: `
    <org-storybook-example-container title="Disabled State" [currentState]="'Selected: ' + disabledForm.value.option">
      <org-storybook-example-container-section label="Disabled Group">
        <form [formGroup]="disabledForm">
          <org-radio-group formControlName="option" name="disabled-group" [orgFormDisabled]="true">
            <org-radio value="option1">Option 1</org-radio>
            <org-radio value="option2">Option 2</org-radio>
            <org-radio value="option3">Option 3</org-radio>
          </org-radio-group>
        </form>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>All radios in a disabled group are non-interactive</li>
        <li>Disabled radios have reduced opacity and a not-allowed cursor</li>
        <li>Keyboard and mouse interactions are blocked</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [
    Radio,
    RadioGroup,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    ReactiveFormsModule,
    FormDisabledDirective,
  ],
})
class RadioDisabledStory {
  public disabledForm = new FormGroup({
    option: new FormControl('option1', { nonNullable: true }),
  });
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Radio group in a disabled state — all child radios are non-interactive.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-disabled-story />`,
    moduleMetadata: {
      imports: [RadioDisabledStory],
    },
  }),
};

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example of integrating radios with Angular reactive forms using the RadioGroup component. This is the recommended approach for form integration.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-reactive-form-story />`,
    moduleMetadata: {
      imports: [RadioReactiveFormStory],
    },
  }),
};

@Component({
  selector: 'story-radio-multiple-groups-story',
  template: `
    <org-storybook-example-container
      title="Multiple Radio Groups"
      [currentState]="'Shipping: ' + multiForm.value.shipping + ', Payment: ' + multiForm.value.payment"
    >
      <form [formGroup]="multiForm">
        <org-form-fields>
          <org-form-field>
            <org-label [asLabel]="false" [label]="'Shipping Method'" />
            <org-radio-group formControlName="shipping" name="shipping">
              <org-radio value="standard">Standard (5-7 business days)</org-radio>
              <org-radio value="express">Express (2-3 business days)</org-radio>
              <org-radio value="overnight">Overnight (next business day)</org-radio>
            </org-radio-group>
          </org-form-field>
          <org-form-field>
            <org-label [asLabel]="false" [label]="'Payment Method'" />
            <org-radio-group formControlName="payment" name="payment">
              <org-radio value="credit">Credit Card</org-radio>
              <org-radio value="debit">Debit Card</org-radio>
              <org-radio value="paypal">PayPal</org-radio>
            </org-radio-group>
          </org-form-field>
        </org-form-fields>
      </form>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Each <strong>org-radio-group</strong> creates a separate radio group</li>
        <li>Each group maintains its own selection state independently</li>
        <li>Selecting a radio in one group does not affect other groups</li>
        <li>Clean separation of concerns with RadioGroup managing each group's state</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [
    Radio,
    Label,
    FormFields,
    FormField,
    RadioGroup,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    ReactiveFormsModule,
  ],
})
class RadioMultipleGroupsStory {
  public multiForm = new FormGroup({
    shipping: new FormControl('standard', { nonNullable: true }),
    payment: new FormControl('credit', { nonNullable: true }),
  });
}

export const MultipleGroups: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example showing multiple independent radio groups on the same page.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-multiple-groups-story />`,
    moduleMetadata: {
      imports: [RadioMultipleGroupsStory],
    },
  }),
};

@Component({
  selector: 'story-radio-validation-story',
  template: `
    <org-storybook-example-container
      title="Radio Group Validation"
      [currentState]="
        'Form Valid: ' + validationForm.valid + ', Selected Value: ' + (validationForm.value.option || 'none')
      "
    >
      <form [formGroup]="validationForm">
        <org-form-fields>
          <org-form-field validationMessage="Please select an option to continue">
            <org-label [asLabel]="false" [label]="'Radio Group with Validation Error'" />
            <org-radio-group formControlName="option" name="option">
              <org-radio value="option1">Option 1</org-radio>
              <org-radio value="option2">Option 2</org-radio>
              <org-radio value="option3">Option 3</org-radio>
            </org-radio-group>
          </org-form-field>
          <org-form-field>
            <org-label [asLabel]="false" [label]="'Radio Group with Validation Error'" />
            <org-radio-group formControlName="valid" name="valid">
              <org-radio value="yes">Yes</org-radio>
              <org-radio value="no">No</org-radio>
            </org-radio-group>
          </org-form-field>
        </org-form-fields>
      </form>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Validation message appears below the radio group when provided</li>
        <li>Message uses <strong>text-danger</strong> color (danger/red)</li>
        <li>Message is visible only when validationMessage input is provided</li>
        <li>Proper ARIA attributes for accessibility (aria-invalid, aria-describedby)</li>
        <li>Message uses role="alert" and aria-live="polite" for screen readers</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [
    Radio,
    RadioGroup,
    Label,
    FormFields,
    FormField,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    ReactiveFormsModule,
  ],
})
class RadioValidationStory {
  public validationForm = new FormGroup({
    option: new FormControl('', { nonNullable: true }),
    valid: new FormControl('yes', { nonNullable: true }),
  });
}

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Example showing radio groups with validation messages. The validation message is displayed below the radio group when provided.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-validation-story />`,
    moduleMetadata: {
      imports: [RadioValidationStory],
    },
  }),
};

export const ValidationSpaceReservation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of validation space reservation behavior. When reserveValidationSpace is true, space is always reserved for validation messages to maintain consistent layout. When false, space is only used when a validation message is present.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Validation Space Reservation"
        currentState="Comparing space reservation behaviors"
      >
        <org-storybook-example-container-section label="Reserve Space = true (default)">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="true">
              <org-radio-group name="reserve-true-group-1">
                <org-radio value="option1">Option 1 (no error)</org-radio>
                <org-radio value="option2">Option 2 (no error)</org-radio>
              </org-radio-group>
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
              <org-radio-group name="reserve-true-group-2">
                <org-radio value="option1">Option 1 (with error)</org-radio>
                <org-radio value="option2">Option 2 (with error)</org-radio>
              </org-radio-group>
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true">
              <org-radio-group name="reserve-true-group-3">
                <org-radio value="option1">Option 1 (no error)</org-radio>
                <org-radio value="option2">Option 2 (no error)</org-radio>
              </org-radio-group>
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Reserve Space = false">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="false">
              <org-radio-group name="reserve-false-group-1">
                <org-radio value="option1">Option 1 (no error)</org-radio>
                <org-radio value="option2">Option 2 (no error)</org-radio>
              </org-radio-group>
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
              <org-radio-group name="reserve-false-group-2">
                <org-radio value="option1">Option 1 (with error)</org-radio>
                <org-radio value="option2">Option 2 (with error)</org-radio>
              </org-radio-group>
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false">
              <org-radio-group name="reserve-false-group-3">
                <org-radio value="option1">Option 1 (no error)</org-radio>
                <org-radio value="option2">Option 2 (no error)</org-radio>
              </org-radio-group>
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>reserveValidationSpace=true</strong>: Space is always reserved for validation messages (maintains consistent spacing between radio groups)</li>
          <li><strong>reserveValidationSpace=false</strong>: Space is only allocated when a validation message is present (radio groups collapse together when no errors)</li>
          <li>Notice how the left column maintains equal spacing between all radio groups</li>
          <li>Notice how the right column's radio groups 1 and 3 are closer together since they have no error messages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Radio, RadioGroup, FormField, FormFields, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
