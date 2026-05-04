import type { Meta, StoryObj } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { List } from './list';
import { ListItem } from './list-item';
import { ListItemIcon } from './list-item-icon';
import { ListItemImage } from './list-item-image';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Icon } from '../icon/icon';

const meta: Meta<List> = {
  title: 'Core/Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## List Component

  A flexible list container component that displays list items in a vertical column layout, designed to work with the ListItem component.

  ### Composition Parts
  - **org-list** — parent wrapper providing shared \`size\` and \`listRole\` context to children
  - **org-list-item** — individual list row supporting anchor / button / div rendering, selected / disabled / clickable states
  - **org-list-item-icon** — icon slotted inside a list item; size is inherited from the parent list item
  - **org-list-item-image** — image slotted inside a list item; size matches the icon footprint for the current list item size

  ### Features
  - Vertical flex column layout
  - No gap between items by default
  - Works with ListItem components
  - Supports sm and base size variants

  ### ListItem Features
  - Conditionally clickable — only shows cursor and hover when a click listener is attached
  - Hover background color change (neutral subtle) when clickable
  - Selected state with primary subtle background
  - Content centered using flexbox
  - Accessible with focus states

  ### Usage Examples
  \`\`\`html
  <!-- Basic list (non-clickable items) -->
  <org-list>
    <org-list-item>Item 1</org-list-item>
    <org-list-item>Item 2</org-list-item>
    <org-list-item>Item 3</org-list-item>
  </org-list>

  <!-- List with selected items -->
  <org-list>
    <org-list-item [isSelected]="true">Selected Item</org-list-item>
    <org-list-item>Normal Item</org-list-item>
  </org-list>

  <!-- With click handler (clickable items) -->
  <org-list>
    <org-list-item asTag="button" (clicked)="onClick()">Clickable Item</org-list-item>
  </org-list>

  <!-- With icons via composition (placement determines pre / post) -->
  <org-list>
    <org-list-item>
      <org-list-item-icon name="arrow-down" />
      Item with leading icon
    </org-list-item>
    <org-list-item>
      Item with trailing icon
      <org-list-item-icon name="arrow-right" />
    </org-list-item>
  </org-list>

  <!-- With images via composition -->
  <org-list>
    <org-list-item>
      <org-list-item-image src="path/to/image.jpg" alt="User avatar" />
      Item with image
    </org-list-item>
  </org-list>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<List>;

export const Default: Story = {
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        story: 'Default list with basic items. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-list>
        <org-list-item>List Item 1</org-list-item>
        <org-list-item>List Item 2</org-list-item>
        <org-list-item>List Item 3</org-list-item>
      </org-list>
    `,
    moduleMetadata: {
      imports: [List, ListItem],
    },
  }),
};

export const BasicList: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic list with multiple items.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Basic List"
        currentState="Simple list with multiple items"
      >
        <org-storybook-example-container-section label="Default">
          <org-list>
            <org-list-item>Dashboard</org-list-item>
            <org-list-item><org-icon name="arrow-down" />Projects</org-list-item>
            <org-list-item>Team Members<org-icon name="arrow-down" class="ml-auto" /></org-list-item>
            <org-list-item>Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>List items are displayed in a vertical column</li>
          <li>No gap between items by default</li>
          <li>Items without click handlers show default cursor and no hover effect</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection, Icon],
    },
  }),
};

export const ListItemStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different list item states: normal and selected.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List Item States"
        currentState="Comparing normal and selected states"
      >
        <org-storybook-example-container-section label="Normal">
          <org-list>
            <org-list-item>Normal List Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Selected">
          <org-list>
            <org-list-item [isSelected]="true">Selected List Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Mixed States">
          <org-list>
            <org-list-item>Dashboard</org-list-item>
            <org-list-item [isSelected]="true">Projects</org-list-item>
            <org-list-item>Team Members</org-list-item>
            <org-list-item>Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal</strong>: Shows hover effect on mouse over (neutral subtle background)</li>
          <li><strong>Selected</strong>: Has primary subtle background that overrides hover</li>
          <li>Both states maintain focus-visible styles for keyboard navigation</li>
          <li>Selected state takes priority over hover effects</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithLongContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'List items with varying content lengths to demonstrate layout.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List with Varying Content"
        currentState="List items with different content lengths"
      >
        <org-storybook-example-container-section label="Long Content">
          <org-list class="max-w-sm">
            <org-list-item>Short item</org-list-item>
            <org-list-item>This is a much longer item with more content to show how text wraps</org-list-item>
            <org-list-item [isSelected]="true">Selected item with a longer description that spans multiple words</org-list-item>
            <org-list-item>Another short item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Items adjust height based on content</li>
          <li>Content is centered vertically using flexbox</li>
          <li>Text wraps naturally within items</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive list items demonstrating click behavior. Items only show clickable styling when they have a click listener attached.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Interactive Behavior"
        currentState="Comparing clickable vs non-clickable items"
      >
        <org-storybook-example-container-section label="With Click Listeners">
          <org-list>
            <org-list-item asTag="button" (clicked)="undefined">Clickable - Item 1</org-list-item>
            <org-list-item asTag="button" (clicked)="undefined">Clickable - Item 2</org-list-item>
            <org-list-item asTag="button" [isSelected]="true" (clicked)="undefined">Clickable - Selected Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without Click Listeners">
          <org-list>
            <org-list-item>Not Clickable - Item 1</org-list-item>
            <org-list-item>Not Clickable - Item 2</org-list-item>
            <org-list-item [isSelected]="true">Not Clickable - Selected Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Mixed">
          <org-list>
            <org-list-item asTag="button" (clicked)="undefined">Clickable Item</org-list-item>
            <org-list-item>Non-Clickable Item</org-list-item>
            <org-list-item asTag="a" href="#">Another Clickable Item as an anchor tag</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Items with click listeners show pointer cursor and hover effects</li>
          <li>Items without click listeners have default cursor and no hover effects</li>
          <li>Focus-visible styles only appear on clickable items</li>
          <li>Selected state works independently of clickable state</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: 'List with custom styling applied via standard class attribute.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Custom Styling"
        currentState="Lists with custom classes and styling"
      >
        <org-storybook-example-container-section label="With Border">
          <org-list class="border border-default-color rounded-base overflow-hidden">
            <org-list-item>Dashboard</org-list-item>
            <org-list-item [isSelected]="true">Projects</org-list-item>
            <org-list-item>Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Gap">
          <org-list class="gap-1">
            <org-list-item>Item 1</org-list-item>
            <org-list-item>Item 2</org-list-item>
            <org-list-item>Item 3</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Custom Item Class">
          <org-list>
            <org-list-item class="rounded-base">Rounded Item 1</org-list-item>
            <org-list-item class="rounded-base">Rounded Item 2</org-list-item>
            <org-list-item class="rounded-base" [isSelected]="true">Rounded Selected</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Standard class attribute can be used to add borders, gaps, and other styling</li>
          <li>Both the list and individual list items support class-based customization</li>
          <li>All interactive behaviors are maintained with custom styling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ItemTypes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items can be rendered as different HTML elements using the asTag input - button, anchor, or div (default).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List Item Types"
        currentState="Demonstrating different element types in the same list"
      >
        <org-storybook-example-container-section label="Mixed Element Types">
          <org-list>
            <org-list-item asTag="button" (clicked)="undefined">Button Item - Clickable with event</org-list-item>
            <org-list-item asTag="a" href="https://example.com" [isExternalHref]="true">Anchor Item - External Link</org-list-item>
            <org-list-item asTag="a" href="/dashboard">Anchor Item - Internal Link</org-list-item>
            <org-list-item>Div Item - Static Content</org-list-item>
            <org-list-item asTag="button" [isSelected]="true" (clicked)="undefined">Button Item - Selected</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Button (asTag="button")</strong>: Renders as button element, requires clicked event handler</li>
          <li><strong>Anchor (asTag="a")</strong>: Renders as anchor element, requires href or routerLink input</li>
          <li><strong>Div (default)</strong>: Renders as div element when no asTag is specified</li>
          <li>External links automatically include target="_blank" and rel="noopener noreferrer"</li>
          <li>All types support the same styling and state management (selected, hover, etc.)</li>
          <li>Each type maintains proper accessibility attributes for its element</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const DisabledState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items can be disabled to prevent interaction. Disabled items show reduced opacity and cannot be clicked.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Disabled State"
        currentState="Demonstrating disabled list items in different scenarios"
      >
        <org-storybook-example-container-section label="Disabled vs Enabled">
          <org-list>
            <org-list-item asTag="button" (clicked)="console.log('Enabled item clicked')">Enabled Item</org-list-item>
            <org-list-item asTag="button" [disabled]="true" (clicked)="console.log('Disabled item clicked')">Disabled Item</org-list-item>
            <org-list-item asTag="button" (clicked)="console.log('Enabled item clicked')">Enabled Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled with Selection">
          <org-list>
            <org-list-item asTag="button" [isSelected]="true" (clicked)="console.log('Selected enabled clicked')">Selected &amp; Enabled</org-list-item>
            <org-list-item asTag="button" [isSelected]="true" [disabled]="true" (clicked)="console.log('Selected disabled clicked')">Selected &amp; Disabled</org-list-item>
            <org-list-item asTag="button" [disabled]="true" (clicked)="console.log('Disabled clicked')">Disabled Only</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled Different Element Types">
          <org-list>
            <org-list-item asTag="button" [disabled]="true" (clicked)="console.log('Button clicked')">Disabled Button</org-list-item>
            <org-list-item asTag="a" href="#" [disabled]="true">Disabled Anchor</org-list-item>
            <org-list-item [disabled]="true">Disabled Div</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled with Icons">
          <org-list>
            <org-list-item asTag="button" (clicked)="console.log('Enabled with icon')">
              <org-list-item-icon name="arrow-down" />
              Enabled with Icon
            </org-list-item>
            <org-list-item asTag="button" [disabled]="true" (clicked)="console.log('Disabled with icon')">
              <org-list-item-icon name="arrow-down" />
              Disabled with Icon
            </org-list-item>
            <org-list-item asTag="button" [disabled]="true" (clicked)="console.log('Disabled with post icon')">
              Disabled with Post Icon
              <org-list-item-icon name="arrow-right" />
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Disabled items show cursor-not-allowed cursor</li>
          <li>Disabled items do not respond to clicks or keyboard interactions</li>
          <li>Disabled items have reduced text color and background to indicate their state</li>
          <li>Disabled items do not show hover effects</li>
          <li>Disabled state can be combined with selected state</li>
          <li>Anchor elements get aria-disabled attribute when disabled</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, ListItemIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Lists and list items support different sizes. The list component sets the default size for all items, but individual items can override it with the overrideSize input.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List Sizes"
        currentState="Demonstrating different size configurations"
      >
        <org-storybook-example-container-section label="Small (Default)">
          <org-list>
            <org-list-item><org-list-item-icon name="arrow-down" />Dashboard</org-list-item>
            <org-list-item><org-list-item-icon name="arrow-down" />Projects</org-list-item>
            <org-list-item><org-list-item-icon name="arrow-down" />Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base">
          <org-list size="base">
            <org-list-item><org-list-item-icon name="arrow-down" />Dashboard</org-list-item>
            <org-list-item><org-list-item-icon name="arrow-down" />Projects</org-list-item>
            <org-list-item><org-list-item-icon name="arrow-down" />Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small List with One Overridden Base Item">
          <org-list>
            <org-list-item><org-list-item-icon name="arrow-down" />Dashboard (sm)</org-list-item>
            <org-list-item overrideSize="base"><org-list-item-icon name="arrow-down" />Projects (base override)</org-list-item>
            <org-list-item><org-list-item-icon name="arrow-down" />Settings (sm)</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Small size (default)</strong>: px-1.5 py-1 text-sm with sm icon size</li>
          <li><strong>Base size</strong>: px-2.5 py-2 with base icon size</li>
          <li>List component sets the default size for all items</li>
          <li>Individual items can override the list size using overrideSize input</li>
          <li>Icons automatically adjust size based on the item size</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, ListItemIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const ForceClickable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The forceClickable input forces the list item to display clickable styles even without a direct click handler on the item. Useful when the clickable interaction is handled by a child element.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Force Clickable"
        currentState="Comparing forced clickable vs default non-clickable"
      >
        <org-storybook-example-container-section label="With forceClickable">
          <org-list>
            <org-list-item [forceClickable]="true">Forced Clickable Item</org-list-item>
            <org-list-item [forceClickable]="true" [isSelected]="true">Forced Clickable Selected Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Without forceClickable">
          <org-list>
            <org-list-item>Default Non-Clickable Item</org-list-item>
            <org-list-item [isSelected]="true">Default Non-Clickable Selected Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>forceClickable items show pointer cursor and hover effects without a click handler</li>
          <li>Default items without a click handler show no hover effect or pointer cursor</li>
          <li>Useful when a child element handles the click interaction</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const RouterLinkItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items can use Angular RouterLink for client-side navigation. Use routerLink instead of href for internal app routes.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Router Link Items"
        currentState="Demonstrating internal navigation with Angular RouterLink"
      >
        <org-storybook-example-container-section label="Router Link Anchors">
          <org-list>
            <org-list-item asTag="a" routerLink="/dashboard">Dashboard (routerLink)</org-list-item>
            <org-list-item asTag="a" routerLink="/projects" [isSelected]="true">Projects (routerLink selected)</org-list-item>
            <org-list-item asTag="a" routerLink="/settings">Settings (routerLink)</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="RouterLink vs href">
          <org-list>
            <org-list-item asTag="a" routerLink="/internal-route">Internal Route (routerLink)</org-list-item>
            <org-list-item asTag="a" href="https://example.com" [isExternalHref]="true">External URL (href)</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>routerLink uses Angular's client-side navigation (no full page reload)</li>
          <li>href is used for external URLs and opens in a new tab when isExternalHref is true</li>
          <li>Both render as anchor elements with clickable styling</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
    applicationConfig: {
      providers: [provideRouter([])],
    },
  }),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items with icons using the `org-list-item-icon` sub-component. Placement inside the list item determines whether the icon renders before (leading) or after (trailing) the text.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List Item Icons"
        currentState="Leading and trailing icons via composition"
      >
        <org-storybook-example-container-section label="Leading Icon">
          <org-list>
            <org-list-item>
              <org-list-item-icon name="arrow-down" />
              Dashboard
            </org-list-item>
            <org-list-item>
              <org-list-item-icon name="settings" />
              Settings
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Trailing Icon">
          <org-list>
            <org-list-item>
              Team Members
              <org-list-item-icon name="arrow-right" />
            </org-list-item>
            <org-list-item>
              Projects
              <org-list-item-icon name="chevron-right" />
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Leading and Trailing">
          <org-list>
            <org-list-item>
              <org-list-item-icon name="mail" />
              Inbox
              <org-list-item-icon name="chevron-right" />
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Icons slotted before the text content render as leading icons</li>
          <li>Icons slotted after the text content render as trailing icons</li>
          <li>Icon size is inherited from the parent list item's resolved size</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, ListItemIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const BorderVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Lists support a border variant that applies an outer border and rounded corners. The first and last list items automatically round their corresponding corners so hover and selected backgrounds do not cover the rounded border.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Border Variant"
        currentState="Comparing border variant options"
      >
        <org-storybook-example-container-section label="None (Default)">
          <org-list>
            <org-list-item asTag="button" (clicked)="undefined">Dashboard</org-list-item>
            <org-list-item asTag="button" [isSelected]="true" (clicked)="undefined">Projects</org-list-item>
            <org-list-item asTag="button" (clicked)="undefined">Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Outer">
          <org-list borderVariant="outer">
            <org-list-item asTag="button" (clicked)="undefined">Dashboard</org-list-item>
            <org-list-item asTag="button" [isSelected]="true" (clicked)="undefined">Projects</org-list-item>
            <org-list-item asTag="button" (clicked)="undefined">Settings</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Outer with Single Item">
          <org-list borderVariant="outer">
            <org-list-item asTag="button" (clicked)="undefined">Only Item</org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>None</strong>: No border applied to the list container</li>
          <li><strong>Outer</strong>: Applies a border and rounded corners to the list container</li>
          <li>First list item rounds its top-left and top-right corners</li>
          <li>Last list item rounds its bottom-left and bottom-right corners</li>
          <li>Hover and selected backgrounds respect the rounded corners</li>
          <li>A single list item rounds all four corners</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [List, ListItem, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithImages: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'List items with images using the `org-list-item-image` sub-component. The image sizes to match the list item icon footprint (1rem at `sm`, 1.25rem at `base`) so icons and images align consistently in mixed lists.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="List Item Images"
        currentState="Images slotted inside list items at different sizes"
      >
        <org-storybook-example-container-section label="Small (Default)">
          <org-list>
            <org-list-item>
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John's avatar" />
              John Doe
            </org-list-item>
            <org-list-item>
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane's avatar" />
              Jane Smith
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Base">
          <org-list size="base">
            <org-list-item>
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John's avatar" />
              John Doe
            </org-list-item>
            <org-list-item>
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Jane's avatar" />
              Jane Smith
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Mixed with Icons">
          <org-list>
            <org-list-item>
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John's avatar" />
              John Doe
              <org-list-item-icon name="chevron-right" />
            </org-list-item>
            <org-list-item>
              <org-list-item-icon name="mail" />
              Inbox
              <org-list-item-icon name="chevron-right" />
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Trailing Image">
          <org-list>
            <org-list-item>
              Assigned to
              <org-list-item-image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" alt="Alice's avatar" />
            </org-list-item>
          </org-list>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Image size is inherited from the parent list item's resolved size</li>
          <li>Small (sm) lists render images at 1rem (16px) square</li>
          <li>Base lists render images at 1.25rem (20px) square</li>
          <li>Images and icons occupy the same visual footprint so mixed lists stay aligned</li>
          <li>Placement (leading / trailing) is determined by position in the slot</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        List,
        ListItem,
        ListItemIcon,
        ListItemImage,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};
