import type { Meta, StoryObj } from '@storybook/angular';
import { Avatar } from './avatar';
import { AvatarCircle } from './avatar-circle';
import { AvatarImage } from './avatar-image';
import { AvatarLabel } from './avatar-label';
import { AvatarStack } from './avatar-stack';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Avatar> = {
  title: 'Core/Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Avatar Component

  A composable avatar that coordinates a circle (with image / initials / gravatar) and optional labels.

  ### Composition Parts
  - **org-avatar** — parent wrapper providing shared \`label\` and \`size\` context to children, plus clickable behavior
  - **org-avatar-circle** — the circular visual; always renders initials from the parent label; accepts an \`org-avatar-image\` child
  - **org-avatar-image** — image layer positioned over the circle's initials; supports \`src\`, \`email\` (gravatar), and \`alt\` override; hides on load error to reveal initials
  - **org-avatar-label** — renders the parent label text plus an optional sub-label

  ### Size Options
  - **sm**: Small avatar (20px)
  - **base**: Standard avatar size (28px) - default
  - **lg**: Large avatar (40px)

  ### Image Priority (inside org-avatar-image)
  1. Explicit \`src\` URL
  2. Gravatar (via \`email\`)
  3. None — initials remain visible

  ### Initials Generation
  - Single word: First 2 letters (e.g., "John" → "JO")
  - Multiple words: First letter of first word + first letter of last word (e.g., "John Doe" → "JD")

  ### Usage Examples
  \`\`\`html
  <!-- Initials only -->
  <org-avatar label="John Doe">
    <org-avatar-circle />
  </org-avatar>

  <!-- With custom image -->
  <org-avatar label="John Doe">
    <org-avatar-circle>
      <org-avatar-image src="path/to/image.jpg" />
    </org-avatar-circle>
  </org-avatar>

  <!-- With Gravatar -->
  <org-avatar label="John Doe">
    <org-avatar-circle>
      <org-avatar-image email="test1@example.com" />
    </org-avatar-circle>
  </org-avatar>

  <!-- With labels -->
  <org-avatar label="John Doe">
    <org-avatar-circle />
    <org-avatar-label subLabel="Software Engineer" />
  </org-avatar>

  <!-- With explicit alt override -->
  <org-avatar label="John Doe">
    <org-avatar-circle>
      <org-avatar-image src="path/to/image.jpg" alt="Custom alt text" />
    </org-avatar-circle>
  </org-avatar>

  <!-- Large avatar, circle only (no label text) -->
  <org-avatar label="John Doe" size="lg">
    <org-avatar-circle />
  </org-avatar>
</div>

---

  ## Avatar Stack Component

  A component that displays multiple avatars in a horizontal stack with overlapping effect.

  ### Features
  - Stacks child elements (typically avatars) horizontally with overlapping
  - Supports three size variants: sm, base, lg
  - Can be disabled by setting size to \`null\`
  - Defaults to "base" size when no value is provided
  - Uses flexbox with negative spacing for overlap effect
  - Avatars in a stack should set \`[stacked]="true"\` on the \`org-avatar-circle\` for a background-colored ring between circles

  ### Size Variants
  - **sm**: Small overlap
  - **base**: Base overlap (default)
  - **lg**: Large overlap
  - **null**: Disabled - no overlap styling applied

  Set each \`org-avatar\` \`size\` to match the stack so circle dimensions align with the overlap spacing.

  ### Usage Examples
  \`\`\`html
  <!-- Default (base size) -->
  <org-avatar-stack>
    <org-avatar label="User 1" size="base">
      <org-avatar-circle [stacked]="true" />
    </org-avatar>
    <org-avatar label="User 2" size="base">
      <org-avatar-circle [stacked]="true" />
    </org-avatar>
    <org-avatar label="User 3" size="base">
      <org-avatar-circle [stacked]="true" />
    </org-avatar>
  </org-avatar-stack>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {
  args: {
    label: 'John Doe',
    size: 'base',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The name/label for the avatar; shared with child sub-components',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size of the avatar; shared with child sub-components',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default avatar configuration with label and initials. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-avatar [label]="label" [size]="size">
        <org-avatar-circle />
        <org-avatar-label />
      </org-avatar>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarLabel],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available size variants (sm, base, lg).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing sm, base, and lg sizes"
      >
        <org-storybook-example-container-section label="Small (sm)">
          <org-avatar label="John Doe" size="sm">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (default)">
          <org-avatar label="John Doe">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <org-avatar label="John Doe" size="lg">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>sm</strong>: Small avatar (20px)</li>
          <li><strong>base</strong>: Standard avatar size (28px) - default</li>
          <li><strong>lg</strong>: Large avatar (40px)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ImageTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different image types: initials, Gravatar, and custom images.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Image Types"
        currentState="Comparing initials, Gravatar, and custom images"
      >
        <org-storybook-example-container-section label="With Initials">
          <org-avatar label="John Doe">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Gravatar">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image email="test1@example.com" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Custom Image">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Initials</strong>: Automatically generated from label (first and last name)</li>
          <li><strong>Gravatar</strong>: Fetched from Gravatar service using email</li>
          <li><strong>Custom Image</strong>: Uses provided image URL (takes priority)</li>
          <li>Falls back to initials if image fails to load</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarImage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const LabelVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different label configurations: with labels, with sub-labels, and without labels.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Label Variations"
        currentState="Comparing different label configurations"
      >
        <org-storybook-example-container-section label="With Label Only">
          <org-avatar label="John Doe">
            <org-avatar-circle />
            <org-avatar-label />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Label and Sub-label">
          <org-avatar label="John Doe">
            <org-avatar-circle />
            <org-avatar-label subLabel="Software Engineer" />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without Labels (Avatar Only)">
          <org-avatar label="John Doe">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Label Only</strong>: Displays name next to avatar</li>
          <li><strong>Label and Sub-label</strong>: Displays name and additional info (e.g., title, email)</li>
          <li><strong>Avatar Only</strong>: Shows only the avatar circle without text</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarLabel, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const InitialsGeneration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of how initials are generated from different name formats.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Initials Generation"
        currentState="Comparing single name, two names, and multiple names"
      >
        <org-storybook-example-container-section label="Single Name">
          <org-avatar label="John">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Two Names">
          <org-avatar label="John Doe">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Names">
          <org-avatar label="John Michael Doe">
            <org-avatar-circle />
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Single Name</strong>: Shows first 2 letters (e.g., "John" → "JO")</li>
          <li><strong>Two Names</strong>: Shows first letter of each word (e.g., "John Doe" → "JD")</li>
          <li><strong>Multiple Names</strong>: Shows first letter of first and last word (e.g., "John Michael Doe" → "JD")</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Clickable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When a (clicked) event listener is bound, the avatar renders as a <button> with cursor: pointer and data-clickable="true" on the host. Without a listener, it renders as a non-interactive <div>.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Clickable Behavior"
        currentState="Comparing clickable and non-clickable avatars"
      >
        <org-storybook-example-container-section label="With Click Handler (button)">
          <org-avatar label="John Doe" (clicked)="onClicked($event)">
            <org-avatar-circle />
            <org-avatar-label />
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without Click Handler (div)">
          <org-avatar label="John Doe">
            <org-avatar-circle />
            <org-avatar-label />
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>With handler</strong>: Renders a &lt;button&gt;, adds data-clickable="true" to host, shows pointer cursor</li>
          <li><strong>Without handler</strong>: Renders a &lt;div&gt;, no data-clickable attribute, default cursor</li>
        </ul>
      </org-storybook-example-container>
    `,
    props: {
      onClicked: (event: MouseEvent) => console.log('avatar clicked', event),
    },
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarLabel, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ErrorHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of fallback behavior when images fail to load.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Error Handling & Fallbacks"
        currentState="Testing image load failures"
      >
        <org-storybook-example-container-section label="Invalid Image URL">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image src="https://invalid-url.com/image.jpg" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid Gravatar Email">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image email="nonexistent@example.com" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Successful Image">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Invalid Image URL</strong>: Falls back to initials when image fails to load</li>
          <li><strong>Invalid Gravatar</strong>: Falls back to initials when Gravatar not found</li>
          <li><strong>Successful Image</strong>: Displays image when successfully loaded</li>
          <li>Fallback is seamless and automatic</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarImage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AltOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The org-avatar-image alt input defaults to the parent avatar label for accessibility; an explicit alt overrides this default.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Alt Text Behavior"
        currentState="Comparing default alt fallback vs explicit alt override"
      >
        <org-storybook-example-container-section label="Default (uses avatar label)">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Explicit Alt Override">
          <org-avatar label="John Doe">
            <org-avatar-circle>
              <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile picture of the current user" />
            </org-avatar-circle>
          </org-avatar>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Default</strong>: Image alt attribute reads "John Doe" (inherited from the avatar label)</li>
          <li><strong>Override</strong>: Image alt attribute reads the explicitly provided value</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Avatar, AvatarCircle, AvatarImage, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

type StackStory = StoryObj<AvatarStack>;

export const StackDefault: StackStory = {
  args: {
    size: 'base',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg', null],
      description: 'The size of the avatar stack; set to null to disable overlap styling',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default avatar stack with base size. Use the controls below to interact with the component. Note: This story uses projected content (avatars), so only the stack size control is interactive.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-avatar-stack [size]="size">
        <org-avatar label="John Doe" [size]="size">
          <org-avatar-circle [stacked]="true" />
        </org-avatar>
        <org-avatar label="Jane Smith" [size]="size">
          <org-avatar-circle [stacked]="true" />
        </org-avatar>
        <org-avatar label="Bob Johnson" [size]="size">
          <org-avatar-circle [stacked]="true" />
        </org-avatar>
        <org-avatar label="Alice Williams" [size]="size">
          <org-avatar-circle [stacked]="true" />
        </org-avatar>
      </org-avatar-stack>
    `,
    moduleMetadata: {
      imports: [AvatarStack, Avatar, AvatarCircle],
    },
  }),
};

export const StackSizes: StackStory = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available size variants (sm, base, lg) side by side.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Size Variants"
        currentState="Comparing sm, base, and lg sizes"
      >
        <org-storybook-example-container-section label="Small (sm)">
          <org-avatar-stack size="sm">
            <org-avatar label="User 1" size="sm"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 2" size="sm"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 3" size="sm"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 4" size="sm"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base (default)">
          <org-avatar-stack size="base">
            <org-avatar label="User 1"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 2"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 3"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 4"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <org-avatar-stack size="lg">
            <org-avatar label="User 1" size="lg"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 2" size="lg"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 3" size="lg"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 4" size="lg"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>sm</strong>: Minimal overlap for compact display</li>
          <li><strong>base</strong>: Standard overlap for balanced appearance (default)</li>
          <li><strong>lg</strong>: Maximum overlap for space-efficient display</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [AvatarStack, Avatar, AvatarCircle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const StackAvatarTypes: StackStory = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of avatar stacks with different avatar types: initials, Gravatar, and custom images.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Avatar Types"
        currentState="Comparing initials, Gravatar, and custom images"
      >
        <org-storybook-example-container-section label="With Initials">
          <org-avatar-stack>
            <org-avatar label="John Doe"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Jane Smith"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Bob Johnson"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Alice Williams"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Gravatar">
          <org-avatar-stack>
            <org-avatar label="User 1"><org-avatar-circle [stacked]="true"><org-avatar-image email="test1@example.com" /></org-avatar-circle></org-avatar>
            <org-avatar label="User 2"><org-avatar-circle [stacked]="true"><org-avatar-image email="test2@example.com" /></org-avatar-circle></org-avatar>
            <org-avatar label="User 3"><org-avatar-circle [stacked]="true"><org-avatar-image email="user3@example.com" /></org-avatar-circle></org-avatar>
            <org-avatar label="User 4"><org-avatar-circle [stacked]="true"><org-avatar-image email="test3@example.com" /></org-avatar-circle></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Custom Images">
          <org-avatar-stack>
            <org-avatar label="John Doe">
              <org-avatar-circle [stacked]="true">
                <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              </org-avatar-circle>
            </org-avatar>
            <org-avatar label="Jane Smith">
              <org-avatar-circle [stacked]="true">
                <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" />
              </org-avatar-circle>
            </org-avatar>
            <org-avatar label="Bob Johnson">
              <org-avatar-circle [stacked]="true">
                <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" />
              </org-avatar-circle>
            </org-avatar>
            <org-avatar label="Alice Williams">
              <org-avatar-circle [stacked]="true">
                <org-avatar-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" />
              </org-avatar-circle>
            </org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Initials</strong>: Avatars display with generated initials from labels</li>
          <li><strong>Gravatar</strong>: Avatars display with Gravatar images based on email</li>
          <li><strong>Custom Images</strong>: Avatars display with provided custom image sources</li>
          <li>Border styling provides visual separation between overlapping avatars</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        AvatarStack,
        Avatar,
        AvatarCircle,
        AvatarImage,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const StackLabelVariations: StackStory = {
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of avatar stacks with different label variations: single name, interactive, and multiple word names.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Label Variations"
        currentState="Comparing single name, interactive, and multiple word names"
      >
        <org-storybook-example-container-section label="Single Name">
          <org-avatar-stack>
            <org-avatar label="John"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Jane"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Bob"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Alice"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Interactive (many avatars)">
          <org-avatar-stack>
            <org-avatar label="User 1"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 2"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 3"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 4"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 5"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 6"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 7"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="User 8"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Multiple Word Names">
          <org-avatar-stack>
            <org-avatar label="John Doe"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Jane Smith"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Bob Johnson"><org-avatar-circle [stacked]="true" /></org-avatar>
            <org-avatar label="Alice Williams"><org-avatar-circle [stacked]="true" /></org-avatar>
          </org-avatar-stack>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Single Name</strong>: Avatars display with single initial from one-word labels</li>
          <li><strong>Interactive</strong>: Component scales well with many avatars maintaining consistent spacing</li>
          <li><strong>Multiple Word Names</strong>: Avatars display with initials from multi-word labels</li>
          <li>Overlap effect maintains visual hierarchy regardless of label complexity</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [AvatarStack, Avatar, AvatarCircle, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
