import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlInput } from '../../example/design-system-demo/design-system-demo-control-input';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Pagination } from './pagination';

type LiveDemoTotalItemsChoice = '0' | '25' | '100' | '250' | '1000';
type LiveDemoVisiblePagesChoice = '5' | '7' | '11';
type LiveDemoItemsPerPagePreset = 'standard' | 'custom' | 'fewer';

const allLiveDemoTotalItemsChoices = ['0', '25', '100', '250', '1000'] as const;
const allLiveDemoVisiblePagesChoices = ['5', '7', '11'] as const;
const allLiveDemoItemsPerPagePresets = ['standard', 'custom', 'fewer'] as const;

const liveDemoTotalItemsItems: ButtonToggleItem[] = allLiveDemoTotalItemsChoices.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoVisiblePagesItems: ButtonToggleItem[] = allLiveDemoVisiblePagesChoices.map((value) => ({
  label: value,
  value,
  buttonColor: 'primary',
}));

const liveDemoItemsPerPagePresetItems: ButtonToggleItem[] = allLiveDemoItemsPerPagePresets.map((preset) => ({
  label: preset,
  value: preset,
  buttonColor: 'primary',
}));

const itemsPerPagePresetMap: Record<LiveDemoItemsPerPagePreset, number[]> = {
  standard: [5, 10, 20, 50],
  custom: [10, 25, 50, 100],
  fewer: [10, 50],
};

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

@Component({
  selector: 'story-pagination-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Pagination,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlInput,
    DesignSystemDemoCanvas,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 6rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="All paginations below are real and interactive — hover, focus, press, or tab through them to see every state."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-input label="Total items">
            <org-button-toggle [items]="totalItemsItems" formControlName="totalItems" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Visible pages">
            <org-button-toggle [items]="visiblePagesItems" formControlName="visiblePages" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Items per page options">
            <org-button-toggle [items]="itemsPerPagePresetItems" formControlName="itemsPerPagePreset" buttonSize="sm" />
          </org-design-system-demo-control-input>
          <org-design-system-demo-control-input label="Disabled">
            <org-checkbox-toggle name="live-demo-disabled" value="disabled" formControlName="disabled">
              {{ liveDemoForm.controls.disabled.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-input>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-pagination
              [totalItems]="resolvedTotalItems()"
              [visiblePages]="resolvedVisiblePages()"
              [itemsPerPageOptions]="resolvedItemsPerPageOptions()"
              [disabled]="liveDemoForm.controls.disabled.value"
            />
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class PaginationLiveDemoStory {
  protected readonly totalItemsItems = liveDemoTotalItemsItems;
  protected readonly visiblePagesItems = liveDemoVisiblePagesItems;
  protected readonly itemsPerPagePresetItems = liveDemoItemsPerPagePresetItems;

  protected readonly liveDemoForm = new FormGroup({
    totalItems: new FormControl<LiveDemoTotalItemsChoice>('100', { nonNullable: true }),
    visiblePages: new FormControl<LiveDemoVisiblePagesChoice>('7', { nonNullable: true }),
    itemsPerPagePreset: new FormControl<LiveDemoItemsPerPagePreset>('standard', { nonNullable: true }),
    disabled: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected resolvedTotalItems(): number {
    return Number(this.liveDemoForm.controls.totalItems.value);
  }

  protected resolvedVisiblePages(): number {
    return Number(this.liveDemoForm.controls.visiblePages.value);
  }

  protected resolvedItemsPerPageOptions(): number[] {
    return itemsPerPagePresetMap[this.liveDemoForm.controls.itemsPerPagePreset.value];
  }
}

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully interactive demo. Use the controls to drive the dataset size, visible-page count, items-per-page preset, and disabled state, and observe the live result in the canvas.',
      },
    },
  },
  render: () => ({
    template: `<story-pagination-live-demo />`,
    moduleMetadata: {
      imports: [PaginationLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every pagination axis — dataset size, page position, visible-page count, items-per-page presets, enabled / disabled state, and the empty dataset edge case.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Dataset Sizes" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="25" />
            <org-pagination [totalItems]="100" />
            <org-pagination [totalItems]="1000" [currentPage]="25" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Small</strong>: Shows all pages when total pages fit within visible limit</li>
            <li><strong>Medium</strong>: Shows ellipsis when pages exceed visible limit</li>
            <li><strong>Large</strong>: Smart ellipsis placement based on current page position</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Page Positions" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="500" [currentPage]="1" />
            <org-pagination [totalItems]="500" [currentPage]="25" />
            <org-pagination [totalItems]="500" [currentPage]="50" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>First Page</strong>: Previous/First buttons disabled, ellipsis after initial pages</li>
            <li><strong>Middle Page</strong>: All navigation enabled, ellipsis on both sides</li>
            <li><strong>Last Page</strong>: Next/Last buttons disabled, ellipsis before final pages</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Visible Page Variations" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="5" />
            <org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="7" />
            <org-pagination [totalItems]="500" [currentPage]="25" [visiblePages]="11" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>5 Pages</strong>: Compact view with fewer page buttons</li>
            <li><strong>7 Pages</strong>: Balanced default view (recommended)</li>
            <li><strong>11 Pages</strong>: Expanded view showing more page options</li>
            <li>Odd numbers are recommended to maintain symmetry around current page</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Items Per Page Options" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="300" [itemsPerPageOptions]="[5, 10, 20, 50]" />
            <org-pagination [totalItems]="300" [itemsPerPage]="25" [itemsPerPageOptions]="[10, 25, 50, 100]" />
            <org-pagination [totalItems]="300" [itemsPerPageOptions]="[10, 50]" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Items per page selector shows available options</li>
            <li>Changing items per page adjusts total pages and resets to page 1</li>
            <li>Default options: [5, 10, 20, 50]</li>
            <li>Custom options can be provided based on use case</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Pagination States" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="100" [currentPage]="5" />
            <org-pagination [totalItems]="100" [currentPage]="5" [disabled]="true" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li><strong>Normal</strong>: All navigation buttons and selectors are interactive</li>
            <li><strong>Disabled</strong>: All interactions are disabled, reduced opacity applied</li>
            <li>Disabled state prevents page changes and items per page changes</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Zero Items" />
          <org-design-system-demo-canvas slot="canvas">
            <org-pagination [totalItems]="0" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Result text shows "0–0 of 0"</li>
            <li>Only page 1 is shown and is active</li>
            <li>Previous/First and Next/Last navigation buttons are all disabled</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        Pagination,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
