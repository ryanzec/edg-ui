import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { FormDisabledDirective } from '../form-disabled-directive/form-disabled-directive';
import { ButtonToggle, ButtonToggleItem } from './button-toggle';

const liveDemoSizeItems: ButtonToggleItem[] = [
  { label: 'sm', value: 'sm', buttonColor: 'primary' },
  { label: 'base', value: 'base', buttonColor: 'primary' },
  { label: 'lg', value: 'lg', buttonColor: 'primary' },
];

const liveDemoToggleItems: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary' },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

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
    fullWidth: false,
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
    fullWidth: {
      control: 'boolean',
      description: 'Stretches the toggle to fill its parent and gives each button an equal share of the width',
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
        [fullWidth]="fullWidth"
      />
    `,
    moduleMetadata: {
      imports: [ButtonToggle],
    },
  }),
};

@Component({
  selector: 'story-button-toggle-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormDisabledDirective,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
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
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="The button toggle below is real and interactive — click any button to update the selected value, and use the controls to drive the visual state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Button Size">
            <org-button-toggle [items]="sizeItems" formControlName="buttonSize" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Full Width">
            <org-checkbox-toggle name="live-demo-full-width" value="fullWidth" formControlName="fullWidth">
              {{ liveDemoForm.controls.fullWidth.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-button-toggle
              [items]="toggleItems"
              formControlName="value"
              [buttonSize]="liveDemoForm.controls.buttonSize.value"
              [orgFormDisabled]="liveDemoForm.controls.disabled.value"
              [fullWidth]="liveDemoForm.controls.fullWidth.value"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ButtonToggleLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly toggleItems = liveDemoToggleItems;

  protected readonly liveDemoForm = new FormGroup({
    value: new FormControl<string>('center', { nonNullable: true }),
    buttonSize: new FormControl<'sm' | 'base' | 'lg'>('base', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    fullWidth: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Click the toggle to change the selected value, and use the controls to drive the button size and disabled state.',
      },
    },
  },
  render: () => ({
    template: `<story-button-toggle-live-demo />`,
    moduleMetadata: {
      imports: [ButtonToggleLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every button-toggle variant axis — button size, per-item colors, and disabled states — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button Sizes" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="items" value="center" buttonSize="sm" />
            <org-button-toggle [items]="items" value="center" buttonSize="base" />
            <org-button-toggle [items]="items" value="center" buttonSize="lg" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Small</strong>: Compact toggle for dense layouts</li>
            <li><strong>Base</strong>: Standard toggle size for most use cases (default)</li>
            <li><strong>Large</strong>: Prominent toggle for primary/important segmented controls</li>
            <li>The size is applied uniformly to every button in the toggle</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="All Button Colors in One Toggle" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="allColorsItems" value="primary" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Every available <code>ButtonColor</code> is rendered as an item within a single toggle</li>
            <li>Items appear in the canonical <code>allComponentColors</code> order: primary, secondary, neutral, safe, info, caution, warning, danger</li>
            <li>The selected item (<strong>primary</strong>) shows its color's pressed/active state; click any other item to see its color in the active state</li>
            <li>Inactive items remain in their default (neutral) state regardless of their per-item <code>buttonColor</code></li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Per-Item Colors" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="severityItems" value="info" />
            <org-button-toggle [items]="brandItems" value="secondary" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The active button renders in its variant's pressed (active) state colors</li>
            <li>Hover and active pseudo-states are neutralized on the active button</li>
            <li>Focus-visible remains on the active button so keyboard focus is still indicated</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Disabled States" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="items" value="center" [disabled]="true" />
            <org-button-toggle [items]="perItemDisabledItems" value="left" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Wrapper disabled</strong>: every item is non-interactive and the whole toggle is dimmed</li>
            <li><strong>Per-item disabled</strong>: only the items with <code>buttonDisabled: true</code> are non-interactive</li>
            <li>An item is disabled when either the wrapper is disabled OR its own <code>buttonDisabled</code> is true</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Full Width" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-toggle [items]="items" value="center" [fullWidth]="true" />
            <org-button-toggle [items]="brandItems" value="primary" [fullWidth]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The toggle stretches to fill the full width of its parent container</li>
            <li>Each button takes an equal share of the available width regardless of its label length</li>
            <li>Equal sizing is preserved as the number of items in the toggle changes</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    props: {
      items: defaultItems,
      allColorsItems: allComponentColors.map((color) => ({
        label: color,
        value: color,
        buttonColor: color,
      })) as ButtonToggleItem[],
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
      perItemDisabledItems: [
        { label: 'Left', value: 'left', buttonColor: 'primary' },
        { label: 'Center', value: 'center', buttonColor: 'primary', buttonDisabled: true },
        { label: 'Right', value: 'right', buttonColor: 'primary' },
      ] as ButtonToggleItem[],
    },
    moduleMetadata: {
      imports: [
        ButtonToggle,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-button-toggle-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <org-button-toggle [items]="items" [value]="selected()" (changed)="selected.set($event)" />
          <p>
            Selected: <strong>{{ selected() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Click any button to update the selected value</li>
          <li>Clicking the active button is a no-op (no deselect)</li>
          <li>The host listens to the <code>changed</code> output to update its own state</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
  imports: [
    ButtonToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
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
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Reactive Form Integration"
          [description]="'Form Valid: ' + toggleForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
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
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
          <li>Form state updates automatically as buttons are clicked — no manual change handlers needed</li>
          <li>
            Programmatic <strong>form.disable()</strong> and <strong>control.disable()</strong> reflect in the toggle
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
  imports: [
    ButtonToggle,
    FormFields,
    FormField,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
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
