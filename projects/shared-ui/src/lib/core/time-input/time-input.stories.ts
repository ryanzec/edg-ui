import type { Meta, StoryObj } from '@storybook/angular';
import { TimeInput } from './time-input';
import { allInputVariants } from '../input/input';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';

const meta: Meta<TimeInput> = {
  title: 'Core/Components/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## TimeInput Component

  A specialized time input component that provides an intuitive interface for entering times in 12-hour format with keyboard navigation and segment-based editing.

  ### Features
  - 12-hour time format (hh:mm am/pm)
  - Keyboard navigation with arrow keys
  - Smart digit entry with auto-advancement
  - Up/Down arrow keys to increment/decrement values
  - Segment-based selection (hours, minutes, am/pm)
  - Support for both reactive forms and two-way model binding
  - Two visual variants: bordered and borderless
  - Disabled and readonly states

  ### Time Format
  - Hours: 01-12 with leading zero
  - Minutes: 00-59 with leading zero
  - Period: am or pm (lowercase)
  - Example: "03:45 pm"

  ### Keyboard Interactions
  - **Focus**: Hours segment is automatically selected
  - **Left/Right Arrow**: Navigate between segments (hours ↔ minutes ↔ am/pm)
  - **Up/Down Arrow**: Increment/decrement current segment with looping
  - **Number Keys**: Smart digit entry with auto-advancement
    - Hours: 0-1 waits for second digit, 2-9 auto-adds leading 0
    - Minutes: 0-5 waits for second digit, 6-9 auto-adds leading 0
  - **A/P Keys**: In am/pm segment, set to am or pm respectively
  - **Delete/Backspace**: Ignored (format is always maintained)

  ### Usage Examples
  \`\`\`html
  <!-- Basic time input -->
  <org-time-input name="time-input" />

  <!-- With default value -->
  <org-time-input name="time-input" [defaultValue]="'02:30 pm'" />

  <!-- Two-way model binding -->
  <org-time-input name="time-input" [(value)]="myTime" />

  <!-- Borderless variant -->
  <org-time-input name="time-input" variant="borderless" />

  <!-- Disabled state -->
  <org-time-input name="time-input" [disabled]="true" />

  <!-- Readonly state -->
  <org-time-input name="time-input" [readonly]="true" [defaultValue]="'09:15 am'" />

  <!-- Reactive form binding -->
  <org-time-input name="time-input" [formControl]="timeControl" />

  <!-- With accessible label -->
  <org-time-input name="time-input" ariaLabel="Appointment time (12-hour format)" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TimeInput>;

export const Default: Story = {
  args: {
    name: 'time-input',
    variant: 'bordered',
    placeholder: 'Enter time',
    disabled: false,
    readonly: false,
    defaultValue: '',
    autoFocus: false,
    ariaLabel: null,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute for the input element',
    },
    variant: {
      control: 'select',
      options: allInputVariants,
      description: 'The visual variant of the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    defaultValue: {
      control: 'text',
      description: 'Default time value in format "hh:mm am/pm", only applied when no reactive form value is present',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether the input should automatically receive focus',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label passed through to the native input element',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default time input with bordered variant. Use the controls below to interact with the component.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of bordered and borderless variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Variant Comparison"
        currentState="Comparing bordered and borderless variants"
      >
        <org-storybook-example-container-section label="Bordered (default)">
          <org-time-input name="bordered-time-input" variant="bordered" [defaultValue]="'09:30 am'" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless">
          <org-time-input name="borderless-time-input" variant="borderless" [defaultValue]="'02:45 pm'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>bordered</strong>: Standard input with visible border (default)</li>
          <li><strong>borderless</strong>: Minimal styling without border</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of disabled, readonly, and normal states.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Input States"
        currentState="Comparing disabled, readonly, and normal states"
      >
        <org-storybook-example-container-section label="Normal (enabled)">
          <org-time-input name="normal-time-input" [defaultValue]="'10:15 am'" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled">
          <org-time-input name="disabled-time-input" [disabled]="true" [defaultValue]="'03:30 pm'" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Readonly">
          <org-time-input name="readonly-time-input" [readonly]="true" [defaultValue]="'11:45 am'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal</strong>: Fully interactive with keyboard navigation</li>
          <li><strong>Disabled</strong>: Cannot focus, edit, or interact</li>
          <li><strong>Readonly</strong>: Can focus but cannot edit</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates keyboard navigation features. Click in the input and use arrow keys to navigate between segments (hours, minutes, am/pm).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Keyboard Navigation"
        currentState="Try using arrow keys to navigate and edit the time"
      >
        <org-storybook-example-container-section label="Interactive time input">
          <org-time-input name="keyboard-nav-time-input" [defaultValue]="'12:00 pm'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Left/Right Arrow</strong>: Navigate between hours, minutes, and am/pm segments</li>
          <li><strong>Up/Down Arrow</strong>: Increment or decrement the current segment</li>
          <li><strong>Number Keys</strong>: Enter digits with smart auto-advancement</li>
          <li><strong>A/P Keys</strong>: When on am/pm segment, set to am or pm</li>
          <li><strong>Focus</strong>: Hours segment is automatically selected</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const DefaultValues: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time inputs with various default values.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Default Values"
        currentState="Comparing inputs with different default times"
      >
        <org-storybook-example-container-section label="No default (empty)">
          <org-time-input name="no-default-time-input" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Morning time (09:00 am)">
          <org-time-input name="morning-time-input" [defaultValue]="'09:00 am'" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Afternoon time (02:30 pm)">
          <org-time-input name="afternoon-time-input" [defaultValue]="'02:30 pm'" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Evening time (08:45 pm)">
          <org-time-input name="evening-time-input" [defaultValue]="'08:45 pm'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>default values must be in format: "hh:mm am/pm"</li>
          <li>hours must be 01-12, minutes 00-59</li>
          <li>invalid values will be ignored and component will start with default state</li>
          <li>defaultValue is ignored when a reactive form value is present</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AutoFocus: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time input with autoFocus enabled. The input receives focus automatically on mount.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Auto Focus"
        currentState="Time input automatically focused on mount"
      >
        <org-storybook-example-container-section label="Auto-focused input">
          <org-time-input name="auto-focus-time-input" [autoFocus]="true" [defaultValue]="'08:30 am'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>the input receives focus automatically when the story loads</li>
          <li>the hours segment is selected on initial focus</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AriaLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time input with a custom aria-label for screen reader accessibility.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Aria Label"
        currentState="Time input with custom accessible label"
      >
        <org-storybook-example-container-section label="With ariaLabel">
          <org-time-input
            name="aria-label-time-input"
            ariaLabel="Appointment time (12-hour format)"
            [defaultValue]="'10:00 am'"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without ariaLabel">
          <org-time-input name="no-aria-label-time-input" [defaultValue]="'10:00 am'" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>screen readers will announce the ariaLabel value when the input is focused</li>
          <li>use ariaLabel to describe the purpose and expected format of the time input</li>
          <li>inspect the native input element to verify the aria-label attribute is applied</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-time-input-reactive-form-story',
  template: `
    <org-storybook-example-container title="Reactive Form Binding" currentState="Time input bound to FormControl">
      <org-storybook-example-container-section label="Time Input with FormControl">
        <org-time-input name="reactive-form-time-input" [formControl]="timeControl()" />
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Form Value">
        <div class="flex flex-col gap-2">
          <div><strong>Current Value:</strong> {{ timeControl().value || 'empty' }}</div>
          <div><strong>Valid:</strong> {{ timeControl().valid }}</div>
          <div><strong>Touched:</strong> {{ timeControl().touched }}</div>
          <div><strong>Dirty:</strong> {{ timeControl().dirty }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>component implements ControlValueAccessor for reactive form integration</li>
        <li>form value updates as you edit the time</li>
        <li>supports all standard form control features (validation, dirty, touched, etc.)</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection, ReactiveFormsModule],
})
class TimeInputReactiveFormStoryComponent {
  public timeControl = signal(new FormControl('03:15 pm'));
}

export const ReactiveFormBinding: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Time input integrated with Angular reactive forms using FormControl.',
      },
    },
  },
  render: () => ({
    moduleMetadata: {
      imports: [TimeInputReactiveFormStoryComponent],
    },
    template: '<story-time-input-reactive-form-story />',
  }),
};

@Component({
  selector: 'story-time-input-value-model-story',
  template: `
    <org-storybook-example-container title="Two-Way Model Binding" currentState="Time input bound via model()">
      <org-storybook-example-container-section label="Time Input">
        <org-time-input name="value-model-time-input" [(value)]="currentValue" />
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Bound Value">
        <div class="flex flex-col gap-2">
          <div><strong>Current Value:</strong> {{ currentValue }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>value</strong> supports two-way binding via <code>[(value)]</code></li>
        <li>the parent value updates in real time as the time is edited</li>
        <li>the bound value is always in format "hh:mm am/pm"</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [TimeInput, StorybookExampleContainer, StorybookExampleContainerSection],
})
class TimeInputValueModelStoryComponent {
  public currentValue = '12:00 pm';
}

export const ValueModelBinding: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates two-way binding via the value model() signal.',
      },
    },
  },
  render: () => ({
    moduleMetadata: {
      imports: [TimeInputValueModelStoryComponent],
    },
    template: '<story-time-input-value-model-story />',
  }),
};
