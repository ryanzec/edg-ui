import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { Checkbox } from '../checkbox/checkbox';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Icon } from '../icon/icon';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import {
  Button,
  allButtonSizes,
  allButtonVariants,
  allButtonColorStrengths,
  ButtonColor,
  ButtonColorStrength,
  ButtonSize,
  ButtonVariant,
} from './button';
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

const liveDemoColorStrengthItems: ButtonToggleItem[] = allButtonColorStrengths.map((colorStrength) => ({
  label: colorStrength,
  value: colorStrength,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allButtonSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

type LiveDemoIconChoice = 'none' | 'pre' | 'post' | 'both' | 'only';

const allLiveDemoIconChoices = ['none', 'pre', 'post', 'both', 'only'] as const;

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
          <org-button #buttonRef label="Hold to Press" />
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
          <org-button #buttonRef label="Click or Tab to Focus" />
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

  A versatile button component with multiple color variants, sizes, icon support, and interactive states.

  ### Features
  - 8 color variants for different semantic meanings
  - 4 style variants (filled, ghost, text, plain)
  - 2 color strengths (strong, soft) applied orthogonally to the variant
  - 3 size options (small, base, large)
  - Built-in icon support via the preIcon and postIcon inputs
  - Custom pre/post content via projected #pre / #post templates (ngTemplateOutlet)
  - Loading state with spinner (replaces the pre slot during loading)
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
  <org-button color="primary" label="Click Me" />

  <!-- Button with pre-icon -->
  <org-button color="primary" label="Add Item" preIcon="plus" />

  <!-- Button with post-icon -->
  <org-button color="primary" label="Continue" postIcon="arrow-right" />

  <!-- Button with both icons -->
  <org-button color="primary" label="Download" preIcon="download" postIcon="arrow-right" />

  <!-- Loading button -->
  <org-button color="primary" label="Saving..." [loading]="true" />

  <!-- Disabled button -->
  <org-button color="primary" label="Disabled" [disabled]="true" />

  <!-- Icon-only button with accessible label -->
  <org-button color="primary" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" />

  <!-- Custom pre/post content via projected templates -->
  <org-button color="primary" label="With Custom Content">
    <ng-template #pre><org-icon name="sparkles" /></ng-template>
    <ng-template #post><org-icon name="arrow-right" /></ng-template>
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
    colorStrength: 'strong',
    disabled: false,
    loading: false,
    iconOnly: false,
    type: 'button',
    excludeSpacing: false,
    buttonClass: '',
    ariaLabel: null,
    label: 'Click Me',
    preIcon: null,
    postIcon: null,
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
      options: ['filled', 'outline', 'ghost', 'text', 'plain'],
      description: 'The variant style of the button',
    },
    colorStrength: {
      control: 'select',
      options: ['strong', 'soft'],
      description: "The color intensity of the variant; 'soft' uses the soft color tokens where applicable",
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
    label: {
      control: 'text',
      description: 'The visible text label rendered inside the button',
    },
    preIcon: {
      control: 'select',
      options: [null, 'plus', 'sparkles', 'download', 'cog', 'arrow-right', 'check'],
      description: 'Optional icon rendered before the label',
    },
    postIcon: {
      control: 'select',
      options: [null, 'arrow-right', 'sparkles', 'download', 'check', 'plus'],
      description: 'Optional icon rendered after the label',
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
        [colorStrength]="colorStrength"
        [disabled]="disabled"
        [loading]="loading"
        [iconOnly]="iconOnly"
        [type]="type"
        [excludeSpacing]="excludeSpacing"
        [buttonClass]="buttonClass"
        [ariaLabel]="ariaLabel"
        [label]="label"
        [preIcon]="preIcon"
        [postIcon]="postIcon"
      />
    `,
    moduleMetadata: {
      imports: [Button],
    },
  }),
};

@Component({
  selector: 'story-button-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Button,
    ButtonToggle,
    Checkbox,
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
          <org-design-system-demo-control-group label="Color Strength">
            <org-button-toggle [items]="colorStrengthItems" formControlName="colorStrength" buttonSize="sm" />
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
          <org-design-system-demo-control-group label="Custom pre">
            <org-checkbox-toggle name="live-demo-custom-pre" value="custom-pre" formControlName="customPre">
              {{ liveDemoForm.controls.customPre.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Custom post">
            <org-checkbox-toggle name="live-demo-custom-post" value="custom-post" formControlName="customPost">
              {{ liveDemoForm.controls.customPost.value ? 'on' : 'off' }}
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
                  [colorStrength]="liveDemoForm.controls.colorStrength.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  label="Save changes"
                >
                  @if (liveDemoForm.controls.customPre.value) {
                    <ng-template #pre>
                      <org-checkbox name="live-demo-projected-pre" value="live-demo-projected-pre" />
                    </ng-template>
                  }
                  @if (liveDemoForm.controls.customPost.value) {
                    <ng-template #post>
                      <org-checkbox name="live-demo-projected-post" value="live-demo-projected-post" />
                    </ng-template>
                  }
                </org-button>
              }
              @case ('pre') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [colorStrength]="liveDemoForm.controls.colorStrength.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  label="Save changes"
                  preIcon="sparkles"
                >
                  @if (liveDemoForm.controls.customPre.value) {
                    <ng-template #pre>
                      <org-checkbox name="live-demo-projected-pre" value="live-demo-projected-pre" />
                    </ng-template>
                  }
                  @if (liveDemoForm.controls.customPost.value) {
                    <ng-template #post>
                      <org-checkbox name="live-demo-projected-post" value="live-demo-projected-post" />
                    </ng-template>
                  }
                </org-button>
              }
              @case ('post') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [colorStrength]="liveDemoForm.controls.colorStrength.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  label="Save changes"
                  postIcon="sparkles"
                >
                  @if (liveDemoForm.controls.customPre.value) {
                    <ng-template #pre>
                      <org-checkbox name="live-demo-projected-pre" value="live-demo-projected-pre" />
                    </ng-template>
                  }
                  @if (liveDemoForm.controls.customPost.value) {
                    <ng-template #post>
                      <org-checkbox name="live-demo-projected-post" value="live-demo-projected-post" />
                    </ng-template>
                  }
                </org-button>
              }
              @case ('both') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [colorStrength]="liveDemoForm.controls.colorStrength.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  label="Save changes"
                  preIcon="sparkles"
                  postIcon="sparkles"
                >
                  @if (liveDemoForm.controls.customPre.value) {
                    <ng-template #pre>
                      <org-checkbox name="live-demo-projected-pre" value="live-demo-projected-pre" />
                    </ng-template>
                  }
                  @if (liveDemoForm.controls.customPost.value) {
                    <ng-template #post>
                      <org-checkbox name="live-demo-projected-post" value="live-demo-projected-post" />
                    </ng-template>
                  }
                </org-button>
              }
              @case ('only') {
                <org-button
                  [color]="liveDemoForm.controls.color.value"
                  [variant]="liveDemoForm.controls.variant.value"
                  [colorStrength]="liveDemoForm.controls.colorStrength.value"
                  [size]="liveDemoForm.controls.size.value"
                  [disabled]="liveDemoForm.controls.disabled.value"
                  [loading]="liveDemoForm.controls.loading.value"
                  [iconOnly]="true"
                  label="Save changes"
                  preIcon="sparkles"
                  ariaLabel="Save changes"
                >
                  @if (liveDemoForm.controls.customPre.value) {
                    <ng-template #pre>
                      <org-checkbox name="live-demo-projected-pre" value="live-demo-projected-pre" />
                    </ng-template>
                  }
                  @if (liveDemoForm.controls.customPost.value) {
                    <ng-template #post>
                      <org-checkbox name="live-demo-projected-post" value="live-demo-projected-post" />
                    </ng-template>
                  }
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
  protected readonly colorStrengthItems = liveDemoColorStrengthItems;
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly iconItems = liveDemoIconItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<ButtonColor>('primary', { nonNullable: true }),
    variant: new FormControl<ButtonVariant>('filled', { nonNullable: true }),
    colorStrength: new FormControl<ButtonColorStrength>('strong', { nonNullable: true }),
    size: new FormControl<ButtonSize>('base', { nonNullable: true }),
    icon: new FormControl<LiveDemoIconChoice>('none', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
    loading: new FormControl<boolean>(false, { nonNullable: true }),
    customPre: new FormControl<boolean>(false, { nonNullable: true }),
    customPost: new FormControl<boolean>(false, { nonNullable: true }),
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
          'Comprehensive showcase of every button variant axis — color, size, icon composition, state, variant style, spacing, group orientation, and custom pre/post projection — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary" label="Primary Button" />
            <org-button color="secondary" label="Secondary Button" />
            <org-button color="neutral" label="Neutral Button" />
            <org-button color="safe" label="Safe Button" />
            <org-button color="info" label="Info Button" />
            <org-button color="caution" label="Caution Button" />
            <org-button color="warning" label="Warning Button" />
            <org-button color="danger" label="Danger Button" />
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
            <org-button color="primary" size="sm" label="Small Button" />
            <org-button color="primary" size="base" label="Base Button" />
            <org-button color="primary" size="lg" label="Large Button" />
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
              <org-button color="primary" size="sm" label="Add Item" preIcon="plus" />
              <org-button color="primary" size="base" label="Add Item" preIcon="plus" />
              <org-button color="primary" size="lg" label="Add Item" preIcon="plus" />
            </div>
            <org-button color="primary" label="Add Item" preIcon="plus" />
            <org-button color="primary" label="Continue" postIcon="arrow-right" />
            <org-button color="primary" label="Download" preIcon="download" postIcon="arrow-right" />
            <org-button color="primary" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Pre-Icon</strong>: Pass a preIcon name to render an icon before the label</li>
            <li><strong>Post-Icon</strong>: Pass a postIcon name to render an icon after the label</li>
            <li><strong>Both Icons</strong>: Pass both preIcon and postIcon for emphasis</li>
            <li><strong>Icon-Only</strong>: Set [iconOnly]="true" for icon-only padding and always provide an ariaLabel for accessibility</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Custom Pre/Post Content" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary" label="Custom Pre">
              <ng-template #pre><org-icon name="sparkles" /></ng-template>
            </org-button>
            <org-button color="primary" label="Custom Post">
              <ng-template #post><org-icon name="arrow-right" /></ng-template>
            </org-button>
            <org-button color="primary" label="Custom Both">
              <ng-template #pre><org-icon name="sparkles" /></ng-template>
              <ng-template #post><org-icon name="arrow-right" /></ng-template>
            </org-button>
            <org-button color="primary" label="With Badge">
              <ng-template #pre>
                <span class="rounded-base bg-danger px-1 text-xs text-on-danger">3</span>
              </ng-template>
            </org-button>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>#pre template</strong>: Project an <code>&lt;ng-template #pre&gt;</code> to render before the label</li>
            <li><strong>#post template</strong>: Project an <code>&lt;ng-template #post&gt;</code> to render after the label</li>
            <li><strong>Template wins</strong>: When both a projected template and the corresponding icon input are provided, the projected template wins and a warning is logged</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button States" />
          <org-design-system-demo-canvas slot="canvas">
            <org-button color="primary" label="Normal Button" />
            <org-button color="primary" label="Disabled Button" [disabled]="true" />
            <org-button color="primary" label="Loading Button" [loading]="true" />
            <org-button color="primary" label="Uploading..." preIcon="upload" [loading]="true" />
            <org-button color="primary" label="Settings" preIcon="cog" [loading]="true" [iconOnly]="true" ariaLabel="Settings" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Normal</strong>: Interactive with hover and focus states</li>
            <li><strong>Disabled</strong>: Non-interactive, reduced opacity, no hover effects</li>
            <li><strong>Loading</strong>: Shows spinner in the pre slot, non-interactive during operation</li>
            <li><strong>Loading Icon-Only</strong>: The icon is replaced by the spinner during loading</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Button Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2">
              <org-button color="primary" variant="filled" label="Filled" />
              <org-button color="primary" variant="outline" label="Outline" />
              <org-button color="primary" variant="ghost" label="Ghost" />
              <org-button color="primary" variant="text" label="Text" />
              <org-button color="primary" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="secondary" variant="filled" label="Filled" />
              <org-button color="secondary" variant="outline" label="Outline" />
              <org-button color="secondary" variant="ghost" label="Ghost" />
              <org-button color="secondary" variant="text" label="Text" />
              <org-button color="secondary" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="neutral" variant="filled" label="Filled" />
              <org-button color="neutral" variant="outline" label="Outline" />
              <org-button color="neutral" variant="ghost" label="Ghost" />
              <org-button color="neutral" variant="text" label="Text" />
              <org-button color="neutral" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="safe" variant="filled" label="Filled" />
              <org-button color="safe" variant="outline" label="Outline" />
              <org-button color="safe" variant="ghost" label="Ghost" />
              <org-button color="safe" variant="text" label="Text" />
              <org-button color="safe" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="info" variant="filled" label="Filled" />
              <org-button color="info" variant="outline" label="Outline" />
              <org-button color="info" variant="ghost" label="Ghost" />
              <org-button color="info" variant="text" label="Text" />
              <org-button color="info" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="caution" variant="filled" label="Filled" />
              <org-button color="caution" variant="outline" label="Outline" />
              <org-button color="caution" variant="ghost" label="Ghost" />
              <org-button color="caution" variant="text" label="Text" />
              <org-button color="caution" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="warning" variant="filled" label="Filled" />
              <org-button color="warning" variant="outline" label="Outline" />
              <org-button color="warning" variant="ghost" label="Ghost" />
              <org-button color="warning" variant="text" label="Text" />
              <org-button color="warning" variant="plain" label="Plain" />
            </div>
            <div class="flex gap-2">
              <org-button color="danger" variant="filled" label="Filled" />
              <org-button color="danger" variant="outline" label="Outline" />
              <org-button color="danger" variant="ghost" label="Ghost" />
              <org-button color="danger" variant="text" label="Text" />
              <org-button color="danger" variant="plain" label="Plain" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Filled</strong>: Default variant with colored background and border</li>
            <li><strong>Outline</strong>: Filled-like colored border and text, but the background stays transparent in every state; the border and text step through the hover/active color tokens on interaction</li>
            <li><strong>Ghost</strong>: Transparent background and border in default state, colored text; hover/focus/active matches the filled styling on interaction</li>
            <li><strong>Text</strong>: Always transparent background and border, uses color-specific text tokens in default state, with a filled-like focus-visible state</li>
            <li><strong>Plain</strong>: Color-agnostic — neutral border, transparent background, inherited foreground regardless of the color input</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Strength" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <org-button color="primary" variant="filled" colorStrength="strong" label="Filled strong" />
                <org-button color="primary" variant="filled" colorStrength="soft" label="Filled soft" />
                <org-button color="primary" variant="outline" colorStrength="strong" label="Outline strong" />
                <org-button color="primary" variant="outline" colorStrength="soft" label="Outline soft" />
                <org-button color="primary" variant="ghost" colorStrength="strong" label="Ghost strong" />
                <org-button color="primary" variant="ghost" colorStrength="soft" label="Ghost soft" />
                <org-button color="primary" variant="text" colorStrength="strong" label="Text strong" />
                <org-button color="primary" variant="text" colorStrength="soft" label="Text soft" />
              </div>
              <div class="flex gap-2">
                <org-button color="safe" variant="filled" colorStrength="strong" label="Filled strong" />
                <org-button color="safe" variant="filled" colorStrength="soft" label="Filled soft" />
                <org-button color="safe" variant="outline" colorStrength="strong" label="Outline strong" />
                <org-button color="safe" variant="outline" colorStrength="soft" label="Outline soft" />
                <org-button color="safe" variant="ghost" colorStrength="strong" label="Ghost strong" />
                <org-button color="safe" variant="ghost" colorStrength="soft" label="Ghost soft" />
                <org-button color="safe" variant="text" colorStrength="strong" label="Text strong" />
                <org-button color="safe" variant="text" colorStrength="soft" label="Text soft" />
              </div>
              <div class="flex gap-2">
                <org-button color="danger" variant="filled" colorStrength="strong" label="Filled strong" />
                <org-button color="danger" variant="filled" colorStrength="soft" label="Filled soft" />
                <org-button color="danger" variant="outline" colorStrength="strong" label="Outline strong" />
                <org-button color="danger" variant="outline" colorStrength="soft" label="Outline soft" />
                <org-button color="danger" variant="ghost" colorStrength="strong" label="Ghost strong" />
                <org-button color="danger" variant="ghost" colorStrength="soft" label="Ghost soft" />
                <org-button color="danger" variant="text" colorStrength="strong" label="Text strong" />
                <org-button color="danger" variant="text" colorStrength="soft" label="Text soft" />
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>colorStrength</strong>: An axis orthogonal to variant — <code>strong</code> (default) uses the strong accent tokens, <code>soft</code> swaps in the soft color tokens where a variant actually paints with a color</li>
            <li><strong>Filled + soft</strong>: Low-emphasis tinted background with neutral foreground; hover/focus/active step through the soft state tokens</li>
            <li><strong>Outline + soft</strong>: Transparent background with neutral foreground; the border softens through the soft state tokens on hover/focus/active</li>
            <li><strong>Ghost + soft</strong>: Resting state still transparent with colored text, but the hover/active fill uses the soft tint instead of the strong fill</li>
            <li><strong>Text + soft</strong>: Resting and hover text are unchanged; only the focus-visible fill softens</li>
            <li><strong>Plain</strong>: Unaffected by colorStrength — it is color-agnostic by design</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Exclude Spacing" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" label="Small" />
              <org-button color="primary" size="base" label="Base" />
              <org-button color="primary" size="lg" label="Large" />
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" label="Small" [excludeSpacing]="true" />
              <org-button color="primary" size="base" label="Base" [excludeSpacing]="true" />
              <org-button color="primary" size="lg" label="Large" [excludeSpacing]="true" />
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" />
              <org-button color="primary" size="base" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" />
              <org-button color="primary" size="lg" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" />
            </div>
            <div class="flex gap-2 items-baseline">
              <org-button color="primary" size="sm" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true" />
              <org-button color="primary" size="base" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true" />
              <org-button color="primary" size="lg" label="Settings" preIcon="cog" [iconOnly]="true" ariaLabel="Settings" [excludeSpacing]="true" />
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
              <org-button color="primary" label="First" />
              <org-button color="primary" variant="ghost" label="Second" />
              <org-button color="primary" variant="ghost" label="Third" />
            </org-button-group>
            <org-button-group orientation="vertical">
              <org-button color="primary" label="First" />
              <org-button color="primary" variant="ghost" label="Second" />
              <org-button color="primary" variant="ghost" label="Third" />
            </org-button-group>
            <org-button-group class="border border-default-color rounded-base p-1">
              <org-button color="neutral" variant="ghost" label="Cancel" />
              <org-button color="primary" label="Save" />
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
        ButtonGroup,
        Icon,
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
