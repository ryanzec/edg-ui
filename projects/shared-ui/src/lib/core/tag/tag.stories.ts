import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Tag, allTagSizes, allTagVariants } from './tag';
import { TagIcon } from './tag-icon';
import { allComponentColors } from '../types/component-types';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-tag-clickable-icons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Clickable Icons"
      currentState="Icons become interactive when their clicked output is observed"
    >
      <org-storybook-example-container-section label="Clickable pre icon">
        <div class="flex flex-col gap-2">
          <org-tag color="primary">
            <org-tag-icon name="cog" (clicked)="preClickCount.set(preClickCount() + 1)" />
            Settings
          </org-tag>
          <p>
            Clicks: <strong>{{ preClickCount() }}</strong>
          </p>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Clickable post icon">
        <div class="flex flex-col gap-2">
          <org-tag color="info">
            Action
            <org-tag-icon name="arrow-right" (clicked)="postClickCount.set(postClickCount() + 1)" />
          </org-tag>
          <p>
            Clicks: <strong>{{ postClickCount() }}</strong>
          </p>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Non-clickable icons (no listener attached)">
        <org-tag color="neutral">
          <org-tag-icon name="cog" />
          Static icons
          <org-tag-icon name="check" />
        </org-tag>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Icons are only interactive when their <strong>clicked</strong> output is observed</li>
        <li>Non-clickable icons show no hover effect and are not keyboard-focusable</li>
        <li>Use <strong>ariaLabel</strong> on <strong>org-tag-icon</strong> to provide meaningful accessible labels</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class TagClickableIconsStory {
  protected readonly preClickCount = signal(0);
  protected readonly postClickCount = signal(0);
}

@Component({
  selector: 'story-tag-removable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Removable Tags"
      currentState="The tag-level removable input renders a built-in X affordance and overrides any trailing tag-icon"
    >
      <org-storybook-example-container-section label="Not removable">
        <org-tag color="primary">Fixed Tag</org-tag>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Removable (soft variant)">
        <div class="flex flex-col gap-2">
          <org-tag color="primary" [removable]="true" (removed)="removedCount.set(removedCount() + 1)">
            Removable Tag
          </org-tag>
          <p>
            Removed events: <strong>{{ removedCount() }}</strong>
          </p>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Removable (strong variant)">
        <org-tag color="safe" variant="strong" [removable]="true">Removable Strong</org-tag>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Removable + leading icon">
        <org-tag color="info" [removable]="true">
          <org-tag-icon name="cog" />
          Settings Tag
        </org-tag>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section
        label="Removable overrides a trailing tag-icon (the trailing arrow-right is suppressed)"
      >
        <org-tag color="caution" [removable]="true">
          Action Tag
          <org-tag-icon name="arrow-right" />
        </org-tag>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Custom removeAriaLabel">
        <org-tag color="neutral" [removable]="true" removeAriaLabel="Remove the priority filter">priority:high</org-tag>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Multiple removable tags">
        <div class="flex flex-wrap gap-2">
          <org-tag color="primary" [removable]="true">React</org-tag>
          <org-tag color="info" [removable]="true">Angular</org-tag>
          <org-tag color="safe" [removable]="true">Vue</org-tag>
          <org-tag color="caution" [removable]="true">Svelte</org-tag>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label='Legacy: removable via &lt;org-tag-icon [removable]="true" /&gt;'>
        <org-tag color="primary">
          Legacy Removable
          <org-tag-icon [removable]="true" />
        </org-tag>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li>Setting <strong>removable</strong> on <strong>org-tag</strong> renders a built-in X affordance</li>
        <li>The X click emits the <strong>removed</strong> output on <strong>org-tag</strong></li>
        <li>If a trailing <strong>org-tag-icon</strong> is also slotted, it is suppressed (overridden)</li>
        <li>Leading <strong>org-tag-icon</strong>s are still rendered alongside the built-in X</li>
        <li>Use <strong>removeAriaLabel</strong> to give the X a meaningful accessible label</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class TagRemovableStory {
  protected readonly removedCount = signal(0);
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
  - **org-tag-icon** — slotted icon; the icon inherits the tag's color and per-size dimension. Becomes interactive when its \`clicked\` output is observed or when its own \`removable\` input is set.

  ### Features
  - Three sizes: xs, sm (default), base
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
    size: 'sm',
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three size options: xs, sm (default), and base.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing all three size options"
      >
        <org-storybook-example-container-section label="Extra Small (xs)">
          <org-tag color="primary" size="xs">Extra Small</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small (sm) - Default">
          <org-tag color="primary">Small</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base">
          <org-tag color="primary" size="base">Base</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Icons - xs">
          <org-tag color="info" size="xs">
            <org-tag-icon name="cog" />
            Extra Small
            <org-tag-icon name="arrow-right" />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Icons - sm">
          <org-tag color="info">
            <org-tag-icon name="cog" />
            Small
            <org-tag-icon name="arrow-right" />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Icons - base">
          <org-tag color="info" size="base">
            <org-tag-icon name="cog" />
            Base
            <org-tag-icon name="arrow-right" />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Removable - all sizes">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="safe" size="xs" [removable]="true">xs</org-tag>
            <org-tag color="safe" [removable]="true">sm</org-tag>
            <org-tag color="safe" size="base" [removable]="true">base</org-tag>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>xs</strong>: 18px tall, dense for status columns</li>
          <li><strong>sm</strong>: 20px tall (default)</li>
          <li><strong>base</strong>: 24px tall, larger padding and text</li>
          <li>Icon and X dimensions scale proportionally with tag size</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of soft and strong variants across the same set of colors.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Variant Comparison"
        currentState="Strong (saturated fill) vs soft (tinted, same-color text)"
      >
        <org-storybook-example-container-section label="Soft (default)">
          <div class="flex flex-wrap gap-2">
            <org-tag color="neutral">Design</org-tag>
            <org-tag color="safe">Active</org-tag>
            <org-tag color="info">Beta</org-tag>
            <org-tag color="caution">Review</org-tag>
            <org-tag color="danger">Blocked</org-tag>
            <org-tag color="primary">Draft</org-tag>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Strong">
          <div class="flex flex-wrap gap-2">
            <org-tag color="neutral" variant="strong">Design</org-tag>
            <org-tag color="safe" variant="strong">Active</org-tag>
            <org-tag color="info" variant="strong">Beta</org-tag>
            <org-tag color="caution" variant="strong">Review</org-tag>
            <org-tag color="danger" variant="strong">Blocked</org-tag>
            <org-tag color="primary" variant="strong">Draft</org-tag>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>soft</strong>: Tinted background, same-color text — quieter; designed to pack densely</li>
          <li><strong>strong</strong>: Saturated fill, contrasting text — reads at a glance, suitable for status</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'All eight color variants in both soft and strong variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants"
        currentState="All 8 colors in soft (default) and strong"
      >
        <org-storybook-example-container-section label="Soft - Primary"><org-tag color="primary">Primary</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Secondary"><org-tag color="secondary">Secondary</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Neutral"><org-tag color="neutral">Neutral</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Safe"><org-tag color="safe">Safe</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Info"><org-tag color="info">Info</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Caution"><org-tag color="caution">Caution</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Warning"><org-tag color="warning">Warning</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Soft - Danger"><org-tag color="danger">Danger</org-tag></org-storybook-example-container-section>

        <org-storybook-example-container-section label="Strong - Primary"><org-tag color="primary" variant="strong">Primary</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Secondary"><org-tag color="secondary" variant="strong">Secondary</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Neutral"><org-tag color="neutral" variant="strong">Neutral</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Safe"><org-tag color="safe" variant="strong">Safe</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Info"><org-tag color="info" variant="strong">Info</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Caution"><org-tag color="caution" variant="strong">Caution</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Warning"><org-tag color="warning" variant="strong">Warning</org-tag></org-storybook-example-container-section>
        <org-storybook-example-container-section label="Strong - Danger"><org-tag color="danger" variant="strong">Danger</org-tag></org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>primary</strong>: Primary brand color</li>
          <li><strong>secondary</strong>: Secondary accent color</li>
          <li><strong>neutral</strong>: Neutral/gray color</li>
          <li><strong>safe</strong>: Success/positive state (green)</li>
          <li><strong>info</strong>: Informational state (blue)</li>
          <li><strong>caution</strong>: Caution state (yellow)</li>
          <li><strong>warning</strong>: Warning state (orange)</li>
          <li><strong>danger</strong>: Error/danger state (red)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ColorBySize: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Color × size matrix in the strong variant. Mirrors the design-system reference figure.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color × Size · Strong"
        currentState="Eight semantic colors at three sizes (strong variant)"
      >
        <org-storybook-example-container-section label="Primary">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="primary" variant="strong" size="xs">Label</org-tag>
            <org-tag color="primary" variant="strong" size="sm">Label</org-tag>
            <org-tag color="primary" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Secondary">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="secondary" variant="strong" size="xs">Label</org-tag>
            <org-tag color="secondary" variant="strong" size="sm">Label</org-tag>
            <org-tag color="secondary" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Neutral">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="neutral" variant="strong" size="xs">Label</org-tag>
            <org-tag color="neutral" variant="strong" size="sm">Label</org-tag>
            <org-tag color="neutral" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Safe">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="safe" variant="strong" size="xs">Label</org-tag>
            <org-tag color="safe" variant="strong" size="sm">Label</org-tag>
            <org-tag color="safe" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Info">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="info" variant="strong" size="xs">Label</org-tag>
            <org-tag color="info" variant="strong" size="sm">Label</org-tag>
            <org-tag color="info" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Caution">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="caution" variant="strong" size="xs">Label</org-tag>
            <org-tag color="caution" variant="strong" size="sm">Label</org-tag>
            <org-tag color="caution" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Warning">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="warning" variant="strong" size="xs">Label</org-tag>
            <org-tag color="warning" variant="strong" size="sm">Label</org-tag>
            <org-tag color="warning" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>
        <org-storybook-example-container-section label="Danger">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="danger" variant="strong" size="xs">Label</org-tag>
            <org-tag color="danger" variant="strong" size="sm">Label</org-tag>
            <org-tag color="danger" variant="strong" size="base">Label</org-tag>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Reach for <strong>safe</strong> for "active / approved"</li>
          <li>Reach for <strong>caution</strong> and <strong>warning</strong> for "needs attention"</li>
          <li>Reach for <strong>danger</strong> for "blocked / failing"</li>
          <li>Reach for <strong>neutral</strong> for de-emphasized status</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tags composed with leading, trailing, or both org-tag-icon children.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Icon Composition"
        currentState="Comparing tags with different org-tag-icon configurations"
      >
        <org-storybook-example-container-section label="No icons">
          <org-tag color="primary">No Icons</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Leading icon only">
          <div class="flex flex-wrap gap-2">
            <org-tag color="info"><org-tag-icon name="bookmark" />Saved</org-tag>
            <org-tag color="safe"><org-tag-icon name="check" />Approved</org-tag>
            <org-tag color="caution"><org-tag-icon name="circle" />Pending</org-tag>
            <org-tag color="danger"><org-tag-icon name="circle-x" />Blocked</org-tag>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Trailing icon only">
          <div class="flex flex-wrap gap-2">
            <org-tag color="neutral">Linear<org-tag-icon name="arrow-up-right" /></org-tag>
            <org-tag color="neutral">3 issues<org-tag-icon name="chevron-right" /></org-tag>
            <org-tag color="info">Docs<org-tag-icon name="arrow-up-right" /></org-tag>
          </div>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Both icons">
          <org-tag color="primary">
            <org-tag-icon name="cog" />
            Action
            <org-tag-icon name="arrow-right" />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Strong variant with icons">
          <org-tag color="danger" variant="strong">
            <org-tag-icon name="trash" />
            Delete
          </org-tag>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Place an <strong>org-tag-icon</strong> before the text for a leading icon</li>
          <li>Place an <strong>org-tag-icon</strong> after the text for a trailing icon</li>
          <li>The icon inherits the tag's color and per-size dimension automatically</li>
          <li>Setting <strong>removable</strong> on the parent tag suppresses the trailing icon</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Removable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The tag-level removable input renders a built-in X affordance and overrides any trailing org-tag-icon. The X is keyboard-focusable and emits the removed output.',
      },
    },
  },
  render: () => ({
    template: '<story-tag-removable />',
    moduleMetadata: {
      imports: [TagRemovableStory],
    },
  }),
};

export const ClickableIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Slot icons become interactive when their clicked output is observed. Non-observed icons are disabled and non-focusable.',
      },
    },
  },
  render: () => ({
    template: '<story-tag-clickable-icons />',
    moduleMetadata: {
      imports: [TagClickableIconsStory],
    },
  }),
};
