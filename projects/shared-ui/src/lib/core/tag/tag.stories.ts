import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Input } from '../input/input';
import { allComponentColors } from '../types/component-types';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Tag, TagColor, TagSize, TagVariant, allTagSizes, allTagVariants } from './tag';
import { TagIcon } from './tag-icon';

const liveDemoColorItems: ButtonToggleItem[] = allComponentColors.map((color) => ({
  label: color,
  value: color,
  buttonColor: 'primary',
}));

const liveDemoVariantItems: ButtonToggleItem[] = allTagVariants.map((variant) => ({
  label: variant,
  value: variant,
  buttonColor: 'primary',
}));

const liveDemoSizeItems: ButtonToggleItem[] = allTagSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-tag-removable-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Removable" />
      <org-design-system-demo-canvas slot="canvas">
        <org-tag color="primary">Fixed Tag</org-tag>
        <div class="flex flex-col gap-2">
          <org-tag color="primary" [removable]="true" (removed)="removedCount.set(removedCount() + 1)">
            Removable Tag
          </org-tag>
          <p>
            Removed events: <strong>{{ removedCount() }}</strong>
          </p>
        </div>
        <org-tag color="safe" variant="strong" [removable]="true">Removable Strong</org-tag>
        <org-tag color="info" [removable]="true">
          <org-tag-icon name="cog" />
          Settings Tag
        </org-tag>
        <org-tag color="caution" [removable]="true">
          Action Tag
          <org-tag-icon name="arrow-right" />
        </org-tag>
        <org-tag color="neutral" [removable]="true" removeAriaLabel="Remove the priority filter">priority:high</org-tag>
        <div class="flex flex-wrap gap-2">
          <org-tag color="primary" [removable]="true">React</org-tag>
          <org-tag color="info" [removable]="true">Angular</org-tag>
          <org-tag color="safe" [removable]="true">Vue</org-tag>
          <org-tag color="caution" [removable]="true">Svelte</org-tag>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class TagRemovableSection {
  protected readonly removedCount = signal(0);
}

@Component({
  selector: 'story-tag-clickable-icons-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Clickable Icons" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2">
          <org-tag color="primary">
            <org-tag-icon name="cog" (clicked)="preClickCount.set(preClickCount() + 1)" />
            Settings
          </org-tag>
          <p>
            Pre-icon clicks: <strong>{{ preClickCount() }}</strong>
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <org-tag color="info">
            Action
            <org-tag-icon name="arrow-right" (clicked)="postClickCount.set(postClickCount() + 1)" />
          </org-tag>
          <p>
            Post-icon clicks: <strong>{{ postClickCount() }}</strong>
          </p>
        </div>
        <org-tag color="neutral">
          <org-tag-icon name="cog" />
          Static icons
          <org-tag-icon name="check" />
        </org-tag>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class TagClickableIconsSection {
  protected readonly preClickCount = signal(0);
  protected readonly postClickCount = signal(0);
}

const meta: Meta<Tag> = {
  title: 'Core/Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Tag Component

  A small inline pill / chip for status, categories, and filters. Pill-shaped (fully rounded) so it never reads as a button. Two variants × eight semantic colors × three sizes; optional leading/trailing icons; optional built-in removable "×" affordance.

  ### Composition Parts
  - **org-tag** — the pill container. Drives color, size, variant, and the built-in removable affordance.
  - **org-tag-icon** — slotted icon; the icon inherits the tag's color and per-size dimension. Becomes interactive when its \`clicked\` output is observed.

  ### Features
  - Three sizes: xs, sm, base (default)
  - Two visual variants: soft (default) and strong
  - Eight color options: primary, secondary, neutral, safe, info, caution, warning, danger
  - Composable pre / post icons via &lt;org-tag-icon /&gt;
  - Built-in removable affordance via the tag-level \`removable\` input (overrides any trailing tag-icon)
  - Clickable icon support via the icon's \`clicked\` output

  ### Variants
  - **soft** (default): Tinted background paired with same-color text. Quieter; designed to pack densely.
  - **strong**: Saturated fill with contrasting text. Reads at a glance; suitable for status and emphasis.

  ### Color Options
  - **primary**: Primary brand color (default)
  - **secondary**: Secondary accent color
  - **neutral**: Neutral/gray color
  - **safe**: Success/positive state (green)
  - **info**: Informational state (blue)
  - **caution**: Caution state (yellow)
  - **warning**: Warning state (orange)
  - **danger**: Error/danger state (red)

  ### Usage Examples
  \`\`\`html
  <!-- Basic tag -->
  <org-tag color="primary">Tag Content</org-tag>

  <!-- Strong variant -->
  <org-tag color="primary" variant="strong">Strong Tag</org-tag>

  <!-- Tag with leading icon -->
  <org-tag color="info">
    <org-tag-icon name="cog" />
    Settings
  </org-tag>

  <!-- Tag with trailing icon -->
  <org-tag color="safe">
    Completed
    <org-tag-icon name="check" />
  </org-tag>

  <!-- Built-in removable affordance -->
  <org-tag color="neutral" [removable]="true" (removed)="onRemove()">priority:high</org-tag>

  <!-- Removable + leading icon (the leading icon is preserved) -->
  <org-tag color="info" [removable]="true" (removed)="onRemove()">
    <org-tag-icon name="cog" />
    Settings
  </org-tag>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;

// the removable / removeAriaLabel inputs and removed output come from the host-directive forwarding on Tag,
// which storybook's signal-input type extraction does not see, so they are augmented onto the args type here.
type Story = StoryObj<Tag & { removable: boolean; removeAriaLabel: string | null }>;

export const Default: Story = {
  args: {
    color: 'primary',
    size: 'base',
    variant: 'soft',
    removable: false,
    removeAriaLabel: null,
  },
  argTypes: {
    color: {
      control: 'select',
      options: allComponentColors,
      description: 'The color variant of the tag',
    },
    size: {
      control: 'select',
      options: allTagSizes,
      description: 'The size of the tag',
    },
    variant: {
      control: 'select',
      options: allTagVariants,
      description: 'The visual variant of the tag',
    },
    removable: {
      control: 'boolean',
      description: 'When true, renders a built-in X affordance and overrides any trailing tag-icon',
    },
    removeAriaLabel: {
      control: 'text',
      description: 'Accessible label for the built-in remove button (defaults to "Remove tag")',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default tag with primary color and soft variant. Use the controls below to interact with the component, including toggling the built-in removable affordance.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-tag
        [color]="color"
        [size]="size"
        [variant]="variant"
        [removable]="removable"
        [removeAriaLabel]="removeAriaLabel"
      >
        Tag Content
      </org-tag>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon],
    },
  }),
};

@Component({
  selector: 'story-tag-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Tag,
    TagIcon,
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
          description="Walk every combination — color, variant, size, and the optional icon and removable flags. The label text is editable so you can sanity-check truncation and icon spacing on real copy."
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
          <org-design-system-demo-control-group label="Label">
            <org-input name="live-demo-label" formControlName="label" ariaLabel="Tag label" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Leading icon">
            <org-checkbox-toggle name="live-demo-leading-icon" value="leadingIcon" formControlName="leadingIcon">
              {{ liveDemoForm.controls.leadingIcon.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Trailing icon">
            <org-checkbox-toggle name="live-demo-trailing-icon" value="trailingIcon" formControlName="trailingIcon">
              {{ liveDemoForm.controls.trailingIcon.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Removable">
            <org-checkbox-toggle name="live-demo-removable" value="removable" formControlName="removable">
              {{ liveDemoForm.controls.removable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-tag
              [color]="liveDemoForm.controls.color.value"
              [variant]="liveDemoForm.controls.variant.value"
              [size]="liveDemoForm.controls.size.value"
              [removable]="liveDemoForm.controls.removable.value"
            >
              @if (liveDemoForm.controls.leadingIcon.value) {
                <org-tag-icon name="cog" />
              }
              {{ liveDemoForm.controls.label.value }}
              @if (liveDemoForm.controls.trailingIcon.value) {
                <org-tag-icon name="arrow-right" />
              }
            </org-tag>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TagLiveDemoStory {
  protected readonly colorItems = liveDemoColorItems;
  protected readonly variantItems = liveDemoVariantItems;
  protected readonly sizeItems = liveDemoSizeItems;

  protected readonly liveDemoForm = new FormGroup({
    color: new FormControl<TagColor>('primary', { nonNullable: true }),
    variant: new FormControl<TagVariant>('strong', { nonNullable: true }),
    size: new FormControl<TagSize>('base', { nonNullable: true }),
    label: new FormControl<string>('Design', { nonNullable: true }),
    leadingIcon: new FormControl<boolean>(false, { nonNullable: true }),
    trailingIcon: new FormControl<boolean>(false, { nonNullable: true }),
    removable: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Walk every combination — color, variant, size, and the optional icon and removable flags — and edit the label text to sanity-check truncation and icon spacing on real copy.',
      },
    },
  },
  render: () => ({
    template: `<story-tag-live-demo />`,
    moduleMetadata: {
      imports: [TagLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every tag variant axis — variant style, color × size matrix, color, size, icon composition, removable affordance, clickable icons, and realistic in-context placements — in a single scrollable view.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Variant Comparison" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap gap-2">
              <org-tag color="neutral" variant="strong">Design</org-tag>
              <org-tag color="safe" variant="strong">Active</org-tag>
              <org-tag color="info" variant="strong">Beta</org-tag>
              <org-tag color="caution" variant="strong">Review</org-tag>
              <org-tag color="danger" variant="strong">Blocked</org-tag>
              <org-tag color="primary" variant="strong">Draft</org-tag>
            </div>
            <div class="flex flex-wrap gap-2">
              <org-tag color="neutral">Design</org-tag>
              <org-tag color="safe">Active</org-tag>
              <org-tag color="info">Beta</org-tag>
              <org-tag color="caution">Review</org-tag>
              <org-tag color="danger">Blocked</org-tag>
              <org-tag color="primary">Draft</org-tag>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>strong</strong> (top): Saturated fill, contrasting text — reads at a glance, suitable for status</li>
            <li><strong>soft</strong> (bottom, default): Tinted background, same-color text — quieter; designed to pack densely</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color × Size · Strong" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="primary" variant="strong" size="xs">Label</org-tag>
              <org-tag color="primary" variant="strong" size="sm">Label</org-tag>
              <org-tag color="primary" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="secondary" variant="strong" size="xs">Label</org-tag>
              <org-tag color="secondary" variant="strong" size="sm">Label</org-tag>
              <org-tag color="secondary" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="neutral" variant="strong" size="xs">Label</org-tag>
              <org-tag color="neutral" variant="strong" size="sm">Label</org-tag>
              <org-tag color="neutral" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="safe" variant="strong" size="xs">Label</org-tag>
              <org-tag color="safe" variant="strong" size="sm">Label</org-tag>
              <org-tag color="safe" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="info" variant="strong" size="xs">Label</org-tag>
              <org-tag color="info" variant="strong" size="sm">Label</org-tag>
              <org-tag color="info" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="caution" variant="strong" size="xs">Label</org-tag>
              <org-tag color="caution" variant="strong" size="sm">Label</org-tag>
              <org-tag color="caution" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="warning" variant="strong" size="xs">Label</org-tag>
              <org-tag color="warning" variant="strong" size="sm">Label</org-tag>
              <org-tag color="warning" variant="strong" size="base">Label</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="danger" variant="strong" size="xs">Label</org-tag>
              <org-tag color="danger" variant="strong" size="sm">Label</org-tag>
              <org-tag color="danger" variant="strong" size="base">Label</org-tag>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Reach for <strong>safe</strong> for "active / approved"</li>
            <li>Reach for <strong>caution</strong> and <strong>warning</strong> for "needs attention"</li>
            <li>Reach for <strong>danger</strong> for "blocked / failing"</li>
            <li>Reach for <strong>neutral</strong> for de-emphasized status</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Color Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap gap-2">
              <org-tag color="primary">Primary</org-tag>
              <org-tag color="secondary">Secondary</org-tag>
              <org-tag color="neutral">Neutral</org-tag>
              <org-tag color="safe">Safe</org-tag>
              <org-tag color="info">Info</org-tag>
              <org-tag color="caution">Caution</org-tag>
              <org-tag color="warning">Warning</org-tag>
              <org-tag color="danger">Danger</org-tag>
            </div>
            <div class="flex flex-wrap gap-2">
              <org-tag color="primary" variant="strong">Primary</org-tag>
              <org-tag color="secondary" variant="strong">Secondary</org-tag>
              <org-tag color="neutral" variant="strong">Neutral</org-tag>
              <org-tag color="safe" variant="strong">Safe</org-tag>
              <org-tag color="info" variant="strong">Info</org-tag>
              <org-tag color="caution" variant="strong">Caution</org-tag>
              <org-tag color="warning" variant="strong">Warning</org-tag>
              <org-tag color="danger" variant="strong">Danger</org-tag>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>primary</strong>: Primary brand color</li>
            <li><strong>secondary</strong>: Secondary accent color</li>
            <li><strong>neutral</strong>: Neutral/gray color</li>
            <li><strong>safe</strong>: Success/positive state (green)</li>
            <li><strong>info</strong>: Informational state (blue)</li>
            <li><strong>caution</strong>: Caution state (yellow)</li>
            <li><strong>warning</strong>: Warning state (orange)</li>
            <li><strong>danger</strong>: Error/danger state (red)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Size Variants" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="primary" size="xs">Extra Small</org-tag>
              <org-tag color="primary" size="sm">Small</org-tag>
              <org-tag color="primary">Base</org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="info" size="xs">
                <org-tag-icon name="cog" />
                Extra Small
                <org-tag-icon name="arrow-right" />
              </org-tag>
              <org-tag color="info" size="sm">
                <org-tag-icon name="cog" />
                Small
                <org-tag-icon name="arrow-right" />
              </org-tag>
              <org-tag color="info">
                <org-tag-icon name="cog" />
                Base
                <org-tag-icon name="arrow-right" />
              </org-tag>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <org-tag color="safe" size="xs" [removable]="true">xs</org-tag>
              <org-tag color="safe" size="sm" [removable]="true">sm</org-tag>
              <org-tag color="safe" [removable]="true">base</org-tag>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>xs</strong>: 18px tall, dense for status columns</li>
            <li><strong>sm</strong>: 20px tall</li>
            <li><strong>base</strong>: 24px tall, larger padding and text (default)</li>
            <li>Icon and X dimensions scale proportionally with tag size</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Icon Composition" />
          <org-design-system-demo-canvas slot="canvas">
            <org-tag color="primary">No Icons</org-tag>
            <div class="flex flex-wrap gap-2">
              <org-tag color="info"><org-tag-icon name="file-text" />Saved</org-tag>
              <org-tag color="safe"><org-tag-icon name="check" />Approved</org-tag>
              <org-tag color="caution"><org-tag-icon name="circle" />Pending</org-tag>
              <org-tag color="danger"><org-tag-icon name="circle-x" />Blocked</org-tag>
            </div>
            <div class="flex flex-wrap gap-2">
              <org-tag color="neutral">Linear<org-tag-icon name="arrow-up-right" /></org-tag>
              <org-tag color="neutral">3 issues<org-tag-icon name="chevron-right" /></org-tag>
              <org-tag color="info">Docs<org-tag-icon name="arrow-up-right" /></org-tag>
            </div>
            <org-tag color="primary">
              <org-tag-icon name="cog" />
              Action
              <org-tag-icon name="arrow-right" />
            </org-tag>
            <org-tag color="danger" variant="strong">
              <org-tag-icon name="trash" />
              Delete
            </org-tag>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Place an <strong>org-tag-icon</strong> before the text for a leading icon</li>
            <li>Place an <strong>org-tag-icon</strong> after the text for a trailing icon</li>
            <li>The icon inherits the tag's color and per-size dimension automatically</li>
            <li>Setting <strong>removable</strong> on the parent tag suppresses the trailing icon</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-tag-removable-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Setting <strong>removable</strong> on <strong>org-tag</strong> renders a built-in X affordance</li>
            <li>The X click emits the <strong>removed</strong> output on <strong>org-tag</strong></li>
            <li>If a trailing <strong>org-tag-icon</strong> is also slotted, it is suppressed (overridden)</li>
            <li>Leading <strong>org-tag-icon</strong>s are still rendered alongside the built-in X</li>
            <li>Use <strong>removeAriaLabel</strong> to give the X a meaningful accessible label</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <story-tag-clickable-icons-section />
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Icons are only interactive when their <strong>clicked</strong> output is observed</li>
            <li>Non-clickable icons show no hover effect and are not keyboard-focusable</li>
            <li>Use <strong>ariaLabel</strong> on <strong>org-tag-icon</strong> to provide meaningful accessible labels</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="In Context" />
          <org-design-system-demo-canvas slot="canvas">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <org-tag color="safe" variant="strong" size="sm">Active</org-tag>
                <strong>Tokens — light + dark parity audit</strong>
                <span class="ml-auto">due Fri</span>
              </div>
              <div class="flex items-center gap-2">
                <org-tag color="caution" variant="strong" size="sm">Review</org-tag>
                <strong>Input · password show/hide affordance</strong>
                <span class="ml-auto">opened 2d</span>
              </div>
              <div class="flex items-center gap-2">
                <org-tag color="danger" variant="strong" size="sm">Blocked</org-tag>
                <strong>List item · long-press disclosure on touch</strong>
                <span class="ml-auto">waiting on a11y</span>
              </div>
              <div class="flex items-center gap-2">
                <org-tag color="neutral" variant="strong" size="sm">Draft</org-tag>
                <strong>Modal · scrim opacity in dark mode</strong>
                <span class="ml-auto">no owner</span>
              </div>
              <div class="flex items-center gap-2">
                <span>Categories</span>
                <org-tag color="neutral" size="sm">design-system</org-tag>
                <org-tag color="info" size="sm">tokens</org-tag>
                <org-tag color="info" size="sm">light-mode</org-tag>
                <org-tag color="info" size="sm">a11y</org-tag>
                <org-tag color="neutral" size="sm">+3</org-tag>
              </div>
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Tags read as "what this thing is", not "what to do with it" — pair with adjacent labels for context</li>
            <li>Use <strong>strong</strong> for status indicators (Active, Review, Blocked) and <strong>soft</strong> for category tags that should not compete with surrounding content</li>
            <li>Pick semantic colors that match the meaning: safe for active, caution for review, danger for blocked, neutral for de-emphasized</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Tag,
        TagIcon,
        TagRemovableSection,
        TagClickableIconsSection,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
