import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Link } from './link';
import { allLinkTargets } from '../../brain/link-brain/link-brain';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-link-action-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link, StorybookExampleContainer, StorybookExampleContainerSection],
  template: `
    <org-storybook-example-container
      title="Action Link"
      currentState="A link without href that emits clicked when activated"
    >
      <org-storybook-example-container-section label="Click or press Enter / Space">
        <org-link (clicked)="onLinkClicked()">Run action</org-link>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Click count">
        <span data-testid="click-count">{{ clickCount }}</span>
      </org-storybook-example-container-section>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>No href</strong>: Renders as an anchor with role="button" and tabindex="0"</li>
        <li><strong>Click or Enter / Space</strong>: Triggers the clicked output</li>
        <li><strong>Counter</strong>: Increments each time the action link fires</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class LinkActionStory {
  protected clickCount = 0;

  protected onLinkClicked(): void {
    this.clickCount += 1;
    console.log('action link clicked');
  }
}

const meta: Meta<Link> = {
  title: 'Core/Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Link Component

  A standard hyperlink with optional support for action-style behavior when no href is provided.

  ### Features
  - Always renders as a single anchor element
  - Standard html anchor attributes exposed as typed inputs (href, target, rel, download, hreflang, referrerPolicy, ariaLabel)
  - Auto-applies rel="noopener noreferrer" when target="_blank" and consumer did not provide a rel value
  - Action-link mode when href is omitted: emits clicked, focusable, keyboard-activated via Enter or Space
  - Disabled state strips href, sets aria-disabled / tabindex=-1, and styles as not-allowed; element stays an anchor

  ### Usage Examples
  \`\`\`html
  <!-- standard link -->
  <org-link href="https://example.com">Example</org-link>

  <!-- new tab with auto rel -->
  <org-link href="https://example.com" target="_blank">Example</org-link>

  <!-- action link, emits clicked -->
  <org-link (clicked)="handleAction()">Run action</org-link>

  <!-- disabled, anchor with aria-disabled and not-allowed cursor -->
  <org-link href="https://example.com" [disabled]="true">Example</org-link>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Link>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    target: '_self',
    disabled: false,
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'the url the link navigates to; leave blank for action-link mode',
    },
    target: {
      control: 'select',
      options: allLinkTargets,
      description: 'the html target attribute',
    },
    disabled: {
      control: 'boolean',
      description: 'when true the anchor is non-interactive with disabled styling',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default link with full controls. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-link [href]="href" [target]="target" [disabled]="disabled">Example link</org-link>`,
    moduleMetadata: {
      imports: [Link],
    },
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of the enabled and disabled rendering of the link component.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Disabled Variants"
        currentState="Comparing enabled and disabled rendering"
      >
        <org-storybook-example-container-section label="Enabled">
          <org-link href="https://example.com">Example link</org-link>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled">
          <org-link href="https://example.com" [disabled]="true">Example link</org-link>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Enabled</strong>: Renders as an anchor with link styling and pointer cursor</li>
          <li><strong>Disabled</strong>: Same anchor with aria-disabled, no href, tabindex -1 and cursor not-allowed</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Link, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithTarget: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates target="_blank" with the auto-applied rel="noopener noreferrer".',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Target Variants"
        currentState="Comparing different target attribute values"
      >
        <org-storybook-example-container-section label="Same Tab (_self)">
          <org-link href="https://example.com" target="_self">Open in same tab</org-link>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="New Tab (_blank, auto rel)">
          <org-link href="https://example.com" target="_blank">Open in new tab</org-link>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="New Tab (_blank, custom rel)">
          <org-link href="https://example.com" target="_blank" rel="nofollow">Open with custom rel</org-link>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>_self</strong>: Opens in the same browsing context</li>
          <li><strong>_blank auto rel</strong>: Auto-applies rel="noopener noreferrer" for security</li>
          <li><strong>_blank custom rel</strong>: Consumer-provided rel takes precedence over the auto value</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Link, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ActionLink: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the action-link mode where href is omitted and the clicked output emits instead.',
      },
    },
  },
  render: () => ({
    template: `<story-link-action-story />`,
    moduleMetadata: {
      imports: [LinkActionStory],
    },
  }),
};
