import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Card } from '../card/card';
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
import { Checkbox, CheckboxColor, CheckboxSize, allCheckboxColors, allCheckboxSizes } from './checkbox';
import { CheckboxGroup } from './checkbox-group';

const liveDemoSizeItems: ButtonToggleItem[] = allCheckboxSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoColorItems: ButtonToggleItem[] = allCheckboxColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-checkbox-select-all-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Select All Pattern"
        [description]="'Selected: ' + selectedCount() + ' of ' + totalCount"
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-1">
          <org-checkbox
            name="selectAll"
            value="selectAll"
            [checked]="allSelected()"
            [indeterminate]="someSelected()"
            (checkedChange)="onSelectAllChange($event)"
          >
            <strong>Select All</strong>
          </org-checkbox>
          <div class="flex flex-col gap-1">
            <org-checkbox
              name="item1"
              value="item1"
              [checked]="items()[0].selected"
              (checkedChange)="onItemChange(0, $event)"
            >
              Item 1
            </org-checkbox>
            <org-checkbox
              name="item2"
              value="item2"
              [checked]="items()[1].selected"
              (checkedChange)="onItemChange(1, $event)"
            >
              Item 2
            </org-checkbox>
            <org-checkbox
              name="item3"
              value="item3"
              [checked]="items()[2].selected"
              (checkedChange)="onItemChange(2, $event)"
            >
              Item 3
            </org-checkbox>
            <org-checkbox
              name="item4"
              value="item4"
              [checked]="items()[3].selected"
              (checkedChange)="onItemChange(3, $event)"
            >
              Item 4
            </org-checkbox>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class CheckboxSelectAllSection {
  private readonly _totalCount = 4;

  protected readonly items = signal<{ selected: boolean }[]>([
    { selected: false },
    { selected: false },
    { selected: false },
    { selected: false },
  ]);

  protected readonly totalCount = this._totalCount;

  protected readonly selectedCount = computed<number>(() => this.items().filter((item) => item.selected).length);

  protected readonly allSelected = computed<boolean>(() => this.selectedCount() === this._totalCount);

  protected readonly someSelected = computed<boolean>(
    () => this.selectedCount() > 0 && this.selectedCount() < this._totalCount
  );

  protected onItemChange(index: number, checked: boolean): void {
    const newItems = [...this.items()];
    newItems[index].selected = checked;
    this.items.set(newItems);
  }

  protected onSelectAllChange(checked: boolean): void {
    this.items.set(this.items().map(() => ({ selected: checked })));
  }
}

@Component({
  selector: 'story-checkbox-card-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Checkbox, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Card-tile pattern"
        description="Wrap each option in org-card and bind (clicked) so the whole tile toggles the checkbox underneath. Useful for permission pickers, feature opt-ins, and any list where each option needs to read as its own surface."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 w-full">
          <org-card (clicked)="toggle('read')">
            <org-checkbox
              name="card-read"
              value="read"
              [checked]="selections().read"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('read', $event)"
              description="View projects, files, and comments. No write access."
            >
              Read
            </org-checkbox>
          </org-card>
          <org-card (clicked)="toggle('write')">
            <org-checkbox
              name="card-write"
              value="write"
              [checked]="selections().write"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('write', $event)"
              description="Create, edit, and delete projects and files."
            >
              Write
            </org-checkbox>
          </org-card>
          <org-card (clicked)="toggle('admin')">
            <org-checkbox
              name="card-admin"
              value="admin"
              [checked]="selections().admin"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('admin', $event)"
              description="Manage members, billing, and workspace settings."
            >
              Admin
            </org-checkbox>
          </org-card>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class CheckboxCardSection {
  protected readonly selections = signal<{ read: boolean; write: boolean; admin: boolean }>({
    read: true,
    write: true,
    admin: false,
  });

  protected toggle(key: 'read' | 'write' | 'admin'): void {
    this.selections.update((current) => ({ ...current, [key]: !current[key] }));
  }

  protected setSelection(key: 'read' | 'write' | 'admin', value: boolean): void {
    this.selections.update((current) => ({ ...current, [key]: value }));
  }
}

@Component({
  selector: 'story-checkbox-group-card-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Checkbox, CheckboxGroup, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Checkbox Group — card-tile pattern"
        description="Pair org-checkbox-group with org-card-wrapped children for a permissions-list layout. Each card forwards (clicked) to its checkbox so the entire surface is a hit target."
      />
      <org-design-system-demo-canvas slot="canvas">
        <org-checkbox-group legend="Permissions" description="What this teammate can do in the workspace.">
          <org-card (clicked)="toggle('read')">
            <org-checkbox
              name="cbg-card-read"
              value="read"
              [checked]="selections().read"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('read', $event)"
              description="View projects, files, and comments. No write access."
            >
              Read
            </org-checkbox>
          </org-card>
          <org-card (clicked)="toggle('write')">
            <org-checkbox
              name="cbg-card-write"
              value="write"
              [checked]="selections().write"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('write', $event)"
              description="Create, edit, and delete projects and files."
            >
              Write
            </org-checkbox>
          </org-card>
          <org-card (clicked)="toggle('admin')">
            <org-checkbox
              name="cbg-card-admin"
              value="admin"
              [checked]="selections().admin"
              (click)="$event.stopPropagation()"
              (checkedChange)="setSelection('admin', $event)"
              description="Manage members, billing, and workspace settings."
            >
              Admin
            </org-checkbox>
          </org-card>
        </org-checkbox-group>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class CheckboxGroupCardSection {
  protected readonly selections = signal<{ read: boolean; write: boolean; admin: boolean }>({
    read: true,
    write: false,
    admin: false,
  });

  protected toggle(key: 'read' | 'write' | 'admin'): void {
    this.selections.update((current) => ({ ...current, [key]: !current[key] }));
  }

  protected setSelection(key: 'read' | 'write' | 'admin', value: boolean): void {
    this.selections.update((current) => ({ ...current, [key]: value }));
  }
}

@Component({
  selector: 'story-checkbox-validation-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Checkbox,
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
        [description]="'Form Valid: ' + validationForm.valid + ', Accepted: ' + (validationForm.value.terms || false)"
      />
      <org-design-system-demo-canvas slot="canvas">
        <form [formGroup]="validationForm">
          <org-form-fields>
            <org-form-field validationMessage="You must accept the terms and conditions to continue">
              <org-checkbox formControlName="terms" name="terms" value="accepted">
                I accept the terms and conditions
              </org-checkbox>
            </org-form-field>
            <org-form-field>
              <org-checkbox formControlName="newsletter" name="newsletter" value="subscribed">
                Subscribe to newsletter
              </org-checkbox>
            </org-form-field>
          </org-form-fields>
        </form>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class CheckboxValidationSection {
  protected readonly validationForm = new FormGroup({
    terms: new FormControl<boolean>(false, { nonNullable: true }),
    newsletter: new FormControl<boolean>(true, { nonNullable: true }),
  });
}

const meta: Meta<Checkbox> = {
  title: 'Core/Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Checkbox Component

  A boolean opt-in — a styled square indicator (with a tick or a horizontal dash) paired with a label and an optional sub-line description. Native &lt;input type="checkbox"&gt; drives state; the visible square is a styled sibling. Three sizes &times; two colors &times; indeterminate / disabled / error states.

  ### Features
  - Three sizes: \`sm\`, \`base\` (default), \`lg\`
  - Two colors: \`primary\` (default), \`danger\`
  - Three checked states: unchecked, checked, indeterminate
  - Optional description sub-line beneath the label
  - Disabled state
  - Error state (driven by parent \`org-form-field\` validation message)
  - Form integration via \`ControlValueAccessor\` (works with reactive forms)
  - Accessible: ARIA attributes, keyboard navigation (Space / Enter)

  ### Usage Examples
  \`\`\`html
  <!-- Basic checkbox -->
  <org-checkbox name="agree" value="yes">I agree to the terms</org-checkbox>

  <!-- Checked, with description -->
  <org-checkbox name="features" value="features" [checked]="true" description="Up to once a week.">
    Email me about new features
  </org-checkbox>

  <!-- Danger color (destructive opt-in) -->
  <org-checkbox name="delete" value="delete" color="danger">
    Permanently delete this account
  </org-checkbox>

  <!-- Different sizes -->
  <org-checkbox name="small" value="small" size="sm">Small</org-checkbox>
  <org-checkbox name="large" value="large" size="lg">Large</org-checkbox>

  <!-- Card-tile pattern: wrap with org-card and forward (clicked) to a toggle handler -->
  <org-card (clicked)="readSelected.set(!readSelected())">
    <org-checkbox
      name="read"
      value="read"
      [checked]="readSelected()"
      (checkedChange)="readSelected.set($event)"
      description="View projects, files, and comments."
    >
      Read
    </org-checkbox>
  </org-card>

  <!-- Reactive forms -->
  <form [formGroup]="myForm">
    <org-form-fields>
      <org-form-field validationMessage="You must accept the terms">
        <org-checkbox formControlName="terms" name="terms" value="accepted">
          I accept the terms
        </org-checkbox>
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

// the checked / indeterminate / disabled inputs come from the host-directive forwarding on `Checkbox`, which
// storybook's signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<Checkbox & { checked: boolean; indeterminate: boolean; disabled: boolean }>;

export const Default: Story = {
  args: {
    name: 'checkbox',
    value: 'value',
    checked: false,
    indeterminate: false,
    disabled: false,
    size: 'base',
    color: 'primary',
    description: '',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the checkbox input (required)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for the checkbox input (required)',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    size: {
      control: 'select',
      options: allCheckboxSizes,
      description: 'Size of the checkbox',
    },
    color: {
      control: 'select',
      options: allCheckboxColors,
      description: 'Color variant of the checkbox',
    },
    description: {
      control: 'text',
      description: 'Optional description sub-line beneath the label',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default checkbox with all controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-checkbox
        [name]="name"
        [value]="value"
        [checked]="checked"
        [indeterminate]="indeterminate"
        [disabled]="disabled"
        [size]="size"
        [color]="color"
        [description]="description"
      >
        Checkbox Label
      </org-checkbox>
    `,
    moduleMetadata: {
      imports: [Checkbox],
    },
  }),
};

@Component({
  selector: 'story-checkbox-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Checkbox,
    ButtonToggle,
    CheckboxToggle,
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
          description="Toggle the inputs to walk every documented combination — label, description, size, color, checked, indeterminate, disabled."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Label">
            <org-input name="live-demo-label" formControlName="label" ariaLabel="Checkbox label" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Description">
            <org-input name="live-demo-description" formControlName="description" ariaLabel="Checkbox description" />
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
          <org-design-system-demo-control-group label="Indeterminate">
            <org-checkbox-toggle name="live-demo-indeterminate" value="indeterminate" formControlName="indeterminate">
              {{ liveDemoForm.controls.indeterminate.value ? 'on' : 'off' }}
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
            <org-checkbox
              name="live-demo"
              value="live-demo"
              [size]="liveDemoForm.controls.size.value"
              [color]="liveDemoForm.controls.color.value"
              [checked]="liveDemoForm.controls.checked.value"
              [indeterminate]="liveDemoForm.controls.indeterminate.value"
              [disabled]="liveDemoForm.controls.disabled.value"
              [description]="liveDemoForm.controls.description.value"
            >
              {{ liveDemoForm.controls.label.value }}
            </org-checkbox>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class CheckboxLiveDemoStory {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly colorItems = liveDemoColorItems;

  protected readonly liveDemoForm = new FormGroup({
    label: new FormControl<string>('Email me about new features', { nonNullable: true }),
    description: new FormControl<string>('Up to once a week.', { nonNullable: true }),
    size: new FormControl<CheckboxSize>('base', { nonNullable: true }),
    color: new FormControl<CheckboxColor>('primary', { nonNullable: true }),
    checked: new FormControl<boolean>(true, { nonNullable: true }),
    indeterminate: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every combination — size, color, checked, indeterminate, disabled — and edit the label / description text.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-live-demo />`,
    moduleMetadata: {
      imports: [CheckboxLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every checkbox axis — sizes, colors, states, description sub-line, card-tile pattern, grouping, select-all pattern, validation, and validation space reservation — in a single scrollable view.',
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
            description="Three sizes — sm, base, lg. The indicator, label type, tick stroke weight, and full row hit-target all scale together."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox name="sizes-sm-unchecked" value="sm" size="sm">Small</org-checkbox>
                <org-checkbox name="sizes-sm-checked" value="sm" size="sm" [checked]="true">Small</org-checkbox>
                <org-checkbox name="sizes-sm-ind" value="sm" size="sm" [indeterminate]="true">Small</org-checkbox>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox name="sizes-base-unchecked" value="base">Base</org-checkbox>
                <org-checkbox name="sizes-base-checked" value="base" [checked]="true">Base</org-checkbox>
                <org-checkbox name="sizes-base-ind" value="base" [indeterminate]="true">Base</org-checkbox>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox name="sizes-lg-unchecked" value="lg" size="lg">Large</org-checkbox>
                <org-checkbox name="sizes-lg-checked" value="lg" size="lg" [checked]="true">Large</org-checkbox>
                <org-checkbox name="sizes-lg-ind" value="lg" size="lg" [indeterminate]="true">Large</org-checkbox>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>sm</strong>: compact for tight spaces</li>
            <li><strong>base</strong>: standard default</li>
            <li><strong>lg</strong>: prominent — emphasis or large-touch surfaces</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Colors"
            description="Two semantic colors only — primary (ink) and danger. Use danger sparingly, for destructive opt-ins like &quot;Permanently delete this account&quot;."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox name="colors-primary-unchecked" value="primary">Send me product updates</org-checkbox>
                <org-checkbox name="colors-primary-checked" value="primary" [checked]="true">
                  Send me product updates
                </org-checkbox>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox name="colors-danger-unchecked" value="danger" color="danger">
                  Permanently delete this account
                </org-checkbox>
                <org-checkbox name="colors-danger-checked" value="danger" color="danger" [checked]="true">
                  Permanently delete this account
                </org-checkbox>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>primary</strong>: default ink color for routine opt-ins</li>
            <li><strong>danger</strong>: reserve for destructive opt-ins (delete account, irreversible actions)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="States"
            description="Default / hover / focus / disabled / error across unchecked, checked, and indeterminate. Hover and focus are real — interact with the controls below to see them."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-6">
                <org-checkbox name="states-default-unchecked" value="default">Option</org-checkbox>
                <org-checkbox name="states-default-checked" value="default" [checked]="true">Option</org-checkbox>
                <org-checkbox name="states-default-ind" value="default" [indeterminate]="true">Option</org-checkbox>
              </div>
              <div class="flex items-center gap-6">
                <org-checkbox name="states-disabled-unchecked" value="disabled" [disabled]="true">Option</org-checkbox>
                <org-checkbox
                  name="states-disabled-checked"
                  value="disabled"
                  [disabled]="true"
                  [checked]="true"
                >
                  Option
                </org-checkbox>
                <org-checkbox
                  name="states-disabled-ind"
                  value="disabled"
                  [disabled]="true"
                  [indeterminate]="true"
                >
                  Option
                </org-checkbox>
              </div>
              <org-form-fields>
                <org-form-field validationMessage="This field is required">
                  <org-checkbox name="states-error-unchecked" value="error">Option (error)</org-checkbox>
                </org-form-field>
                <org-form-field validationMessage="This field is required">
                  <org-checkbox name="states-error-checked" value="error" [checked]="true">
                    Option (error)
                  </org-checkbox>
                </org-form-field>
                <org-form-field validationMessage="This field is required">
                  <org-checkbox name="states-error-ind" value="error" [indeterminate]="true">
                    Option (error)
                  </org-checkbox>
                </org-form-field>
              </org-form-fields>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: neutral indicator border, fills with the color when checked / indeterminate</li>
            <li><strong>Hover</strong>: indicator color shifts toward the active color on the row</li>
            <li><strong>Focus</strong>: visible focus ring around the row (a11y)</li>
            <li><strong>Disabled</strong>: row reads at reduced opacity, pointer becomes not-allowed</li>
            <li><strong>Error</strong>: indicator color uses danger across all checked states; driven by a parent <code>org-form-field</code> validation message</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Description sub-line"
            description="An optional muted line beneath the label, for secondary clarifying copy. The indicator stays optically aligned with the first line of the label."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-3">
              <org-checkbox
                name="desc-features"
                value="features"
                [checked]="true"
                description="Up to once a week. You can unsubscribe at any time from your settings."
              >
                Email me about new features
              </org-checkbox>
              <org-checkbox
                name="desc-usage"
                value="usage"
                description="Helps us understand how the product is used and prioritise improvements."
              >
                Share anonymized usage data
              </org-checkbox>
              <org-checkbox
                name="desc-delete"
                value="delete"
                color="danger"
                description="All projects, files, and integrations will be removed. This cannot be undone."
              >
                I understand this will permanently delete my account
              </org-checkbox>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The description renders below the label in a muted color</li>
            <li>Pair with <strong>color="danger"</strong> when the description warns of irreversible consequences</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checkbox-card-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Wrap each checkbox in <strong>org-card</strong> and bind its <strong>(clicked)</strong> output to toggle the inner checkbox</li>
            <li>Card already supplies the bordered tile, hover/pressed tint, focus ring, and role=button affordance — no bespoke styling needed</li>
            <li>Combine with the checkbox's <strong>description</strong> input to clarify what each option grants</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Grouped Checkboxes"
            description="Multiple checkboxes laid out vertically or horizontally with consistent spacing."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-1">
              <org-checkbox name="vert-option1" value="option1">Option 1</org-checkbox>
              <org-checkbox name="vert-option2" value="option2" [checked]="true">Option 2 (checked)</org-checkbox>
              <org-checkbox name="vert-option3" value="option3">Option 3</org-checkbox>
              <org-checkbox name="vert-option4" value="option4" [disabled]="true">Option 4 (disabled)</org-checkbox>
            </div>
            <div class="flex flex-row gap-3">
              <org-checkbox name="horz-option1" value="option1">Option 1</org-checkbox>
              <org-checkbox name="horz-option2" value="option2" [checked]="true">Option 2</org-checkbox>
              <org-checkbox name="horz-option3" value="option3">Option 3</org-checkbox>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Use a column layout for related opt-ins so each has its own row hit target</li>
            <li>Row layouts work for short, parallel choices that fit on one line</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checkbox-select-all-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Select All</strong> is checked when all items are selected</li>
            <li><strong>Select All</strong> is indeterminate when some (but not all) items are selected</li>
            <li><strong>Select All</strong> is unchecked when no items are selected</li>
            <li>Clicking <strong>Select All</strong> toggles all items</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checkbox-validation-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Validation message appears below the checkbox when provided</li>
            <li>Message uses <strong>text-danger</strong> color (danger / red)</li>
            <li>Proper ARIA attributes for accessibility (aria-invalid, aria-describedby)</li>
            <li>Message uses role="alert" and aria-live="polite" for screen readers</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Checkbox Group"
            description="A vertical stack of org-checkbox options inside a labelled wrapper. Owns layout + legend, description, and required marker — children remain independent controls."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checkbox-group
              legend="Notifications"
              description="Pick the events you want emailed."
              [required]="true"
            >
              <org-checkbox name="cbg-default-features" value="features" [checked]="true">
                New features
              </org-checkbox>
              <org-checkbox name="cbg-default-comments" value="comments">Comments on my posts</org-checkbox>
              <org-checkbox name="cbg-default-mentions" value="mentions">Mentions</org-checkbox>
              <org-checkbox name="cbg-default-newsletter" value="newsletter">Weekly newsletter</org-checkbox>
            </org-checkbox-group>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The legend names the group; the description gives helper context</li>
            <li>The required asterisk lives on the legend, not on individual checkboxes</li>
            <li>Each child checkbox stays an independent control with its own checked / disabled state</li>
            <li>Inter-option gap stays constant across sizes by design — siblings keep vertical alignment</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Checkbox Group — sizes"
            description="data-size cascades to every child checkbox. Indicator and label scale; the stack rhythm stays uniform."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-6">
              <org-checkbox-group size="sm" legend="Small">
                <org-checkbox name="cbg-sm-a" value="a">Option A</org-checkbox>
                <org-checkbox name="cbg-sm-b" value="b" [checked]="true">Option B</org-checkbox>
                <org-checkbox name="cbg-sm-c" value="c">Option C</org-checkbox>
              </org-checkbox-group>
              <org-checkbox-group size="base" legend="Base">
                <org-checkbox name="cbg-base-a" value="a">Option A</org-checkbox>
                <org-checkbox name="cbg-base-b" value="b" [checked]="true">Option B</org-checkbox>
                <org-checkbox name="cbg-base-c" value="c">Option C</org-checkbox>
              </org-checkbox-group>
              <org-checkbox-group size="lg" legend="Large">
                <org-checkbox name="cbg-lg-a" value="a">Option A</org-checkbox>
                <org-checkbox name="cbg-lg-b" value="b" [checked]="true">Option B</org-checkbox>
                <org-checkbox name="cbg-lg-c" value="c">Option C</org-checkbox>
              </org-checkbox-group>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Each child checkbox picks up its size from the group via data-size cascade</li>
            <li>You can still override an individual child's size by setting size on the child directly</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-checkbox-group-card-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>org-checkbox-group accepts any node as a child — wrap each checkbox in <strong>org-card</strong> to get the tiled surface treatment</li>
            <li>Card's <strong>(clicked)</strong> output toggles the inner checkbox so the entire tile is the hit target</li>
            <li>The legend, description, and required marker on org-checkbox-group continue to apply unchanged</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Checkbox Group — disabled cascade"
            description="disabled on the group dims every child that has not pinned its own disabled state. Children stay focusable for assistive tech but cannot be activated."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-checkbox-group legend="Locked while saving" [disabled]="true">
              <org-checkbox name="cbg-disabled-a" value="a">Option A</org-checkbox>
              <org-checkbox name="cbg-disabled-b" value="b" [checked]="true">Option B</org-checkbox>
              <org-checkbox name="cbg-disabled-c" value="c">Option C</org-checkbox>
            </org-checkbox-group>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Every child reads as disabled — reduced opacity, not-allowed cursor, pointer-events blocked</li>
            <li>A child with its own disabled input gets its own disabled treatment and bypasses the group cascade</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Checkbox Group — error cascade"
            description="Wrap the group in an org-form-field with a validationMessage. Every child checkbox without its own data-state picks up the danger indicator color."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-form-fields>
              <org-form-field validationMessage="Pick at least one notification type">
                <org-checkbox-group legend="Notifications" [required]="true">
                  <org-checkbox name="cbg-error-features" value="features">New features</org-checkbox>
                  <org-checkbox name="cbg-error-mentions" value="mentions">Mentions</org-checkbox>
                  <org-checkbox name="cbg-error-newsletter" value="newsletter">Weekly newsletter</org-checkbox>
                </org-checkbox-group>
              </org-form-field>
            </org-form-fields>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The group sets data-state="error" on itself when the parent org-form-field has a validation message</li>
            <li>The danger indicator color cascades to every child via css custom property inheritance</li>
            <li>A child with its own data-state opts out of the cascade and keeps its explicit state</li>
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
                  <org-checkbox name="reserve-true-1" value="1">Checkbox 1 (no error)</org-checkbox>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true" validationMessage="This field has an error">
                  <org-checkbox name="reserve-true-2" value="2">Checkbox 2 (with error)</org-checkbox>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="true">
                  <org-checkbox name="reserve-true-3" value="3">Checkbox 3 (no error)</org-checkbox>
                </org-form-field>
              </org-form-fields>
              <org-form-fields>
                <org-form-field [reserveValidationSpace]="false">
                  <org-checkbox name="reserve-false-1" value="1">Checkbox 1 (no error)</org-checkbox>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false" validationMessage="This field has an error">
                  <org-checkbox name="reserve-false-2" value="2">Checkbox 2 (with error)</org-checkbox>
                </org-form-field>
                <org-form-field [reserveValidationSpace]="false">
                  <org-checkbox name="reserve-false-3" value="3">Checkbox 3 (no error)</org-checkbox>
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
        Checkbox,
        CheckboxGroup,
        FormFields,
        FormField,
        CheckboxCardSection,
        CheckboxGroupCardSection,
        CheckboxSelectAllSection,
        CheckboxValidationSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

@Component({
  selector: 'story-checkbox-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Checkbox,
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
          <org-checkbox
            name="non-form"
            value="non-form"
            [checked]="checked()"
            (checkedChange)="checked.set($event)"
            description="Driven without a reactive form, using [checked] + (checkedChange)."
          >
            Subscribe to product updates
          </org-checkbox>
          <p>
            Checked: <strong>{{ checked() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            Bind <strong>[checked]</strong> to a signal (or any value) and listen to <strong>(checkedChange)</strong> to
            update it
          </li>
          <li>No reactive form required — the host owns the state</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CheckboxNonFormStory {
  protected readonly checked = signal<boolean>(false);
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the checkbox outside of a reactive form using `[checked]` + `(checkedChange)`.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-non-form />`,
    moduleMetadata: {
      imports: [CheckboxNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-checkbox-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Checkbox,
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
          [description]="'Form Valid: ' + checkboxForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="checkboxForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field>
                <org-checkbox formControlName="terms" name="terms" value="terms">
                  I agree to the terms and conditions
                </org-checkbox>
              </org-form-field>
              <org-form-field>
                <org-checkbox formControlName="newsletter" name="newsletter" value="newsletter">
                  Subscribe to newsletter
                </org-checkbox>
              </org-form-field>
              <org-form-field>
                <org-checkbox formControlName="marketing" name="marketing" value="marketing">
                  Receive marketing emails
                </org-checkbox>
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms integration via ControlValueAccessor</li>
          <li>Form state updates automatically as checkboxes are toggled — no manual change handlers needed</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class CheckboxReactiveFormStory {
  protected readonly checkboxForm = new FormGroup({
    terms: new FormControl<boolean>(false, { nonNullable: true }),
    newsletter: new FormControl<boolean>(false, { nonNullable: true }),
    marketing: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected readonly formValueDisplay = toSignal(
    this.checkboxForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.checkboxForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating checkboxes with Angular reactive forms via ControlValueAccessor.',
      },
    },
  },
  render: () => ({
    template: `<story-checkbox-reactive-form />`,
    moduleMetadata: {
      imports: [CheckboxReactiveFormStory],
    },
  }),
};
