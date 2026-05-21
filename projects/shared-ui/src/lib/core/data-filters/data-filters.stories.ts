import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Table } from '../table/table';
import { TableCell } from '../table/table-cell';
import { TableHeader } from '../table/table-header';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';
import { DataFilters } from './data-filters';
import type { DataFilter, DataFiltersValue } from './data-filters-types';

type ShowcaseUserRow = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: 'admin' | 'editor' | 'viewer';
};

const SHOWCASE_USERS: ShowcaseUserRow[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', isActive: true, role: 'admin' },
  { id: '2', name: 'Bjarne Stroustrup', email: 'bjarne@example.com', isActive: true, role: 'editor' },
  { id: '3', name: 'Clara Schumann', email: 'clara@example.com', isActive: false, role: 'viewer' },
  { id: '4', name: 'Dennis Ritchie', email: 'dennis@example.com', isActive: true, role: 'admin' },
  { id: '5', name: 'Edsger Dijkstra', email: 'edsger@example.com', isActive: false, role: 'editor' },
  { id: '6', name: 'Frances Allen', email: 'frances@example.com', isActive: true, role: 'editor' },
  { id: '7', name: 'Grace Hopper', email: 'grace@example.com', isActive: true, role: 'admin' },
  { id: '8', name: 'Hedy Lamarr', email: 'hedy@example.com', isActive: false, role: 'viewer' },
  { id: '9', name: 'Ivan Sutherland', email: 'ivan@example.com', isActive: true, role: 'viewer' },
  { id: '10', name: 'Joan Clarke', email: 'joan@example.com', isActive: false, role: 'editor' },
  { id: '11', name: 'Ken Thompson', email: 'ken@example.com', isActive: true, role: 'admin' },
  { id: '12', name: 'Linus Torvalds', email: 'linus@example.com', isActive: true, role: 'viewer' },
];

const SHOWCASE_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const TEXT_ONLY_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'text', name: 'email', label: 'Email contains', defaultValue: '' },
];

const TOGGLE_ONLY_FILTERS: DataFilter[] = [
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  { type: 'toggle', name: 'isStarred', label: 'Starred only', defaultValue: false },
];

const ARRAY_ONLY_FILTERS: DataFilter[] = [
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const DISABLED_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: 'locked term', disabled: true },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: true, disabled: true },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: ['admin'],
    disabled: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
];

const READONLY_TEXT_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: 'frozen value', readonly: true },
];

const MIXED_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const LARGE_FILTER_LIST: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: '' },
  { type: 'text', name: 'email', label: 'Email', defaultValue: '' },
  { type: 'text', name: 'tag', label: 'Tag', defaultValue: '' },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: false },
  { type: 'toggle', name: 'isStarred', label: 'Starred only', defaultValue: false },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: [],
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const ALL_DISABLED_FILTERS: DataFilter[] = [
  { type: 'text', name: 'search', label: 'Search', defaultValue: 'pinned term', disabled: true },
  { type: 'text', name: 'email', label: 'Email', defaultValue: 'user@example.com', disabled: true },
  { type: 'toggle', name: 'isActive', label: 'Active only', defaultValue: true, disabled: true },
  { type: 'toggle', name: 'isStarred', label: 'Starred only', defaultValue: false, disabled: true },
  {
    type: 'array',
    name: 'role',
    label: 'Role',
    defaultValue: ['admin'],
    disabled: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const filterNames = (filters: DataFilter[]): string[] => filters.map((filter) => filter.name);

@Component({
  selector: 'story-data-filters-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DesignSystemDemo, DesignSystemDemoHeader, DesignSystemDemoCanvas, DataFilters],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .last-event,
      .active-list {
        font-family: var(--font-mono);
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
        background: var(--surface-subtle-color);
        border: 1px solid var(--border-default-color);
        border-radius: var(--radius-base);
        white-space: pre;
        overflow: auto;
      }
    `,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header
        slot="header"
        title="Live demo"
        description="Three filter types — text (debounced 250 ms), toggle (immediate), array combobox (immediate). Add and remove filters with the Add Filter menu and per-row X button; the emitted payload only includes active filters."
      />
      <org-design-system-demo-canvas slot="canvas">
        <div class="canvas-stage">
          <org-data-filters
            [availableFilters]="availableFilters"
            [(activeFilters)]="activeFilters"
            (filtersChanged)="onFiltersChanged($event)"
          />
          <div>
            <div class="text-sm font-semibold mb-1">Active filters (model)</div>
            <div class="active-list">{{ formattedActiveFilters() }}</div>
          </div>
          <div>
            <div class="text-sm font-semibold mb-1">Last emitted payload</div>
            <div class="last-event">{{ formattedLastEvent() }}</div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
  `,
})
class DataFiltersLiveDemoStory {
  protected readonly availableFilters = MIXED_FILTERS;

  protected readonly activeFilters = signal<string[]>(filterNames(MIXED_FILTERS));

  protected readonly lastEvent = signal<DataFiltersValue | null>(null);

  protected readonly formattedLastEvent = computed<string>(() => {
    const value = this.lastEvent();

    if (!value) {
      return 'No events yet — change a filter above to see the payload.';
    }

    return JSON.stringify(value, null, 2);
  });

  protected readonly formattedActiveFilters = computed<string>(() => JSON.stringify(this.activeFilters(), null, 2));

  protected onFiltersChanged(value: DataFiltersValue): void {
    this.lastEvent.set(value);
  }
}

@Component({
  selector: 'story-data-filters-table-integration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataFilters, Table, TableHeader, TableCell, TypedContextDirective],
  styles: [
    `
      :host {
        display: block;
      }
      .stage {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
    `,
  ],
  template: `
    <div class="stage">
      <org-data-filters
        [availableFilters]="availableFilters"
        [(activeFilters)]="activeFilters"
        (filtersChanged)="onFiltersChanged($event)"
      />
      <org-table [data]="filteredRows()">
        <ng-template #header>
          <org-table-th>Name</org-table-th>
          <org-table-th>Email</org-table-th>
          <org-table-th>Role</org-table-th>
          <org-table-th>Active</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="filteredRows()" #body let-row>
          <org-table-td>{{ row.name }}</org-table-td>
          <org-table-td [muted]="true">{{ row.email }}</org-table-td>
          <org-table-td>{{ row.role }}</org-table-td>
          <org-table-td>{{ row.isActive ? 'Yes' : 'No' }}</org-table-td>
        </ng-template>
        <ng-template #empty>No matching users.</ng-template>
      </org-table>
    </div>
  `,
})
class DataFiltersTableIntegrationStory {
  protected readonly availableFilters = SHOWCASE_FILTERS;

  protected readonly activeFilters = signal<string[]>(filterNames(SHOWCASE_FILTERS));

  private readonly _rows = signal<ShowcaseUserRow[]>(SHOWCASE_USERS);

  private readonly _filterValues = signal<DataFiltersValue>({
    search: '',
    isActive: false,
    role: [],
  });

  protected readonly filteredRows = computed<ShowcaseUserRow[]>(() => {
    const rows = this._rows();
    const values = this._filterValues();
    const search = String(values['search'] ?? '')
      .trim()
      .toLowerCase();
    const activeOnly = Boolean(values['isActive']);
    const roles = (values['role'] ?? []) as (string | number)[];

    return rows.filter((row) => {
      if (search && !row.name.toLowerCase().includes(search) && !row.email.toLowerCase().includes(search)) {
        return false;
      }

      if (activeOnly && !row.isActive) {
        return false;
      }

      if (roles.length > 0 && !roles.includes(row.role)) {
        return false;
      }

      return true;
    });
  });

  protected onFiltersChanged(values: DataFiltersValue): void {
    this._filterValues.set(values);
  }
}

@Component({
  selector: 'story-data-filters-add-remove',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataFilters],
  styles: [
    `
      :host {
        display: block;
      }
      .stage {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .active-list {
        font-family: var(--font-mono);
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
        background: var(--surface-subtle-color);
        border: 1px solid var(--border-default-color);
        border-radius: var(--radius-base);
        white-space: pre;
        overflow: auto;
      }
    `,
  ],
  template: `
    <div class="stage">
      <org-data-filters [availableFilters]="availableFilters" [(activeFilters)]="activeFilters" />
      <div>
        <div class="text-sm font-semibold mb-1">Active filters</div>
        <div class="active-list">{{ formattedActiveFilters() }}</div>
      </div>
    </div>
  `,
})
class DataFiltersAddRemoveStory {
  protected readonly availableFilters = LARGE_FILTER_LIST;

  protected readonly activeFilters = signal<string[]>([]);

  protected readonly formattedActiveFilters = computed<string>(() => JSON.stringify(this.activeFilters(), null, 2));
}

@Component({
  selector: 'story-data-filters-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataFilters,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    DataFiltersTableIntegrationStory,
    DataFiltersAddRemoveStory,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .height-constrained {
        max-height: 14rem;
      }
    `,
  ],
  template: `
    <org-storybook-example-container>
      <org-storybook-example-container-section label="Text only">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Text only" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="textOnly" [activeFilters]="textOnlyActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Toggle only">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Toggle only" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="toggleOnly" [activeFilters]="toggleOnlyActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Array only">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Array only" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="arrayOnly" [activeFilters]="arrayOnlyActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Mixed">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Mixed (all three types)" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="mixed" [activeFilters]="mixedActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Empty state">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Empty active filters"
            description="availableFilters is populated but activeFilters is empty — only the Add Filter trigger renders, and its overlay menu lists every available filter."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="largeList" [activeFilters]="emptyActiveList" />
          </org-design-system-demo-canvas>
          <org-design-system-demo-expected-behaviour>
            <ul class="list-inside list-disc flex flex-col gap-1">
              <li>No filter rows render and no payload is emitted on first display.</li>
              <li>
                The Add Filter button is the only interactive element and its overlay menu lists every available filter
                by label.
              </li>
              <li>
                Picking any item from the menu activates that filter — covered visually by the Add / Remove filters
                section below.
              </li>
            </ul>
          </org-design-system-demo-expected-behaviour>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Disabled state">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Disabled state per type" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="disabled" [activeFilters]="disabledActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="All filters disabled">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Every available filter disabled simultaneously"
            description="Each filter sets disabled=true; the X remove button and Add Filter trigger remain interactive because disabled is forwarded to the underlying input only."
          />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="allDisabled" [activeFilters]="allDisabledActive" />
          </org-design-system-demo-canvas>
          <org-design-system-demo-expected-behaviour>
            <ul class="list-inside list-disc flex flex-col gap-1">
              <li>
                Every text, toggle, and array input is rendered in its disabled visual state and ignores user input.
              </li>
              <li>disabled is a per-filter flag — the data-filters component itself has no global disabled input.</li>
              <li>
                The X remove buttons and the Add Filter trigger stay interactive, so the active set can still be mutated
                even when every active filter's input is disabled.
              </li>
            </ul>
          </org-design-system-demo-expected-behaviour>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Readonly text">
        <org-design-system-demo>
          <org-design-system-demo-header slot="header" title="Readonly text input" />
          <org-design-system-demo-canvas slot="canvas">
            <org-data-filters [availableFilters]="readonlyText" [activeFilters]="readonlyTextActive" />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Wrap behavior">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Large list in a height-constrained container"
            description="The form-fields container is capped to a fixed height so the flex column wraps into a second visual column."
          />
          <org-design-system-demo-canvas slot="canvas">
            <div class="height-constrained">
              <org-data-filters [availableFilters]="largeList" [activeFilters]="largeListActive" />
            </div>
          </org-design-system-demo-canvas>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Add / Remove filters">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Active filters model with add + remove"
            description="Starts with no active filters. Use the Add Filter menu to add filters one at a time; click the X next to a filter to remove it. The active-filters model panel below the form reflects the two-way state."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-data-filters-add-remove />
          </org-design-system-demo-canvas>
          <org-design-system-demo-expected-behaviour>
            <ul class="list-inside list-disc flex flex-col gap-1">
              <li>On load the filter bar is empty and the Add Filter menu lists every available filter by label.</li>
              <li>
                Clicking a menu item renders the matching input with its default value and removes it from the menu.
              </li>
              <li>Clicking the X next to a filter removes the input and the name re-appears in the menu.</li>
              <li>When every available filter is active the Add Filter button disappears.</li>
              <li>Adding or removing a filter resets all rendered filters to their default values.</li>
            </ul>
          </org-design-system-demo-expected-behaviour>
        </org-design-system-demo>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Integration with org-table">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Integration with org-table"
            description="Filter changes drive a computed signal that filters the table data input."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-data-filters-table-integration />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Typing in the search field filters the table after ~250 ms.</li>
            <li>Toggling <strong>Active only</strong> immediately removes inactive rows.</li>
            <li>Selecting one or more roles immediately narrows the table; clearing restores all rows.</li>
            <li>An empty result set renders the <code>#empty</code> template.</li>
            <li>Removing a filter via its X resets that filter's contribution and the table updates accordingly.</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class DataFiltersShowcaseStory {
  protected readonly textOnly = TEXT_ONLY_FILTERS;
  protected readonly textOnlyActive = filterNames(TEXT_ONLY_FILTERS);
  protected readonly toggleOnly = TOGGLE_ONLY_FILTERS;
  protected readonly toggleOnlyActive = filterNames(TOGGLE_ONLY_FILTERS);
  protected readonly arrayOnly = ARRAY_ONLY_FILTERS;
  protected readonly arrayOnlyActive = filterNames(ARRAY_ONLY_FILTERS);
  protected readonly mixed = MIXED_FILTERS;
  protected readonly mixedActive = filterNames(MIXED_FILTERS);
  protected readonly disabled = DISABLED_FILTERS;
  protected readonly disabledActive = filterNames(DISABLED_FILTERS);
  protected readonly allDisabled = ALL_DISABLED_FILTERS;
  protected readonly allDisabledActive = filterNames(ALL_DISABLED_FILTERS);
  protected readonly readonlyText = READONLY_TEXT_FILTERS;
  protected readonly readonlyTextActive = filterNames(READONLY_TEXT_FILTERS);
  protected readonly largeList = LARGE_FILTER_LIST;
  protected readonly largeListActive = filterNames(LARGE_FILTER_LIST);
  protected readonly emptyActiveList: string[] = [];
}

const meta: Meta<DataFilters> = {
  title: 'Core/Components/DataFilters',
  component: DataFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## DataFilters Component

  Declarative filter bar that renders a form input per active filter and emits a flat record of the active filters' values whenever any filter changes.

  ### Features
  - Three filter types: text (org-input), toggle (org-checkbox-toggle), array (org-combobox multi-select)
  - Discriminated-union DataFilter type ensures the right defaultValue shape per type at compile time
  - Active filters are controlled via a two-way \`activeFilters\` model; only those filters are rendered and emitted
  - Per-row X button removes the filter from the active set; an Add Filter overlay menu lets the user re-add any inactive filter
  - Self-contained internal reactive form — the parent only consumes the filtersChanged output
  - Text filters are debounced 250 ms; toggle and array filters emit immediately
  - Duplicate payloads are filtered out via distinctUntilChanged
  - Wrapping into multiple visual columns is supported when the host height is constrained
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataFilters>;

export const Default: Story = {
  args: {
    availableFilters: MIXED_FILTERS,
    activeFilters: filterNames(MIXED_FILTERS),
  },
  argTypes: {
    availableFilters: {
      control: 'object',
      description:
        'Array of filter definitions; each entry renders an input matched by `type` when its name is in `activeFilters`.',
    },
    activeFilters: {
      control: 'object',
      description: 'Names of filters to render. Two-way model — defaults to an empty array (no filters shown).',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default filter bar with one of each filter type. Use the controls panel below to edit the filters array shape and the active filter names.',
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<org-data-filters [availableFilters]="availableFilters" [activeFilters]="activeFilters" />`,
    moduleMetadata: {
      imports: [DataFilters],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Live demo with all three filter types. Change any input and watch the emitted payload appear in the panel below the form. Use the Add Filter menu and per-row X button to add/remove filters and observe the active-filters model update.',
      },
    },
  },
  render: () => ({
    template: `<story-data-filters-live-demo />`,
    moduleMetadata: {
      imports: [DataFiltersLiveDemoStory],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase covering every filter type, disabled and readonly states, wrap behavior under a height cap, add/remove via the active filters model, and end-to-end integration with `org-table`.',
      },
    },
  },
  render: () => ({
    template: `<story-data-filters-showcase />`,
    moduleMetadata: {
      imports: [DataFiltersShowcaseStory],
    },
  }),
};
