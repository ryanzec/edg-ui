import type { Meta, StoryObj } from '@storybook/angular';
import {
  EmptyIndicator,
  EMPTY_INDICATOR_ACTION_LABEL_DEFAULT,
  EMPTY_INDICATOR_BOX_BORDER_DEFAULT,
  EMPTY_INDICATOR_BOX_COLOR_DEFAULT,
  EMPTY_INDICATOR_BOX_PADDING_DEFAULT,
  EMPTY_INDICATOR_DESCRIPTION_DEFAULT,
} from './empty-indicator';
import { EmptyIndicatorIcon } from './empty-indicator-icon';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<EmptyIndicator> = {
  title: 'Core/Components/Empty Indicator',
  component: EmptyIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Empty Indicator Component

  A component used to display when a section of the page has no data. It features a centered header with an optional description, projected icon, and optional action button, all rendered inside a Box for consistent border / padding / color styling.

  ### Features
  - Required centered header (lg font size, default text color)
  - Optional description rendered below the header (sm font size, subtle text color)
  - Optional projected icon via \`<org-empty-indicator-icon>\` rendered above the header
  - Optional action button below the description
  - Box-based styling (color, border, padding) via pass-through inputs
  - Fully accessible
  - Light and dark theme support

  ### Composition Parts
  - **org-empty-indicator** — parent wrapper that arranges the icon slot, header, description, and action button
  - **org-empty-indicator-icon** — optional projected icon wrapper hard-wired to the largest size; accepts \`name\`, \`color\`, and \`label\` inputs passed through to the inner Icon

  ### Usage Examples
  \`\`\`html
  <!-- Header only -->
  <org-empty-indicator header="No data available" />

  <!-- With description -->
  <org-empty-indicator
    header="No results found"
    description="Try adjusting your search filters"
  />

  <!-- With projected icon -->
  <org-empty-indicator header="No items to display">
    <org-empty-indicator-icon name="search" />
  </org-empty-indicator>

  <!-- With action button -->
  <org-empty-indicator
    header="No items to display"
    description="Get started by creating your first item"
    actionLabel="Add Item"
    (actionTriggered)="onAddItem()"
  />

  <!-- Custom Box styling -->
  <org-empty-indicator
    header="Warning state"
    boxColor="warning"
    boxBorder="border-thick"
    boxPadding="lg"
  />
  \`\`\`

  ### Notes
  - The action button only displays if both \`actionLabel\` is provided and there is a listener on the \`actionTriggered\` output
  - Box styling (\`boxColor\`, \`boxBorder\`, \`boxPadding\`) is forwarded to an internal \`org-box\`
  - The component takes full width of its container with a minimum height of 200px
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EmptyIndicator>;

export const Default: Story = {
  args: {
    header: 'No data available',
    description: EMPTY_INDICATOR_DESCRIPTION_DEFAULT,
    actionLabel: EMPTY_INDICATOR_ACTION_LABEL_DEFAULT,
    boxColor: EMPTY_INDICATOR_BOX_COLOR_DEFAULT,
    boxBorder: EMPTY_INDICATOR_BOX_BORDER_DEFAULT,
    boxPadding: EMPTY_INDICATOR_BOX_PADDING_DEFAULT,
  },
  argTypes: {
    header: {
      control: 'text',
      description: 'The required header text displayed above the description',
    },
    description: {
      control: 'text',
      description: 'Optional description text displayed below the header',
    },
    actionLabel: {
      control: 'text',
      description: 'Optional label for the action button',
    },
    boxColor: {
      control: 'select',
      options: [null, 'primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'],
      description: 'The semantic color applied to the inner Box component',
    },
    boxBorder: {
      control: 'select',
      options: ['bordered', 'borderless', 'border-thick'],
      description: 'The border/visual style variant applied to the inner Box component',
    },
    boxPadding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'The internal padding size applied to the inner Box component',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty indicator with header only. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onAction: () => {
        console.log('action triggered');
      },
    },
    template: `
      <org-empty-indicator
        [header]="header"
        [description]="description"
        [actionLabel]="actionLabel"
        [boxColor]="boxColor"
        [boxBorder]="boxBorder"
        [boxPadding]="boxPadding"
        (actionTriggered)="onAction()"
      />
    `,
    moduleMetadata: {
      imports: [EmptyIndicator],
    },
  }),
};

export const HeaderAndDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of header-only and header+description configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Header And Description"
        currentState="Comparing header-only and header+description"
      >
        <org-storybook-example-container-section label="Header Only">
          <org-empty-indicator header="No data available" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Header With Description">
          <org-empty-indicator
            header="No results found"
            description="Try adjusting your search filters to find what you're looking for"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Header Only</strong>: Displays only the required header text (lg font size, default text color)</li>
          <li><strong>Header With Description</strong>: Header is displayed above a subtle description (sm font size, subtle text color)</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty indicator with a projected icon via org-empty-indicator-icon. The icon is hard-wired to the largest size.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="With Icon"
        currentState="Comparing different icon names and colors"
      >
        <org-storybook-example-container-section label="Default Icon Color (inherit)">
          <org-empty-indicator header="No search results" description="Try a different search term">
            <org-empty-indicator-icon name="search" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary Colored Icon">
          <org-empty-indicator header="Inbox empty" description="You're all caught up">
            <org-empty-indicator-icon name="mail" color="primary" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning Colored Icon">
          <org-empty-indicator header="No notifications" description="Check back later for updates">
            <org-empty-indicator-icon name="notification-off" color="warning" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger Colored Icon With Label">
          <org-empty-indicator header="Nothing found" description="Your trash is empty">
            <org-empty-indicator-icon name="trash" color="danger" label="Empty trash icon" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Icon Size</strong>: Always rendered at the largest size (5xl) regardless of configuration</li>
          <li><strong>Icon Color</strong>: Defaults to "inherit" but can be any valid IconColor</li>
          <li><strong>Icon Label</strong>: Optional accessible label; when omitted the icon is treated as decorative</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, EmptyIndicatorIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const BoxBorders: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of box borders (bordered, borderless, border-thick) forwarded to the inner Box component.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Box Borders"
        currentState="Comparing bordered, borderless, and border-thick"
      >
        <org-storybook-example-container-section label="Bordered (Default)">
          <org-empty-indicator header="No data available" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Borderless">
          <org-empty-indicator header="No data available" boxBorder="borderless" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Border Thick">
          <org-empty-indicator header="No data available" boxBorder="border-thick" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Bordered</strong>: Standard border (default)</li>
          <li><strong>Borderless</strong>: No border, useful for minimal layouts</li>
          <li><strong>Border Thick</strong>: Emphasized thicker border</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const BoxColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of box colors forwarded to the inner Box component.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Box Colors"
        currentState="Comparing all available box color values"
      >
        <org-storybook-example-container-section label="Default (null)">
          <org-empty-indicator header="Default color" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Primary">
          <org-empty-indicator header="Primary color" boxColor="primary" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Secondary">
          <org-empty-indicator header="Secondary color" boxColor="secondary" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Neutral">
          <org-empty-indicator header="Neutral color" boxColor="neutral" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Safe">
          <org-empty-indicator header="Safe color" boxColor="safe" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Info">
          <org-empty-indicator header="Info color" boxColor="info" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Caution">
          <org-empty-indicator header="Caution color" boxColor="caution" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Warning">
          <org-empty-indicator header="Warning color" boxColor="warning" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Danger">
          <org-empty-indicator header="Danger color" boxColor="danger" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Each semantic color affects the Box border and background per the Box component's styling</li>
          <li>Semantic colors convey meaning visually only — consumers must add appropriate aria attributes when semantically important</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const BoxPaddings: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of box padding sizes forwarded to the inner Box component.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Box Paddings"
        currentState="Comparing none, sm, md, and lg padding"
      >
        <org-storybook-example-container-section label="None">
          <org-empty-indicator header="No data available" boxPadding="none" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Small (sm)">
          <org-empty-indicator header="No data available" boxPadding="sm" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium (md - default)">
          <org-empty-indicator header="No data available" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large (lg)">
          <org-empty-indicator header="No data available" boxPadding="lg" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>none</strong>: No internal padding</li>
          <li><strong>sm</strong>: Small internal padding</li>
          <li><strong>md</strong>: Medium internal padding (default)</li>
          <li><strong>lg</strong>: Large internal padding</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const WithActionButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty indicator with an action button. The button only displays when actionLabel is provided and actionTriggered event has a listener.',
      },
    },
  },
  render: () => ({
    props: {
      onAddItem: () => {
        console.log('add item clicked');
      },
      onCreateNew: () => {
        console.log('create new clicked');
      },
    },
    template: `
      <org-storybook-example-container
        title="With Action Button"
        currentState="Comparing empty indicators with and without action buttons"
      >
        <org-storybook-example-container-section label="No Action Button">
          <org-empty-indicator header="No items found" description="Your list is currently empty" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Action Button">
          <org-empty-indicator
            header="No items to display"
            description="Get started by creating your first item"
            actionLabel="Add Item"
            (actionTriggered)="onAddItem()"
          />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="With Different Action Label">
          <org-empty-indicator
            header="No results found"
            description="Adjust your filters or create something new"
            actionLabel="Create New"
            (actionTriggered)="onCreateNew()"
          />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>No Action Button</strong>: Displays header and description only</li>
          <li><strong>With Action Button</strong>: Displays a primary button below the description when actionLabel is provided and actionTriggered has a listener</li>
          <li><strong>Different Labels</strong>: The action button label can be customized for different contexts</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const DifferentContexts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Examples of empty indicators in different use case contexts.',
      },
    },
  },
  render: () => ({
    props: {
      onAddTask: () => {
        console.log('add task clicked');
      },
      onSearch: () => {
        console.log('search clicked');
      },
      onUpload: () => {
        console.log('upload clicked');
      },
    },
    template: `
      <org-storybook-example-container
        title="Different Contexts"
        currentState="Comparing empty indicators in various use cases"
      >
        <org-storybook-example-container-section label="Empty Task List">
          <org-empty-indicator
            header="No tasks yet"
            description="Create your first task to get started"
            actionLabel="Add Task"
            (actionTriggered)="onAddTask()"
          >
            <org-empty-indicator-icon name="square-check-big" color="primary" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Search Results">
          <org-empty-indicator
            header="No results found"
            description="Try a different search term"
            actionLabel="Try Different Search"
            (actionTriggered)="onSearch()"
          >
            <org-empty-indicator-icon name="search" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Empty File List">
          <org-empty-indicator
            header="No files uploaded"
            description="Upload a file to see it here"
            actionLabel="Upload File"
            (actionTriggered)="onUpload()"
          >
            <org-empty-indicator-icon name="upload" color="info" />
          </org-empty-indicator>
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="No Data (No Action)">
          <org-empty-indicator header="Data will appear here once available" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Task List</strong>: Empty state for a task management interface</li>
          <li><strong>Search Results</strong>: Empty state when no search results are found</li>
          <li><strong>File List</strong>: Empty state for a file upload interface</li>
          <li><strong>No Action</strong>: Simple informational empty state without actions</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [EmptyIndicator, EmptyIndicatorIcon, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
