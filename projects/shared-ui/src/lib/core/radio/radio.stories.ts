import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Box } from '../box/box';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { FormFields } from '../form-fields/form-fields';
import { FormField } from '../form-fields/form-field';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Radio, RadioColor, RadioSize, allRadioColors, allRadioSizes } from './radio';
import { RadioGroup } from './radio-group';

const liveDemoSizeItems: ButtonToggleItem[] = allRadioSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allRadioColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

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

  A single radio option — an indicator (ring + inner dot) paired with a label and an optional sub-description. Native &lt;input type="radio"&gt; drives the form/a11y semantics; the visible ring is a styled sibling that paints from the input's :checked / :focus-visible state.

  ### Features
  - Three sizes: \`sm\`, \`base\` (default), \`lg\`
  - Two colors: \`primary\` (default), \`danger\` — narrow palette by design (radios are commitment controls)
  - Optional \`description\` sub-line beneath the label
  - Disabled state, error state (driven by parent \`org-form-field\` / \`org-radio-group\`)
  - Native arrow-key routing within shared \`name\` (handled by the browser, no custom keyboard logic)
  - Form integration via \`org-radio-group\` + \`ControlValueAccessor\`

  ### Usage Examples
  \`\`\`html
  <!-- Single radio (standalone) -->
  <org-radio name="plan" value="pro">Pro plan</org-radio>

  <!-- With description sub-line -->
  <org-radio name="plan" value="pro" description="Everything in Free, plus team workspaces.">
    Pro plan
  </org-radio>

  <!-- Card-tile pattern: wrap with org-box, set [isClickable]="true", and forward (clicked) to the radio-group -->
  <org-radio-group [value]="selectedPlan()" (valueChange)="selectedPlan.set($event)" name="plan">
    <org-box layout="stack" [isClickable]="true" (clicked)="selectedPlan.set('pro')">
      <org-radio value="pro" description="Up to 25 members.">Pro plan</org-radio>
    </org-box>
  </org-radio-group>

  <!-- Reactive forms via radio-group -->
  <form [formGroup]="form">
    <org-form-fields>
      <org-form-field>
        <org-radio-group formControlName="plan" name="plan" legend="Plan" [required]="true">
          <org-radio value="free">Free</org-radio>
          <org-radio value="pro">Pro</org-radio>
          <org-radio value="team">Team</org-radio>
        </org-radio-group>
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

// the disabled / value inputs come from the host-directive forwarding on `Radio`, which storybook's signal-input
// type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<Radio & { value: string; disabled: boolean }>;

export const Default: Story = {
  args: {
    name: 'radio',
    value: 'value',
    disabled: false,
    size: 'base',
    color: 'primary',
    description: '',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the radio input (required when not inside a radio-group)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for the radio input (required)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    size: {
      control: 'select',
      options: allRadioSizes,
      description: 'Size of the radio',
    },
    color: {
      control: 'select',
      options: allRadioColors,
      description: 'Color variant of the radio',
    },
    description: {
      control: 'text',
      description: 'Optional description sub-line beneath the label',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default radio with all controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-radio
        [name]="name"
        [value]="value"
        [disabled]="disabled"
        [size]="size"
        [color]="color"
        [description]="description"
      >
        Radio Label
      </org-radio>
    `,
    moduleMetadata: {
      imports: [Radio],
    },
  }),
};

@Component({
  selector: 'story-radio-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Radio,
    RadioGroup,
    ButtonToggle,
    CheckboxToggle,
    Input,
    FormFields,
    FormField,
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
          description="Toggle the inputs to walk every documented combination — label, description, size, color, checked, disabled, error."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Label">
            <org-input name="live-demo-label" formControlName="label" ariaLabel="Radio label" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Description">
            <org-input name="live-demo-description" formControlName="description" ariaLabel="Radio description" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Checked">
            <org-checkbox-toggle name="live-demo-checked" value="checked" formControlName="checked">
              {{ liveDemoForm.controls.checked.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Error">
            <org-checkbox-toggle name="live-demo-error" value="error" formControlName="error">
              {{ liveDemoForm.controls.error.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-form-fields>
              <org-form-field [validationMessage]="liveDemoForm.controls.error.value ? 'This field is required' : null">
                <org-radio-group
                  name="live-demo"
                  [value]="liveDemoForm.controls.checked.value ? 'live' : ''"
                  [disabled]="liveDemoForm.controls.disabled.value"
                >
                  <org-radio
                    value="live"
                    [size]="liveDemoForm.controls.size.value"
                    [color]="liveDemoForm.controls.color.value"
                    [description]="liveDemoForm.controls.description.value"
                  >
                    {{ liveDemoForm.controls.label.value }}
                  </org-radio>
                </org-radio-group>
              </org-form-field>
            </org-form-fields>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class RadioLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly colorItems = liveDemoColorItems;

  protected readonly liveDemoForm = new FormGroup({
    label: new FormControl<string>('Email me about new features', { nonNullable: true }),
    description: new FormControl<string>('Up to once a week.', { nonNullable: true }),
    size: new FormControl<RadioSize>('base', { nonNullable: true }),
    color: new FormControl<RadioColor>('primary', { nonNullable: true }),
    checked: new FormControl<boolean>(true, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    error: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every combination — size, color, checked, disabled, error — and edit the label / description text.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-live-demo />`,
    moduleMetadata: {
      imports: [RadioLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-radio-card-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Box, Radio, RadioGroup, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Card-tile pattern"
        description='Wrap each radio in org-box, set [isClickable]="true", and bind (clicked) so the entire tile selects the option. Used for plan-pickers, settings pages, and any selection where each choice needs to read as its own surface.'
      />
      <org-design-system-demo-canvas slot="canvas">
        <org-radio-group name="card-plan" [value]="selectedPlan()" (valueChange)="selectedPlan.set($event)">
          <org-box layout="stack" [isClickable]="true" (clicked)="selectedPlan.set('free')">
            <org-radio
              value="free"
              (click)="$event.stopPropagation()"
              description="For individuals exploring the product. No credit card required."
            >
              Free
            </org-radio>
          </org-box>
          <org-box layout="stack" [isClickable]="true" (clicked)="selectedPlan.set('team')">
            <org-radio
              value="team"
              (click)="$event.stopPropagation()"
              description="Collaborative workspaces with shared billing. $12 / user / month."
            >
              Team
            </org-radio>
          </org-box>
          <org-box layout="stack" [isClickable]="true" (clicked)="selectedPlan.set('enterprise')">
            <org-radio
              value="enterprise"
              (click)="$event.stopPropagation()"
              description="SSO, audit logs, dedicated support, and custom contracts."
            >
              Enterprise
            </org-radio>
          </org-box>
        </org-radio-group>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class RadioCardSection {
  protected readonly selectedPlan = signal<string>('team');
}

@Component({
  selector: 'story-radio-group-default-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Radio, RadioGroup, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Radio Group"
        description="A vertical stack of options with an optional legend and description above. The group owns the inter-option rhythm; each child Radio still renders its own indicator + label."
      />
      <org-design-system-demo-canvas slot="canvas">
        <form [formGroup]="groupForm">
          <org-radio-group
            formControlName="visibility"
            name="visibility"
            legend="Visibility"
            description="Who can see this project?"
            [required]="true"
          >
            <org-radio value="public" description="Anyone with the link can view.">Public</org-radio>
            <org-radio value="workspace" description="All members of your workspace.">Workspace</org-radio>
            <org-radio value="private" description="Only you.">Private</org-radio>
          </org-radio-group>
        </form>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class RadioGroupDefaultSection {
  protected readonly groupForm = new FormGroup({
    visibility: new FormControl<string>('workspace', { nonNullable: true }),
  });
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every radio axis — sizes, colors, states, description sub-line, card-tile pattern, and the radio-group default — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizes"
            description="Three sizes — sm, base, lg. The indicator, label type, and full row hit-target all scale together."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3 w-full">
              <div class="flex items-start gap-12">
                <org-radio name="sizes-sm-unchecked" value="sm" size="sm">Small</org-radio>
                <org-radio-group name="sizes-sm-checked" [value]="'sm'">
                  <org-radio value="sm" size="sm">Small</org-radio>
                </org-radio-group>
              </div>
              <div class="flex items-start gap-12">
                <org-radio name="sizes-base-unchecked" value="base">Base</org-radio>
                <org-radio-group name="sizes-base-checked" [value]="'base'">
                  <org-radio value="base">Base</org-radio>
                </org-radio-group>
              </div>
              <div class="flex items-start gap-12">
                <org-radio name="sizes-lg-unchecked" value="lg" size="lg">Large</org-radio>
                <org-radio-group name="sizes-lg-checked" [value]="'lg'">
                  <org-radio value="lg" size="lg">Large</org-radio>
                </org-radio-group>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: compact for tight spaces</li>
            <li><strong>base</strong>: standard default</li>
            <li><strong>lg</strong>: prominent — emphasis or large-touch surfaces</li>
            <li>Indicator size, label type, and the full row hit target all scale together</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Colors"
            description="Two semantic colors only — primary (the system's ink — black in light mode, near-white in dark mode) and danger (for destructive opt-ins; rare). The full ComponentColor palette is intentionally not exposed here so checked options always read with the same weight regardless of context."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3 w-full">
              <div class="flex items-start gap-12">
                <org-radio name="colors-primary-unchecked" value="primary">Primary (ink)</org-radio>
                <org-radio-group name="colors-primary-checked" [value]="'primary'">
                  <org-radio value="primary">Primary (ink)</org-radio>
                </org-radio-group>
              </div>
              <div class="flex items-start gap-12">
                <org-radio name="colors-danger-unchecked" value="danger" color="danger">
                  Delete this workspace
                </org-radio>
                <org-radio-group name="colors-danger-checked" [value]="'danger'">
                  <org-radio value="danger" color="danger">Delete this workspace</org-radio>
                </org-radio-group>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>primary</strong>: default ink color for routine opt-ins</li>
            <li><strong>danger</strong>: reserve for destructive opt-ins (delete workspace, irreversible actions)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="States"
            description="Default / disabled / error across unchecked and checked. Hover and focus are real states — interact with the radios to preview them; they are not pinned in this docs matrix."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3 w-full">
              <div class="flex items-start gap-12">
                <org-radio name="states-default-unchecked" value="default">Option (default)</org-radio>
                <org-radio-group name="states-default-checked" [value]="'default'">
                  <org-radio value="default">Option (default)</org-radio>
                </org-radio-group>
              </div>
              <div class="flex items-start gap-12">
                <org-radio name="states-disabled-unchecked" value="disabled" [disabled]="true">
                  Option (disabled)
                </org-radio>
                <org-radio-group name="states-disabled-checked" [value]="'disabled'" [disabled]="true">
                  <org-radio value="disabled">Option (disabled)</org-radio>
                </org-radio-group>
              </div>
              <org-form-fields>
                <div class="flex items-start gap-12">
                  <org-form-field validationMessage="This field is required">
                    <org-radio-group name="states-error-unchecked">
                      <org-radio value="error">Option (error)</org-radio>
                    </org-radio-group>
                  </org-form-field>
                  <org-form-field validationMessage="This field is required">
                    <org-radio-group name="states-error-checked" [value]="'error'">
                      <org-radio value="error">Option (error)</org-radio>
                    </org-radio-group>
                  </org-form-field>
                </div>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: neutral indicator border, fills with the color when checked</li>
            <li><strong>Hover</strong>: indicator border deepens (interactive — preview by hovering)</li>
            <li><strong>Focus</strong>: visible focus ring around the indicator (interactive — tab into a radio to preview)</li>
            <li><strong>Disabled</strong>: row reads at reduced opacity, pointer becomes not-allowed</li>
            <li><strong>Error</strong>: indicator border / fill flip to danger; driven by a parent <code>org-form-field</code> validation message</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Description sub-line"
            description="An optional muted line beneath the label, for clarifying copy. The indicator stays optically aligned with the first line of the label, so the description hangs cleanly below."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-radio-group name="desc-plan" [value]="'free'">
              <org-radio value="free" description="For individuals exploring the product. No credit card required.">
                Free
              </org-radio>
              <org-radio value="team" description="Collaborative workspaces with shared billing. $12 / user / month.">
                Team
              </org-radio>
              <org-radio
                value="enterprise"
                description="SSO, audit logs, dedicated support, and custom contracts. Talk to sales."
              >
                Enterprise
              </org-radio>
            </org-radio-group>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The description renders below the label in a muted color</li>
            <li>The indicator stays optically aligned with the first line of the label</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-radio-card-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Wrap each radio in <strong>org-box</strong>, set <strong>[isClickable]="true"</strong>, and bind its <strong>(clicked)</strong> output to set the radio-group's value</li>
            <li>Card already supplies the bordered tile, hover/pressed tint, focus ring, and role=button affordance — no bespoke styling needed</li>
            <li>Combine with the radio's <strong>description</strong> input to clarify what each option grants</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-radio-group-default-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The legend reads as a small uppercase-cased section title — distinct from a Label so it doesn't compete with field-row labels in the same form</li>
            <li>The required marker is a post asterisk in danger color</li>
            <li>The description sits below the legend, above the options — never interleaved</li>
            <li>Inter-option gap is constant across sizes; density should change indicator size, not vertical rhythm</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Radio,
        RadioGroup,
        FormFields,
        FormField,
        RadioCardSection,
        RadioGroupDefaultSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-radio-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Radio,
    RadioGroup,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <org-radio-group
            name="non-form"
            [value]="selected()"
            (valueChange)="selected.set($event)"
            legend="Notification preference"
          >
            <org-radio value="email" description="Get an email when something changes.">Email</org-radio>
            <org-radio value="push" description="Push notifications via the desktop app.">Push</org-radio>
            <org-radio value="none" description="Stay quiet. I'll check in manually.">None</org-radio>
          </org-radio-group>
          <p>
            Selected: <strong>{{ selected() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Bind <strong>[value]</strong> to a signal and listen to <strong>(valueChange)</strong> to update it</li>
          <li>No reactive form required — the host owns the state</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class RadioNonFormStory {
  protected readonly selected = signal<string>('email');
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the radio-group outside of a reactive form using `[value]` + `(valueChange)`.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-non-form />`,
    moduleMetadata: {
      imports: [RadioNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-radio-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Radio,
    RadioGroup,
    FormFields,
    FormField,
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
          title="Reactive Form Integration"
          [description]="'Form Valid: ' + radioForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="radioForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field>
                <org-radio-group formControlName="shipping" name="shipping" legend="Shipping method">
                  <org-radio value="standard" description="5-7 business days">Standard</org-radio>
                  <org-radio value="express" description="2-3 business days">Express</org-radio>
                  <org-radio value="overnight" description="Next business day">Overnight</org-radio>
                </org-radio-group>
              </org-form-field>
              <org-form-field>
                <org-radio-group formControlName="payment" name="payment" legend="Payment method" [required]="true">
                  <org-radio value="credit">Credit card</org-radio>
                  <org-radio value="debit">Debit card</org-radio>
                  <org-radio value="paypal">PayPal</org-radio>
                </org-radio-group>
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            Uses <strong>formControlName</strong> on <code>org-radio-group</code> for reactive forms integration via
            ControlValueAccessor
          </li>
          <li>Form state updates automatically as the user picks an option — no manual change handlers needed</li>
          <li>
            Each <code>org-radio-group</code> is its own form control; multiple groups in the same form stay independent
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class RadioReactiveFormStory {
  protected readonly radioForm = new FormGroup({
    shipping: new FormControl<string>('standard', { nonNullable: true }),
    payment: new FormControl<string>('credit', { nonNullable: true }),
  });

  protected readonly formValueDisplay = toSignal(
    this.radioForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.radioForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating radio-groups with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-radio-reactive-form />`,
    moduleMetadata: {
      imports: [RadioReactiveFormStory],
    },
  }),
};
