import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Tag, allTagVariants, allTagSizes } from './tag';
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

  A composable tag/badge component with multiple color schemes, variants, and slot-based icon composition.

  ### Composition Parts
  - **org-tag** — parent wrapper providing shared \`color\`, \`size\`, and \`variant\` context
  - **org-tag-icon** — slotted icon button; injects the parent tag for size; clickable when its \`clicked\` output is observed or when \`removable\` is true

  ### Features
  - Three size options: xs, sm (default), and base
  - Two visual variants: weak (default) and strong
  - Eight color options: primary, secondary, neutral, safe, info, caution, warning, danger
  - Composable pre / post icons via &lt;org-tag-icon /&gt;
  - Removable affordance via &lt;org-tag-icon removable /&gt;
  - Clickable icon support via the \`clicked\` output

  ### Variants
  - **weak**: Subtle background with colored text (default)
  - **strong**: Solid colored background with contrasting text

  ### Color Options
  - **primary**: Primary brand color
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

  <!-- Tag with variant -->
  <org-tag color="primary" variant="strong">Strong Tag</org-tag>

  <!-- Tag with pre icon -->
  <org-tag color="info">
    <org-tag-icon name="cog" />
    Settings
  </org-tag>

  <!-- Tag with post icon -->
  <org-tag color="safe">
    Completed
    <org-tag-icon name="check" />
  </org-tag>

  <!-- Tag with both icons -->
  <org-tag color="primary">
    <org-tag-icon name="cog" />
    Action
    <org-tag-icon name="arrow-right" />
  </org-tag>

  <!-- Clickable icon (clicked output observed) -->
  <org-tag color="info">
    Action
    <org-tag-icon name="arrow-right" (clicked)="onActionClick()" />
  </org-tag>

  <!-- Removable tag -->
  <org-tag color="neutral">
    Removable Tag
    <org-tag-icon removable (removed)="onRemove()" />
  </org-tag>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Tag>;

export const Default: Story = {
  args: {
    color: 'primary',
    size: 'sm',
    variant: 'weak',
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
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default tag with primary color and weak variant. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-tag [color]="color" [size]="size" [variant]="variant">
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

        <org-storybook-example-container-section label="Removable - Different Sizes">
          <div class="flex flex-wrap items-center gap-2">
            <org-tag color="safe" size="xs">
              xs
              <org-tag-icon removable />
            </org-tag>
            <org-tag color="safe">
              sm
              <org-tag-icon removable />
            </org-tag>
            <org-tag color="safe" size="base">
              base
              <org-tag-icon removable />
            </org-tag>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>xs</strong>: Extra small size with reduced padding and text</li>
          <li><strong>sm</strong>: Small size (default)</li>
          <li><strong>base</strong>: Base size with larger padding and text</li>
          <li>Icon sizes scale proportionally with tag size</li>
          <li>All sizes work with all variants and colors</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 8 color variants across both weak and strong variants.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Color Variants (Weak)"
        currentState="Comparing all 8 color options with weak variant"
      >
        <div>
          <org-storybook-example-container-section label="Primary">
            <org-tag color="primary">Primary</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Secondary">
            <org-tag color="secondary">Secondary</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Neutral">
            <org-tag color="neutral">Neutral</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Safe">
            <org-tag color="safe">Safe</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Info">
            <org-tag color="info">Info</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Caution">
            <org-tag color="caution">Caution</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Warning">
            <org-tag color="warning">Warning</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Danger">
            <org-tag color="danger">Danger</org-tag>
          </org-storybook-example-container-section>
        </div>

        <div>
          <org-storybook-example-container-section label="Primary">
            <org-tag color="primary" variant="strong">Primary</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Secondary">
            <org-tag color="secondary" variant="strong">Secondary</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Neutral">
            <org-tag color="neutral" variant="strong">Neutral</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Safe">
            <org-tag color="safe" variant="strong">Safe</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Info">
            <org-tag color="info" variant="strong">Info</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Caution">
            <org-tag color="caution" variant="strong">Caution</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Warning">
            <org-tag color="warning" variant="strong">Warning</org-tag>
          </org-storybook-example-container-section>

          <org-storybook-example-container-section label="Danger">
            <org-tag color="danger" variant="strong">Danger</org-tag>
          </org-storybook-example-container-section>
        </div>

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

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of weak and strong variants across different colors.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Variant Comparison"
        currentState="Comparing weak and strong variants"
      >
        <org-storybook-example-container-section label="Primary - Weak (default)">
          <org-tag color="primary">Primary Weak</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary - Strong">
          <org-tag color="primary" variant="strong">Primary Strong</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe - Weak">
          <org-tag color="safe">Safe Weak</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe - Strong">
          <org-tag color="safe" variant="strong">Safe Strong</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger - Weak">
          <org-tag color="danger">Danger Weak</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger - Strong">
          <org-tag color="danger" variant="strong">Danger Strong</org-tag>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>weak</strong>: Subtle background with colored text (default)</li>
          <li><strong>strong</strong>: Solid colored background with contrasting text</li>
          <li>Both variants work with all color options</li>
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
        story: 'Tags composed with pre, post, or both org-tag-icon children.',
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

        <org-storybook-example-container-section label="Pre icon only">
          <org-tag color="info">
            <org-tag-icon name="cog" />
            Settings
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Post icon only">
          <org-tag color="safe">
            Completed
            <org-tag-icon name="check" />
          </org-tag>
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
            <org-tag-icon name="x" />
          </org-tag>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Place an <strong>org-tag-icon</strong> before the text for a pre-icon</li>
          <li>Place an <strong>org-tag-icon</strong> after the text for a post-icon</li>
          <li>Both slots can be used simultaneously</li>
          <li>Icons work with all variants and colors</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ClickableIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Icons become interactive when their clicked output is observed. Non-observed icons are disabled and non-focusable.',
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

export const Removable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tags composed with a removable org-tag-icon that renders an X and emits the removed output on click.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Removable Tags"
        currentState="Tags composed with a removable org-tag-icon"
      >
        <org-storybook-example-container-section label="Not removable">
          <org-tag color="primary">Fixed Tag</org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Removable (weak)">
          <org-tag color="primary">
            Removable Tag
            <org-tag-icon removable />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Removable (strong)">
          <org-tag color="safe" variant="strong">
            Removable Strong
            <org-tag-icon removable />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Removable with pre icon">
          <org-tag color="info">
            <org-tag-icon name="cog" />
            Settings Tag
            <org-tag-icon removable />
          </org-tag>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple removable tags">
          <div class="flex flex-wrap gap-2">
            <org-tag color="primary">
              React
              <org-tag-icon removable />
            </org-tag>
            <org-tag color="info">
              Angular
              <org-tag-icon removable />
            </org-tag>
            <org-tag color="safe">
              Vue
              <org-tag-icon removable />
            </org-tag>
            <org-tag color="caution">
              Svelte
              <org-tag-icon removable />
            </org-tag>
          </div>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Setting <strong>removable</strong> on an <strong>org-tag-icon</strong> renders an X icon</li>
          <li>Clicking the X icon emits the <strong>removed</strong> output</li>
          <li>Removable icons are always interactive, regardless of observers on <strong>clicked</strong></li>
          <li>Works with all variants and colors</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Tag, TagIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
