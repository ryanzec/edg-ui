import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Combobox } from './combobox';
import { type ComboboxOptionInput } from '../combobox-store/combobox-store';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Button } from '../button/button';
import { FormFields } from '../form-fields/form-fields';
import { FormField } from '../form-fields/form-field';

const fruitOptions: ComboboxOptionInput[] = [
  { label: 'Apple', value: 'apple', groupLabel: 'Fruits' },
  { label: 'Banana', value: 'banana', groupLabel: 'Fruits', disabled: true },
  { label: 'Cherry', value: 'cherry', groupLabel: 'Fruits' },
  { label: 'Mango', value: 'mango', groupLabel: 'Fruits' },
  { label: 'Orange', value: 'orange', groupLabel: 'Fruits' },
  { label: 'Strawberry', value: 'strawberry', groupLabel: 'Fruits' },
  { label: 'Carrot', value: 'carrot', groupLabel: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', groupLabel: 'Vegetables' },
  { label: 'Spinach', value: 'spinach', groupLabel: 'Vegetables' },
  { label: 'Tomato', value: 'tomato', groupLabel: 'Vegetables' },
  { label: 'Chicken', value: 'chicken', groupLabel: 'Proteins' },
  { label: 'Beef', value: 'beef', groupLabel: 'Proteins' },
  { label: 'Tofu', value: 'tofu', groupLabel: 'Proteins' },
  { label: 'Salmon', value: 'salmon', groupLabel: 'Proteins' },
];

const simpleOptions: ComboboxOptionInput[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
];

const meta: Meta<Combobox> = {
  title: 'Core/Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Combobox Component

  A powerful combobox/autocomplete component for single and multi-select scenarios with full keyboard accessibility.

  ### Features
  - Single and multi-select modes
  - Keyboard navigation (Arrow keys, Enter, Home, End, Escape)
  - Auto-filtering with custom filter support
  - Grouping support
  - Allow new options (tags input mode)
  - Reactive forms support (ControlValueAccessor)
  - Simple forms support
  - Auto-show options on focus
  - Accessible overlay positioning with CDK
  - Scrollable options list
  - Tag display for multi-select

  ### Keyboard Navigation
  - **Enter**: Select focused option
  - **ArrowDown**: Navigate to next option (opens menu if closed)
  - **ArrowUp**: Navigate to previous option (opens menu if closed)
  - **Home**: Focus first option
  - **End**: Focus last option
  - **Escape**: Close menu or blur input

  ### Usage Examples
  \`\`\`html
  <!-- Basic single select -->
  <org-combobox
    [options]="options"
    placeholder="Select an option..."
  />

  <!-- Multi-select with grouping -->
  <org-combobox
    [options]="options"
    [isMultiSelect]="true"
    [isGroupingEnabled]="true"
    placeholder="Select multiple options..."
  />

  <!-- With reactive forms -->
  <org-combobox
    [formControl]="myControl"
    [options]="options"
  />

  <!-- Custom filtering -->
  <org-combobox
    [options]="options"
    [optionFilter]="customFilterFn"
  />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Combobox>;

@Component({
  selector: 'story-combobox-default-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container title="Default">
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-combobox
            [name]="name()"
            [options]="options()"
            [placeholder]="placeholder()"
            [isMultiSelect]="isMultiSelect()"
            [autoShowOption]="autoShowOption()"
            [allowNewOptions]="allowNewOptions()"
            [isGroupingEnabled]="isGroupingEnabled()"
            [disabled]="disabled()"
            [containerClass]="containerClass()"
          />
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class ComboboxDefaultDemo {
  protected readonly name = input('combobox');
  protected readonly options = input<ComboboxOptionInput[]>(simpleOptions);
  protected readonly placeholder = input('Select...');
  protected readonly isMultiSelect = input(false);
  protected readonly autoShowOption = input(true);
  protected readonly allowNewOptions = input(false);
  protected readonly isGroupingEnabled = input(false);
  protected readonly disabled = input(false);
  protected readonly containerClass = input('');
}

export const Default: Story = {
  args: {
    name: 'combobox',
    options: simpleOptions,
    placeholder: 'Select...',
    isMultiSelect: false,
    autoShowOption: true,
    allowNewOptions: false,
    isGroupingEnabled: false,
    disabled: false,
    containerClass: '',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute for the combobox input element',
    },
    options: {
      control: 'object',
      description: 'Array of options to display',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    isMultiSelect: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
    autoShowOption: {
      control: 'boolean',
      description: 'Whether options should show automatically on focus',
    },
    allowNewOptions: {
      control: 'boolean',
      description: 'Whether new options can be created',
    },
    isGroupingEnabled: {
      control: 'boolean',
      description: 'Whether options should be grouped',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the combobox is disabled',
    },
    containerClass: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <story-combobox-default-demo
        [name]="name"
        [options]="options"
        [placeholder]="placeholder"
        [isMultiSelect]="isMultiSelect"
        [autoShowOption]="autoShowOption"
        [allowNewOptions]="allowNewOptions"
        [isGroupingEnabled]="isGroupingEnabled"
        [disabled]="disabled"
        [containerClass]="containerClass"
      />
    `,
    moduleMetadata: {
      imports: [ComboboxDefaultDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-single-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Combobox,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Button,
    JsonPipe,
    FormFields,
    FormField,
  ],
  template: `
    <org-storybook-example-container
      title="Single Select"
      [currentState]="'Selected: ' + (selectedValues() ? (selectedValues() | json) : 'None')"
    >
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-form-fields>
            <org-form-field>
              <org-combobox
                #combobox
                name="single-select"
                [options]="options"
                placeholder="Select a fruit..."
                (selectedValuesChanged)="selectedValuesChange($event)"
                (inputValueChanged)="inputValueChange($event)"
              />
            </org-form-field>
          </org-form-fields>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="combobox.open()">Open</org-button>
          <org-button color="primary" size="sm" (clicked)="combobox.close()">Close</org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions(['apple'])">
            Select Apple
          </org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions([])">
            Clear Selection
          </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Values:</strong> {{ selectedValues() ? (selectedValues() | json) : 'None' }}</div>
          <div><strong>Input Value:</strong> "{{ inputValue() }}"</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Only one option can be selected at a time</li>
        <li>Input displays selected option label when not focused</li>
        <li>Options menu closes after selection</li>
        <li>Arrow keys navigate through options</li>
        <li>Enter selects the focused option</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxSingleSelectDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[] | null>(null);
  protected inputValue = signal<string>('');

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }

  protected inputValueChange(value: string): void {
    console.log('Input value changed:', value);
    this.inputValue.set(value);
  }
}

export const SingleSelect: Story = {
  render: () => ({
    template: '<story-combobox-single-select-demo />',
    moduleMetadata: {
      imports: [ComboboxSingleSelectDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-multi-select-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Multi Select"
      [currentState]="'Selected: ' + selectedValues().length + ' items'"
    >
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-combobox
            #combobox
            name="multi-select"
            [options]="options"
            [isMultiSelect]="true"
            placeholder="Select multiple fruits..."
            (selectedValuesChanged)="selectedValuesChange($event)"
            (inputValueChanged)="inputValueChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="combobox.open()">Open</org-button>
          <org-button color="primary" size="sm" (clicked)="combobox.close()">Close</org-button>
          <org-button
            color="secondary"
            size="sm"
            (clicked)="combobox.setSelectedOptions(['apple', 'banana', 'cherry'])"
          >
            Select Multiple
          </org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions([])"> Clear All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div>
            <strong>Selected Values:</strong>
            {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
          </div>
          <div><strong>Input Value:</strong> "{{ inputValue() }}"</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Multiple options can be selected</li>
        <li>Selected items shown as tags in the input</li>
        <li>Tags can be removed by clicking X</li>
        <li>Options menu stays open after selection</li>
        <li>Input clears after each selection</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxMultiSelectDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[]>([]);
  protected inputValue = signal<string>('');

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }

  protected inputValueChange(value: string): void {
    console.log('Input value changed:', value);
    this.inputValue.set(value);
  }
}

export const MultiSelect: Story = {
  render: () => ({
    template: '<story-combobox-multi-select-demo />',
    moduleMetadata: {
      imports: [ComboboxMultiSelectDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-grouped-options-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, JsonPipe],
  template: `
    <org-storybook-example-container title="Grouped Options" [currentState]="'Grouping enabled'">
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-combobox
            name="grouped-options"
            [options]="options"
            [isGroupingEnabled]="true"
            placeholder="Select from grouped options..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Values:</strong> {{ selectedValues() ? (selectedValues() | json) : 'None' }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Options are organized by groups (Fruits, Vegetables, Proteins)</li>
        <li>Each group has a header</li>
        <li>Keyboard navigation respects group boundaries</li>
        <li>Groups are sorted alphabetically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxGroupedOptionsDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[] | null>(null);

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const GroupedOptions: Story = {
  render: () => ({
    template: '<story-combobox-grouped-options-demo />',
    moduleMetadata: {
      imports: [ComboboxGroupedOptionsDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-custom-filter-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, JsonPipe],
  template: `
    <org-storybook-example-container title="Custom Filter" [currentState]="'Custom starts-with filter'">
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-combobox
            name="custom-filter"
            [options]="options"
            [optionFilter]="customFilter"
            placeholder="Type to filter (starts with)..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Values:</strong> {{ selectedValues() ? (selectedValues() | json) : 'None' }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Custom filter matches options that start with input text</li>
        <li>Case-insensitive matching</li>
        <li>Try typing "a" to see Apple, or "b" to see Banana and Broccoli</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxCustomFilterDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[] | null>(null);

  protected customFilter = (inputValue: string, option: { label: string }): boolean => {
    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
  };

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const CustomFilter: Story = {
  render: () => ({
    template: '<story-combobox-custom-filter-demo />',
    moduleMetadata: {
      imports: [ComboboxCustomFilterDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-reactive-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Combobox,
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Button,
    JsonPipe,
  ],
  template: `
    <org-storybook-example-container
      title="Reactive Forms"
      [currentState]="'Form value: ' + (formControl.value | json)"
    >
      <org-storybook-example-container-section label="Combobox with FormControl">
        <div class="max-w-sm">
          <org-combobox
            name="reactive-form"
            [formControl]="formControl"
            [options]="options"
            [isMultiSelect]="true"
            placeholder="Select options..."
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="formControl.setValue(['apple', 'banana'])">
            Set to [apple, banana]
          </org-button>
          <org-button color="secondary" size="sm" (clicked)="formControl.setValue([])"> Clear </org-button>
          <org-button color="secondary" size="sm" (clicked)="formControl.disable()"> Disable </org-button>
          <org-button color="secondary" size="sm" (clicked)="formControl.enable()"> Enable </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Form State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Form Value:</strong> {{ formControl.value | json }}</div>
          <div><strong>Valid:</strong> {{ formControl.valid }}</div>
          <div><strong>Touched:</strong> {{ formControl.touched }}</div>
          <div><strong>Dirty:</strong> {{ formControl.dirty }}</div>
          <div><strong>Disabled:</strong> {{ formControl.disabled }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Implements ControlValueAccessor for reactive forms</li>
        <li>Form control value is always an array</li>
        <li>Supports setValue, disable, enable</li>
        <li>Tracks touched and dirty states</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxReactiveFormsDemo {
  protected options = fruitOptions;
  protected formControl = new FormControl<(string | number)[]>([]);
}

@Component({
  selector: 'story-combobox-simple-forms-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Simple Forms"
      [currentState]="'Selected: ' + (selectedValues().length > 0 ? (selectedValues() | json) : 'None')"
    >
      <org-storybook-example-container-section label="Combobox with Two-Way Binding">
        <div class="max-w-sm">
          <org-combobox
            #combobox
            name="simple-form"
            [options]="options"
            [isMultiSelect]="true"
            placeholder="Select options..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="combobox.setSelectedOptions(['apple', 'banana'])">
            Set to [apple, banana]
          </org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions([])"> Clear </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div><strong>Selected Values:</strong> {{ selectedValues() | json }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Uses event binding instead of form control</li>
        <li>Signal-based state management</li>
        <li>Simpler for basic forms without validation</li>
        <li>Direct access to component API methods</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxSimpleFormsDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[]>([]);

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const ReactiveForm: Story = {
  render: () => ({
    template: '<story-combobox-reactive-forms-demo />',
    moduleMetadata: {
      imports: [ComboboxReactiveFormsDemo],
    },
  }),
};

export const SimpleForm: Story = {
  render: () => ({
    template: '<story-combobox-simple-forms-demo />',
    moduleMetadata: {
      imports: [ComboboxSimpleFormsDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-allow-new-options-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Allow New Options"
      [currentState]="'Selected: ' + (selectedValues().length > 0 ? (selectedValues() | json) : 'None')"
    >
      <org-storybook-example-container-section label="Combobox">
        <div class="max-w-sm">
          <org-combobox
            name="allow-new-options"
            [options]="options"
            [allowNewOptions]="true"
            placeholder="Type to search or create..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div>
            <strong>Selected Values:</strong> {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Typing a value not in the list and pressing Enter adds it as a new selection</li>
        <li>New options are marked with isNew flag and shown in the selection display</li>
        <li>Existing options still match via the standard filter</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxAllowNewOptionsDemo {
  protected options = simpleOptions;
  protected selectedValues = signal<(string | number)[]>([]);

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const AllowNewOptions: Story = {
  render: () => ({
    template: '<story-combobox-allow-new-options-demo />',
    moduleMetadata: {
      imports: [ComboboxAllowNewOptionsDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-filter-selected-options-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container
      title="Filter Selected Options"
      [currentState]="'Selected: ' + (selectedValues().length > 0 ? (selectedValues() | json) : 'None')"
    >
      <org-storybook-example-container-section label="With filterSelectedOptions (default)">
        <div class="max-w-sm">
          <org-combobox
            name="filter-selected-on"
            [options]="options"
            [isMultiSelect]="true"
            [filterSelectedOptions]="true"
            placeholder="Selected options are hidden..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Without filterSelectedOptions">
        <div class="max-w-sm">
          <org-combobox
            name="filter-selected-off"
            [options]="options"
            [isMultiSelect]="true"
            [filterSelectedOptions]="false"
            placeholder="Selected options remain visible..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div>
            <strong>Selected Values:</strong> {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Top combobox hides already-selected options from the dropdown</li>
        <li>Bottom combobox keeps already-selected options visible and re-selectable</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxFilterSelectedOptionsDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[]>([]);

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const FilterSelectedOptions: Story = {
  render: () => ({
    template: '<story-combobox-filter-selected-options-demo />',
    moduleMetadata: {
      imports: [ComboboxFilterSelectedOptionsDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-states-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container title="States">
      <org-storybook-example-container-section label="Default">
        <div class="max-w-2xs">
          <org-combobox name="state-default" [options]="options" placeholder="Default state" />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Disabled">
        <div class="max-w-2xs">
          <org-combobox name="state-disabled" [options]="options" [disabled]="true" placeholder="Disabled state" />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="With Auto Show Disabled">
        <div class="max-w-2xs">
          <org-combobox
            name="state-no-auto"
            [options]="options"
            [autoShowOption]="false"
            placeholder="Auto show disabled"
          />
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Default state is interactive</li>
        <li>Disabled state is non-interactive</li>
        <li>Auto show can be disabled to require manual opening</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxStatesDemo {
  protected options = simpleOptions;
}

export const States: Story = {
  render: () => ({
    template: '<story-combobox-states-demo />',
    moduleMetadata: {
      imports: [ComboboxStatesDemo],
    },
  }),
};

@Component({
  selector: 'story-combobox-validation-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, FormField, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container title="Validation" [currentState]="'Has error: ' + hasError()">
      <org-storybook-example-container-section label="With Validation Message">
        <div class="max-w-sm">
          <org-form-field [validationMessage]="validationMessage()">
            <org-combobox
              #combobox
              name="validation"
              [options]="options"
              [isMultiSelect]="true"
              placeholder="Select at least one option..."
              (selectedValuesChanged)="selectedValuesChange($event)"
            />
          </org-form-field>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="validateSelection()"> Trigger Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="clearValidation()"> Clear Validation </org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions([])">
            Clear Selection
          </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div>
            <strong>Selected Values:</strong>
            {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
          </div>
          <div><strong>Validation Message:</strong> "{{ validationMessage() }}"</div>
          <div><strong>Has Error:</strong> {{ hasError() }}</div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Validation message is displayed when provided</li>
        <li>Combobox shows error state with red border and error icon</li>
        <li>Validation message appears below the combobox</li>
        <li>Validation can be triggered programmatically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxValidationDemo {
  protected options = fruitOptions;
  protected selectedValues = signal<(string | number)[]>([]);
  protected validationMessage = signal<string | null>(null);
  protected hasError = computed<boolean>(() => !!this.validationMessage()?.trim());

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);

    // Clear validation when user makes a selection
    if (values.length > 0 && this.hasError()) {
      this.clearValidation();
    }
  }

  protected validateSelection(): void {
    if (this.selectedValues().length === 0) {
      this.validationMessage.set('At least one option is required');

      return;
    }

    this.validationMessage.set('');
  }

  protected clearValidation(): void {
    this.validationMessage.set('');
  }
}

export const Validation: Story = {
  render: () => ({
    template: '<story-combobox-validation-demo />',
    moduleMetadata: {
      imports: [ComboboxValidationDemo],
    },
  }),
};

const largeDatasetOptions: ComboboxOptionInput[] = Array.from({ length: 100 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: `option-${index + 1}`,
}));

@Component({
  selector: 'story-combobox-scrolling-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Combobox, StorybookExampleContainer, StorybookExampleContainerSection, Button, JsonPipe],
  template: `
    <org-storybook-example-container title="Large Dataset - Scrolling" [currentState]="'100 options available'">
      <org-storybook-example-container-section label="Combobox with 100 Options">
        <div class="max-w-sm">
          <org-combobox
            #combobox
            name="scrolling"
            [options]="options"
            [isMultiSelect]="true"
            placeholder="Select options..."
            (selectedValuesChanged)="selectedValuesChange($event)"
          />
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex flex-wrap gap-2">
          <org-button color="primary" size="sm" (clicked)="combobox.open()">Open</org-button>
          <org-button color="primary" size="sm" (clicked)="combobox.close()">Close</org-button>
          <org-button
            color="secondary"
            size="sm"
            (clicked)="combobox.setSelectedOptions(['option-1', 'option-50', 'option-100'])"
          >
            Select 1, 50, 100
          </org-button>
          <org-button color="secondary" size="sm" (clicked)="combobox.setSelectedOptions([])"> Clear All </org-button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="State">
        <div class="text-sm flex flex-col gap-1">
          <div>
            <strong>Selected Values:</strong>
            {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
          </div>
        </div>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Options menu is scrollable with max height of 400px</li>
        <li>Keyboard navigation scrolls focused option into view</li>
        <li>Arrow keys, Home, and End keys work correctly with scroll</li>
        <li>Performance remains smooth with large dataset</li>
        <li>Filtering reduces the visible options dynamically</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ComboboxScrollingDemo {
  protected options = largeDatasetOptions;
  protected selectedValues = signal<(string | number)[]>([]);

  protected selectedValuesChange(values: (string | number)[]): void {
    console.log('Selected values changed:', values);
    this.selectedValues.set(values);
  }
}

export const Scrolling: Story = {
  render: () => ({
    template: '<story-combobox-scrolling-demo />',
    moduleMetadata: {
      imports: [ComboboxScrollingDemo],
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
              <org-combobox
                name="reserve-true-combobox-1"
                placeholder="Combobox 1 (no error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
              <org-combobox
                name="reserve-true-combobox-2"
                placeholder="Combobox 2 (with error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="true">
              <org-combobox
                name="reserve-true-combobox-3"
                placeholder="Combobox 3 (no error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Reserve Space = false">
          <org-form-fields>
            <org-form-field [reserveValidationSpace]="false">
              <org-combobox
                name="reserve-false-combobox-1"
                placeholder="Combobox 1 (no error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
              <org-combobox
                name="reserve-false-combobox-2"
                placeholder="Combobox 2 (with error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
            <org-form-field [reserveValidationSpace]="false">
              <org-combobox
                name="reserve-false-combobox-3"
                placeholder="Combobox 3 (no error)"
                [options]="[
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]"
              />
            </org-form-field>
          </org-form-fields>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>reserveValidationSpace=true</strong>: Space is always reserved for validation messages (maintains consistent spacing between comboboxes)</li>
          <li><strong>reserveValidationSpace=false</strong>: Space is only allocated when a validation message is present (comboboxes collapse together when no errors)</li>
          <li>Notice how the left column maintains equal spacing between all comboboxes</li>
          <li>Notice how the right column's comboboxes 1 and 3 are closer together since they have no error messages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Combobox, FormField, FormFields, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
