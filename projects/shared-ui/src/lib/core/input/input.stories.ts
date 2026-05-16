import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { allIconNames } from '../../brain/icon-brain/icon-brain';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Label } from '../label/label';
import { Tag } from '../tags/tag';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Input,
  InputInlineItem,
  InputShowClearMode,
  InputType,
  InputVariant,
  allInputShowClearModes,
  allInputTypes,
  allInputVariants,
} from './input';

const liveDemoVariantItems: ButtonToggleItem[] = allInputVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoTypeItems: ButtonToggleItem[] = (['text', 'email', 'password', 'number', 'search'] as const).map(
  (type) => ({
    label: type,
    value: type,
    buttonColor: 'primary',
  })
);

const liveDemoStateItems: ButtonToggleItem[] = [
  { label: 'idle', value: 'idle', buttonColor: 'primary' },
  { label: 'error', value: 'error', buttonColor: 'primary' },
];

const liveDemoShowClearItems: ButtonToggleItem[] = allInputShowClearModes.map((mode) => ({
  label: mode,
  value: mode,
  buttonColor: 'primary',
}));

const meta: Meta<Input> = {
  title: 'Core/Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Input Component

  A single-line text-entry shell. The native &lt;input&gt; lives inside a styled wrapper so the wrapper can host slot adornments (pre icon, post buttons, chips), render the focused border, and grow to fit chips that wrap onto multiple rows.

  ### Features
  - Three variants: \`bordered\` (default), \`borderless\`, \`inline\`
  - Type-specific affordances: search, password (with toggle), number (with stepper)
  - Pre / post slots: shorthand \`preIcon\` / \`postIcon\` inputs **or** projected \`<ng-template #pre>\` / \`<ng-template #post>\`
  - Inline chips via the \`inlineItems\` array (default \`org-tag\` rendering, customizable through a projected \`<ng-template #chip let-item>\`)
  - Clear button with three visibility modes: \`never\`, \`active\`, \`always\`
  - Loading state (renders the spinner and forces native readonly)
  - Full state set: hover, focus, error, disabled, readonly, loading
  - Form integration via \`ControlValueAccessor\` (works with reactive forms)
  - Accessible: focus monitoring, aria-invalid driven by parent FormField validation message

  ### Usage Examples
  \`\`\`html
  <!-- bordered (default) -->
  <org-input name="email" type="email" placeholder="you@example.com" preIcon="mail" />

  <!-- borderless inside a card header -->
  <org-input name="quick-search" variant="borderless" type="search" preIcon="search" placeholder="Search" />

  <!-- password with toggle -->
  <org-input name="password" type="password" [showPasswordToggle]="true" placeholder="Enter password" />

  <!-- number with stepper -->
  <org-input name="qty" type="number" placeholder="Quantity" />

  <!-- clear button visible whenever the field is non-empty -->
  <org-input name="search" type="search" showClear="always" placeholder="Search" />

  <!-- custom pre slot via projection -->
  <org-input name="amount">
    <ng-template #pre><span class="text-muted">USD</span></ng-template>
  </org-input>

  <!-- inline chips with default rendering -->
  <org-input name="filters" placeholder="Add a filter..." [inlineItems]="filters" />

  <!-- inline chips with custom template -->
  <org-input name="filters" [inlineItems]="filters">
    <ng-template #chip let-item>
      <org-tag color="info" [removable]="true">{{ item.label }}</org-tag>
    </ng-template>
  </org-input>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Input>;

export const Default: Story = {
  args: {
    name: 'input',
    variant: 'bordered',
    type: 'text',
    placeholder: 'Enter text...',
    value: '',
    disabled: false,
    readonly: false,
    loading: false,
    showClear: 'never',
    showPasswordToggle: false,
    selectAllOnFocus: false,
    autoFocus: false,
    preIcon: null,
    postIcon: null,
    inlineItems: [],
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute (also used as the element id for label association)',
    },
    variant: {
      control: 'select',
      options: allInputVariants,
      description: 'The visual variant of the input',
    },
    type: {
      control: 'select',
      options: allInputTypes,
      description: 'The HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    value: {
      control: 'text',
      description: 'The current value of the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the input is in a loading state',
    },
    showClear: {
      control: 'select',
      options: allInputShowClearModes,
      description: 'Clear-button visibility mode',
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Whether to show the password visibility toggle (password type only)',
    },
    selectAllOnFocus: {
      control: 'boolean',
      description: 'Whether to select all text when the input receives focus',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Whether the input should auto-focus on mount',
    },
    preIcon: {
      control: 'select',
      options: [null, ...allIconNames],
      description: 'Shorthand icon rendered before the input text',
    },
    postIcon: {
      control: 'select',
      options: [null, ...allIconNames],
      description: 'Shorthand icon rendered after the input text',
    },
    inlineItems: {
      control: 'object',
      description: 'Array of inline tag/chip items rendered inside the field',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default input with full controls. Use the controls below to drive every visual input.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-input
        [name]="name"
        [variant]="variant"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [loading]="loading"
        [showClear]="showClear"
        [showPasswordToggle]="showPasswordToggle"
        [selectAllOnFocus]="selectAllOnFocus"
        [autoFocus]="autoFocus"
        [preIcon]="preIcon"
        [postIcon]="postIcon"
        [inlineItems]="inlineItems"
      />
    `,
    moduleMetadata: {
      imports: [Input],
    },
  }),
};

@Component({
  selector: 'story-input-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Input,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
    FormField,
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
          description="Real, focusable input — every state is live. Toggle the controls to walk every input on the page."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Type">
            <org-button-toggle [items]="typeItems" formControlName="type" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="State">
            <org-button-toggle [items]="stateItems" formControlName="state" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="ShowClear">
            <org-button-toggle [items]="showClearItems" formControlName="showClear" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Pre">
            <org-checkbox-toggle name="live-demo-pre" value="pre" formControlName="pre">
              {{ liveDemoForm.controls.pre.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Post">
            <org-checkbox-toggle name="live-demo-post" value="post" formControlName="post">
              {{ liveDemoForm.controls.post.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Readonly">
            <org-checkbox-toggle name="live-demo-readonly" value="readonly" formControlName="readonly">
              {{ liveDemoForm.controls.readonly.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Loading">
            <org-checkbox-toggle name="live-demo-loading" value="loading" formControlName="loading">
              {{ liveDemoForm.controls.loading.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            @if (liveDemoForm.controls.state.value === 'error') {
              <org-form-field validationMessage="Field has an error message">
                <org-input
                  name="live-demo-input"
                  placeholder="Type something"
                  [variant]="liveDemoForm.controls.variant.value"
                  [type]="liveDemoForm.controls.type.value"
                  [showClear]="liveDemoForm.controls.showClear.value"
                  [showPasswordToggle]="liveDemoForm.controls.type.value === 'password'"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [readonly]="liveDemoForm.controls.readonly.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  [preIcon]="liveDemoForm.controls.pre.value ? 'mail' : null"
                  [postIcon]="liveDemoForm.controls.post.value ? 'check' : null"
                />
              </org-form-field>
            } @else {
              <org-input
                name="live-demo-input"
                placeholder="Type something"
                [variant]="liveDemoForm.controls.variant.value"
                [type]="liveDemoForm.controls.type.value"
                [showClear]="liveDemoForm.controls.showClear.value"
                [showPasswordToggle]="liveDemoForm.controls.type.value === 'password'"
                [disabled]="liveDemoForm.controls.disabled.value"
                [readonly]="liveDemoForm.controls.readonly.value"
                [loading]="liveDemoForm.controls.loading.value"
                [preIcon]="liveDemoForm.controls.pre.value ? 'mail' : null"
                [postIcon]="liveDemoForm.controls.post.value ? 'check' : null"
              />
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class InputLiveDemoStory {
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly typeItems = liveDemoTypeItems;
  protected readonly stateItems = liveDemoStateItems;
  protected readonly showClearItems = liveDemoShowClearItems;

  protected readonly liveDemoForm = new FormGroup({
    variant: new FormControl<InputVariant>('bordered', { nonNullable: true }),
    type: new FormControl<InputType>('text', { nonNullable: true }),
    state: new FormControl<'idle' | 'error'>('idle', { nonNullable: true }),
    showClear: new FormControl<InputShowClearMode>('active', { nonNullable: true }),
    pre: new FormControl<boolean>(false, { nonNullable: true }),
    post: new FormControl<boolean>(false, { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    readonly: new FormControl<boolean>(false, { nonNullable: true }),
    loading: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the input component (variant, type, state, clear-button mode, slots, disabled, readonly, loading) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-input-live-demo />`,
    moduleMetadata: {
      imports: [InputLiveDemoStory],
    },
  }),
};

@Component({
  selector: 'story-input-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Input,
    Tag,
    Label,
    FormField,
    FormFields,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input name="showcase-bordered" placeholder="you@example.com" />
          <org-input name="showcase-borderless" variant="borderless" placeholder="Untitled note" />
          <org-input name="showcase-inline" variant="inline" placeholder="Q3 roadmap" value="Q3 roadmap" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>bordered</strong>: Standard input with visible border (default)</li>
          <li><strong>borderless</strong>: No chrome at rest — meant to live inside another bordered surface</li>
          <li><strong>inline</strong>: Hugs its text, focused = single underline. Looks like editable inline copy</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Visual States" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input name="showcase-state-default" placeholder="you@example.com" />
          <org-form-field validationMessage="Invalid">
            <org-input name="showcase-state-error" value="acme corp" />
          </org-form-field>
          <org-input name="showcase-state-disabled" [disabled]="true" placeholder="Read-only payload" />
          <org-input name="showcase-state-readonly" [readonly]="true" value="Auto-generated id" />
          <org-input name="showcase-state-loading" [loading]="true" value="Acme" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Hover and focus surface the info border color</li>
          <li><strong>Error</strong>: Border switches to danger red and survives hover / focus</li>
          <li><strong>Disabled</strong>: Reduced opacity, pointer events blocked</li>
          <li><strong>Readonly</strong>: Slightly tinted background, value still selectable</li>
          <li><strong>Loading</strong>: Spinner appears in the post slot, native input forced readonly</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Adornments" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input name="showcase-pre-icon" preIcon="mail" placeholder="Email address" />
          <org-input name="showcase-post-icon" postIcon="check" value="acme" />
          <org-input name="showcase-text-prefix">
            <ng-template #pre><span>https://</span></ng-template>
          </org-input>
          <org-input name="showcase-text-suffix" value="acme">
            <ng-template #post><span>.example.com</span></ng-template>
          </org-input>
          <org-input name="showcase-both" preIcon="mail" postIcon="check" value="you&#64;example.com" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            <strong>preIcon / postIcon</strong>: Shorthand inputs that render an <code>org-icon</code> into the slot
          </li>
          <li>
            <strong>#pre / #post templates</strong>: Project any markup (icon, text adornment, custom button); takes
            precedence over the shorthand
          </li>
          <li>Slots automatically tighten the native pad-x on their side so the field reads tight</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Type-specific Affordances" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input name="showcase-search" type="search" preIcon="search" placeholder="Search" value="design" />
          <org-input name="showcase-password" type="password" [showPasswordToggle]="true" value="hunter2hunter2" />
          <org-input name="showcase-number" type="number" value="12" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>Search</strong>: Native browser clear cross is suppressed; pair with a pre search icon</li>
          <li>
            <strong>Password</strong>: When <code>showPasswordToggle</code> is true the post eye icon swaps
            text/password
          </li>
          <li><strong>Number</strong>: Native browser spinners are suppressed; the shell renders its own stepper</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Clear Button — showClear" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input name="showcase-clear-never" showClear="never" value="Hello world" />
          <org-input name="showcase-clear-active" showClear="active" value="Hello world" />
          <org-input name="showcase-clear-always" showClear="always" value="Hello world" />
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li><strong>never</strong>: Clear button is always hidden (default)</li>
          <li><strong>active</strong>: Hidden unless (hover OR focus) AND the field has a value</li>
          <li><strong>always</strong>: Visible whenever the field has a value</li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Inline Chips" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input
            name="showcase-chips-search"
            type="search"
            preIcon="search"
            placeholder="Add another filter..."
            [inlineItems]="searchChips"
          />
          <org-input name="showcase-chips-tag" placeholder="tag" [inlineItems]="tagChips">
            <ng-template #chip let-item>
              <org-tag color="info" [removable]="true">{{ item.label }}</org-tag>
            </ng-template>
          </org-input>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            <strong>inlineItems</strong>: An array of <code>InputInlineItem</code> renders default <code>org-tag</code>s
            with the input track owning the layout
          </li>
          <li>
            <strong>#chip template</strong>: Project an <code>&lt;ng-template #chip let-item&gt;</code> to fully
            customize each chip; receives the item as the implicit context
          </li>
          <li>
            The track owns row-gap so chips wrap naturally; the input's chip-size pinning makes every tag honor a single
            rhythm
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>

      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="In Context — with Label / FormField" />
        <org-design-system-demo-canvas slot="canvas">
          <org-form-fields>
            <org-form-field>
              <org-label text="Email address" htmlFor="showcase-label-email" [isRequired]="true" />
              <org-input name="showcase-label-email" type="email" preIcon="mail" placeholder="you&#64;example.com" />
            </org-form-field>
            <org-form-field>
              <org-label text="Password" htmlFor="showcase-label-password" [isRequired]="true" />
              <org-input
                name="showcase-label-password"
                type="password"
                [showPasswordToggle]="true"
                value="hunter2hunter2"
              />
            </org-form-field>
            <org-form-field validationMessage="URL can only contain lowercase letters, numbers, and hyphens.">
              <org-label text="Workspace URL" htmlFor="showcase-label-workspace" [isRequired]="true" />
              <org-input name="showcase-label-workspace" value="acme corp" />
            </org-form-field>
          </org-form-fields>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>
            <strong>FormField wrapping</strong>: Provides validation message + reserved space; the input's error state
            is driven directly by the FormField
          </li>
          <li>
            <strong>Label association</strong>: The label's <code>inputId</code> matches the input's
            <code>name</code> (which is also used as the element id)
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class InputShowcaseStory {
  protected readonly searchChips: InputInlineItem[] = [
    { id: 'priority', label: 'priority:high', removable: true },
    { id: 'noah', label: '@noah', removable: true },
  ];

  protected readonly tagChips: InputInlineItem[] = [
    { id: 'design', label: 'design', removable: true },
    { id: 'tokens', label: 'tokens', removable: true },
    { id: 'light-mode', label: 'light-mode', removable: true },
    { id: 'a11y', label: 'a11y', removable: true },
  ];
}

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every input variant axis — variants, visual states, adornments, type-specific affordances, clear-button modes, inline chips, and in-context FormField composition — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `<story-input-showcase />`,
    moduleMetadata: {
      imports: [InputShowcaseStory],
    },
  }),
};

@Component({
  selector: 'story-input-non-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Input, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas, DesignSystemDemoExpectedBehaviour],
  template: `
    <div class="flex flex-col gap-4">
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Non-Form Usage" />
        <org-design-system-demo-canvas slot="canvas">
          <org-input
            name="non-form-input"
            placeholder="Type to update the value below"
            showClear="active"
            [(value)]="value"
            (cleared)="clearedCount.set(clearedCount() + 1)"
          />
          <p>
            Value: <strong>{{ value() }}</strong>
          </p>
          <p>
            Cleared events: <strong>{{ clearedCount() }}</strong>
          </p>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Use <strong>[(value)]</strong> for two-way binding outside of a reactive form</li>
          <li>The <strong>cleared</strong> output emits whenever the clear button wipes the value</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class InputNonFormStory {
  protected readonly value = signal<string>('Hello world');
  protected readonly clearedCount = signal<number>(0);
}

export const NonFormUsage: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Driving the input outside of a reactive form using `[(value)]` and listening to `(cleared)`.',
      },
    },
  },
  render: () => ({
    template: `<story-input-non-form />`,
    moduleMetadata: {
      imports: [InputNonFormStory],
    },
  }),
};

@Component({
  selector: 'story-input-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Input,
    Label,
    FormField,
    FormFields,
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
          [description]="'Form Valid: ' + signupForm.valid + ', Form Value: ' + formValueDisplay()"
        />
        <org-design-system-demo-canvas slot="canvas">
          <form [formGroup]="signupForm" class="flex flex-col gap-2">
            <org-form-fields>
              <org-form-field [validationMessage]="emailError()">
                <org-label text="Email address" htmlFor="signup-email" [isRequired]="true" />
                <org-input
                  name="signup-email"
                  type="email"
                  preIcon="mail"
                  placeholder="you&#64;example.com"
                  formControlName="email"
                />
              </org-form-field>
              <org-form-field [validationMessage]="workspaceError()">
                <org-label text="Workspace URL" htmlFor="signup-workspace" [isRequired]="true" />
                <org-input name="signup-workspace" formControlName="workspace" placeholder="acme" />
              </org-form-field>
              <org-form-field>
                <org-label text="Password" htmlFor="signup-password" />
                <org-input
                  name="signup-password"
                  type="password"
                  [showPasswordToggle]="true"
                  formControlName="password"
                />
              </org-form-field>
            </org-form-fields>
          </form>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="list-inside list-disc flex flex-col gap-1">
          <li>Uses <strong>formControlName</strong> for reactive forms via <code>ControlValueAccessor</code></li>
          <li>
            The <code>org-form-field</code> wraps each input and drives the <code>data-state="error"</code> via
            <code>validationMessage</code>
          </li>
          <li>
            Programmatic <strong>form.disable()</strong> / <strong>control.disable()</strong> reflects in the input
          </li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    </div>
  `,
})
class InputReactiveFormStory {
  protected readonly signupForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    workspace: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)],
    }),
    password: new FormControl<string>('', { nonNullable: true }),
  });

  protected readonly emailError = toSignal(
    this.signupForm.controls.email.statusChanges.pipe(
      map(() => {
        const errors = this.signupForm.controls.email.errors;

        if (!errors || !this.signupForm.controls.email.touched) {
          return '';
        }

        if (errors['required']) {
          return 'Email is required';
        }

        if (errors['email']) {
          return 'Enter a valid email address';
        }

        return '';
      })
    ),
    { initialValue: '' }
  );

  protected readonly workspaceError = toSignal(
    this.signupForm.controls.workspace.statusChanges.pipe(
      map(() => {
        const errors = this.signupForm.controls.workspace.errors;

        if (!errors || !this.signupForm.controls.workspace.touched) {
          return '';
        }

        if (errors['required']) {
          return 'Workspace URL is required';
        }

        if (errors['pattern']) {
          return 'URL can only contain lowercase letters, numbers, and hyphens.';
        }

        return '';
      })
    ),
    { initialValue: '' }
  );

  protected readonly formValueDisplay = toSignal(
    this.signupForm.valueChanges.pipe(map((value) => JSON.stringify(value))),
    { initialValue: JSON.stringify(this.signupForm.value) }
  );
}

export const ReactiveFormIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example of integrating the input with Angular reactive forms via `ControlValueAccessor`.',
      },
    },
  },
  render: () => ({
    template: `<story-input-reactive-form />`,
    moduleMetadata: {
      imports: [InputReactiveFormStory],
    },
  }),
};
