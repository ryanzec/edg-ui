import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SortableDirective } from './sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-sortable-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortableDirective, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [SortingStore],
  template: `
    <org-storybook-example-container title="Sortable Directive">
      <org-storybook-example-container-section label="State">
        <div class="flex flex-col gap-2">
          <div class="text-sm"><strong>Current Sort Key:</strong> {{ sortingStore.key() ?? 'null' }}</div>
          <div class="text-sm"><strong>Current Direction:</strong> {{ sortingStore.direction() ?? 'null' }}</div>
          <div class="text-sm"><strong>Is Sorting:</strong> {{ sortingStore.isSorting() }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Click to Sort">
        <div class="flex gap-4 p-4 border rounded-md">
          <span class="font-medium" [orgSortableKey]="'name'">Name</span>
          <span class="font-medium" [orgSortableKey]="'email'">Email</span>
          <span class="font-medium" [orgSortableKey]="'status'">Status</span>
          <span class="font-medium" [orgSortableKey]="'date'">Date</span>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class SortableDemo {
  public readonly sortingStore = inject(SortingStore);
}

@Component({
  selector: 'story-sortable-enabled-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortableDirective, Button, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [SortingStore],
  template: `
    <org-storybook-example-container title="Dynamic Enable/Disable">
      <org-storybook-example-container-section label="State">
        <div class="flex flex-col gap-2">
          <div class="text-sm"><strong>Current Sort Key:</strong> {{ sortingStore.key() ?? 'null' }}</div>
          <div class="text-sm"><strong>Current Direction:</strong> {{ sortingStore.direction() ?? 'null' }}</div>
          <div class="text-sm"><strong>Is Sorting:</strong> {{ sortingStore.isSorting() }}</div>
          <div class="text-sm"><strong>Sorting Enabled:</strong> {{ enabled() }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <div class="flex gap-2">
          <button orgButton buttonVariant="outline" (click)="toggleEnabled()">
            {{ enabled() ? 'Disable' : 'Enable' }} Sorting
          </button>
          <button orgButton buttonVariant="outline" (click)="sortingStore.clearSort()">Clear Sort</button>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Sortable Headers ({{ enabled() ? 'Enabled' : 'Disabled' }})">
        <div class="flex gap-4 p-4 border rounded-md">
          <span class="font-medium" [orgSortableKey]="'name'" [sortableEnabled]="enabled()">Name</span>
          <span class="font-medium" [orgSortableKey]="'email'" [sortableEnabled]="enabled()">Email</span>
          <span class="font-medium" [orgSortableKey]="'status'" [sortableEnabled]="enabled()">Status</span>
          <span class="font-medium" [orgSortableKey]="'date'" [sortableEnabled]="enabled()">Date</span>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class SortableEnabledDemo {
  public readonly sortingStore = inject(SortingStore);
  public readonly enabled = signal(true);

  public toggleEnabled(): void {
    this.enabled.update((current) => !current);
  }
}

@Component({
  selector: 'story-sortable-mixed-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortableDirective, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [SortingStore],
  template: `
    <org-storybook-example-container title="Mixed Enabled/Disabled Headers">
      <org-storybook-example-container-section label="State">
        <div class="flex flex-col gap-2">
          <div class="text-sm"><strong>Current Sort Key:</strong> {{ sortingStore.key() ?? 'null' }}</div>
          <div class="text-sm"><strong>Current Direction:</strong> {{ sortingStore.direction() ?? 'null' }}</div>
          <div class="text-sm"><strong>Is Sorting:</strong> {{ sortingStore.isSorting() }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Headers">
        <div class="flex gap-4 p-4 border rounded-md">
          <span class="font-medium" [orgSortableKey]="'name'" [sortableEnabled]="true">Name (Enabled)</span>
          <span class="font-medium" [orgSortableKey]="'email'" [sortableEnabled]="false">Email (Disabled)</span>
          <span class="font-medium" [orgSortableKey]="'status'" [sortableEnabled]="true">Status (Enabled)</span>
          <span class="font-medium" [orgSortableKey]="'date'" [sortableEnabled]="false">Date (Disabled)</span>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class SortableMixedDemo {
  public readonly sortingStore = inject(SortingStore);
}

@Component({
  selector: 'story-sortable-preset-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortableDirective, StorybookExampleContainer, StorybookExampleContainerSection],
  providers: [SortingStore],
  template: `
    <org-storybook-example-container title="Preset Sort State">
      <org-storybook-example-container-section label="State">
        <div class="flex flex-col gap-2">
          <div class="text-sm"><strong>Current Sort Key:</strong> {{ sortingStore.key() ?? 'null' }}</div>
          <div class="text-sm"><strong>Current Direction:</strong> {{ sortingStore.direction() ?? 'null' }}</div>
          <div class="text-sm"><strong>Is Sorting:</strong> {{ sortingStore.isSorting() }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Headers (Name is preset to asc)">
        <div class="flex gap-4 p-4 border rounded-md">
          <span class="font-medium" [orgSortableKey]="'name'">Name</span>
          <span class="font-medium" [orgSortableKey]="'email'">Email</span>
          <span class="font-medium" [orgSortableKey]="'status'">Status</span>
          <span class="font-medium" [orgSortableKey]="'date'">Date</span>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class SortablePresetDemo {
  public readonly sortingStore = inject(SortingStore);

  constructor() {
    this.sortingStore.setSort('name', 'asc');
  }
}

const meta: Meta<SortableDirective> = {
  title: 'Core/Directives/Sortable',
  component: SortableDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Sortable Directive

  A directive that adds sorting functionality to elements, typically used on table headers. It automatically injects an icon to indicate sorting status and integrates with the SortingStore service.

  ### Features
  - Automatic icon injection showing sort direction
  - Visual feedback for active/inactive sorting states
  - Click handling to toggle sort direction
  - Keyboard accessible (Enter and Space trigger sort toggle)
  - Integrates with SortingStore for state management
  - Cycles through: ascending → descending → no sort
  - Accessible with pointer cursor and text selection disabled
  - **Dynamic enable/disable** support to add/remove sorting functionality at runtime

  ### Visual States
  - **Not Sorting**: Shows arrows-down-up icon in subtle color (text-text-subtle)
  - **Ascending**: Shows arrow-up icon in default color
  - **Descending**: Shows arrow-down icon in default color
  - **Disabled**: No icon shown, no interactive classes applied

  ### Requirements
  - **MUST** be used within a component that provides SortingStore
  - **MUST** have a non-empty \`sortableKey\` value (the sort key)

  ### Inputs
  - \`sortableKey\` (required): The sort key identifier
  - \`sortableEnabled\` (optional, default: true): Controls whether sorting functionality is enabled

  ### Usage Examples
  \`\`\`html
  <!-- Provide SortingStore in parent component -->
  @Component({
    providers: [SortingStore]
  })
  class TableComponent {
    sortingStore = inject(SortingStore);
  }

  <!-- Use directive on sortable headers -->
  <th [orgSortableKey]="'name'">Name</th>
  <th [orgSortableKey]="'email'">Email</th>
  <th [orgSortableKey]="'date'">Date</th>

  <!-- Dynamically enable/disable sorting -->
  <th [orgSortableKey]="'name'" [sortableEnabled]="canSort()">Name</th>
  <th [orgSortableKey]="'email'" [sortableEnabled]="false">Email</th>
  \`\`\`

  ### Dynamic Enable/Disable
  The \`sortableEnabled\` input allows you to dynamically add or remove sorting functionality:
  - When **enabled → disabled**: Icon is removed, interactive classes are removed, clicks do nothing, sort state is preserved
  - When **disabled → enabled**: Icon is added back, interactive classes are restored, clicks work again, previous sort state is restored if applicable

  ### Integration with SortingStore
  The directive uses the SortingStore service to:
  - Read current sorting state (key and direction)
  - Toggle sorting when clicked or activated via keyboard (only when enabled)
  - Update visual indicators based on state changes

  ### Styling
  When enabled, the directive automatically adds:
  - \`cursor-pointer\` class for clickable indication
  - \`select-none\` class to prevent text selection
  - \`flex\`, \`gap-1\`, \`items-center\` classes for layout
  - \`text-text-subtle\` class on icon when not actively sorting
  - \`role="button"\` and \`tabindex="0"\` for keyboard accessibility

  When disabled, all classes and attributes are removed and no icon is shown.
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SortableDirective>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo of the Sortable directive. Click on any header to toggle sorting.',
      },
    },
  },
  render: () => ({
    template: `<story-sortable-demo />`,
    moduleMetadata: {
      imports: [SortableDemo],
    },
  }),
};

export const DynamicEnableDisable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the ability to dynamically enable or disable sorting functionality. Click the "Enable/Disable Sorting" button to toggle sorting on all headers. Note that the sort state is preserved when toggling - if you sort by a column, then disable sorting, then re-enable it, the previous sort state will be restored.',
      },
    },
  },
  render: () => ({
    template: `<story-sortable-enabled-demo />`,
    moduleMetadata: {
      imports: [SortableEnabledDemo],
    },
  }),
};

export const MixedEnabledDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a scenario where some headers are sortable and others are disabled. Name and Status can be sorted, while Email and Date cannot be sorted (no icon shown, no cursor change, clicks do nothing).',
      },
    },
  },
  render: () => ({
    template: `<story-sortable-mixed-demo />`,
    moduleMetadata: {
      imports: [SortableMixedDemo],
    },
  }),
};

export const PresetSort: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a scenario where the sort key and direction are preset before user interaction. The Name column is initialized with an ascending sort, which is reflected in the icon state. Headers remain fully interactive — clicking any header will update the sort as normal.',
      },
    },
  },
  render: () => ({
    template: `<story-sortable-preset-demo />`,
    moduleMetadata: {
      imports: [SortablePresetDemo],
    },
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows sortable headers with sorting functionality completely disabled. Notice there are no icons, no interactive cursor, and clicks do nothing.',
      },
    },
  },
  render: () => ({
    template: `
      <org-storybook-example-container title="Disabled Sorting">
        <org-storybook-example-container-section label="Headers">
          <div class="flex gap-4 p-4 border rounded-md">
            <span class="font-medium" [orgSortableKey]="'name'" [sortableEnabled]="false">Name</span>
            <span class="font-medium" [orgSortableKey]="'email'" [sortableEnabled]="false">Email</span>
            <span class="font-medium" [orgSortableKey]="'status'" [sortableEnabled]="false">Status</span>
            <span class="font-medium" [orgSortableKey]="'date'" [sortableEnabled]="false">Date</span>
          </div>
        </org-storybook-example-container-section>
      </org-storybook-example-container>
    `,
    moduleMetadata: {
      imports: [SortableDirective, StorybookExampleContainer, StorybookExampleContainerSection],
      providers: [SortingStore],
    },
  }),
};
