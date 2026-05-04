import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Button, allButtonSizes, allButtonVariants, ButtonColor, ButtonSize, ButtonVariant } from './button';
import { ButtonIcon } from './button-icon';
import { ButtonGroup } from './button-group';

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoVariantItems: ButtonToggleItem[] = allButtonVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allButtonSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

type LiveDemoIconChoice = 'none' | 'leading' | 'trailing' | 'both' | 'only';

const allLiveDemoIconChoices = ['none', 'leading', 'trailing', 'both', 'only'] as const;

const liveDemoIconItems: ButtonToggleItem[] = allLiveDemoIconChoices.map((choice) => ({
  label: choice,
  value: choice,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-button-pressed-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Pressed State" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <org-button #buttonRef>Hold to Press</org-button>
          <p>
            isPressed: <strong>{{ buttonRef.isPressed() }}</strong>
          </p>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class ButtonPressedStateStory {}

@Component({
  selector: 'story-button-focused-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Focused State" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <org-button #buttonRef>Click or Tab to Focus</org-button>
          <p>
            isFocused: <strong>{{ buttonRef.isFocused() }}</strong>
          </p>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class ButtonFocusedStateStory {}

const meta: Meta<Button> = {
  title: 'Core/Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Button Component

  A versatile button component with multiple color variants, sizes, composable icon support, and interactive states.

  ### Features
  - 8 color variants for different semantic meanings
  - 4 style variants (filled, ghost, text, soft)
  - 3 size options (small, base, large)
  - Composable icon support via &lt;org-button-icon /&gt; slotted before/after content
  - Loading state with spinner (replaces the first slotted icon or prepends a spinner when none are slotted)
  - Disabled state
  - Accessible with focus management
  - Smooth hover and pressed states
  - Form support (button, submit, reset types)

  ### Color Options
  - **primary**: Primary color (default)
  - **secondary**: Secondary accent color
  - **neutral**: Neutral gray color
  - **safe**: Success/safe state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Danger/error state (red)

  ### Size Options
  - **sm**: Compact button for tight spaces
  - **base**: Standard button size (default)
  - **lg**: Prominent button for primary actions

  ### Usage Examples
  \`\`\`html
  <!-- Basic button -->
  <org-button color="primary">Click Me</org-button>

  <!-- Button with pre-icon -->
  <org-button color="primary">
    <org-button-icon name="plus" />
    Add Item
  </org-button>

  <!-- Button with post-icon -->
  <org-button color="primary">
    Continue
    <org-button-icon name="arrow-right" />
  </org-button>

  <!-- Loading button -->
  <org-button color="primary" [loading]="true">Saving...</org-button>

  <!-- Disabled button -->
  <org-button color="primary" [disabled]="true">Disabled</org-button>

  <!-- Icon-only button with accessible label -->
  <org-button color="primary" [iconOnly]="true" ariaLabel="Settings">
    <org-button-icon name="cog" />
  </org-button>

  <!-- Large button with pre and post icons -->
  <org-button color="primary" size="lg">
    <org-button-icon name="download" />
    Download
    <org-button-icon name="arrow-right" />
  </org-button>
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {
  args: {
    color: 'primary',
    size: 'base',
    variant: 'filled',
    disabled: false,
    loading: false,
    iconOnly: false,
    type: 'button',
    excludeSpacing: false,
    buttonClass: '',
    ariaLabel: null,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'],
      description: 'The color variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the button',
    },
    variant: {
      control: 'select',
      options: ['filled', 'ghost', 'text', 'soft'],
      description: 'The variant style of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether the button renders in icon-only mode (drives icon-only padding styles)',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The HTML button type',
    },
    excludeSpacing: {
      control: 'boolean',
      description: 'Whether to exclude padding styles from the button',
    },
    buttonClass: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for icon-only buttons or visual label override',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default button with primary color. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-button
        [color]="color"
        [size]="size"
        [variant]="variant"
        [disabled]="disabled"
        [loading]="loading"
        [iconOnly]="iconOnly"
        [type]="type"
        [excludeSpacing]="excludeSpacing"
        [buttonClass]="buttonClass"
        [ariaLabel]="ariaLabel"
      >
        Click Me
      </org-button>
    `,
    moduleMetadata: {
      imports: [Button, ButtonIcon],
    },
  }),
};

@Component({
  selector: 'story-button-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    ButtonIcon,
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
          description="All buttons below are real and interactive — hover, focus, press, or tab through them to see every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Color">
            <org-button-toggle [items]="colorItems" formControlName="color" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Variant">
            <org-button-toggle [items]="variantItems" formControlName="variant" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Icon">
            <org-button-toggle [items]="iconItems" formControlName="icon" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
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
            @switch (liveDemoForm.controls.icon.value) {
              @case ('none') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                >
                  Save changes
                </org-button>
              }
              @case ('leading') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                >
                  <org-button-icon name="sparkles" />
                  Save changes
                </org-button>
              }
              @case ('trailing') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                >
                  Save changes
                  <org-button-icon name="sparkles" />
                </org-button>
              }
              @case ('both') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                >
                  <org-button-icon name="sparkles" />
                  Save changes
                  <org-button-icon name="sparkles" />
                </org-button>
              }
              @case ('only') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  [iconOnly]="true"
                  ariaLabel="Save changes"
                >
                  <org-button-icon name="sparkles" />
                </org-button>
              }
            }
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class ButtonLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly iconItems = liveDemoIconItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<ButtonColor>('primary', { nonNullable: true }),
    variant: new FormControl<ButtonVariant>('filled', { nonNullable: true }),
    size: new FormControl<ButtonSize>('base', { nonNullable: true }),
    icon: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    loading: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive every visual input on the button (color, variant, size, icon position, disabled, loading) and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-button-live-demo />`,
    moduleMetadata: {
      imports: [ButtonLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every button variant axis — color, size, icon composition, state, variant style, spacing, and group orientation — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary">Primary Button</org-button>
            <org-button color="secondary">Secondary Button</org-button>
            <org-button color="neutral">Neutral Button</org-button>
            <org-button color="safe">Safe Button</org-button>
            <org-button color="info">Info Button</org-button>
            <org-button color="caution">Caution Button</org-button>
            <org-button color="warning">Warning Button</org-button>
            <org-button color="danger">Danger Button</org-button>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Primary</strong>: Primary color for main actions</li>
            <li><strong>Secondary</strong>: Secondary accent color for alternative actions</li>
            <li><strong>Neutral</strong>: Neutral gray for low-emphasis actions</li>
            <li><strong>Safe</strong>: Green for success/positive actions</li>
            <li><strong>Info</strong>: Blue for informational actions</li>
            <li><strong>Caution</strong>: Yellow for caution/warning actions</li>
            <li><strong>Warning</strong>: Orange for important warnings</li>
            <li><strong>Danger</strong>: Red for destructive/dangerous actions</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Size Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary" size="sm">Small Button</org-button>
            <org-button color="primary" size="base">Base Button</org-button>
            <org-button color="primary" size="lg">Large Button</org-button>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Small</strong>: Compact button for tight spaces or secondary actions</li>
            <li><strong>Base</strong>: Standard button size for most use cases (default)</li>
            <li><strong>Large</strong>: Prominent button for primary/important actions</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Icon Variations" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm">
                <org-button-icon name="plus" />
                Add Item
              </org-button>
              <org-button color="primary" size="base">
                <org-button-icon name="plus" />
                Add Item
              </org-button>
              <org-button color="primary" size="lg">
                <org-button-icon name="plus" />
                Add Item
              </org-button>
            </div>
            <org-button color="primary">
              <org-button-icon name="plus" />
              Add Item
            </org-button>
            <org-button color="primary">
              Continue
              <org-button-icon name="arrow-right" />
            </org-button>
            <org-button color="primary">
              <org-button-icon name="download" />
              Download
              <org-button-icon name="arrow-right" />
            </org-button>
            <org-button color="primary" [iconOnly]="true" ariaLabel="Settings">
              <org-button-icon name="cog" />
            </org-button>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Pre-Icon</strong>: Slot an org-button-icon before the text</li>
            <li><strong>Post-Icon</strong>: Slot an org-button-icon after the text</li>
            <li><strong>Both Icons</strong>: Slot icons on both sides for emphasis</li>
            <li><strong>Icon-Only</strong>: Set [iconOnly]="true" for icon-only padding and always provide an ariaLabel for accessibility</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button States" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary">Normal Button</org-button>
            <org-button color="primary" [disabled]="true">Disabled Button</org-button>
            <org-button color="primary" [loading]="true">Loading Button</org-button>
            <org-button color="primary" [loading]="true">
              <org-button-icon name="upload" />
              Uploading...
            </org-button>
            <org-button color="primary" [loading]="true" [iconOnly]="true" ariaLabel="Settings">
              <org-button-icon name="cog" />
            </org-button>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Normal</strong>: Interactive with hover and focus states</li>
            <li><strong>Disabled</strong>: Non-interactive, reduced opacity, no hover effects</li>
            <li><strong>Loading</strong>: Shows spinner, non-interactive during operation</li>
            <li><strong>Loading with Icon</strong>: The first slotted org-button-icon renders as the spinner</li>
            <li><strong>Loading Icon-Only</strong>: The icon is replaced by the spinner during loading</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2">
              <org-button color="primary" variant="filled">Filled</org-button>
              <org-button color="primary" variant="ghost">Ghost</org-button>
              <org-button color="primary" variant="text">Text</org-button>
              <org-button color="primary" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="secondary" variant="filled">Filled</org-button>
              <org-button color="secondary" variant="ghost">Ghost</org-button>
              <org-button color="secondary" variant="text">Text</org-button>
              <org-button color="secondary" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="neutral" variant="filled">Filled</org-button>
              <org-button color="neutral" variant="ghost">Ghost</org-button>
              <org-button color="neutral" variant="text">Text</org-button>
              <org-button color="neutral" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="safe" variant="filled">Filled</org-button>
              <org-button color="safe" variant="ghost">Ghost</org-button>
              <org-button color="safe" variant="text">Text</org-button>
              <org-button color="safe" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="info" variant="filled">Filled</org-button>
              <org-button color="info" variant="ghost">Ghost</org-button>
              <org-button color="info" variant="text">Text</org-button>
              <org-button color="info" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="caution" variant="filled">Filled</org-button>
              <org-button color="caution" variant="ghost">Ghost</org-button>
              <org-button color="caution" variant="text">Text</org-button>
              <org-button color="caution" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="warning" variant="filled">Filled</org-button>
              <org-button color="warning" variant="ghost">Ghost</org-button>
              <org-button color="warning" variant="text">Text</org-button>
              <org-button color="warning" variant="soft">Soft</org-button>
            </div>
            <div class="flex gap-2">
              <org-button color="danger" variant="filled">Filled</org-button>
              <org-button color="danger" variant="ghost">Ghost</org-button>
              <org-button color="danger" variant="text">Text</org-button>
              <org-button color="danger" variant="soft">Soft</org-button>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Filled</strong>: Default variant with colored background and border</li>
            <li><strong>Ghost</strong>: Transparent background and border in default state, colored text</li>
            <li><strong>Hover/Focus/Active</strong>: Ghost variant matches filled variant styling on interaction</li>
            <li><strong>Text</strong>: Always transparent background and border, uses color-specific text tokens (e.g., primary-text, danger-text) in default state, bold variant (e.g., primary-text-bold, danger-text-bold) on hover/focus/active</li>
            <li><strong>Soft</strong>: Mirrors the filled pattern but uses soft color tokens for a low-emphasis tinted background with colored text; hover/focus/active step through the soft state tokens</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Exclude Spacing" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm">Small</org-button>
              <org-button color="primary" size="base">Base</org-button>
              <org-button color="primary" size="lg">Large</org-button>
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" [excludeSpacing]="true">Small</org-button>
              <org-button color="primary" size="base" [excludeSpacing]="true">Base</org-button>
              <org-button color="primary" size="lg" [excludeSpacing]="true">Large</org-button>
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" [iconOnly]="true" ariaLabel="Settings">
                <org-button-icon name="cog" />
              </org-button>
              <org-button color="primary" size="base" [iconOnly]="true" ariaLabel="Settings">
                <org-button-icon name="cog" />
              </org-button>
              <org-button color="primary" size="lg" [iconOnly]="true" ariaLabel="Settings">
                <org-button-icon name="cog" />
              </org-button>
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true">
                <org-button-icon name="cog" />
              </org-button>
              <org-button color="primary" size="base" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true">
                <org-button-icon name="cog" />
              </org-button>
              <org-button color="primary" size="lg" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true">
                <org-button-icon name="cog" />
              </org-button>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Default</strong>: Button includes padding based on size</li>
            <li><strong>excludeSpacing=true</strong>: Removes all padding, useful for custom layouts where spacing is controlled externally</li>
            <li><strong>Text Size</strong>: Font size and gap are preserved regardless of excludeSpacing setting</li>
            <li><strong>Icon-Only</strong>: Icon-only buttons also respect the excludeSpacing setting</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button Group Orientations" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button-group>
              <org-button color="primary">First</org-button>
              <org-button color="primary" variant="ghost">Second</org-button>
              <org-button color="primary" variant="ghost">Third</org-button>
            </org-button-group>
            <org-button-group orientation="vertical">
              <org-button color="primary">First</org-button>
              <org-button color="primary" variant="ghost">Second</org-button>
              <org-button color="primary" variant="ghost">Third</org-button>
            </org-button-group>
            <org-button-group class="border border-default-color rounded-base p-1">
              <org-button color="neutral" variant="ghost">Cancel</org-button>
              <org-button color="primary">Save</org-button>
            </org-button-group>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Horizontal</strong>: Buttons arranged in a row (default orientation)</li>
            <li><strong>Vertical</strong>: Buttons stacked in a column</li>
            <li><strong>Custom Classes</strong>: Pass a native class attribute to add styles to the group container</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Button,
        ButtonIcon,
        ButtonGroup,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};

export const PressedState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the isPressed computed signal. Click and hold the button to see the signal update.',
      },
    },
  },
  render: () => ({
    template: `<story-button-pressed-state />`,
    moduleMetadata: {
      imports: [ButtonPressedStateStory],
    },
  }),
};

export const FocusedState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the isFocused computed signal. Click or Tab to the button and observe the signal update. The FocusMonitor from Angular CDK tracks both keyboard and pointer focus origins.',
      },
    },
  },
  render: () => ({
    template: `<story-button-focused-state />`,
    moduleMetadata: {
      imports: [ButtonFocusedStateStory],
    },
  }),
};
