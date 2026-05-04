import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { ButtonToggle, ButtonToggleItem } from './button-toggle';

const meta: Meta<ButtonToggle> = {
  title: 'Core/Components/Button Toggle',
  component: ButtonToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## ButtonToggle Component

  A segmented button group for selecting a single value from a list of options.

  ### Features
  - Single-value selection (radio-style); the active button cannot be deselected by re-clicking
  - Per-item color via the underlying button component
  - Per-item disabling via the \`buttonDisabled\` flag
  - Wrapper-level \`disabled\` to disable the entire toggle
  - Form integration via Angular reactive forms (ControlValueAccessor)
  - Accessible: wrapper has \`role="group"\`, each button reflects \`aria-pressed\`

  ### Items
  Each item is a \`ButtonToggleItem\`:
  \`\`\`ts
  type ButtonToggleItem = {
    label: string;
    value: string;
    buttonColor: ButtonColor;
    buttonDisabled?: boolean;
  };
  \`\`\`

  ### Usage Examples
  \`\`\`html
  <!-- non-form usage -->
  <org-button-toggle
    [items]="items"
    [value]="selected"
    (changed)="selected = $event"
  />

  <!-- reactive forms usage -->
  <form [formGroup]="form">
    <org-form-fields>
      <org-form-field>
        <org-button-toggle [items]="items" formControlName="alignment" />
      </org-form-field>
    </org-form-fields>
  </form>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ButtonToggle>;

const defaultItems: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary' },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    value: 'center',
    disabled: false,
    buttonSize: 'base',
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'The items rendered as buttons within the toggle',
    },
    value: {
      control: 'text',
      description: 'The currently selected value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire toggle is disabled',
    },
    buttonSize: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size applied to every button rendered within the toggle',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default toggle with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-button-toggle
        [items]="items"
        [value]="value"
        [disabled]="disabled"
        [buttonSize]="buttonSize"
      />
    `,
    moduleMetadata: {
      imports: [ButtonToggle],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all 3 size variants (sm, base, lg). The size is applied uniformly to every button in the toggle.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Button Sizes"
        currentState="Comparing sm, base, and lg sizes for the toggle's buttons"
      >
        <org-storybook-example-container-section label="Small">
          <org-button-toggle [items]="items" value="center" buttonSize="sm" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (Default)">
          <org-button-toggle [items]="items" value="center" buttonSize="base" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large">
          <org-button-toggle [items]="items" value="center" buttonSize="lg" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Small</strong>: Compact toggle for dense layouts</li>
          <li><strong>Base</strong>: Standard toggle size for most use cases (default)</li>
          <li><strong>Large</strong>: Prominent toggle for primary/important segmented controls</li>
          <li>The size is applied uniformly to every button in the toggle</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      items: defaultItems,
    },
    moduleMetadata: {
      imports: [ButtonToggle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const PerItemColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each item can specify its own button color, allowing semantic differentiation per option.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Per-Item Colors"
        currentState="Each item drives its own button color via the buttonColor field"
      >
        <org-storybook-example-container-section label="Semantic Severity">
          <org-button-toggle
            [items]="severityItems"
            value="info"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Mixed Brand Colors">
          <org-button-toggle
            [items]="brandItems"
            value="secondary"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>The active button renders in its variant's pressed (active) state colors</li>
          <li>Hover and active pseudo-states are neutralized on the active button</li>
          <li>Focus-visible remains on the active button so keyboard focus is still indicated</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      severityItems: [
        { label: 'Safe', value: 'safe', buttonColor: 'safe' },
        { label: 'Info', value: 'info', buttonColor: 'info' },
        { label: 'Caution', value: 'caution', buttonColor: 'caution' },
        { label: 'Warning', value: 'warning', buttonColor: 'warning' },
        { label: 'Danger', value: 'danger', buttonColor: 'danger' },
      ] as ButtonToggleItem[],
      brandItems: [
        { label: 'Primary', value: 'primary', buttonColor: 'primary' },
        { label: 'Secondary', value: 'secondary', buttonColor: 'secondary' },
        { label: 'Neutral', value: 'neutral', buttonColor: 'neutral' },
      ] as ButtonToggleItem[],
    },
    moduleMetadata: {
      imports: [ButtonToggle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Disabling can target the whole toggle (wrapper-level `disabled`) or individual items (`buttonDisabled` per item).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Disabled States"
        currentState="Comparing wrapper-level and per-item disabled behaviors"
      >
        <org-storybook-example-container-section label="Wrapper Disabled">
          <org-button-toggle
            [items]="items"
            value="center"
            [disabled]="true"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Per-Item Disabled">
          <org-button-toggle
            [items]="perItemDisabledItems"
            value="left"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Wrapper disabled</strong>: every item is non-interactive and the whole toggle is dimmed</li>
          <li><strong>Per-item disabled</strong>: only the items with <code>buttonDisabled: true</code> are non-interactive</li>
          <li>An item is disabled when either the wrapper is disabled OR its own <code>buttonDisabled</code> is true</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      items: defaultItems,
      perItemDisabledItems: [
        { label: 'Left', value: 'left', buttonColor: 'primary' },
        { label: 'Center', value: 'center', buttonColor: 'primary', buttonDisabled: true },
        { label: 'Right', value: 'right', buttonColor: 'primary' },
      ] as ButtonToggleItem[],
    },
    moduleMetadata: {
      imports: [ButtonToggle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

@Component({
  selector: 'story-button-toggle-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <org-storybook-example-container title="Non-Form Usage" [currentState]="'Selected: ' + selected()">
      <org-storybook-example-container-section label="Two-Way Style Binding via [value] + (changed)">
        <org-button-toggle [items]="items" [value]="selected()" (changed)="selected.set($event)" />
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Click any button to update the selected value</li>
        <li>Clicking the active button is a no-op (no deselect)</li>
        <li>The host listens to the <code>changed</code> output to update its own state</li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [ButtonToggle, StorybookExampleContainer, StorybookExampleContainerSection],
})
class ButtonToggleNonFormStory {
  protected readonly items: ButtonToggleItem[] = [
    { label: 'Day', value: 'day', buttonColor: 'primary' },
    { label: 'Week', value: 'week', buttonColor: 'primary' },
    { label: 'Month', value: 'month', buttonColor: 'primary' },
    { label: 'Year', value: 'year', buttonColor: 'primary' },
  ];

  protected readonly selected = signal<string>('week');
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the toggle outside of a reactive form using `[value]` + `(changed)`.',
      },
    },
  },
  render: () => ({
    template: `<story-button-toggle-non-form />`,
    moduleMetadata: {
      imports: [ButtonToggleNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-button-toggle-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <org-storybook-example-container
      title="Reactive Form Integration"
      [currentState]="'Form Valid: ' + toggleForm.valid + ', Form Value: ' + formValueDisplay()"
    >
      <org-storybook-example-container-section label="Toggle in a Form">
        <form [formGroup]="toggleForm" class="flex flex-col gap-2">
          <org-form-fields>
            <org-form-field>
              <org-button-toggle [items]="alignmentItems" formControlName="alignment" />
            </org-form-field>
            <org-form-field>
              <org-button-toggle [items]="severityItems" formControlName="severity" />
            </org-form-field>
          </org-form-fields>
        </form>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
        <li>Form state updates automatically as buttons are clicked — no manual change handlers needed</li>
        <li>
          Programmatic <strong>form.disable()</strong> and <strong>control.disable()</strong> reflect in the toggle
        </li>
      </ul>
    </org-storybook-example-container>
  `,
  imports: [
    ButtonToggle,
    FormFields,
    FormField,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    ReactiveFormsModule,
  ],
})
class ButtonToggleReactiveFormStory {
  protected readonly alignmentItems: ButtonToggleItem[] = [
    { label: 'Left', value: 'left', buttonColor: 'primary' },
    { label: 'Center', value: 'center', buttonColor: 'primary' },
    { label: 'Right', value: 'right', buttonColor: 'primary' },
  ];

  protected readonly severityItems: ButtonToggleItem[] = [
    { label: 'Safe', value: 'safe', buttonColor: 'safe' },
    { label: 'Info', value: 'info', buttonColor: 'info' },
    { label: 'Warning', value: 'warning', buttonColor: 'warning' },
    { label: 'Danger', value: 'danger', buttonColor: 'danger' },
  ];

  protected readonly toggleForm = new FormGroup({
    alignment: new FormControl<string>('center', { nonNullable: true }),
    severity: new FormControl<string>('info', { nonNullable: true }),
  });

  protected readonly formValueDisplay = toSignal(
    this.toggleForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.toggleForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the toggle with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-button-toggle-reactive-form />`,
    moduleMetadata: {
      imports: [ButtonToggleReactiveFormStory],
    },
  }),
};
