import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from './pagination';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-pagination-dataset-small-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="25" />`,
})
class PaginationDatasetSmallDemo {}

@Component({
  selector: 'story-pagination-dataset-medium-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="100" />`,
})
class PaginationDatasetMediumDemo {}

@Component({
  selector: 'story-pagination-dataset-large-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="1000" [currentPage]="25" />`,
})
class PaginationDatasetLargeDemo {}

@Component({
  selector: 'story-pagination-page-position-first-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="1" />`,
})
class PaginationPagePositionFirstDemo {}

@Component({
  selector: 'story-pagination-page-position-middle-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="25" />`,
})
class PaginationPagePositionMiddleDemo {}

@Component({
  selector: 'story-pagination-page-position-last-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="50" />`,
})
class PaginationPagePositionLastDemo {}

@Component({
  selector: 'story-pagination-visible-pages-5-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="5" />`,
})
class PaginationVisiblePages5Demo {}

@Component({
  selector: 'story-pagination-visible-pages-7-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="7" />`,
})
class PaginationVisiblePages7Demo {}

@Component({
  selector: 'story-pagination-visible-pages-11-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="11" />`,
})
class PaginationVisiblePages11Demo {}

@Component({
  selector: 'story-pagination-items-per-page-standard-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="300" [itemsPerPageOptions]="[5, 10, 20, 50]" />`,
})
class PaginationItemsPerPageStandardDemo {}

@Component({
  selector: 'story-pagination-items-per-page-custom-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="300" [itemsPerPage]="25" [itemsPerPageOptions]="[10, 25, 50, 100]" />`,
})
class PaginationItemsPerPageCustomDemo {}

@Component({
  selector: 'story-pagination-items-per-page-fewer-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="300" [itemsPerPageOptions]="[10, 50]" />`,
})
class PaginationItemsPerPageFewerDemo {}

@Component({
  selector: 'story-pagination-state-normal-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="100" [currentPage]="5" />`,
})
class PaginationStateNormalDemo {}

@Component({
  selector: 'story-pagination-state-disabled-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="100" [currentPage]="5" [disabled]="true" />`,
})
class PaginationStateDisabledDemo {}

@Component({
  selector: 'story-pagination-zero-items-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Pagination],
  template: `<org-pagination [totalItems]="0" />`,
})
class PaginationZeroItemsDemo {}

const meta: Meta<Pagination> = {
  title: 'Core/Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">

## Pagination Component

A flexible pagination component for navigating through large datasets with customizable page visibility and items per page options.

### Features
- Configurable visible page numbers
- Items per page selector
- First/last page navigation
- Previous/next page navigation
- Smart ellipsis for large page ranges
- Result count display
- Disabled state support
- Keyboard accessible

### Key Options
- **visiblePages**: Number of page buttons to display (default: 7, recommended: odd numbers)
- **itemsPerPageOptions**: Array of options for items per page selector (default: [5, 10, 20, 50])
- **totalItems**: Total number of items in the dataset
- **itemsPerPage**: Initial items per page value
- **currentPage**: Initial active page (default: 1)
- **disabled**: Disables all pagination interactions

### Usage Examples
\`\`\`html
<!-- Basic pagination -->
<org-pagination
  [totalItems]="100"
/>

<!-- Pagination with two-way binding -->
<org-pagination
  [totalItems]="500"
  [(currentPage)]="currentPage"
  [(itemsPerPage)]="itemsPerPage"
/>

<!-- Pagination with custom visible pages -->
<org-pagination
  [totalItems]="1000"
  [(currentPage)]="currentPage"
  [(itemsPerPage)]="itemsPerPage"
  [visiblePages]="5"
/>

<!-- Disabled pagination -->
<org-pagination
  [totalItems]="100"
  [disabled]="true"
/>
\`\`\`

### Two-Way Binding
- **currentPage**: Current active page (use \`[(currentPage)]\` for two-way binding)
- **itemsPerPage**: Items per page (use \`[(itemsPerPage)]\` for two-way binding)

</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    visiblePages: 7,
    itemsPerPageOptions: [5, 10, 20, 50],
    disabled: false,
  },
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'The initial active page',
    },
    totalItems: {
      control: 'number',
      description: 'Total number of items in the dataset',
    },
    itemsPerPage: {
      control: 'select',
      options: [5, 10, 20, 50],
      description: 'Initial items per page value',
    },
    visiblePages: {
      control: 'number',
      description: 'Number of page buttons to display (odd numbers recommended)',
    },
    itemsPerPageOptions: {
      control: 'object',
      description: 'Array of options for items per page selector',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether pagination is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default pagination with 100 items. Use the controls below to interact with the component.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-pagination
        [(currentPage)]="currentPage"
        [totalItems]="totalItems"
        [(itemsPerPage)]="itemsPerPage"
        [visiblePages]="visiblePages"
        [itemsPerPageOptions]="itemsPerPageOptions"
        [disabled]="disabled"
      />
    `,
    moduleMetadata: {
      imports: [Pagination],
    },
  }),
};

export const DatasetSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of pagination behavior with different dataset sizes (small, medium, large).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Dataset Sizes"
        currentState="Comparing small, medium, and large datasets"
      >
        <org-storybook-example-container-section label="Small Dataset (25 items)">
          <story-pagination-dataset-small-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Medium Dataset (100 items)">
          <story-pagination-dataset-medium-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Large Dataset (1000 items)">
          <story-pagination-dataset-large-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Small</strong>: Shows all pages when total pages fit within visible limit</li>
          <li><strong>Medium</strong>: Shows ellipsis when pages exceed visible limit</li>
          <li><strong>Large</strong>: Smart ellipsis placement based on current page position</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        PaginationDatasetSmallDemo,
        PaginationDatasetMediumDemo,
        PaginationDatasetLargeDemo,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const PagePositions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of pagination appearance at different page positions (first, middle, last).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Page Positions"
        currentState="Comparing first, middle, and last page positions"
      >
        <org-storybook-example-container-section label="First Page">
          <story-pagination-page-position-first-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Middle Page">
          <story-pagination-page-position-middle-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Last Page">
          <story-pagination-page-position-last-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>First Page</strong>: Previous/First buttons disabled, ellipsis after initial pages</li>
          <li><strong>Middle Page</strong>: All navigation enabled, ellipsis on both sides</li>
          <li><strong>Last Page</strong>: Next/Last buttons disabled, ellipsis before final pages</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        PaginationPagePositionFirstDemo,
        PaginationPagePositionMiddleDemo,
        PaginationPagePositionLastDemo,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const VisiblePageVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different visible page configurations (5, 7, 11 pages).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Visible Page Variations"
        currentState="Comparing different numbers of visible pages"
      >
        <org-storybook-example-container-section label="5 Visible Pages (Compact)">
          <story-pagination-visible-pages-5-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="7 Visible Pages (Default)">
          <story-pagination-visible-pages-7-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="11 Visible Pages (Expanded)">
          <story-pagination-visible-pages-11-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>5 Pages</strong>: Compact view with fewer page buttons</li>
          <li><strong>7 Pages</strong>: Balanced default view (recommended)</li>
          <li><strong>11 Pages</strong>: Expanded view showing more page options</li>
          <li>Odd numbers are recommended to maintain symmetry around current page</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        PaginationVisiblePages5Demo,
        PaginationVisiblePages7Demo,
        PaginationVisiblePages11Demo,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const ItemsPerPageOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different items per page configurations.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Items Per Page Options"
        currentState="Comparing different items per page configurations"
      >
        <org-storybook-example-container-section label="Standard Options (5, 10, 20, 50)">
          <story-pagination-items-per-page-standard-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Custom Options (10, 25, 50, 100)">
          <story-pagination-items-per-page-custom-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Fewer Options (10, 50)">
          <story-pagination-items-per-page-fewer-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Items per page selector shows available options</li>
          <li>Changing items per page adjusts total pages and resets to page 1</li>
          <li>Default options: [5, 10, 20, 50]</li>
          <li>Custom options can be provided based on use case</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        PaginationItemsPerPageStandardDemo,
        PaginationItemsPerPageCustomDemo,
        PaginationItemsPerPageFewerDemo,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comparison of normal and disabled states.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Pagination States"
        currentState="Comparing normal and disabled states"
      >
        <org-storybook-example-container-section label="Normal (Enabled)">
          <story-pagination-state-normal-demo />
        </org-storybook-example-container-section>

        <org-storybook-example-container-section label="Disabled">
          <story-pagination-state-disabled-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li><strong>Normal</strong>: All navigation buttons and selectors are interactive</li>
          <li><strong>Disabled</strong>: All interactions are disabled, reduced opacity applied</li>
          <li>Disabled state prevents page changes and items per page changes</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [
        PaginationStateNormalDemo,
        PaginationStateDisabledDemo,
        StorybookExampleContainer,
        StorybookExampleContainerSection,
      ],
    },
  }),
};

export const ZeroItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination behavior when the dataset is empty (0 total items).',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container
        title="Zero Items"
        currentState="Empty dataset with 0 total items"
      >
        <org-storybook-example-container-section label="Empty Dataset">
          <story-pagination-zero-items-demo />
        </org-storybook-example-container-section>

        <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
          <li>Result text shows "result 0 - 0 of 0"</li>
          <li>Only page 1 is shown and is active</li>
          <li>Previous/First and Next/Last navigation buttons are all disabled</li>
        </ul>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [PaginationZeroItemsDemo, StorybookExampleContainer, StorybookExampleContainerSection],
    },
  }),
};
