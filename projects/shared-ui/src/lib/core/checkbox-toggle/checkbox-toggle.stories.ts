import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { IconName } from '../../brain/icon-brain/icon-brain';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Input } from '../input/input';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  CheckboxToggle,
  CheckboxToggleColor,
  CheckboxToggleLabelPosition,
  CheckboxToggleSize,
  CheckboxToggleVariant,
  allCheckboxToggleColors,
  allCheckboxToggleLabelPositions,
  allCheckboxToggleSizes,
  allCheckboxToggleVariants,
} from './checkbox-toggle';

type LiveDemoIconChoice = 'none' | IconName;

const liveDemoSizeItems: ButtonToggleItem[] = allCheckboxToggleSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allCheckboxToggleColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoVariantItems: ButtonToggleItem[] = allCheckboxToggleVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoLabelPositionItems: ButtonToggleItem[] = allCheckboxToggleLabelPositions.map((position) => ({
  label: position,
  value: position,
  buttonColor: 'primary',
}));

const liveDemoIconOffItems: ButtonToggleItem[] = [
  { label: 'none', value: 'none', buttonColor: 'primary' },
  { label: 'eye-off', value: 'eye-off', buttonColor: 'primary' },
  { label: 'x', value: 'x', buttonColor: 'primary' },
  { label: 'lock-keyhole', value: 'lock-keyhole', buttonColor: 'primary' },
];

const liveDemoIconOnItems: ButtonToggleItem[] = [
  { label: 'none', value: 'none', buttonColor: 'primary' },
  { label: 'eye', value: 'eye', buttonColor: 'primary' },
  { label: 'check', value: 'check', buttonColor: 'primary' },
  { label: 'notification', value: 'notification', buttonColor: 'primary' },
];

const meta: Meta<CheckboxToggle> = {
  title: 'Core/Components/Checkbox Toggle',
  component: CheckboxToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## CheckboxToggle Component

  A pill-shaped switch that semantically behaves like a checkbox: the native &lt;input type="checkbox"&gt; drives state and form semantics; the visible track + sliding knob is the styled treatment. Use for "is this thing turned on right now" settings (notifications, dark mode, autosave) — change takes effect immediately. Use plain Checkbox for opt-ins / agreements pending a Save.

  ### Features
  - Three sizes: \`sm\`, \`base\` (default), \`lg\`
  - Three colors: \`primary\` (default), \`safe\` (positive on-state), \`danger\` (destructive on-state)
  - Two variants: \`default\` (row), \`card\` (bordered tile)
  - Two label positions: \`end\` (default — track-leading) / \`start\` (label-leading)
  - Optional knob icons (\`iconOff\` / \`iconOn\`) that crossfade with state
  - Optional description sub-line beneath the label
  - Disabled state
  - Error state (driven by parent \`org-form-field\` validation message)
  - Form integration via \`ControlValueAccessor\` (works with reactive forms)
  - Accessible: \`role="switch"\`, \`aria-checked\`, keyboard navigation (Space / Enter)

  ### Usage Examples
  \`\`\`html
  <!-- Basic toggle -->
  <org-checkbox-toggle name="notifications" value="enabled">
    Enable notifications
  </org-checkbox-toggle>

  <!-- Checked, with description -->
  <org-checkbox-toggle name="features" value="enabled" [checked]="true" description="Up to once a week.">
    Email me about new features
  </org-checkbox-toggle>

  <!-- Safe color (on-state carries positive meaning) -->
  <org-checkbox-toggle name="2fa" value="on" color="safe" [checked]="true">
    Two-factor authentication
  </org-checkbox-toggle>

  <!-- Card variant (settings list) -->
  <org-checkbox-toggle name="autosave" value="on" variant="card" description="Save changes as you type.">
    Autosave
  </org-checkbox-toggle>

  <!-- With knob icons -->
  <org-checkbox-toggle name="theme" value="dark" iconOff="eye-off" iconOn="eye">
    Visibility
  </org-checkbox-toggle>

  <!-- Reactive forms -->
  <form [formGroup]="myForm">
    <org-form-fields>
      <org-form-field>
        <org-checkbox-toggle formControlName="notifications" name="notifications" value="enabled">
          Enable notifications
        </org-checkbox-toggle>
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

// the checked / disabled inputs come from the host-directive forwarding on `CheckboxToggle`, which storybook's
// signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<CheckboxToggle & { checked: boolean; disabled: boolean }>;

export const Default: Story = {
  args: {
    name: 'toggle',
    value: 'value',
    checked: false,
    disabled: false,
    size: 'base',
    color: 'primary',
    variant: 'default',
    labelPosition: 'end',
    description: '',
    iconOff: undefined,
    iconOn: undefined,
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the toggle input (required)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for the toggle input (required)',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    size: {
      control: 'select',
      options: allCheckboxToggleSizes,
      description: 'Size of the toggle',
    },
    color: {
      control: 'select',
      options: allCheckboxToggleColors,
      description: 'Color variant — drives the on-state ramp',
    },
    variant: {
      control: 'select',
      options: allCheckboxToggleVariants,
      description: 'Visual variant: default (row) or card (bordered tile)',
    },
    labelPosition: {
      control: 'select',
      options: allCheckboxToggleLabelPositions,
      description: 'Position of the label relative to the track',
    },
    description: {
      control: 'text',
      description: 'Optional description sub-line beneath the label',
    },
    iconOff: {
      control: 'text',
      description: 'Icon shown on the knob when the toggle is off',
    },
    iconOn: {
      control: 'text',
      description: 'Icon shown on the knob when the toggle is on',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default toggle with all controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-checkbox-toggle
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        [size]="size"
        [color]="color"
        [variant]="variant"
        [labelPosition]="labelPosition"
        [description]="description"
        [iconOff]="iconOff"
        [iconOn]="iconOn"
      >
        Toggle Label
      </org-checkbox-toggle>
    `,
    moduleMetadata: {
      imports: [CheckboxToggle],
    },
  }),
};

@Component({
  selector: 'story-checkbox-toggle-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CheckboxToggle,
    ButtonToggle,
    Input,
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
          description="Toggle the inputs to walk every documented combination — label, description, size, color, variant, label-position, optional icon-off / icon-on, checked, disabled."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Label">
            <org-input name="live-demo-label" formControlName="label" ariaLabel="Toggle label" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Description">
            <org-input name="live-demo-description" formControlName="description" ariaLabel="Toggle description" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Label position">
            <org-button-toggle [items]="labelPositionItems" formControlName="labelPosition" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon off">
            <org-button-toggle [items]="iconOffItems" formControlName="iconOff" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon on">
            <org-button-toggle [items]="iconOnItems" formControlName="iconOn" buttonSize="sm" />
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
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-checkbox-toggle
              name="live-demo"
              value="live-demo"
              [size]="liveDemoForm.controls.size.value"
              [color]="liveDemoForm.controls.color.value"
              [variant]="liveDemoForm.controls.variant.value"
              [labelPosition]="liveDemoForm.controls.labelPosition.value"
              [checked]="liveDemoForm.controls.checked.value"
              [disabled]="liveDemoForm.controls.disabled.value"
              [description]="liveDemoForm.controls.description.value"
              [iconOff]="resolveIconOff()"
              [iconOn]="resolveIconOn()"
            >
              {{ liveDemoForm.controls.label.value }}
            </org-checkbox-toggle>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CheckboxToggleLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly colorItems = liveDemoColorItems;
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly labelPositionItems = liveDemoLabelPositionItems;
  protected readonly iconOffItems = liveDemoIconOffItems;
  protected readonly iconOnItems = liveDemoIconOnItems;

  protected readonly liveDemoForm = new FormGroup({
    label: new FormControl<string>('Email notifications', { nonNullable: true }),
    description: new FormControl<string>('Up to once a week.', { nonNullable: true }),
    size: new FormControl<CheckboxToggleSize>('base', { nonNullable: true }),
    color: new FormControl<CheckboxToggleColor>('primary', { nonNullable: true }),
    variant: new FormControl<CheckboxToggleVariant>('default', { nonNullable: true }),
    labelPosition: new FormControl<CheckboxToggleLabelPosition>('end', { nonNullable: true }),
    iconOff: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
    iconOn: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
    checked: new FormControl<boolean>(true, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected resolveIconOff(): IconName | undefined {
    const value = this.liveDemoForm.controls.iconOff.value;

    return value === 'none' ? undefined : (value as IconName);
  }

  protected resolveIconOn(): IconName | undefined {
    const value = this.liveDemoForm.controls.iconOn.value;

    return value === 'none' ? undefined : (value as IconName);
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every combination — size, color, variant, label-position, icon-off / icon-on, checked, disabled — and edit the label / description text.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-toggle-live-demo />`,
    moduleMetadata: {
      imports: [CheckboxToggleLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-checkbox-toggle-validation-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CheckboxToggle,
    FormFields,
    FormField,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Validation"
        [description]="
          'Form Valid: ' + validationForm.valid + ', Notifications: ' + (validationForm.value.notifications || false)
        "
      />
      <org-design-system-demo-canvas slot="canvas">
        <form [formGroup]="validationForm">
          <org-form-fields>
            <org-form-field validationMessage="You must enable notifications to receive important updates">
              <org-checkbox-toggle formControlName="notifications" name="notifications" value="enabled">
                Enable Notifications *
              </org-checkbox-toggle>
            </org-form-field>
            <org-form-field>
              <org-checkbox-toggle formControlName="marketing" name="marketing" value="enabled">
                Receive Marketing Emails
              </org-checkbox-toggle>
            </org-form-field>
          </org-form-fields>
        </form>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class CheckboxToggleValidationSection {
  protected readonly validationForm = new FormGroup({
    notifications: new FormControl<boolean>(false, { nonNullable: true }),
    marketing: new FormControl<boolean>(true, { nonNullable: true }),
  });
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every checkbox-toggle variant axis — sizes, colors, states, label-position, knob icons, description sub-line, card variant, grouping, validation, and validation space reservation — in a single scrollable view.',
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
            description="Three sizes — sm, base, lg. The track, knob, label type, and full row hit-target all scale together."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="sizes-sm-off" value="sm" size="sm">Small</org-checkbox-toggle>
                <org-checkbox-toggle name="sizes-sm-on" value="sm" size="sm" [checked]="true">Small</org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="sizes-base-off" value="base">Base</org-checkbox-toggle>
                <org-checkbox-toggle name="sizes-base-on" value="base" [checked]="true">Base</org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="sizes-lg-off" value="lg" size="lg">Large</org-checkbox-toggle>
                <org-checkbox-toggle name="sizes-lg-on" value="lg" size="lg" [checked]="true">Large</org-checkbox-toggle>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: compact for tight spaces</li>
            <li><strong>base</strong>: standard default — matches base control row height</li>
            <li><strong>lg</strong>: prominent — emphasis or large-touch surfaces</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Colors"
            description="Three semantic colors — primary (default), safe (for &quot;this thing is enabled / protected&quot; framings), and danger (for destructive opt-ins; rare). Off-state is identical across colors — only the on-state ramp swaps."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="colors-primary-off" value="primary">
                  Email notifications
                </org-checkbox-toggle>
                <org-checkbox-toggle name="colors-primary-on" value="primary" [checked]="true">
                  Email notifications
                </org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="colors-safe-off" value="safe" color="safe">
                  Two-factor authentication
                </org-checkbox-toggle>
                <org-checkbox-toggle name="colors-safe-on" value="safe" color="safe" [checked]="true">
                  Two-factor authentication
                </org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="colors-danger-off" value="danger" color="danger">
                  Allow public access
                </org-checkbox-toggle>
                <org-checkbox-toggle name="colors-danger-on" value="danger" color="danger" [checked]="true">
                  Allow public access
                </org-checkbox-toggle>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>primary</strong>: default ink color for routine on / off settings</li>
            <li><strong>safe</strong>: use when the on-state carries a positive semantic (2FA on, autosave on, encryption on)</li>
            <li><strong>danger</strong>: reserve for destructive opt-ins (allow public access, irreversible actions)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="States"
            description="Default / disabled / error across off and on. Hover and focus are real — interact with the toggles below to see them."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="states-default-off" value="default">Setting</org-checkbox-toggle>
                <org-checkbox-toggle name="states-default-on" value="default" [checked]="true">Setting</org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="states-disabled-off" value="disabled" [disabled]="true">Setting</org-checkbox-toggle>
                <org-checkbox-toggle name="states-disabled-on" value="disabled" [disabled]="true" [checked]="true">Setting</org-checkbox-toggle>
              </div>
              <org-form-fields>
                <org-form-field validationMessage="This field is required">
                  <org-checkbox-toggle name="states-error-off" value="error">Setting (error)</org-checkbox-toggle>
                </org-form-field>
                <org-form-field validationMessage="This field is required">
                  <org-checkbox-toggle name="states-error-on" value="error" [checked]="true">
                    Setting (error)
                  </org-checkbox-toggle>
                </org-form-field>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: neutral track in off, color-filled track in on</li>
            <li><strong>Hover</strong>: track shifts toward the hover ramp on the row</li>
            <li><strong>Focus</strong>: visible focus ring around the track (a11y)</li>
            <li><strong>Disabled</strong>: row reads at reduced opacity, pointer becomes not-allowed</li>
            <li><strong>Error</strong>: on-state ramp uses danger; driven by a parent <code>org-form-field</code> validation message</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Label position"
            description="By default the track sits on the leading edge with the label trailing. Set labelPosition='start' to flip — useful for settings rows where the label takes the available width and the track sits at the trailing edge. (The card variant defaults to label-first — same idiom, no attribute needed.)"
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-checkbox-toggle name="label-position-end" value="end" [checked]="true">
                Default — track first, label after
              </org-checkbox-toggle>
              <org-checkbox-toggle name="label-position-start" value="start" labelPosition="start" [checked]="true">
                Start — label takes the width, track at the end
              </org-checkbox-toggle>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>end</strong> (default): track on the leading edge, label trailing</li>
            <li><strong>start</strong>: label takes the available width, track sits at the trailing edge</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Knob icons"
            description="Optional, independently per side. Render whichever are provided in the iconOff / iconOn slots; the knob carries the icon matching the current state and crossfades on toggle."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="icons-both-off" value="both" iconOff="eye-off" iconOn="eye">
                  Visibility
                </org-checkbox-toggle>
                <org-checkbox-toggle
                  name="icons-both-on"
                  value="both"
                  iconOff="eye-off"
                  iconOn="eye"
                  [checked]="true"
                >
                  Visibility
                </org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="icons-on-only-off" value="on-only" iconOn="check">
                  Confirmed
                </org-checkbox-toggle>
                <org-checkbox-toggle name="icons-on-only-on" value="on-only" iconOn="check" [checked]="true">
                  Confirmed
                </org-checkbox-toggle>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox-toggle name="icons-off-only-off" value="off-only" iconOff="lock-keyhole">
                  Public
                </org-checkbox-toggle>
                <org-checkbox-toggle
                  name="icons-off-only-on"
                  value="off-only"
                  iconOff="lock-keyhole"
                  [checked]="true"
                >
                  Public
                </org-checkbox-toggle>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Provide either or both of <strong>iconOff</strong> / <strong>iconOn</strong></li>
            <li>The knob shows the icon matching the current state; the other slot fades out</li>
            <li>Common pairs: eye-off / eye for visibility, lock-keyhole / x for confirm, etc.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Description sub-line"
            description="An optional muted line beneath the label. The track stays optically aligned with the first line of the label, so the description hangs cleanly below."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-checkbox-toggle
                name="desc-features"
                value="features"
                [checked]="true"
                description="Up to once a week. You can unsubscribe at any time."
              >
                Email me about new features
              </org-checkbox-toggle>
              <org-checkbox-toggle
                name="desc-2fa"
                value="2fa"
                color="safe"
                description="Require a code from your authenticator app on each sign-in."
              >
                Two-factor authentication
              </org-checkbox-toggle>
              <org-checkbox-toggle
                name="desc-public"
                value="public"
                color="danger"
                description="Anyone with the link can see your profile, projects, and shared spaces."
              >
                Public profile
              </org-checkbox-toggle>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The description renders below the label in a muted color</li>
            <li>Pair with <strong>color="safe"</strong> for protective on-states or <strong>color="danger"</strong> when the description warns of consequences</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Card variant"
            description="Wraps the row in a bordered tile — the canonical settings-list pattern. Card defaults to label-first (copy on the leading edge, track on the trailing edge); the whole tile is the hit target. When checked, the border picks up the on-color."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2 w-full">
              <org-checkbox-toggle
                name="card-autosave"
                value="autosave"
                variant="card"
                [checked]="true"
                description="Save changes as you type. Recover any version from the history."
              >
                Autosave
              </org-checkbox-toggle>
              <org-checkbox-toggle
                name="card-slack"
                value="slack"
                variant="card"
                description="Send a message to #updates whenever a deploy succeeds or fails."
              >
                Slack notifications
              </org-checkbox-toggle>
              <org-checkbox-toggle
                name="card-public"
                value="public"
                variant="card"
                description="Anyone on the internet can view this workspace's contents and member list."
              >
                Public workspace
              </org-checkbox-toggle>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Each card is its own surface — border + background change on hover</li>
            <li>Selected (checked) cards highlight their border with the chosen color</li>
            <li>Combine with <strong>description</strong> to clarify what each setting controls</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Grouped Toggles"
            description="Multiple toggles laid out vertically or horizontally with consistent spacing."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-1">
              <org-checkbox-toggle name="vert-option1" value="option1">Notifications</org-checkbox-toggle>
              <org-checkbox-toggle name="vert-option2" value="option2" [checked]="true">Email alerts</org-checkbox-toggle>
              <org-checkbox-toggle name="vert-option3" value="option3">SMS alerts</org-checkbox-toggle>
              <org-checkbox-toggle name="vert-option4" value="option4" [disabled]="true">Push notifications (disabled)</org-checkbox-toggle>
            </div>
            <div class="flex flex-row gap-3">
              <org-checkbox-toggle name="horz-option1" value="option1">WiFi</org-checkbox-toggle>
              <org-checkbox-toggle name="horz-option2" value="option2" [checked]="true">Bluetooth</org-checkbox-toggle>
              <org-checkbox-toggle name="horz-option3" value="option3">Airplane mode</org-checkbox-toggle>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Use a column layout for related settings so each has its own row hit target</li>
            <li>Row layouts work for short, parallel choices that fit on one line</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checkbox-toggle-validation-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Validation message appears below the toggle when provided</li>
            <li>Message uses <strong>text-danger</strong> color (danger / red)</li>
            <li>Proper ARIA attributes for accessibility (aria-invalid, aria-describedby)</li>
            <li>Message uses role="alert" and aria-live="polite" for screen readers</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Validation Space Reservation"
            description="When reserveValidationSpace is true, space is always reserved for validation messages so rows do not jump as errors appear and disappear."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-6 w-full">
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="true">
                  <org-checkbox-toggle name="reserve-true-1" value="1">Toggle 1 (no error)</org-checkbox-toggle>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
                  <org-checkbox-toggle name="reserve-true-2" value="2">Toggle 2 (with error)</org-checkbox-toggle>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true">
                  <org-checkbox-toggle name="reserve-true-3" value="3">Toggle 3 (no error)</org-checkbox-toggle>
                </org-form-field>
              </org-form-fields>
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="false">
                  <org-checkbox-toggle name="reserve-false-1" value="1">Toggle 1 (no error)</org-checkbox-toggle>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
                  <org-checkbox-toggle name="reserve-false-2" value="2">Toggle 2 (with error)</org-checkbox-toggle>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false">
                  <org-checkbox-toggle name="reserve-false-3" value="3">Toggle 3 (no error)</org-checkbox-toggle>
                </org-form-field>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>reserveValidationSpace=true</strong>: space is always reserved (left column) — rows stay aligned</li>
            <li><strong>reserveValidationSpace=false</strong>: space is allocated only when a message is present (right column) — rows collapse together</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        CheckboxToggle,
        FormFields,
        FormField,
        CheckboxToggleValidationSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-checkbox-toggle-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckboxToggle,
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
          <org-checkbox-toggle
            name="non-form"
            value="non-form"
            [checked]="checked()"
            (checkedChange)="checked.set($event)"
            description="Driven without a reactive form, using [checked] + (checkedChange)."
          >
            Subscribe to product updates
          </org-checkbox-toggle>
          <p>
            Checked: <strong>{{ checked() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Bind <strong>[checked]</strong> to a signal (or any value) and listen to <strong>(checkedChange)</strong> to update it</li>
          <li>No reactive form required — the host owns the state</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CheckboxToggleNonFormStory {
  protected readonly checked = signal<boolean>(false);
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the toggle outside of a reactive form using `[checked]` + `(checkedChange)`.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-toggle-non-form />`,
    moduleMetadata: {
      imports: [CheckboxToggleNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-checkbox-toggle-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CheckboxToggle,
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
          [description]="'Form Valid: ' + toggleForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="toggleForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field>
                <org-checkbox-toggle formControlName="notifications" name="notifications" value="notifications">
                  Enable notifications
                </org-checkbox-toggle>
              </org-form-field>
              <org-form-field>
                <org-checkbox-toggle formControlName="darkMode" name="darkMode" value="darkMode">
                  Dark mode
                </org-checkbox-toggle>
              </org-form-field>
              <org-form-field>
                <org-checkbox-toggle formControlName="autoSave" name="autoSave" value="autoSave">
                  Auto-save
                </org-checkbox-toggle>
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
          <li>Form state updates automatically as toggles are changed — no manual change handlers needed</li>
          <li>
            Programmatic <strong>form.disable()</strong> and <strong>control.disable()</strong> are reflected in the
            toggle's disabled state
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CheckboxToggleReactiveFormStory {
  protected readonly toggleForm = new FormGroup({
    notifications: new FormControl<boolean>(false, { nonNullable: true }),
    darkMode: new FormControl<boolean>(false, { nonNullable: true }),
    autoSave: new FormControl<boolean>(true, { nonNullable: true }),
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
        story: 'Example of integrating toggles with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-toggle-reactive-form />`,
    moduleMetadata: {
      imports: [CheckboxToggleReactiveFormStory],
    },
  }),
};
