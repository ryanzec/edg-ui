import type { Meta, StoryObj } from '@storybook/angular';
import { ScrollArea, allScrollAreaDirections } from './scroll-area';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

const meta: Meta<ScrollArea> = {
  title: 'Core/Components/Scroll Area',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Scroll Area Component

  A component that wraps \`ngx-scrollbar\` to provide a consistent, minimalist custom scrollbar experience.

  ### Class Inputs

  The component accepts three class inputs that map to distinct parts of the internal structure:

  - **containerClass** *(ng-scrollbar host)*: Visual container styles such as border, border-radius, and layout.
  Applied alongside \`scrollClass\` on the same \`ng-scrollbar\` host element.
  Examples: \`rounded-lg border border-default-color\`, \`flex flex-col\`

  - **scrollClass** *(ng-scrollbar host)*: Sizing and overflow constraints. Applied to the \`ng-scrollbar\` host
  so that relative sizing (e.g. \`h-full\`, \`w-full\`) works correctly within the viewport.
  Examples: \`h-3xs\`, \`w-2xs\`, \`h-full w-full min-h-0\`

  - **spacingClass** *(inner content wrapper div)*: Padding and spacing. Kept separate from the scrollable host
  because padding on the scrollbar container would push the scrollbar track inward.
  Examples: \`p-4\`, \`px-3 py-2\`

  ### Features
  - Supports vertical, horizontal, or both scroll directions
  - Optional hover-only scrollbar visibility
  - Clean, minimalist custom scrollbar via \`ngx-scrollbar\` with \`appearance="compact"\`
  - Scrollbar can be fully hidden via the \`enabled\` input

  ### Direction Options
  - **vertical** (default): Only y-axis scrolling enabled
  - **horizontal**: Only x-axis scrolling enabled
  - **both**: Both x and y-axis scrolling enabled

  ### Visibility Options
  - **Always visible** (default): Scrollbars shown when content is scrollable
  - **Hover only**: Scrollbars only appear when hovering over the element

  ### Usage Examples
  \`\`\`html
  <!-- Vertical scrolling with border, fixed height, and inner padding -->
  <org-scroll-area
    containerClass="rounded-lg border border-default-color"
    scrollClass="h-3xs"
    spacingClass="p-4"
  >
    <!-- Long content here -->
  </org-scroll-area>

  <!-- Horizontal scrolling -->
  <org-scroll-area
    direction="horizontal"
    containerClass="rounded-lg border border-default-color"
    scrollClass="w-2xs"
    spacingClass="p-4"
  >
    <!-- Wide content here -->
  </org-scroll-area>

  <!-- Both directions -->
  <org-scroll-area
    direction="both"
    containerClass="rounded-lg border border-default-color"
    scrollClass="h-3xs w-2xs"
    spacingClass="p-4"
  >
    <!-- Large content here -->
  </org-scroll-area>

  <!-- Hover-only, no border (no containerClass needed) -->
  <org-scroll-area
    [onlyShowOnHover]="true"
    scrollClass="h-3xs"
    spacingClass="p-4"
  >
    <!-- Content here -->
  </org-scroll-area>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ScrollArea>;

export const Default: Story = {
  args: {
    direction: 'vertical',
    onlyShowOnHover: false,
    enabled: true,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: allScrollAreaDirections,
      description: 'controls which scroll directions are enabled',
    },
    onlyShowOnHover: {
      control: 'boolean',
      description: 'controls whether scrollbars only show on hover',
    },
    enabled: {
      control: 'boolean',
      description: 'controls whether the scrollbar track and thumb are visible',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'default scroll area with vertical scrolling. use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-scroll-area
        [direction]="direction"
        [onlyShowOnHover]="onlyShowOnHover"
        [enabled]="enabled"
        containerClass="rounded-lg border border-default-color"
        scrollClass="h-3xs"
        spacingClass="p-4"
      >
        <div>This is a scrollable area with custom scrollbar styling.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
        <div>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
        <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</div>
        <div>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</div>
        <div>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.</div>
        <div>Eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet.</div>
        <div>Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</div>
        <div>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</div>
        <div>Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</div>
        <div>Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus.</div>
        <div>Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</div>
        <div>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</div>
      </org-scroll-area>
    `,
    moduleMetadata: {
      imports: [ScrollArea],
    },
  }),
};

export const NotEnoughContent: Story = {
  args: {
    direction: 'vertical',
    onlyShowOnHover: false,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: allScrollAreaDirections,
      description: 'controls which scroll directions are enabled',
    },
    onlyShowOnHover: {
      control: 'boolean',
      description: 'controls whether scrollbars only show on hover',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'scroll area with not enough content to scroll.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-scroll-area
        [direction]="direction"
        [onlyShowOnHover]="onlyShowOnHover"
        containerClass="rounded-lg border border-default-color"
        scrollClass="h-3xs"
        spacingClass="p-4"
      >
        <div>This is a scrollable area with custom scrollbar styling.</div>
      </org-scroll-area>
    `,
    moduleMetadata: {
      imports: [ScrollArea],
    },
  }),
};

export const Enabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'comparison of enabled (default) vs disabled scrollbar visibility.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Enabled Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Enabled (default)</div>
          <org-scroll-area
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs"
            spacingClass="p-4"
          >
            <div>Scrollbar track and thumb are visible.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Disabled</div>
          <org-scroll-area
            [enabled]="false"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs"
            spacingClass="p-4"
          >
            <div>Scrollbar track and thumb are hidden; content still scrolls.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>enabled</strong>: Scrollbar track and thumb are rendered</li>
          <li><strong>disabled</strong>: Scrollbar track and thumb are hidden; scrolling still works</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        ScrollArea,
        DesignSystemDemo,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        DesignSystemDemoHeader,
      ],
    },
  }),
};

export const Directions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'comparison of all scroll direction options.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Scroll Direction Variants" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Vertical (default)</div>
          <org-scroll-area
            direction="vertical"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs"
            spacingClass="p-4"
          >
            <div>Vertical scrolling only.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Horizontal</div>
          <org-scroll-area
            direction="horizontal"
            containerClass="rounded-lg border border-default-color"
            scrollClass="w-2xs whitespace-nowrap"
            spacingClass="p-4"
          >
            <span>Horizontal scrolling only. This is a very long line of text that will require horizontal scrolling to see all of it. Keep reading to see more content that extends beyond the visible area.</span>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Both</div>
          <org-scroll-area
            direction="both"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs w-2xs"
            spacingClass="p-4"
          >
            <div class="whitespace-nowrap">Both vertical and horizontal scrolling enabled. This line is very long and will require horizontal scrolling to see all the content that extends beyond the visible area.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>vertical</strong>: Only y-axis scrolling, x-axis hidden</li>
          <li><strong>horizontal</strong>: Only x-axis scrolling, y-axis hidden</li>
          <li><strong>both</strong>: Both axes can scroll independently</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        ScrollArea,
        DesignSystemDemo,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        DesignSystemDemoHeader,
      ],
    },
  }),
};

export const VisibilityModes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'comparison of always visible vs hover-only scrollbar visibility.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Scrollbar Visibility Modes" />
        <org-design-system-demo-canvas slot="canvas">
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Always Visible (default)</div>
          <org-scroll-area
            direction="vertical"
            [onlyShowOnHover]="false"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs"
            spacingClass="p-4"
          >
            <div>Scrollbar is always visible when content is scrollable.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Hover Only</div>
          <org-scroll-area
            direction="both"
            [onlyShowOnHover]="true"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs max-w-2xs"
            spacingClass="p-4"
          >
            <div>Scrollbar only appears when hovering over this area.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div class="w-base">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Always visible</strong>: Scrollbar shown whenever content is scrollable</li>
          <li><strong>Hover only</strong>: Scrollbar hidden by default, appears on mouse hover</li>
          <li>Both modes use smooth transitions for a polished experience</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        ScrollArea,
        DesignSystemDemo,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        DesignSystemDemoHeader,
      ],
    },
  }),
};

export const SafariSizingBugHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'to test Safari sizing bug handling.',
      },
    },
  },
  render: () => ({
    template: `
      <org-design-system-demo>
        <org-design-system-demo-header slot="header" title="Safari Sizing Bug Handling" />
        <org-design-system-demo-canvas slot="canvas">
        <div>
          INSTRUCTIONS: Navigate to the page from another page and hover over the examples to make sure there is no content shift.
        </div>
          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Both Directions</div>
          <org-scroll-area
            direction="both"
            [onlyShowOnHover]="true"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs max-w-2xs"
            spacingClass="p-4"
          >
            <div class="font-semibold">Hover to reveal scrollbar - content stays stable!</div>
            <div>The scrollbar space is reserved even when hidden, preventing layout shift.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            <div>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
            <div class="w-base">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
            <div>Excepteur sint occaecat cupidatat non proident.</div>
            <div>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            <div>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</div>
            <div>Accusantium doloremque laudantium, totam rem aperiam.</div>
            <div>Eaque ipsa quae ab illo inventore veritatis et quasi architecto.</div>
            <div>Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem.</div>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Vertical Direction</div>
          <org-scroll-area
            direction="vertical"
            [onlyShowOnHover]="true"
            containerClass="rounded-lg border border-default-color"
            scrollClass="h-6xs max-w-2xs"
            spacingClass="p-4"
          >
            <div>Test 1</div>
            <div>Test 2</div>
            <div>Test 3</div>
            <div>Test 4</div>
            <div>Test 5</div>
            <div>Test 6</div>
            <div>Test 7</div>
            <div>Test 8</div>
            <div>Test 9</div>
            <div>Test 10</div>
            <div>Test 11</div>
            <div>Test 12</div>
            <div>Test 13</div>
            <div>Test 14</div>
            <div>Test 15</div>
          </org-scroll-area>
          </div>

          <div class="flex flex-col gap-2 items-start">
            <div class="text-sm font-medium">Horizontal Direction</div>
          <org-scroll-area
            direction="horizontal"
            [onlyShowOnHover]="true"
            containerClass="rounded-lg border border-default-color"
            scrollClass="w-2xs whitespace-nowrap"
            spacingClass="p-4"
          >
            <span>Test 1 </span>
            <span>Test 2 </span>
            <span>Test 3 </span>
            <span>Test 4 </span>
            <span>Test 5 </span>
            <span>Test 6 </span>
            <span>Test 7 </span>
            <span>Test 8 </span>
            <span>Test 9 </span>
            <span>Test 10 </span>
            <span>Test 11 </span>
            <span>Test 12 </span>
            <span>Test 13 </span>
            <span>Test 14 </span>
            <span>Test 15 </span>
          </org-scroll-area>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
      <org-design-system-demo-expected-behaviour>
        <ul class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Both Directions</strong>: Scrollbar space is reserved, preventing layout shift when scrollbar appears/disappears</li>
          <li><strong>Vertical Direction</strong>: Scrollbar space is reserved, preventing layout shift when scrollbar appears/disappears</li>
          <li><strong>Horizontal Direction</strong>: Scrollbar space is reserved, preventing layout shift when scrollbar appears/disappears</li>
        </ul>
      </org-design-system-demo-expected-behaviour>
    `,
    moduleMetadata: {
      imports: [
        ScrollArea,
        DesignSystemDemo,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
        DesignSystemDemoHeader,
      ],
    },
  }),
};
