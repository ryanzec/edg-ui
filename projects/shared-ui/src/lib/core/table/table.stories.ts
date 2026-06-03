import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Table, allTableSizes, TableSize } from './table';
import { TableHeader } from './table-header';
import { TableCell } from './table-cell';
import { TableActionsDirective } from './table-actions-directive';
import { ButtonToggle, ButtonToggleItem } from '../button-toggle/button-toggle';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { SortableDirective } from '../sortable-directive/sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';
import { Pagination } from '../pagination/pagination';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import { Button } from '../button/button';
import { Tag } from '../tags/tag';
import { Avatar } from '../avatar/avatar';
import { Link } from '../link/link';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoControlGroup } from '../../example/design-system-demo/design-system-demo-control-group';
import { DesignSystemDemoControls } from '../../example/design-system-demo/design-system-demo-controls';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';

type User = {
  id: string;
  name: string;
  owner: string;
  status: 'active' | 'in-review' | 'draft' | 'blocked';
  updated: string;
  records: number;
};

const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Aurora — Mobile redesign', owner: 'P. Shah', status: 'active', updated: '2h ago', records: 1204 },
  { id: '2', name: 'Beacon — Billing v2', owner: 'D. Nakamura', status: 'in-review', updated: '5h ago', records: 342 },
  { id: '3', name: 'Cinder — Internal docs', owner: 'L. Wexler', status: 'draft', updated: '1d ago', records: 87 },
  { id: '4', name: 'Drift — Onboarding flow', owner: 'M. Ali', status: 'blocked', updated: '2d ago', records: 512 },
  {
    id: '5',
    name: 'Ember — Pricing experiments',
    owner: 'R. Aoki',
    status: 'active',
    updated: '14m ago',
    records: 2098,
  },
  { id: '6', name: 'Foundry — Compliance v3', owner: 'K. Quinn', status: 'in-review', updated: '4d ago', records: 124 },
  { id: '7', name: 'Gravity — Search index', owner: 'T. Park', status: 'active', updated: '6h ago', records: 904 },
  { id: '8', name: 'Hearth — Settings refresh', owner: 'V. Chen', status: 'draft', updated: '3d ago', records: 56 },
];

const STATUS_TAG_COLOR: Record<User['status'], 'safe' | 'info' | 'neutral' | 'warning'> = {
  active: 'safe',
  'in-review': 'info',
  draft: 'neutral',
  blocked: 'warning',
};

const STATUS_LABEL: Record<User['status'], string> = {
  active: 'Active',
  'in-review': 'In review',
  draft: 'Draft',
  blocked: 'Blocked',
};

type LiveDemoState = 'default' | 'loading' | 'loading-overlay' | 'empty';

const allLiveDemoStates = [
  'default',
  'loading',
  'loading-overlay',
  'empty',
] as const satisfies readonly LiveDemoState[];

const liveDemoSizeItems: ButtonToggleItem[] = allTableSizes.map((size) => ({
  label: size,
  value: size,
  buttonColor: 'primary',
}));

const liveDemoStateItems: ButtonToggleItem[] = allLiveDemoStates.map((state) => ({
  label: state === 'loading-overlay' ? 'loading + overlay' : state,
  value: state,
  buttonColor: 'primary',
}));

@Component({
  selector: 'story-table-live-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Table,
    TableHeader,
    TableCell,
    SortableDirective,
    TableActionsDirective,
    TypedContextDirective,
    Button,
    ButtonToggle,
    CheckboxToggle,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoControls,
    DesignSystemDemoControlGroup,
    DesignSystemDemoCanvas,
  ],
  providers: [SortingStore],
  styles: [
    `
      :host {
        display: block;
      }
      .canvas-stage {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
    `,
  ],
  template: `
    <form [formGroup]="liveDemoForm">
      <org-design-system-demo>
        <org-design-system-demo-header
          slot="header"
          title="Live demo"
          description="Toggle the modifiers. Density swaps the row min-height and cell padding scale; striping, hover, selectable rows, sortable headers, the sticky first column, the sticky header, and a trailing row-actions cell guarded by [orgTableActions] are independent flags that compose freely."
        />
        <org-design-system-demo-controls slot="controls">
          <org-design-system-demo-control-group label="Size">
            <org-button-toggle [items]="sizeItems" formControlName="size" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="State">
            <org-button-toggle [items]="stateItems" formControlName="state" buttonSize="sm" />
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Striped">
            <org-checkbox-toggle name="live-demo-striped" value="striped" formControlName="striped">
              {{ liveDemoForm.controls.striped.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Hover">
            <org-checkbox-toggle name="live-demo-hover" value="hover" formControlName="hover">
              {{ liveDemoForm.controls.hover.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Selectable rows">
            <org-checkbox-toggle name="live-demo-selectable" value="selectable" formControlName="selectable">
              {{ liveDemoForm.controls.selectable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Expandable rows">
            <org-checkbox-toggle name="live-demo-expandable" value="expandable" formControlName="expandable">
              {{ liveDemoForm.controls.expandable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Clickable rows">
            <org-checkbox-toggle name="live-demo-clickable" value="clickable" formControlName="clickable">
              {{ liveDemoForm.controls.clickable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Sortable">
            <org-checkbox-toggle name="live-demo-sortable" value="sortable" formControlName="sortable">
              {{ liveDemoForm.controls.sortable.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Sticky 1st col">
            <org-checkbox-toggle name="live-demo-sticky-first" value="sticky-first" formControlName="stickyFirstColumn">
              {{ liveDemoForm.controls.stickyFirstColumn.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Sticky header">
            <org-checkbox-toggle name="live-demo-sticky-header" value="sticky-header" formControlName="stickyHeader">
              {{ liveDemoForm.controls.stickyHeader.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
          <org-design-system-demo-control-group label="Row actions">
            <org-checkbox-toggle name="live-demo-row-actions" value="row-actions" formControlName="rowActions">
              {{ liveDemoForm.controls.rowActions.value ? 'on' : 'off' }}
            </org-checkbox-toggle>
          </org-design-system-demo-control-group>
        </org-design-system-demo-controls>
        <org-design-system-demo-canvas slot="canvas">
          <div class="canvas-stage">
            <org-table
              [data]="data()"
              [size]="liveDemoForm.controls.size.value!"
              [striped]="liveDemoForm.controls.striped.value!"
              [hover]="liveDemoForm.controls.hover.value!"
              [stickyFirstColumn]="liveDemoForm.controls.stickyFirstColumn.value!"
              [stickyHeader]="liveDemoForm.controls.stickyHeader.value!"
              [selectionData]="selectionDataValue()"
              [expandedData]="expandedDataValue()"
              [rowsClickable]="liveDemoForm.controls.clickable.value"
              [isLoading]="isLoading()"
              [isBackgroundLoading]="isBackgroundLoading()"
              [style.maxHeight]="'18rem'"
            >
              <ng-template #header>
                <org-table-th>
                  @if (liveDemoForm.controls.sortable.value) {
                    <div [orgSortableKey]="'name'">Project</div>
                  } @else {
                    Project
                  }
                </org-table-th>
                <org-table-th>
                  @if (liveDemoForm.controls.sortable.value) {
                    <div [orgSortableKey]="'owner'">Owner</div>
                  } @else {
                    Owner
                  }
                </org-table-th>
                <org-table-th>
                  @if (liveDemoForm.controls.sortable.value) {
                    <div [orgSortableKey]="'updated'">Updated</div>
                  } @else {
                    Updated
                  }
                </org-table-th>
                <org-table-th [numeric]="true">
                  @if (liveDemoForm.controls.sortable.value) {
                    <div [orgSortableKey]="'records'">Records</div>
                  } @else {
                    Records
                  }
                </org-table-th>
                @if (liveDemoForm.controls.rowActions.value) {
                  <org-table-th>Actions</org-table-th>
                }
              </ng-template>
              <ng-template #empty>
                No projects match the current filter. Try a different status, or reset filters.
              </ng-template>
              <ng-template [orgTypedContext]="data()" #body let-user>
                <org-table-td>{{ user.name }}</org-table-td>
                <org-table-td [muted]="true">{{ user.owner }}</org-table-td>
                <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
                <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
                @if (liveDemoForm.controls.rowActions.value) {
                  <org-table-td>
                    <org-button
                      orgTableActions
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      [iconOnly]="true"
                      preIcon="ellipsis"
                      label="Row actions"
                    />
                  </org-table-td>
                }
              </ng-template>
              <ng-template [orgTypedContext]="data()" #expanded let-user>
                <div class="p-3 flex flex-col gap-1 text-sm">
                  <div><span class="font-semibold">Project id:</span> {{ user.id }}</div>
                  <div><span class="font-semibold">Status:</span> {{ user.status }}</div>
                  <div>
                    <span class="font-semibold">Notes:</span>
                    Expanded details panel — click the row again to collapse.
                  </div>
                </div>
              </ng-template>
            </org-table>
          </div>
        </org-design-system-demo-canvas>
      </org-design-system-demo>
    </form>
  `,
})
class TableLiveDemo {
  protected readonly sizeItems = liveDemoSizeItems;
  protected readonly stateItems = liveDemoStateItems;

  protected readonly liveDemoForm = new FormGroup({
    size: new FormControl<TableSize>('base', { nonNullable: true }),
    state: new FormControl<LiveDemoState>('default', { nonNullable: true }),
    striped: new FormControl<boolean>(false, { nonNullable: true }),
    hover: new FormControl<boolean>(true, { nonNullable: true }),
    selectable: new FormControl<boolean>(false, { nonNullable: true }),
    expandable: new FormControl<boolean>(false, { nonNullable: true }),
    clickable: new FormControl<boolean>(false, { nonNullable: true }),
    sortable: new FormControl<boolean>(false, { nonNullable: true }),
    stickyFirstColumn: new FormControl<boolean>(false, { nonNullable: true }),
    stickyHeader: new FormControl<boolean>(false, { nonNullable: true }),
    rowActions: new FormControl<boolean>(false, { nonNullable: true }),
  });

  protected readonly selectionStore = new DataSelectionStore<User>();
  protected readonly expansionStore = new DataSelectionStore<User>();

  private readonly _stateValue = signal<LiveDemoState>('default');
  private readonly _selectableValue = signal<boolean>(false);
  private readonly _expandableValue = signal<boolean>(false);

  protected readonly data = computed<User[]>(() => (this._stateValue() === 'empty' ? [] : SAMPLE_USERS));

  protected readonly isLoading = computed<boolean>(() => this._stateValue() === 'loading');

  protected readonly isBackgroundLoading = computed<boolean>(() => this._stateValue() === 'loading-overlay');

  protected readonly selectionDataValue = computed<DataSelectionStore<User> | undefined>(() =>
    this._selectableValue() ? this.selectionStore : undefined
  );

  protected readonly expandedDataValue = computed<DataSelectionStore<User> | undefined>(() =>
    this._expandableValue() ? this.expansionStore : undefined
  );

  constructor() {
    this.liveDemoForm.controls.state.valueChanges.subscribe((value) => this._stateValue.set(value!));
    this.liveDemoForm.controls.selectable.valueChanges.subscribe((value) => this._selectableValue.set(value!));
    this.liveDemoForm.controls.expandable.valueChanges.subscribe((value) => this._expandableValue.set(value!));
  }
}

@Component({
  selector: 'story-table-anatomy-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Tag, TypedContextDirective],
  template: `
    <org-table [data]="users" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Status</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td>
          <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
        </org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableAnatomyDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 3);

  protected statusColor(status: User['status']): 'safe' | 'info' | 'neutral' | 'warning' {
    return STATUS_TAG_COLOR[status];
  }

  protected statusLabel(status: User['status']): string {
    return STATUS_LABEL[status];
  }
}

@Component({
  selector: 'story-table-sizes-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ],
  template: `
    <org-table [data]="smallUsers" size="sm" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="smallUsers" #body let-user>
        <org-table-td>{{ user.shortName }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
    <org-table [data]="baseUsers" size="base" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="baseUsers" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
    <org-table [data]="largeUsers" size="lg" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="largeUsers" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableSizesDemo {
  protected readonly smallUsers = SAMPLE_USERS.slice(0, 4).map((user) => ({
    ...user,
    shortName: user.name.split(' — ')[0],
  }));
  protected readonly baseUsers = SAMPLE_USERS.slice(0, 4);
  protected readonly largeUsers = SAMPLE_USERS.slice(0, 3);
}

@Component({
  selector: 'story-table-row-states-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Tag, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ],
  template: `
    <org-table [data]="users" [selectionData]="selectionStore" [hover]="true">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Status</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td>
          <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
        </org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
    <org-table [data]="regions" [striped]="true" [hover]="false">
      <ng-template #header>
        <org-table-th>Region</org-table-th>
        <org-table-th>Plan</org-table-th>
        <org-table-th [numeric]="true">Seats</org-table-th>
        <org-table-th [numeric]="true">MRR</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="regions" #body let-region>
        <org-table-td>{{ region.name }}</org-table-td>
        <org-table-td>{{ region.plan }}</org-table-td>
        <org-table-td [numeric]="true">{{ region.seats }}</org-table-td>
        <org-table-td [numeric]="true">{{ region.mrrLabel }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableRowStatesDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 4);
  protected readonly selectionStore = new DataSelectionStore<User>();

  protected readonly regions = [
    { id: 'na', name: 'North America', plan: 'Enterprise', seats: 2140, mrrLabel: '$184,200' },
    { id: 'emea', name: 'EMEA', plan: 'Enterprise', seats: 1802, mrrLabel: '$148,910' },
    { id: 'apac', name: 'APAC', plan: 'Team', seats: 920, mrrLabel: '$56,400' },
    { id: 'latam', name: 'LATAM', plan: 'Team', seats: 412, mrrLabel: '$22,140' },
    { id: 'other', name: 'Other', plan: 'Free', seats: 3019, mrrLabel: '$0' },
    { id: 'total', name: 'Total', plan: '', seats: 8293, mrrLabel: '$411,650' },
  ];

  constructor() {
    this.selectionStore.set(this.users[1], true);
  }

  protected statusColor(status: User['status']): 'safe' | 'info' | 'neutral' | 'warning' {
    return STATUS_TAG_COLOR[status];
  }

  protected statusLabel(status: User['status']): string {
    return STATUS_LABEL[status];
  }
}

@Component({
  selector: 'story-table-sortable-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, SortableDirective, TypedContextDirective],
  providers: [SortingStore],
  template: `
    <org-table [data]="sortedUsers()" [hover]="false">
      <ng-template #header>
        <org-table-th>
          <div [orgSortableKey]="'name'">Project</div>
        </org-table-th>
        <org-table-th>
          <div [orgSortableKey]="'owner'">Owner</div>
        </org-table-th>
        <org-table-th>
          <div [orgSortableKey]="'updated'">Updated</div>
        </org-table-th>
        <org-table-th [numeric]="true">
          <div [orgSortableKey]="'records'">Records</div>
        </org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="sortedUsers()" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableSortableDemo {
  protected readonly sortingStore = inject(SortingStore);

  private readonly _users = SAMPLE_USERS.slice(0, 5);

  protected readonly sortedUsers = computed<User[]>(() => {
    const key = this.sortingStore.key();
    const direction = this.sortingStore.direction();

    if (!key || !direction) {
      return this._users;
    }

    const sorted = [...this._users];

    sorted.sort((a, b) => {
      const aValue = (a as unknown as Record<string, unknown>)[key];
      const bValue = (b as unknown as Record<string, unknown>)[key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);

      return direction === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
    });

    return sorted;
  });
}

type WideUser = User & {
  region: string;
  created: string;
  lastDeploy: string;
  members: number;
  storage: number;
};

@Component({
  selector: 'story-table-sticky-first-column-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Tag, TypedContextDirective],
  template: `
    <org-table [data]="users" [stickyFirstColumn]="true" [hover]="false" [style]="{ maxWidth: '38rem' }">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Region</org-table-th>
        <org-table-th>Status</org-table-th>
        <org-table-th>Created</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th>Last deploy</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
        <org-table-th [numeric]="true">Members</org-table-th>
        <org-table-th [numeric]="true">Storage (GB)</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td>{{ user.region }}</org-table-td>
        <org-table-td>
          <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
        </org-table-td>
        <org-table-td [faint]="true">{{ user.created }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [faint]="true">{{ user.lastDeploy }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.members }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.storage }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableStickyFirstColumnDemo {
  protected readonly users: WideUser[] = SAMPLE_USERS.slice(0, 5).map((user, index) => ({
    ...user,
    region: ['NA', 'EMEA', 'NA', 'APAC', 'EMEA'][index] ?? 'NA',
    created: ['Mar 12, 2025', 'Jan 04, 2025', 'Feb 21, 2025', 'Mar 30, 2025', 'Apr 11, 2025'][index] ?? '—',
    lastDeploy: ['12m ago', '3d ago', '—', '8d ago', '14m ago'][index] ?? '—',
    members: [8, 5, 3, 4, 12][index] ?? 0,
    storage: [14.2, 3.8, 0.4, 2.1, 22.8][index] ?? 0,
  }));

  protected statusColor(status: User['status']): 'safe' | 'info' | 'neutral' | 'warning' {
    return STATUS_TAG_COLOR[status];
  }

  protected statusLabel(status: User['status']): string {
    return STATUS_LABEL[status];
  }
}

@Component({
  selector: 'story-table-loading-empty-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ],
  template: `
    <org-table [data]="loadingUsers" [isLoading]="true" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="loadingUsers" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
    <org-table [data]="emptyUsers" [hover]="false">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template #empty>
        No projects match the current filter. Try a different status, or reset filters.
      </ng-template>
      <ng-template [orgTypedContext]="emptyUsers" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class TableLoadingEmptyDemo {
  protected readonly loadingUsers = SAMPLE_USERS.slice(0, 4);
  protected readonly emptyUsers: User[] = [];
}

@Component({
  selector: 'story-table-expandable-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Tag, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .expanded-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 0;
      }
      .expanded-content .row {
        display: flex;
        gap: 0.5rem;
        font-size: 0.875rem;
      }
      .expanded-content .label {
        font-weight: 600;
        min-width: 6rem;
      }
      .demo-caption {
        font-size: 0.875rem;
        color: var(--color-fg-muted);
      }
    `,
  ],
  template: `
    <div>
      <div class="demo-caption">
        Expansion only — click a row to expand / collapse. Multiple rows can be open at once.
      </div>
      <org-table [data]="users" [expandedData]="expansionOnlyStore" [hover]="true">
        <ng-template #header>
          <org-table-th>Project</org-table-th>
          <org-table-th>Owner</org-table-th>
          <org-table-th>Status</org-table-th>
          <org-table-th [numeric]="true">Records</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.owner }}</org-table-td>
          <org-table-td>
            <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
          </org-table-td>
          <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
        </ng-template>
        <ng-template [orgTypedContext]="users" #expanded let-user>
          <div class="expanded-content">
            <div class="row">
              <span class="label">Project id</span><span>{{ user.id }}</span>
            </div>
            <div class="row">
              <span class="label">Updated</span><span>{{ user.updated }}</span>
            </div>
            <div class="row">
              <span class="label">Notes</span><span>Click the row again to collapse this section.</span>
            </div>
          </div>
        </ng-template>
      </org-table>
    </div>
    <div>
      <div class="demo-caption">
        Expansion + selection — selection lives on the checkbox column; the row body triggers expansion.
      </div>
      <org-table
        [data]="users"
        [selectionData]="selectionStore"
        [expandedData]="expansionWithSelectionStore"
        [hover]="true"
      >
        <ng-template #header>
          <org-table-th>Project</org-table-th>
          <org-table-th>Owner</org-table-th>
          <org-table-th>Status</org-table-th>
          <org-table-th [numeric]="true">Records</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="users" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.owner }}</org-table-td>
          <org-table-td>
            <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
          </org-table-td>
          <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
        </ng-template>
        <ng-template [orgTypedContext]="users" #expanded let-user>
          <div class="expanded-content">
            <div class="row">
              <span class="label">Project id</span><span>{{ user.id }}</span>
            </div>
            <div class="row">
              <span class="label">Updated</span><span>{{ user.updated }}</span>
            </div>
          </div>
        </ng-template>
      </org-table>
    </div>
  `,
})
class TableExpandableDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 4);
  protected readonly expansionOnlyStore = new DataSelectionStore<User>();
  protected readonly expansionWithSelectionStore = new DataSelectionStore<User>();
  protected readonly selectionStore = new DataSelectionStore<User>();

  constructor() {
    this.expansionOnlyStore.set(this.users[0], true);
    this.expansionOnlyStore.set(this.users[2], true);
  }

  protected statusColor(status: User['status']): 'safe' | 'info' | 'neutral' | 'warning' {
    return STATUS_TAG_COLOR[status];
  }

  protected statusLabel(status: User['status']): string {
    return STATUS_LABEL[status];
  }
}

@Component({
  selector: 'story-table-in-context-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, Tag, Avatar, Link, Pagination, Button, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
    `,
  ],
  template: `
    <org-table [data]="paginatedUsers()" [selectionData]="selectionStore" [hover]="true">
      <ng-template #selectedActions>
        <org-button label="Resend invite" preIcon="mail" />
        <org-button label="Restore" />
        <org-button color="danger" label="Delete" preIcon="trash" />
      </ng-template>
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Status</org-table-th>
        <org-table-th>Updated</org-table-th>
        <org-table-th [numeric]="true">Records</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="paginatedUsers()" #body let-user>
        <org-table-td>
          <org-link href="#">{{ user.name }}</org-link>
        </org-table-td>
        <org-table-td>
          <org-avatar size="sm" [label]="user.owner" [showLabel]="true" />
        </org-table-td>
        <org-table-td>
          <org-tag [color]="statusColor(user.status)" variant="soft">{{ statusLabel(user.status) }}</org-tag>
        </org-table-td>
        <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
        <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
      </ng-template>
    </org-table>
    <org-pagination
      [(currentPage)]="currentPage"
      [totalItems]="users.length"
      [(itemsPerPage)]="itemsPerPage"
      [itemsPerPageOptions]="[5, 10]"
    />
  `,
})
class TableInContextDemo {
  protected readonly selectionStore = new DataSelectionStore<User>();

  protected readonly users = SAMPLE_USERS;
  protected readonly currentPage = signal(1);
  protected readonly itemsPerPage = signal(5);

  protected readonly paginatedUsers = computed<User[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = Math.min(start + this.itemsPerPage(), this.users.length);

    return this.users.slice(start, end);
  });

  protected statusColor(status: User['status']): 'safe' | 'info' | 'neutral' | 'warning' {
    return STATUS_TAG_COLOR[status];
  }

  protected statusLabel(status: User['status']): string {
    return STATUS_LABEL[status];
  }
}

@Component({
  selector: 'story-table-row-actions-guard-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TableActionsDirective, Button, TypedContextDirective],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .readout {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
      }
      .readout-label {
        font-weight: 600;
        margin-right: 0.25rem;
      }
    `,
  ],
  template: `
    <org-table [data]="users" [hover]="true" [rowsClickable]="true" (rowClicked)="handleRowClicked($event)">
      <ng-template #header>
        <org-table-th>Project</org-table-th>
        <org-table-th>Owner</org-table-th>
        <org-table-th>Unguarded action</org-table-th>
        <org-table-th>Guarded action</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="users" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
        <org-table-td>{{ user.owner }}</org-table-td>
        <org-table-td>
          <org-button
            color="neutral"
            variant="ghost"
            size="sm"
            label="Edit"
            preIcon="pencil"
            (clicked)="handleUnguardedAction()"
          />
        </org-table-td>
        <org-table-td>
          <org-button
            orgTableActions
            color="neutral"
            variant="ghost"
            size="sm"
            label="Edit"
            preIcon="pencil"
            (clicked)="handleGuardedAction()"
          />
        </org-table-td>
      </ng-template>
    </org-table>
    <div class="readout">
      <div><span class="readout-label">Row clicks:</span>{{ rowClickedCount() }}</div>
      <div><span class="readout-label">Unguarded action clicks:</span>{{ unguardedActionCount() }}</div>
      <div><span class="readout-label">Guarded action clicks:</span>{{ guardedActionCount() }}</div>
    </div>
  `,
})
class TableRowActionsGuardDemo {
  protected readonly users = SAMPLE_USERS.slice(0, 3);

  protected readonly rowClickedCount = signal<number>(0);
  protected readonly unguardedActionCount = signal<number>(0);
  protected readonly guardedActionCount = signal<number>(0);

  protected handleRowClicked(_user: User): void {
    this.rowClickedCount.update((value) => value + 1);
  }

  protected handleUnguardedAction(): void {
    this.unguardedActionCount.update((value) => value + 1);
  }

  protected handleGuardedAction(): void {
    this.guardedActionCount.update((value) => value + 1);
  }
}

const meta: Meta<Table> = {
  title: 'Core/Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Table Component

  A real \`<table>\` element. Owns row rhythm, cell padding, the header shelf, hover/selected/striped tints, and an optional sticky first column.

  ### Features
  - Three size variants (\`sm\`, \`base\`, \`lg\`) tracking the same control ramp as Button and Input
  - Visual modifiers: \`bordered\`, \`striped\`, \`hover\`, \`stickyHeader\`, \`stickyFirstColumn\`, \`emphasizeFirst\`
  - Per-cell modifiers on \`<org-table-td>\` and \`<org-table-th>\`: \`numeric\`, \`muted\`, \`faint\`, \`selectColumn\`
  - Row state: selected (auto-driven by \`selectionData\`), expanded (auto-driven by \`expandedData\`), clickable, empty
  - Sortable headers via the existing \`[orgSortableKey]\` directive — the chevron + \`aria-sort\` are owned by the header
  - Auto-rendered selection column when a \`DataSelectionStore\` is supplied via \`selectionData\`
  - Per-row expanded section via a \`<ng-template #expanded>\` projected template + \`expandedData\` store; multiple rows can be open at once
  - Row click routing: when \`expandedData\` is set, a row click toggles expansion; else when \`selectionData\` is set, a row click toggles selection; else the \`(rowClicked)\` output fires
  - Loading state with \`<org-loading-blocker>\` overlay (\`isLoading\`) and a corner spinner for refreshes (\`isBackgroundLoading\`)
  - Empty-state row when \`data().length === 0\` and a \`<ng-template #empty>\` is provided
</div>
        `,
      },
    },
  },
};

export default meta;

// inputs forwarded via host directives (isLoading / isBackgroundLoading / selectionData / expandedData) are
// not visible to storybook's signal-input type extraction, so they are augmented onto the args type here.
type Story = StoryObj<
  Table & {
    isLoading: boolean;
    isBackgroundLoading: boolean;
    selectionData: DataSelectionStore<{ id: string }> | undefined;
    expandedData: DataSelectionStore<{ id: string }> | undefined;
  }
>;

export const Default: Story = {
  args: {
    data: SAMPLE_USERS.slice(0, 5),
    size: 'base',
    bordered: true,
    striped: false,
    hover: true,
    stickyHeader: true,
    stickyFirstColumn: false,
    emphasizeFirst: false,
    isLoading: false,
    isBackgroundLoading: false,
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data to display in the table',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'The size variant; controls row height, cell padding, and font size',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether the table draws its own top hairline + surface',
    },
    striped: {
      control: 'boolean',
      description: 'Whether even body rows are tinted with the lifted surface',
    },
    hover: {
      control: 'boolean',
      description: 'Whether body rows tint on hover',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Whether the auto-rendered header row is sticky to the top of the scroll viewport',
    },
    stickyFirstColumn: {
      control: 'boolean',
      description: 'Whether the first column is pinned during horizontal scroll',
    },
    emphasizeFirst: {
      control: 'boolean',
      description: 'Whether the first body cell of each row is rendered with the emphasized weight + tone',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows the loading-blocker overlay (e.g. initial data fetch)',
    },
    isBackgroundLoading: {
      control: 'boolean',
      description: 'Shows a small spinner in the top-right (e.g. background refresh)',
    },
    selectionData: {
      control: false,
      description: 'Optional DataSelectionStore that drives the selection column and selected actions bar',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <org-table
        [data]="data"
        [size]="size"
        [bordered]="bordered"
        [striped]="striped"
        [hover]="hover"
        [stickyHeader]="stickyHeader"
        [stickyFirstColumn]="stickyFirstColumn"
        [emphasizeFirst]="emphasizeFirst"
        [isLoading]="isLoading"
        [isBackgroundLoading]="isBackgroundLoading"
        [style.maxHeight]="'18rem'"
      >
        <ng-template #header>
          <org-table-th>Project</org-table-th>
          <org-table-th>Owner</org-table-th>
          <org-table-th>Updated</org-table-th>
          <org-table-th [numeric]="true">Records</org-table-th>
        </ng-template>
        <ng-template [orgTypedContext]="data" #body let-user>
          <org-table-td>{{ user.name }}</org-table-td>
          <org-table-td>{{ user.owner }}</org-table-td>
          <org-table-td [faint]="true">{{ user.updated }}</org-table-td>
          <org-table-td [numeric]="true">{{ user.records }}</org-table-td>
        </ng-template>
      </org-table>
    `,
    moduleMetadata: {
      imports: [Table, TableHeader, TableCell, TypedContextDirective],
    },
  }),
};

export const LiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Live, interactive table — toggle every modifier in real time. Density, state, striping, hover, selectable rows, sortable headers, sticky 1st column and sticky header are independent flags that compose freely.',
      },
    },
  },
  render: () => ({
    template: `<story-table-live-demo />`,
    moduleMetadata: {
      imports: [TableLiveDemo],
    },
  }),
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive showcase of every Table axis — anatomy, sizes, row states, sortable headers, sticky first column, loading + empty, and a fully composed in-context example with pagination, selection, and composed cells.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Anatomy"
            description="A real <table> with three groups: thead, tbody, and an optional tfoot. The header sits on a quiet shelf — same surface as the body, faint uppercase eyebrow type. Body rows are separated by a soft hairline; the post inset on the first and last cell makes the table edge read as a margin."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-anatomy-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The header is its own visual band, not a floating row</li>
            <li>Row separators sit on the TOP edge of cells — the first body row drops its top border</li>
            <li>The first / last cell of every row pulls a touch wider via the size's edge inset</li>
            <li>Numeric columns (records) right-align and use tabular numerals</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sizes"
            description="Three densities. Small for dense data tables (admin, settings); base as the default; large for marketing-adjacent product surfaces with generous breathing room. Row min-height tracks the same control ramp as Button and Input so a Table row aligns with neighbouring controls at every density."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-sizes-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Small: 24px row · dense data</li>
            <li>Base: 32px row · default</li>
            <li>Large: 40px row · roomy</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Row states"
            description="Three dispositions for body rows. Hover tints when [hover] is on. Selected rows pick up a soft neutral tint via the auto-rendered selection column; selected wins over hover. Striped tables tint every even body row with the same lifted surface as the header so the rhythm reads as one piece."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-row-states-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Hover tint applies only to non-selected, non-empty body rows</li>
            <li>Selected row tint is driven by the supplied DataSelectionStore</li>
            <li>Selected + hover combines to a darker neutral surface</li>
            <li>Striped tint is independent of selection / hover</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sortable headers"
            description="Wrap any header label in a [orgSortableKey] directive and provide a SortingStore. The header reads the active sort state and sets data-sortable + aria-sort itself; the chevron lifts to fg + a single direction when the column is the active sort. Click a header to walk the cycle."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-sortable-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Click a header to toggle sort: asc → desc → none</li>
            <li>Active sort lifts both the label color and the chevron</li>
            <li>aria-sort on the &lt;th&gt; reflects the current direction for screen readers</li>
            <li>Numeric sortable columns place the chevron on the pre edge so the number stays flush right</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Sticky first column"
            description="[stickyFirstColumn] pins the pre column when the body scrolls horizontally — the column shares the body surface but draws a post hairline so it reads as a pinned rail. Striping, hover, and selection all carry over to the sticky cell."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-sticky-first-column-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>The first column is pinned during horizontal scroll</li>
            <li>The pinned cell repaints with the row's current state surface so striping / hover / selection still read</li>
            <li>The header's first cell stays on the header tone</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Loading & empty"
            description="A loading table reuses the Skeleton bar primitive inside <td>s — the row rhythm holds while data resolves. An empty table opts in via a #empty template; the row sits in <tbody> with a generous vertical pad and centers its message."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-loading-empty-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Skeleton bars compose into cells without breaking the row rhythm</li>
            <li>Empty rows skip the hover and stripe state</li>
            <li>For initial data fetches that should block the entire surface, use [isLoading] (renders an org-loading-blocker)</li>
            <li>For background refreshes, use [isBackgroundLoading] (renders a small corner spinner without blocking)</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Expandable rows"
            description="Provide an [expandedData] store to enable per-row expansion. A row click toggles expansion when expandedData is supplied; combine with selectionData to keep the checkbox column as the sole authority for selection while the row body drives expansion. Multiple rows can be expanded simultaneously."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-expandable-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>A row click toggles the expanded section when [expandedData] is supplied</li>
            <li>Multiple rows can be expanded at the same time</li>
            <li>When both [selectionData] and [expandedData] are supplied, the checkbox handles selection and the row body handles expansion</li>
            <li>When neither is supplied, the (rowClicked) output fires with the row's data</li>
            <li>The expanded section row spans the full table width and skips hover / striped / selected treatments</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="In context"
            description="A fully composed table — selection, pagination, avatars, links, status tags. The Table component owns the surface; pagination is a sibling. Composed cell content (Avatar, Tag, Link) carries its existing system treatment without re-wrapping."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-in-context-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Selecting any row lifts the actions bar above the table header</li>
            <li>The selection state persists across page changes</li>
            <li>Cell content composes existing core components directly — no table-specific wrappers</li>
          </ul>
        </org-design-system-demo-expected-behaviour>

        <org-design-system-demo>
          <org-design-system-demo-header
            slot="header"
            title="Row action guards"
            description="Apply [orgTableActions] to interactive controls inside a clickable row (or any clickable container) so the control's own click + Enter / Space activation do not also fire the surrounding container's click handler. Clicking the unguarded button increments BOTH the row click counter and the unguarded action counter; clicking the guarded button increments ONLY the guarded action counter."
          />
          <org-design-system-demo-canvas slot="canvas">
            <story-table-row-actions-guard-demo />
          </org-design-system-demo-canvas>
        </org-design-system-demo>
        <org-design-system-demo-expected-behaviour>
          <ul class="list-inside list-disc flex flex-col gap-1">
            <li>Clicking the unguarded button also fires (rowClicked) for that row</li>
            <li>Clicking the guarded button only fires the button's own (clicked) handler — (rowClicked) does NOT fire</li>
            <li>Keyboard Enter / Space on the guarded button activates only the button — the surrounding row is not also activated</li>
            <li>The directive is reusable on any clickable container (cards, list items) — it is not table-specific in implementation</li>
          </ul>
        </org-design-system-demo-expected-behaviour>
      </div>
    `,
    moduleMetadata: {
      imports: [
        TableAnatomyDemo,
        TableSizesDemo,
        TableRowStatesDemo,
        TableSortableDemo,
        TableStickyFirstColumnDemo,
        TableLoadingEmptyDemo,
        TableExpandableDemo,
        TableInContextDemo,
        TableRowActionsGuardDemo,
        DesignSystemDemo,
        DesignSystemDemoHeader,
        DesignSystemDemoCanvas,
        DesignSystemDemoExpectedBehaviour,
      ],
    },
  }),
};
