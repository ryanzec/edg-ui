import type { Meta, StoryObj } from '@storybook/angular';
import { Checklist, type ChecklistItemData } from './checklist';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

const meta: Meta<Checklist> = {
  title: 'Core/Components/Checklist',
  component: Checklist,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Checklist Component

  A component for displaying a list of items with status indicators and optional nested sub-items. Supports one level of nesting with expand/collapse functionality.

  ### Features
  - 4 status types with distinct icons and colors
  - One level of nesting with expand/collapse
  - Animated status icons (spinning for in-progress)
  - Light and dark theme support
  - Accessible with keyboard navigation

  ### Status Types
  - **not-started**: Neutral dots icon indicating the item hasn't started
  - **in-progress**: Blue spinning circle indicating ongoing work
  - **valid**: Green filled check circle for successful completion
  - **invalid**: Red filled X circle for errors or failures

  ### Usage Examples
  \`\`\`html
  <!-- Simple flat list -->
  <org-checklist [items]="items" />

  <!-- List with nested items -->
  <org-checklist [items]="itemsWithNesting" />
  \`\`\`

  ### TypeScript Types
  \`\`\`typescript
  type ChecklistItemStatus = 'not-started' | 'in-progress' | 'valid' | 'invalid';

  type BaseChecklistItemData = {
    id: string;
    label: string;
    status: ChecklistItemStatus;
  };

  type ChecklistItemData = BaseChecklistItemData & {
    items?: BaseChecklistItemData[];
  };
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Checklist>;

const flatItems: ChecklistItemData[] = [
  { id: '1', label: 'Initialize project', status: 'valid' },
  { id: '2', label: 'Configure dependencies', status: 'valid' },
  { id: '3', label: 'Building application', status: 'in-progress' },
  { id: '4', label: 'Run tests', status: 'not-started' },
  { id: '5', label: 'Deploy to production', status: 'not-started' },
];

export const Default: Story = {
  args: {
    items: flatItems,
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of checklist items to display',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default checklist with a flat list of items in various states. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-checklist [items]="items" />
    `,
    moduleMetadata: {
      imports: [Checklist],
    },
  }),
};

export const StatusTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all 4 status types with their respective icons and colors.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Status Types"
        currentState="Comparing all 4 status indicators"
      >
        <org-storybook-example-container-section label="Not Started">
          <org-checklist [items]="[
            { id: '1', label: 'Task that has not started yet', status: 'not-started' }
          ]" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="In Progress">
          <org-checklist [items]="[
            { id: '2', label: 'Task currently in progress', status: 'in-progress' }
          ]" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Valid (Success)">
          <org-checklist [items]="[
            { id: '3', label: 'Task completed successfully', status: 'valid' }
          ]" />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Invalid (Error)">
          <org-checklist [items]="[
            { id: '4', label: 'Task that failed or has errors', status: 'invalid' }
          ]" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Not Started</strong>: Neutral gray dots icon</li>
          <li><strong>In Progress</strong>: Blue spinning circle icon</li>
          <li><strong>Valid</strong>: Green filled check circle icon</li>
          <li><strong>Invalid</strong>: Red filled X circle icon</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Checklist, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const FlatList: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A flat list of items without nesting, showing a typical workflow progression.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Flat List"
        currentState="Showing a simple flat list without nesting"
      >
        <org-storybook-example-container-section label="Deployment Checklist">
          <org-checklist [items]="[
            { id: '1', label: 'Initialize project', status: 'valid' },
            { id: '2', label: 'Configure dependencies', status: 'valid' },
            { id: '3', label: 'Building application', status: 'in-progress' },
            { id: '4', label: 'Run tests', status: 'not-started' },
            { id: '5', label: 'Deploy to production', status: 'not-started' }
          ]" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Each item displays a status icon and label</li>
          <li>No expand/collapse buttons for flat items</li>
          <li>Visual spacing between items for readability</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Checklist, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const NestedItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Items with nested sub-items that can be expanded and collapsed. Supports one level of nesting.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Nested Items"
        currentState="Showing items with expandable nested sub-items"
      >
        <org-storybook-example-container-section label="Data Analysis Workflow">
          <org-checklist [items]="[
            {
              id: '1',
              label: 'Data Preparation',
              status: 'valid',
              items: [
                { id: '1-1', label: 'Data Analysis Preparation Started', status: 'valid' },
                { id: '1-2', label: 'Data Connection Ready', status: 'valid' },
                { id: '1-3', label: 'Analysis Strategy Chosen', status: 'valid' },
                { id: '1-4', label: 'Data Analysis Preparation Complete', status: 'valid' }
              ]
            },
            {
              id: '2',
              label: 'Data Analysis',
              status: 'in-progress',
              items: [
                { id: '2-1', label: 'Loading data sources', status: 'valid' },
                { id: '2-2', label: 'Processing records', status: 'in-progress' },
                { id: '2-3', label: 'Generating insights', status: 'not-started' }
              ]
            },
            {
              id: '3',
              label: 'Report Generation',
              status: 'not-started',
              items: [
                { id: '3-1', label: 'Create visualizations', status: 'not-started' },
                { id: '3-2', label: 'Export data', status: 'not-started' }
              ]
            }
          ]" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Items with nested sub-items show expand/collapse buttons</li>
          <li>Caret icon points right when collapsed, down when expanded</li>
          <li>Nested items are indented for visual hierarchy</li>
          <li>Parent status can differ from child statuses</li>
          <li>Only one level of nesting is supported</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Checklist, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const MixedList: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A combination of flat items and items with nesting in the same list.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Mixed List"
        currentState="Showing both flat and nested items together"
      >
        <org-storybook-example-container-section label="Project Setup">
          <org-checklist [items]="[
            { id: '1', label: 'Create repository', status: 'valid' },
            {
              id: '2',
              label: 'Configure project',
              status: 'valid',
              items: [
                { id: '2-1', label: 'Setup build tools', status: 'valid' },
                { id: '2-2', label: 'Configure linter', status: 'valid' },
                { id: '2-3', label: 'Add testing framework', status: 'valid' }
              ]
            },
            { id: '3', label: 'Initial commit', status: 'valid' },
            {
              id: '4',
              label: 'Development environment',
              status: 'in-progress',
              items: [
                { id: '4-1', label: 'Install dependencies', status: 'valid' },
                { id: '4-2', label: 'Configure IDE', status: 'in-progress' }
              ]
            },
            { id: '5', label: 'Documentation', status: 'not-started' }
          ]" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Flat items have spacer to align with nested items</li>
          <li>Mix of expandable and non-expandable items works seamlessly</li>
          <li>Visual consistency maintained across different item types</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Checklist, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};

export const AllInvalid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example showing error states with invalid status indicators.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Error Scenarios"
        currentState="Showing failed validation checks"
      >
        <org-storybook-example-container-section label="Failed Validation">
          <org-checklist [items]="[
            { id: '1', label: 'Database connection', status: 'invalid' },
            { id: '2', label: 'API authentication', status: 'invalid' },
            {
              id: '3',
              label: 'File system checks',
              status: 'invalid',
              items: [
                { id: '3-1', label: 'Read permissions', status: 'invalid' },
                { id: '3-2', label: 'Write permissions', status: 'invalid' },
                { id: '3-3', label: 'Storage space', status: 'valid' }
              ]
            }
          ]" />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Invalid status shows red X circle icon</li>
          <li>Useful for displaying validation errors or failed checks</li>
          <li>Can be mixed with other statuses in nested items</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [Checklist, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
