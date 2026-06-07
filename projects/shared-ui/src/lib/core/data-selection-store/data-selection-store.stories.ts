import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DataSelectionStore } from './data-selection-store';
import { Button } from '../button/button';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

type User = {
  id: number;
  name: string;
  email: string;
};

const DEMO_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
  { id: 4, name: 'Alice Williams', email: 'alice.williams@example.com' },
  { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com' },
];

@Component({
  selector: 'story-data-selection-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Data Selection Store" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">State</div>
          <div class="flex flex-col gap-2">
            <div class="text-sm"><strong>Selected Count:</strong> {{ selectionStore.selectedCount() }}</div>
            <div class="text-sm"><strong>Has Selection:</strong> {{ selectionStore.hasSelection() }}</div>
            <div class="text-sm"><strong>Select All Enabled:</strong> {{ selectionStore.selectAllEnabled() }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Selected Items</div>
          @if (selectionStore.hasSelection()) {
            <div class="flex flex-col gap-1">
              @for (user of selectionStore.selectedItemsArray(); track user.id) {
                <div class="px-3 py-2 text-sm border rounded-sm bg-info-soft">{{ user.name }} ({{ user.email }})</div>
              }
            </div>
          } @else {
            <div class="text-sm text-neutral">No items selected</div>
          }
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Available Users</div>
          <div class="flex flex-col gap-1">
            @for (user of users; track user.id) {
              <button
                class="px-3 py-2 text-sm border rounded-sm cursor-pointer"
                [class.bg-info-soft]="selectionStore.isSelected(user)"
                (click)="selectionStore.toggle(user)"
              >
                {{ user.name }} ({{ user.email }})
              </button>
            }
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Actions</div>
          <div class="flex flex-wrap gap-2">
            <org-button color="primary" size="sm" label="Select All" (click)="selectionStore.selectAll(users)" />
            <org-button
              color="primary"
              size="sm"
              label="Toggle Select All"
              (click)="selectionStore.toggleSelectAll(users)"
            />
            <org-button
              color="secondary"
              size="sm"
              label="Select First User"
              (click)="selectionStore.select(users[0])"
            />
            <org-button
              color="secondary"
              size="sm"
              label="Select Users 2 &amp; 3"
              (click)="selectionStore.selectMultiple([users[1], users[2]])"
            />
            <org-button color="neutral" size="sm" label="Clear Selection" (click)="selectionStore.clear()" />
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DataSelectionDemo {
  protected readonly selectionStore = new DataSelectionStore<User>();
  protected readonly users: User[] = DEMO_USERS;
}

@Component({
  selector: 'story-data-selection-with-selection-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="With Existing Selection" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">State</div>
          <div class="flex flex-col gap-2">
            <div class="text-sm"><strong>Selected Count:</strong> {{ selectionStore.selectedCount() }}</div>
            <div class="text-sm"><strong>Has Selection:</strong> {{ selectionStore.hasSelection() }}</div>
            <div class="text-sm"><strong>Select All Enabled:</strong> {{ selectionStore.selectAllEnabled() }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Available Users</div>
          <div class="flex flex-col gap-1">
            @for (user of users; track user.id) {
              <button
                class="px-3 py-2 text-sm border rounded-sm cursor-pointer"
                [class.bg-info-soft]="selectionStore.isSelected(user)"
                (click)="selectionStore.toggle(user)"
              >
                {{ user.name }} ({{ user.email }})
              </button>
            }
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Actions</div>
          <div class="flex flex-wrap gap-2">
            <org-button color="neutral" size="sm" label="Clear" (click)="selectionStore.clear()" />
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DataSelectionWithSelectionDemo {
  protected readonly selectionStore = new DataSelectionStore<User>();
  protected readonly users: User[] = DEMO_USERS;

  constructor() {
    this.selectionStore.selectMultiple([DEMO_USERS[0], DEMO_USERS[2]]);
  }
}

@Component({
  selector: 'story-data-selection-all-selected-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="All Items Selected" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">State</div>
          <div class="flex flex-col gap-2">
            <div class="text-sm"><strong>Selected Count:</strong> {{ selectionStore.selectedCount() }}</div>
            <div class="text-sm"><strong>Has Selection:</strong> {{ selectionStore.hasSelection() }}</div>
            <div class="text-sm"><strong>Select All Enabled:</strong> {{ selectionStore.selectAllEnabled() }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Available Users</div>
          <div class="flex flex-col gap-1">
            @for (user of users; track user.id) {
              <button
                class="px-3 py-2 text-sm border rounded-sm cursor-pointer"
                [class.bg-info-soft]="selectionStore.isSelected(user)"
                (click)="selectionStore.toggle(user)"
              >
                {{ user.name }} ({{ user.email }})
              </button>
            }
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Actions</div>
          <div class="flex flex-wrap gap-2">
            <org-button
              color="primary"
              size="sm"
              label="Toggle Select All"
              (click)="selectionStore.toggleSelectAll(users)"
            />
            <org-button color="neutral" size="sm" label="Clear" (click)="selectionStore.clear()" />
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DataSelectionAllSelectedDemo {
  protected readonly selectionStore = new DataSelectionStore<User>();
  protected readonly users: User[] = DEMO_USERS;

  constructor() {
    this.selectionStore.selectAll(DEMO_USERS);
  }
}

@Component({
  selector: 'story-data-selection-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <div class="flex flex-col gap-2 p-4 border rounded-sm">
      <div class="text-sm font-bold">{{ panelLabel() }}</div>
      <div class="text-sm"><strong>Selected Count:</strong> {{ selectionStore.selectedCount() }}</div>
      <div class="flex flex-col gap-1">
        @for (user of users; track user.id) {
          <button
            class="px-3 py-2 text-sm border rounded-sm cursor-pointer"
            [class.bg-info-soft]="selectionStore.isSelected(user)"
            (click)="selectionStore.toggle(user)"
          >
            {{ user.name }}
          </button>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        <org-button color="primary" size="sm" label="Select All" (click)="selectionStore.selectAll(users)" />
        <org-button color="neutral" size="sm" label="Clear" (click)="selectionStore.clear()" />
        <org-button color="secondary" size="sm" label="Set From Outside" (click)="setFromOutside()" />
      </div>
    </div>
  `,
})
class DataSelectionPanel {
  public readonly panelLabel = input<string>('Panel');
  protected readonly selectionStore = new DataSelectionStore<User>();
  protected readonly users: User[] = DEMO_USERS;

  /** demonstrates that selectedItems is now a public writable signal that can be written from outside the helper api */
  protected setFromOutside(): void {
    this.selectionStore.selectedItems.set(new Set<User>([DEMO_USERS[0], DEMO_USERS[1]]));
  }
}

@Component({
  selector: 'story-data-selection-multiple-instances-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataSelectionPanel, DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Multiple Independent Instances" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Two Independent Stores</div>
          <div class="flex flex-col gap-2">
            <div class="text-sm">
              Each panel below instantiates its own <code>DataSelectionStore</code> with
              <code>new DataSelectionStore&lt;User&gt;()</code>. Toggling a user in one panel does not affect the other.
            </div>
            <div class="flex flex-row gap-4">
              <story-data-selection-panel [panelLabel]="'Panel A'" />
              <story-data-selection-panel [panelLabel]="'Panel B'" />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">External Writes via Public Signal</div>
          <div class="text-sm">
            Each panel's <strong>Set From Outside</strong> button calls
            <code>store.selectedItems.set(new Set([...]))</code> directly on the public writable <code>signal()</code>,
            bypassing the helper methods. The resulting <code>Set&lt;T&gt;</code> value is what a consuming component's
            <code>model&lt;Set&lt;T&gt;&gt;()</code> accepts, so the store can be plumbed into two-way bound components
            via <code>[value]="store.selectedItems()"</code> /
            <code>(valueChange)="store.selectedItems.set($event)"</code>.
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DataSelectionMultipleInstancesDemo {}

const meta: Meta<DataSelectionStore<unknown>> = {
  title: 'Core/Services/Data Selection Store',
  component: DataSelectionStore,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## DataSelectionStore

  A generic signal-based state container for handling data selection in Angular applications, particularly useful for paginated tables and lists. The store is a plain class — instantiate it directly with \`new DataSelectionStore<T>()\` and own it as a class field on the component that should hold the state.

  ### Features
  - Generic type support for any data type
  - Signal-based reactive state management
  - Immutable state updates
  - Single and multiple item selection
  - Select all / clear functionality
  - Toggle selection support
  - Computed properties for reactive consumption
  - Public \`selectedItems\` exposed as a writable \`signal()\` so the selection set can be written from outside or wired into another component's \`model<Set<T>>()\` for two-way coordination (\`model()\` itself cannot live on the store class because Angular restricts \`model()\` to \`@Component\` / \`@Directive\` classes)

  ### State Properties
  - **selectedItems**: Public writable \`signal<Set<T>>()\` of currently selected items (writable from outside via \`set()\` / \`update()\`)
  - **selectedItemsArray**: Array of currently selected items
  - **selectedCount**: Number of selected items
  - **selectAllEnabled**: Boolean indicating if select all is enabled
  - **hasSelection**: Boolean indicating if any items are selected

  ### Methods
  - **isSelected(item)**: Check if an item is selected
  - **select(item)**: Select a single item
  - **deselect(item)**: Deselect a single item
  - **toggle(item)**: Toggle selection of a single item
  - **selectMultiple(items)**: Select multiple items
  - **deselectMultiple(items)**: Deselect multiple items
  - **selectAll(items)**: Select all items and set selectAllEnabled to true
  - **clear()**: Clear all selections and reset selectAllEnabled
  - **toggleSelectAll(items)**: Toggle select all state
  - **replaceSelection(items)**: Replace current selection with new items

  ### Usage

  #### Owning the store on a component
  \`\`\`typescript
  import { Component } from '@angular/core';
  import { DataSelectionStore } from '@org/shared-ui';

  type User = {
    id: number;
    name: string;
  };

  @Component({
    selector: 'app-user-table',
    // ...
  })
  export class UserTableComponent {
    protected readonly selectionStore = new DataSelectionStore<User>();

    protected selectUser(user: User): void {
      this.selectionStore.select(user);
    }

    protected get selectedCount(): number {
      return this.selectionStore.selectedCount();
    }
  }
  \`\`\`

  #### Sharing the store with a child component
  When a parent owns the store and a child needs to read/write the same selection, pass the instance down via an \`input()\`:
  \`\`\`typescript
  // parent
  @Component({ /* ... */ })
  export class ParentComponent {
    protected readonly selectionStore = new DataSelectionStore<User>();
  }
  \`\`\`
  \`\`\`html
  <!-- parent template -->
  <app-selection-toolbar [selectionStore]="selectionStore" />
  \`\`\`
  \`\`\`typescript
  // child
  @Component({ /* ... */ })
  export class SelectionToolbar {
    public readonly selectionStore = input.required<DataSelectionStore<User>>();
  }
  \`\`\`

  #### Writing to selectedItems directly
  Because \`selectedItems\` is a public writable \`signal()\`, you can also push values into the store from outside the helper API:
  \`\`\`typescript
  this.selectionStore.selectedItems.set(new Set([user1, user2]));
  \`\`\`

  #### Wiring into a component's model()
  The signal's value (a \`Set<T>\`) is what a consuming component's \`model<Set<T>>()\` accepts, so you can bridge them with the standard input/output pair:
  \`\`\`html
  <some-selection-aware-component
    [selectedItems]="selectionStore.selectedItems()"
    (selectedItemsChange)="selectionStore.selectedItems.set($event)"
  />
  \`\`\`

  #### Multiple independent instances
  See the **MultipleInstances** story for an example of two child components that each instantiate their own \`DataSelectionStore\` and therefore maintain independent selection state.

  ### Integration with Paginated Tables
  This store is designed to work seamlessly with paginated tables. When the page changes, you can:
  - Keep selections across pages by maintaining the selected items
  - Clear selections when changing pages using \`clear()\`
  - Use \`selectAll()\` with current page items for page-level selection
  - Use \`replaceSelection()\` to replace selections when needed
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataSelectionStore<unknown>>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo of the DataSelectionStore service with User objects. Click users to toggle selection, or use the buttons to manage selections.',
      },
    },
  },
  render: () => ({
    template: `<story-data-selection-demo />`,
    moduleMetadata: {
      imports: [DataSelectionDemo],
    },
  }),
};

export const WithExistingSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Store initialized with a partial selection (users 1 and 3 pre-selected). Demonstrates hasSelection and selectAllEnabled being independent.',
      },
    },
  },
  render: () => ({
    template: `<story-data-selection-with-selection-demo />`,
    moduleMetadata: {
      imports: [DataSelectionWithSelectionDemo],
    },
  }),
};

export const AllSelected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Store initialized via selectAll(), demonstrating selectAllEnabled being true. Deselecting any individual item resets selectAllEnabled to false.',
      },
    },
  },
  render: () => ({
    template: `<story-data-selection-all-selected-demo />`,
    moduleMetadata: {
      imports: [DataSelectionAllSelectedDemo],
    },
  }),
};

export const MultipleInstances: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two child components each instantiate their own DataSelectionStore via `new DataSelectionStore<User>()`, producing independent selection state per panel. Each panel also includes a 'Set From Outside' button that calls `store.selectedItems.set(...)` directly on the public writable signal, demonstrating that the selection set can be driven from outside the store's helper API (the foundation for wiring it into another component's `model<Set<T>>()`).",
      },
    },
  },
  render: () => ({
    template: `<story-data-selection-multiple-instances-demo />`,
    moduleMetadata: {
      imports: [DataSelectionMultipleInstancesDemo],
    },
  }),
};
