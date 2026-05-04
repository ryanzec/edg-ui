import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PaginationStore } from './pagination-store';
import { Button } from '../button/button';

@Component({
  selector: 'story-pagination-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  providers: [PaginationStore],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="text-sm"><strong>Current Page:</strong> {{ paginationStore.activePage() }}</div>
        <div class="text-sm"><strong>Total Pages:</strong> {{ paginationStore.totalPages() }}</div>
        <div class="text-sm"><strong>Total Items:</strong> {{ paginationStore.totalItems() }}</div>
        <div class="text-sm"><strong>Items Per Page:</strong> {{ paginationStore.activeItemsPerPage() }}</div>
        <div class="text-sm"><strong>Start Index:</strong> {{ paginationStore.startIndex() }}</div>
        <div class="text-sm"><strong>End Index:</strong> {{ paginationStore.endIndex() }}</div>
        <div class="text-sm"><strong>Has Previous:</strong> {{ paginationStore.hasPrevious() }}</div>
        <div class="text-sm"><strong>Has Next:</strong> {{ paginationStore.hasNext() }}</div>
        <div class="text-sm"><strong>Result Text:</strong> {{ paginationStore.resultText() }}</div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-semibold">Visible Pages:</div>
        <div class="flex flex-wrap gap-1">
          @for (page of paginationStore.visiblePageItems(); track $index) {
            @if (page.type === 'page') {
              <span class="px-2 py-1 text-xs border rounded" [class.bg-info-soft]="page.isActive">
                {{ page.value }}
              </span>
            } @else {
              <span class="px-2 py-1 text-xs">...</span>
            }
          }
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <org-button color="primary" size="sm" (click)="paginationStore.goToFirstPage()"> First Page </org-button>
        <org-button color="primary" size="sm" (click)="paginationStore.goToPreviousPage()"> Previous Page </org-button>
        <org-button color="primary" size="sm" (click)="paginationStore.goToNextPage()"> Next Page </org-button>
        <org-button color="primary" size="sm" (click)="paginationStore.goToLastPage()"> Last Page </org-button>
        <org-button color="secondary" size="sm" (click)="paginationStore.goToPage(5)"> Go to Page 5 </org-button>
        <org-button color="secondary" size="sm" (click)="paginationStore.setState({ itemsPerPage: 20 })">
          Set Items Per Page: 20
        </org-button>
        <org-button color="secondary" size="sm" (click)="paginationStore.setState({ itemsPerPage: 50 })">
          Set Items Per Page: 50
        </org-button>
        <org-button color="neutral" size="sm" (click)="paginationStore.setState({ totalItems: 100 })">
          Set Total Items: 100
        </org-button>
        <org-button color="neutral" size="sm" (click)="paginationStore.setState({ totalItems: 500 })">
          Set Total Items: 500
        </org-button>
        <org-button color="neutral" size="sm" (click)="paginationStore.setState({ totalItems: 0 })">
          Set Total Items: 0
        </org-button>
        <org-button
          color="danger"
          size="sm"
          (click)="paginationStore.setState({ disabled: !paginationStore.disabled() })"
        >
          Toggle Disabled ({{ paginationStore.disabled() ? 'on' : 'off' }})
        </org-button>
      </div>
    </div>
  `,
})
class PaginationDemo {
  public readonly paginationStore = inject(PaginationStore);

  constructor() {
    this.paginationStore.initialize({
      currentPage: 1,
      totalItems: 250,
      itemsPerPage: 10,
      visiblePages: 7,
      itemsPerPageOptions: [5, 10, 20, 50],
      disabled: false,
    });
  }
}

const meta: Meta<PaginationStore> = {
  title: 'Core/Services/Pagination Store',
  component: PaginationStore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## PaginationStore Service

  A signal-based state management service for handling pagination operations in Angular applications.

  ### Features
  - Signal-based reactive state management
  - Configurable items per page with multiple options
  - Automatic page adjustment when total items change
  - Computed properties for reactive consumption
  - Visible page calculation with ellipsis support
  - Navigation methods (first, previous, next, last)
  - Result text generation for displaying current range

  ### State Properties
  - **activePage**: The current active page number
  - **totalPages**: Total number of pages based on items and items per page
  - **totalItems**: Total number of items across all pages
  - **activeItemsPerPage**: Current items per page setting
  - **startIndex**: Starting index for current page (0-based)
  - **endIndex**: Ending index for current page (0-based)
  - **hasPrevious**: Boolean indicating if previous page exists
  - **hasNext**: Boolean indicating if next page exists
  - **visiblePageItems**: Array of visible page items with ellipsis support
  - **resultText**: Formatted text showing current result range
  - **disabled**: Boolean indicating if pagination is disabled
  - **itemsPerPageOptions**: Available items per page options
  - **visiblePages**: Number of visible page buttons

  ### Methods
  - **initialize(state)**: Initialize pagination with initial state
  - **setState(partialState)**: Update pagination state (validates and applies changes)
  - **goToPage(page)**: Navigate to specific page
  - **goToPreviousPage()**: Navigate to previous page
  - **goToNextPage()**: Navigate to next page
  - **goToFirstPage()**: Navigate to first page
  - **goToLastPage()**: Navigate to last page

  ### Usage Examples
  \`\`\`typescript
  // inject the service
  private paginationStore = inject(PaginationStore);

  // initialize with configuration
  this.paginationStore.initialize({
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    visiblePages: 7,
    itemsPerPageOptions: [5, 10, 20, 50],
    disabled: false,
  });

  // navigate pages
  this.paginationStore.goToNextPage();
  this.paginationStore.goToPreviousPage();
  this.paginationStore.goToPage(5);

  // update state
  this.paginationStore.setState({ itemsPerPage: 20 });
  this.paginationStore.setState({ totalItems: 250 });

  // access current state
  const currentPage = this.paginationStore.activePage();
  const totalPages = this.paginationStore.totalPages();
  const hasNext = this.paginationStore.hasNext();
  const resultText = this.paginationStore.resultText();
  \`\`\`

  ### Integration with Tables
  This service is designed to work seamlessly with table components and data lists. It automatically calculates visible page ranges, handles ellipsis for large page counts, and provides computed properties for displaying current result ranges.
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<PaginationStore>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo of the PaginationStore service. Click buttons to interact with pagination state.',
      },
    },
  },
  render: () => ({
    template: `<story-pagination-demo />`,
    moduleMetadata: {
      imports: [PaginationDemo],
    },
  }),
};
