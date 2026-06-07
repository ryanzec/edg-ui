import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { delay, filter, of, switchMap, tap } from 'rxjs';
import { Combobox, allComboboxDropDownWidthModes, type ComboboxDropDownWidthMode } from './combobox';
import { type ComboboxOptionInput } from '../combobox-store/combobox-store';
import { Button } from '../button/button';
import { ButtonToggle, type ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormFields } from '../form-fields/form-fields';
import { FormField } from '../form-fields/form-field';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControlsGroup } from '../../example/design-system-demo/design-system-demo-controls-group';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';

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

const largeDatasetOptions: ComboboxOptionInput[] = Array.from({ length: 100 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: `option-${index + 1}`,
}));

const widthDemoOptions: ComboboxOptionInput[] = [
  { label: 'Short', value: 'short' },
  { label: 'Medium length option', value: 'medium' },
  { label: 'A considerably longer option label than the trigger input itself', value: 'long' },
];

/** simulated latency (ms) for the async-simulation story's fake request */
const ASYNC_SIMULATION_DELAY_MS = 2000;

/** minimum characters before the async-simulation story issues a request */
const ASYNC_SIMULATION_CHARACTER_THRESHOLD = 2;

const asyncNamePool = [
  'Avery',
  'Blake',
  'Cameron',
  'Drew',
  'Emerson',
  'Finley',
  'Gray',
  'Harper',
  'Indie',
  'Jordan',
  'Kai',
  'Logan',
  'Morgan',
  'Noah',
  'Oakley',
  'Parker',
  'Quinn',
  'Riley',
  'Sage',
  'Tatum',
];

const asyncDatasetOptions: ComboboxOptionInput[] = Array.from({ length: 100 }, (_, index) => ({
  label: `${asyncNamePool[index % asyncNamePool.length]} ${index + 1}`,
  value: `async-${index + 1}`,
}));

const liveDemoSelectionItems: ButtonToggleItem[] = [
  { label: 'single', value: 'single', buttonColor: 'primary' },
  { label: 'multi', value: 'multi', buttonColor: 'primary' },
];

const liveDemoWidthModeItems: ButtonToggleItem[] = allComboboxDropDownWidthModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

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

  A select-like form field with an \`org-input\` shell as the trigger and an anchored panel of selectable rows. Built for type-to-filter pickers in single or multi-select modes, with an always-on pre check gutter so labels align whether or not a row is selected.

  ### Features
  - Single and multi-select modes
  - Keyboard navigation (Arrow keys, Enter, Home, End, Escape)
  - Auto-filtering with custom filter support
  - Grouping support with sticky group labels
  - Allow new options (tags input mode)
  - Reactive forms support (ControlValueAccessor)
  - Auto-show options on focus
  - Anchored overlay positioning with CDK
  - Always-reserved pre check gutter so labels align across rows

  ### Keyboard Navigation
  - **Enter**: Select focused option
  - **ArrowDown**: Navigate to next option (opens menu if closed)
  - **ArrowUp**: Navigate to previous option (opens menu if closed)
  - **Home**: Focus first option
  - **End**: Focus last option
  - **Escape**: Close menu or blur input
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Combobox>;

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
    dropDownWidthMode: 'minimum',
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
    dropDownWidthMode: {
      control: 'select',
      options: allComboboxDropDownWidthModes,
      description:
        'How the drop-down panel width relates to the trigger input: "minimum" (content-determined), "match" (equals the input width), or "minimum-match" (at least the input width, growing with content)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default combobox. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <org-combobox
          [name]="name"
          [options]="options"
          [placeholder]="placeholder"
          [isMultiSelect]="isMultiSelect"
          [autoShowOption]="autoShowOption"
          [allowNewOptions]="allowNewOptions"
          [isGroupingEnabled]="isGroupingEnabled"
          [disabled]="disabled"
          [containerClass]="containerClass"
          [dropDownWidthMode]="dropDownWidthMode"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [Combobox],
    },
  }),
};

@Component({
  selector: 'story-combobox-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Combobox,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlsGroup,
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
      .live-demo-combobox-wrapper {
        width: 22rem; /* 352px */
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="A real, focusable Combobox. Click the trigger to open, type to filter, ArrowUp/ArrowDown to move the cursor, Enter to pick, Esc to close. Toggle the controls to walk every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-controls-group label="Selection">
            <org-design-system-demo-control-input label="Selection">
              <org-button-toggle [items]="selectionItems" formControlName="selection" buttonSize="sm" />
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Filter selected">
              <org-checkbox-toggle
                name="live-demo-filter-selected"
                value="filter-selected"
                formControlName="filterSelectedOptions"
              >
                {{ liveDemoForm.controls.filterSelectedOptions.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Behavior">
            <org-design-system-demo-control-input label="Auto show options">
              <org-checkbox-toggle name="live-demo-auto-show" value="auto-show" formControlName="autoShowOption">
                {{ liveDemoForm.controls.autoShowOption.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Allow new options">
              <org-checkbox-toggle name="live-demo-allow-new" value="allow-new" formControlName="allowNewOptions">
                {{ liveDemoForm.controls.allowNewOptions.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
            <org-design-system-demo-control-input label="Grouping">
              <org-checkbox-toggle name="live-demo-grouping" value="grouping" formControlName="isGroupingEnabled">
                {{ liveDemoForm.controls.isGroupingEnabled.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="Layout">
            <org-design-system-demo-control-input label="Drop-down width">
              <org-button-toggle [items]="widthModeItems" formControlName="dropDownWidthMode" buttonSize="sm" />
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
          <org-design-system-demo-controls-group label="State">
            <org-design-system-demo-control-input label="Disabled">
              <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
                {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
              </org-checkbox-toggle>
            </org-design-system-demo-control-input>
          </org-design-system-demo-controls-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <div class="live-demo-combobox-wrapper">
              <org-combobox
                name="live-demo"
                placeholder="Select..."
                [options]="options"
                [isMultiSelect]="isMultiSelect()"
                [autoShowOption]="liveDemoForm.controls.autoShowOption.value"
                [allowNewOptions]="liveDemoForm.controls.allowNewOptions.value"
                [isGroupingEnabled]="liveDemoForm.controls.isGroupingEnabled.value"
                [filterSelectedOptions]="liveDemoForm.controls.filterSelectedOptions.value"
                [disabled]="liveDemoForm.controls.disabled.value"
                [dropDownWidthMode]="liveDemoForm.controls.dropDownWidthMode.value"
              />
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ComboboxLiveDemoStory {
  protected readonly options = fruitOptions;
  protected readonly selectionItems = liveDemoSelectionItems;
  protected readonly widthModeItems = liveDemoWidthModeItems;

  protected readonly liveDemoForm = new FormGroup({
    selection: new FormControl<'single' | 'multi'>('single', { nonNullable: true }),
    autoShowOption: new FormControl<boolean>(true, { nonNullable: true }),
    allowNewOptions: new FormControl<boolean>(false, { nonNullable: true }),
    isGroupingEnabled: new FormControl<boolean>(false, { nonNullable: true }),
    filterSelectedOptions: new FormControl<boolean>(true, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    dropDownWidthMode: new FormControl<ComboboxDropDownWidthMode>('minimum', { nonNullable: true }),
  });

  protected readonly isMultiSelect = computed<boolean>(() => this.liveDemoForm.controls.selection.value === 'multi');
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual / functional input on the combobox (selection mode, auto-show, allow-new, grouping, filter-selected, disabled) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: '<story-combobox-live-demo />',
    moduleMetadata: {
      imports: [ComboboxLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every combobox axis — selection mode, grouped options, allow new options, filter selected, custom filter, states, scrolling, validation, and in-context composition with FormField.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Single vs multi-select"
            description="Single-select stamps the value back into the trigger's text. Multi-select renders selected values as inline chips inside the trigger track."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4 max-w-sm">
              <org-combobox name="showcase-single" [options]="fruitOptions" placeholder="Pick a fruit..." />
              <org-combobox
                name="showcase-multi"
                [options]="fruitOptions"
                [isMultiSelect]="true"
                placeholder="Pick multiple fruits..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Single</strong>: Selecting a row stamps its label back into the trigger and closes the panel</li>
            <li><strong>Multi</strong>: Selected values render as removable inline tags; the panel stays open after each pick</li>
            <li><strong>Check gutter</strong>: Reserved on every row so labels never shift between selected and unselected states</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Drop-down width mode"
            description="dropDownWidthMode controls how the panel width relates to the trigger input: minimum (content-determined), match (equals the trigger), or minimum-match (at least the trigger, growing with content)."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4 max-w-sm">
              <org-combobox
                name="showcase-width-minimum"
                [options]="widthDemoOptions"
                dropDownWidthMode="minimum"
                placeholder="minimum — panel sized to content"
              />
              <org-combobox
                name="showcase-width-match"
                [options]="widthDemoOptions"
                dropDownWidthMode="match"
                placeholder="match — panel equals the trigger width"
              />
              <org-combobox
                name="showcase-width-minimum-match"
                [options]="widthDemoOptions"
                dropDownWidthMode="minimum-match"
                placeholder="minimum-match — at least the trigger, grows with content"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>minimum</strong>: Panel hugs its content — can be narrower than the trigger</li>
            <li><strong>match</strong>: Panel width is locked to the trigger width</li>
            <li><strong>minimum-match</strong>: Panel is at least the trigger width but grows wider for long options</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Grouped options"
            description="Options organize into groups with sticky group labels. Keyboard navigation respects group boundaries."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="max-w-sm">
              <org-combobox
                name="showcase-grouped"
                [options]="fruitOptions"
                [isGroupingEnabled]="true"
                placeholder="Select from grouped options..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Options organize by their <code>groupLabel</code> field</li>
            <li>Group labels stick to the top of their group on scroll</li>
            <li>Groups sort alphabetically; options within a group sort alphabetically</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Allow new options"
            description="When allowNewOptions is true, typing a value not in the list reveals an Add row that can be selected to create the new option."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="max-w-sm">
              <org-combobox
                name="showcase-allow-new"
                [options]="simpleOptions"
                [allowNewOptions]="true"
                placeholder="Type to search or create..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Typing a value not in the list and pressing Enter adds it as a new selection</li>
            <li>New options carry the <code>isNew</code> flag</li>
            <li>Existing options still match through the standard filter</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Filter selected options"
            description="In multi-select mode, filterSelectedOptions controls whether already-selected rows stay visible in the panel."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4 max-w-sm">
              <org-combobox
                name="showcase-filter-selected-on"
                [options]="fruitOptions"
                [isMultiSelect]="true"
                [filterSelectedOptions]="true"
                placeholder="Selected options are hidden..."
              />
              <org-combobox
                name="showcase-filter-selected-off"
                [options]="fruitOptions"
                [isMultiSelect]="true"
                [filterSelectedOptions]="false"
                placeholder="Selected options remain visible..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>filterSelectedOptions=true</strong>: Already-selected rows are hidden from the panel</li>
            <li><strong>filterSelectedOptions=false</strong>: Already-selected rows stay visible and re-selectable</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Custom filter"
            description="Pass an optionFilter function to override the default contains-match. Useful for starts-with, fuzzy, or domain-specific matching."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="max-w-sm">
              <org-combobox
                name="showcase-custom-filter"
                [options]="fruitOptions"
                [optionFilter]="customFilter"
                placeholder="Type to filter (starts with)..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Custom filter matches options that start with the input text</li>
            <li>Case-insensitive matching</li>
            <li>Try typing "a" to see Apple, or "b" to see Banana and Broccoli</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="States"
            description="Default, disabled, and auto-show-disabled comboboxes side by side."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-4 max-w-sm">
              <org-combobox name="showcase-state-default" [options]="simpleOptions" placeholder="Default state" />
              <org-combobox
                name="showcase-state-disabled"
                [options]="simpleOptions"
                [disabled]="true"
                placeholder="Disabled state"
              />
              <org-combobox
                name="showcase-state-no-auto"
                [options]="simpleOptions"
                [autoShowOption]="false"
                placeholder="Auto-show disabled — click to open"
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: Interactive, opens on focus</li>
            <li><strong>Disabled</strong>: Non-interactive, reduced opacity</li>
            <li><strong>Auto-show disabled</strong>: Requires manual click / arrow-key to open</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Scrolling — large dataset"
            description="Panel caps its height and scrolls. Keyboard navigation scrolls the focused option into view."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="max-w-sm">
              <org-combobox
                name="showcase-scrolling"
                [options]="largeDatasetOptions"
                [isMultiSelect]="true"
                placeholder="100 options — scroll the panel..."
              />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Panel caps its height and overflows into a scroll area</li>
            <li>Keyboard navigation scrolls the focused option into view</li>
            <li>ArrowUp / ArrowDown / Home / End keys all work correctly with scroll</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context — with Label"
            description="A FormField wrapper stacks a Label, the Combobox, and a helper / error message. The fixed check gutter in the panel keeps labels aligned across rows."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="max-w-sm">
              <org-form-fields>
                <org-form-field validationMessage="Pick a fruit to continue.">
                  <org-combobox
                    name="showcase-in-context-required"
                    [options]="fruitOptions"
                    placeholder="Pick a fruit..."
                  />
                </org-form-field>
                <org-form-field>
                  <org-combobox
                    name="showcase-in-context-tags"
                    [options]="fruitOptions"
                    [isMultiSelect]="true"
                    placeholder="Pick a few fruits..."
                  />
                </org-form-field>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>FormField stacks Label + Combobox + helper / error in a consistent rhythm</li>
            <li>Validation messages render below the combobox; the trigger picks up the error state from FormField</li>
            <li>Multi-select chips render inside the trigger track in tag rhythm</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Validation space reservation"
            description="reserveValidationSpace controls whether space is always reserved for validation messages so layouts don't shift when errors appear / disappear."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="grid grid-cols-2 gap-4">
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="true">
                  <org-combobox
                    name="showcase-reserve-true-1"
                    placeholder="Reserve = true (no error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
                  <org-combobox
                    name="showcase-reserve-true-2"
                    placeholder="Reserve = true (with error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true">
                  <org-combobox
                    name="showcase-reserve-true-3"
                    placeholder="Reserve = true (no error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
              </org-form-fields>
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="false">
                  <org-combobox
                    name="showcase-reserve-false-1"
                    placeholder="Reserve = false (no error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
                  <org-combobox
                    name="showcase-reserve-false-2"
                    placeholder="Reserve = false (with error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false">
                  <org-combobox
                    name="showcase-reserve-false-3"
                    placeholder="Reserve = false (no error)"
                    [options]="simpleOptions"
                  />
                </org-form-field>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>reserveValidationSpace=true</strong>: Space is always reserved for validation messages — comboboxes stay vertically aligned</li>
            <li><strong>reserveValidationSpace=false</strong>: Space is only allocated when an error is present — comboboxes collapse together when no errors</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      fruitOptions,
      simpleOptions,
      largeDatasetOptions,
      widthDemoOptions,
      customFilter: (inputValue: string, option: { label: string }): boolean =>
        option.label.toLowerCase().startsWith(inputValue.toLowerCase()),
    },
    moduleMetadata: {
      imports: [
        Combobox,
        FormField,
        FormFields,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-combobox-non-form-usage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Combobox,
    Button,
    JsonPipe,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Non-form usage"
          description="Direct event-binding pattern. Selected values come back through the (selectedValuesChanged) output and you drive the combobox imperatively via its public api."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-4 max-w-sm">
            <org-combobox
              #combobox
              name="non-form-usage"
              [options]="options"
              [isMultiSelect]="true"
              placeholder="Pick a few fruits..."
              (selectedValuesChanged)="onSelectedValuesChanged($event)"
              (inputValueChanged)="onInputValueChanged($event)"
            />
            <div class="flex flex-wrap gap-2">
              <org-button color="primary" size="sm" label="Open" (clicked)="combobox.open()" />
              <org-button color="primary" size="sm" label="Close" (clicked)="combobox.close()" />
              <org-button
                color="secondary"
                size="sm"
                label="Set [apple, banana]"
                (clicked)="combobox.setSelectedOptions(['apple', 'banana'])"
              />
              <org-button color="secondary" size="sm" label="Clear" (clicked)="combobox.setSelectedOptions([])" />
            </div>
            <div class="text-sm flex flex-col gap-1">
              <div>
                <strong>Selected:</strong> {{ selectedValues().length > 0 ? (selectedValues() | json) : 'None' }}
              </div>
              <div><strong>Input:</strong> "{{ inputValue() }}"</div>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Use <code>(selectedValuesChanged)</code> to listen for selection changes</li>
          <li>Use <code>(inputValueChanged)</code> to listen for filter-text changes</li>
          <li>
            Use the public api (<code>open()</code>, <code>close()</code>, <code>setSelectedOptions()</code>) to drive
            the combobox imperatively
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class ComboboxNonFormUsageStory {
  protected readonly options = fruitOptions;
  protected readonly selectedValues = signal<(string | number)[]>([]);
  protected readonly inputValue = signal<string>('');

  protected onSelectedValuesChanged(values: (string | number)[]): void {
    console.log('selected values changed:', values);
    this.selectedValues.set(values);
  }

  protected onInputValueChanged(value: string): void {
    console.log('input value changed:', value);
    this.inputValue.set(value);
  }
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates using the combobox without Angular forms. State flows through (selectedValuesChanged) / (inputValueChanged) outputs and you drive the combobox via its public api.',
      },
    },
  },
  render: () => ({
    template: '<story-combobox-non-form-usage />',
    moduleMetadata: {
      imports: [ComboboxNonFormUsageStory],
    },
  }),
};

@Component({
  selector: 'story-combobox-reactive-form-integration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Combobox,
    Button,
    JsonPipe,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive form integration"
          description="ControlValueAccessor pattern. Bind a FormControl and the combobox stays in sync with the form state — value, disabled, touched, dirty."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-4 max-w-sm">
            <org-combobox
              name="reactive-form-integration"
              [formControl]="formControl"
              [options]="options"
              [isMultiSelect]="true"
              placeholder="Pick a few fruits..."
            />
            <div class="flex flex-wrap gap-2">
              <org-button
                color="primary"
                size="sm"
                label="Set [apple, banana]"
                (clicked)="formControl.setValue(['apple', 'banana'])"
              />
              <org-button color="secondary" size="sm" label="Clear" (clicked)="formControl.setValue([])" />
              <org-button color="secondary" size="sm" label="Disable" (clicked)="formControl.disable()" />
              <org-button color="secondary" size="sm" label="Enable" (clicked)="formControl.enable()" />
            </div>
            <div class="text-sm flex flex-col gap-1">
              <div><strong>Form value:</strong> {{ formControl.value | json }}</div>
              <div><strong>Valid:</strong> {{ formControl.valid }}</div>
              <div><strong>Touched:</strong> {{ formControl.touched }}</div>
              <div><strong>Dirty:</strong> {{ formControl.dirty }}</div>
              <div><strong>Disabled:</strong> {{ formControl.disabled }}</div>
            </div>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Implements <code>ControlValueAccessor</code> — bind a <code>FormControl</code> directly</li>
          <li>Form value is always an array of selected values</li>
          <li>Supports <code>setValue</code>, <code>disable</code>, <code>enable</code>, <code>reset</code></li>
          <li>Tracks touched / dirty state through the control</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class ComboboxReactiveFormIntegrationStory {
  protected readonly options = fruitOptions;
  protected readonly formControl = new FormControl<(string | number)[]>([]);
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates ControlValueAccessor integration. The combobox binds to a FormControl and stays in sync with the form state — value, disabled, touched, and dirty.',
      },
    },
  },
  render: () => ({
    template: '<story-combobox-reactive-form-integration />',
    moduleMetadata: {
      imports: [ComboboxReactiveFormIntegrationStory],
    },
  }),
};

@Component({
  selector: 'story-combobox-async-simulation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Combobox,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Async simulation"
          description="Simulates a server-driven autocomplete over a 100-item dataset. The consumer owns the request: each input change (once the character threshold is met) issues a fake 2s request, toggles isLoading, and feeds the filtered results back in. Setting enableFiltering to false keeps the combobox from re-filtering the already-filtered results."
        />
        <org-design-system-demo-canvas slot="canvas">
          <div class="max-w-sm">
            <org-combobox
              name="async-simulation"
              placeholder="Type at least 2 characters..."
              [options]="options()"
              [isLoading]="isLoading()"
              [characterThreshold]="characterThreshold"
              [enableFiltering]="false"
              (inputValueChanged)="onInputValueChanged($event)"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            Typing fewer than {{ characterThreshold }} characters shows "{{ characterThreshold }} characters needed for
            results" and emits no request
          </li>
          <li>Once the threshold is met, a loading spinner shows for ~2s while the simulated request runs</li>
          <li>Results stream back filtered against the typed text; rapid typing cancels stale in-flight requests</li>
          <li>
            <code>enableFiltering</code> set to false prevents the combobox from re-filtering the consumer-supplied
            results
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class ComboboxAsyncSimulationStory {
  private readonly _allOptions = asyncDatasetOptions;
  private readonly _query = signal<string>('');

  protected readonly characterThreshold = ASYNC_SIMULATION_CHARACTER_THRESHOLD;
  protected readonly options = signal<ComboboxOptionInput[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  constructor() {
    // simulate a debounced, server-driven request — switchMap drops stale in-flight responses
    toObservable(this._query)
      .pipe(
        takeUntilDestroyed(),
        filter((query) => query.length >= ASYNC_SIMULATION_CHARACTER_THRESHOLD),
        tap(() => this.isLoading.set(true)),
        switchMap((query) =>
          of(this._allOptions.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))).pipe(
            delay(ASYNC_SIMULATION_DELAY_MS)
          )
        )
      )
      .subscribe((results) => {
        this.options.set(results);
        this.isLoading.set(false);
      });
  }

  protected onInputValueChanged(query: string): void {
    this._query.set(query);
  }
}

export const AsyncSimulation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Simulates async/server-driven autocomplete. The consumer manages the request lifecycle (loading state + fetching), gates requests behind a character threshold, and sets enableFiltering to false so the combobox renders the externally-filtered results as-is.',
      },
    },
  },
  render: () => ({
    template: '<story-combobox-async-simulation />',
    moduleMetadata: {
      imports: [ComboboxAsyncSimulationStory],
    },
  }),
};
