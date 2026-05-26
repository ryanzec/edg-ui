import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Table, type TableSize } from './table';
import { TableHeader } from './table-header';
import { TableCell } from './table-cell';
import { TableActionsDirective } from './table-actions-directive';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import { SortableDirective } from '../sortable-directive/sortable-directive';
import { SortingStore } from '../sorting-store/sorting-store';
import { TypedContextDirective } from '../typed-context-directive/typed-context-directive';

type TestUser = {
  id: string;
  name: string;
  records: number;
};

const SAMPLE_USERS: TestUser[] = [
  { id: 'user-1', name: 'Alice', records: 10 },
  { id: 'user-2', name: 'Bob', records: 20 },
  { id: 'user-3', name: 'Carol', records: 30 },
];

@Component({
  selector: 'story-table-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TableActionsDirective, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <org-table
      data-testid="table"
      [data]="data()"
      [size]="size()"
      [bordered]="bordered()"
      [striped]="striped()"
      [hover]="hover()"
      [stickyHeader]="stickyHeader()"
      [stickyFirstColumn]="stickyFirstColumn()"
      [emphasizeFirst]="emphasizeFirst()"
      [isLoading]="isLoading()"
      [isBackgroundLoading]="isBackgroundLoading()"
      [selectionData]="selectionStoreValue()"
      [expandedData]="expansionStoreValue()"
      (rowClicked)="handleRowClicked($event)"
    >
      <ng-template #header>
        <org-table-th data-testid="header-name">Name</org-table-th>
        <org-table-th data-testid="header-records" [numeric]="true">Records</org-table-th>
        <org-table-th data-testid="header-actions">Actions</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="data()" #body let-user>
        <org-table-td [attr.data-testid]="'body-name-' + user.id">{{ user.name }}</org-table-td>
        <org-table-td [numeric]="true" [attr.data-testid]="'body-records-' + user.id">{{ user.records }}</org-table-td>
        <org-table-td>
          <button
            type="button"
            [attr.data-testid]="'row-action-unguarded-' + user.id"
            (click)="handleUnguardedAction()"
          >
            unguarded
          </button>
          <button
            type="button"
            orgTableActions
            [attr.data-testid]="'row-action-guarded-' + user.id"
            (click)="handleGuardedAction()"
          >
            guarded
          </button>
        </org-table-td>
      </ng-template>
      <ng-template [orgTypedContext]="data()" #expanded let-user>
        <div [attr.data-testid]="'expanded-' + user.id">expanded {{ user.name }}</div>
      </ng-template>
      <ng-template #empty>
        <span data-testid="empty-content">no data</span>
      </ng-template>
      <ng-template #selectedActions>
        <button type="button" data-testid="selected-action">do thing</button>
      </ng-template>
    </org-table>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-bordered-off" (click)="bordered.set(false)">bordered-off</button>
      <button type="button" data-testid="ctl-striped-on" (click)="striped.set(true)">striped-on</button>
      <button type="button" data-testid="ctl-hover-off" (click)="hover.set(false)">hover-off</button>
      <button type="button" data-testid="ctl-sticky-header-off" (click)="stickyHeader.set(false)">
        sticky-header-off
      </button>
      <button type="button" data-testid="ctl-sticky-first-col-on" (click)="stickyFirstColumn.set(true)">
        sticky-first-col-on
      </button>
      <button type="button" data-testid="ctl-emphasize-first-on" (click)="emphasizeFirst.set(true)">
        emphasize-first-on
      </button>
      <button type="button" data-testid="ctl-loading-on" (click)="isLoading.set(true)">loading-on</button>
      <button type="button" data-testid="ctl-loading-off" (click)="isLoading.set(false)">loading-off</button>
      <button type="button" data-testid="ctl-background-loading-on" (click)="isBackgroundLoading.set(true)">
        background-loading-on
      </button>
      <button type="button" data-testid="ctl-data-empty" (click)="data.set([])">data-empty</button>
      <button type="button" data-testid="ctl-data-full" (click)="data.set(initialData)">data-full</button>
      <button type="button" data-testid="ctl-selection-on" (click)="selectionEnabled.set(true)">selection-on</button>
      <button type="button" data-testid="ctl-selection-off" (click)="selectionEnabled.set(false)">selection-off</button>
      <button type="button" data-testid="ctl-expansion-on" (click)="expansionEnabled.set(true)">expansion-on</button>
      <button type="button" data-testid="ctl-expansion-off" (click)="expansionEnabled.set(false)">expansion-off</button>
    </div>
  `,
})
class StoryTableTestsShell {
  protected readonly initialData = SAMPLE_USERS;

  protected readonly data = signal<TestUser[]>(SAMPLE_USERS);
  protected readonly size = signal<TableSize>('base');
  protected readonly bordered = signal<boolean>(true);
  protected readonly striped = signal<boolean>(false);
  protected readonly hover = signal<boolean>(true);
  protected readonly stickyHeader = signal<boolean>(true);
  protected readonly stickyFirstColumn = signal<boolean>(false);
  protected readonly emphasizeFirst = signal<boolean>(false);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly isBackgroundLoading = signal<boolean>(false);
  protected readonly selectionEnabled = signal<boolean>(false);
  protected readonly expansionEnabled = signal<boolean>(false);

  protected readonly selectionStore = new DataSelectionStore<TestUser>();
  protected readonly expansionStore = new DataSelectionStore<TestUser>();

  protected readonly rowClickedIds = signal<string[]>([]);
  protected readonly guardedActionCount = signal<number>(0);
  protected readonly unguardedActionCount = signal<number>(0);

  protected readonly selectionStoreValue = computed<DataSelectionStore<TestUser> | undefined>(() =>
    this.selectionEnabled() ? this.selectionStore : undefined
  );

  protected readonly expansionStoreValue = computed<DataSelectionStore<TestUser> | undefined>(() =>
    this.expansionEnabled() ? this.expansionStore : undefined
  );

  protected readout(): string {
    const selectedIds = Array.from(this.selectionStore.selectedItems())
      .map((user) => user.id)
      .join(',');
    const expandedIds = Array.from(this.expansionStore.selectedItems())
      .map((user) => user.id)
      .join(',');

    return `rowClicked=[${this.rowClickedIds().join(',')}] selected=[${selectedIds}] expanded=[${expandedIds}] guardedAction=${this.guardedActionCount()} unguardedAction=${this.unguardedActionCount()}`;
  }

  protected handleRowClicked(user: TestUser): void {
    this.rowClickedIds.update((ids) => [...ids, user.id]);
  }

  protected handleGuardedAction(): void {
    this.guardedActionCount.update((value) => value + 1);
  }

  protected handleUnguardedAction(): void {
    this.unguardedActionCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-table-no-listener-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <org-table data-testid="table" [data]="data">
      <ng-template #header>
        <org-table-th>Name</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="data" #body let-user>
        <org-table-td [attr.data-testid]="'body-name-' + user.id">{{ user.name }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class StoryTableNoListenerShell {
  protected readonly data = SAMPLE_USERS;
}

@Component({
  selector: 'story-table-no-templates-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table],
  host: { class: 'block' },
  template: `<org-table data-testid="table" [data]="data" />`,
})
class StoryTableNoTemplatesShell {
  protected readonly data = SAMPLE_USERS;
}

@Component({
  selector: 'story-table-empty-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <org-table data-testid="table" [data]="data">
      <ng-template #header>
        <org-table-th>Name</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="data" #body let-user>
        <org-table-td>{{ user.name }}</org-table-td>
      </ng-template>
      <ng-template #empty>
        <span data-testid="empty-content">nothing here</span>
      </ng-template>
    </org-table>
  `,
})
class StoryTableEmptyShell {
  protected readonly data: TestUser[] = [];
}

@Component({
  selector: 'story-table-cell-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, TypedContextDirective],
  host: { class: 'block' },
  template: `
    <org-table [data]="data">
      <ng-template #header>
        <org-table-th data-testid="header-default">Default</org-table-th>
        <org-table-th data-testid="header-numeric" [numeric]="true">Numeric</org-table-th>
        <org-table-th data-testid="header-select" [selectColumn]="true">Select</org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="data" #body let-row>
        <org-table-td data-testid="cell-default">{{ row.label }}</org-table-td>
        <org-table-td data-testid="cell-numeric" [numeric]="true">{{ row.label }}</org-table-td>
        <org-table-td data-testid="cell-muted" [muted]="true">{{ row.label }}</org-table-td>
        <org-table-td data-testid="cell-faint" [faint]="true">{{ row.label }}</org-table-td>
        <org-table-td data-testid="cell-select" [selectColumn]="true">{{ row.label }}</org-table-td>
        <org-table-td data-testid="cell-ellipsis" [ellipsisLines]="2">{{ row.label }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class StoryTableCellShell {
  protected readonly data = [{ id: 'only', label: 'value' }];
}

@Component({
  selector: 'story-table-sortable-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table, TableHeader, TableCell, SortableDirective, TypedContextDirective],
  providers: [SortingStore],
  host: { class: 'block' },
  template: `
    <org-table [data]="data">
      <ng-template #header>
        <org-table-th data-testid="header-non-sortable">Plain</org-table-th>
        <org-table-th data-testid="header-sortable">
          <div data-testid="sortable-trigger" [orgSortableKey]="'name'">Sortable</div>
        </org-table-th>
      </ng-template>
      <ng-template [orgTypedContext]="data" #body let-row>
        <org-table-td>{{ row.label }}</org-table-td>
        <org-table-td>{{ row.label }}</org-table-td>
      </ng-template>
    </org-table>
  `,
})
class StoryTableSortableShell {
  protected readonly data = [{ id: 'only', label: 'value' }];
}

const meta: Meta = {
  title: 'Core/Components/Table/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-table-tests-shell />`,
  moduleMetadata: { imports: [StoryTableTestsShell] },
});

const renderNoListenerShell: Story['render'] = () => ({
  template: `<story-table-no-listener-shell />`,
  moduleMetadata: { imports: [StoryTableNoListenerShell] },
});

const renderNoTemplatesShell: Story['render'] = () => ({
  template: `<story-table-no-templates-shell />`,
  moduleMetadata: { imports: [StoryTableNoTemplatesShell] },
});

const renderEmptyShell: Story['render'] = () => ({
  template: `<story-table-empty-shell />`,
  moduleMetadata: { imports: [StoryTableEmptyShell] },
});

const renderCellShell: Story['render'] = () => ({
  template: `<story-table-cell-shell />`,
  moduleMetadata: { imports: [StoryTableCellShell] },
});

const renderSortableShell: Story['render'] = () => ({
  template: `<story-table-sortable-shell />`,
  moduleMetadata: { imports: [StoryTableSortableShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-bordered')).toBe('');
    await expect(host.getAttribute('data-hover')).toBe('');
    await expect(host.getAttribute('data-sticky-header')).toBe('');
    await expect(host.getAttribute('data-striped')).toBeNull();
    await expect(host.getAttribute('data-sticky-first-column')).toBeNull();
    await expect(host.getAttribute('data-emphasize-first')).toBeNull();
    await expect(host.getAttribute('data-empty')).toBeNull();
    await expect(host.getAttribute('data-loading')).toBeNull();
    await expect(host.getAttribute('data-background-loading')).toBeNull();
    await expect(host.getAttribute('aria-busy')).toBeNull();
  },
};

export const ReflectsSizeInputOnHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    await expect(host.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    await expect(host.getAttribute('data-size')).toBe('lg');
  },
};

export const TogglesBorderedHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-bordered-off'));

    await expect(host.getAttribute('data-bordered')).toBeNull();
  },
};

export const TogglesStripedHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-striped-on'));

    await expect(host.getAttribute('data-striped')).toBe('');
  },
};

export const TogglesHoverHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-hover-off'));

    await expect(host.getAttribute('data-hover')).toBeNull();
  },
};

export const TogglesStickyHeaderHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-sticky-header-off'));

    await expect(host.getAttribute('data-sticky-header')).toBeNull();
  },
};

export const TogglesStickyFirstColumnHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-sticky-first-col-on'));

    await expect(host.getAttribute('data-sticky-first-column')).toBe('');
  },
};

export const TogglesEmphasizeFirstHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-emphasize-first-on'));

    await expect(host.getAttribute('data-emphasize-first')).toBe('');
  },
};

export const TogglesLoadingHostAttributeAndAriaBusy: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await expect(host.getAttribute('data-loading')).toBe('');
    await expect(host.getAttribute('aria-busy')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-loading-off'));

    await expect(host.getAttribute('data-loading')).toBeNull();
    await expect(host.getAttribute('aria-busy')).toBeNull();
  },
};

export const TogglesBackgroundLoadingHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-background-loading-on'));

    await expect(host.getAttribute('data-background-loading')).toBe('');
    await expect(host.querySelector('org-loading-spinner')).not.toBeNull();
  },
};

export const RendersHeaderTemplateRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.querySelector('thead')).not.toBeNull();
    await expect(canvas.getByTestId('header-name').textContent?.trim()).toBe('Name');
    await expect(canvas.getByTestId('header-records').textContent?.trim()).toBe('Records');
  },
};

export const RendersBodyTemplateForEachItem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const bodyRows = host.querySelectorAll('tbody > org-table-tr');

    await expect(bodyRows.length).toBe(SAMPLE_USERS.length);
    await expect(canvas.getByTestId('body-name-user-1').textContent?.trim()).toBe('Alice');
    await expect(canvas.getByTestId('body-name-user-2').textContent?.trim()).toBe('Bob');
    await expect(canvas.getByTestId('body-name-user-3').textContent?.trim()).toBe('Carol');
  },
};

export const OmitsHeaderAndBodyWhenTemplatesNotProvided: Story = {
  render: renderNoTemplatesShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.querySelector('thead')).toBeNull();
    await expect(host.querySelector('tbody')).toBeNull();
  },
};

export const RendersEmptyTemplateWhenDataEmpty: Story = {
  render: renderEmptyShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.getAttribute('data-empty')).toBe('');
    await expect(canvas.getByTestId('empty-content').textContent?.trim()).toBe('nothing here');
  },
};

export const TogglesEmptyHostAttributeWhenDataChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.getAttribute('data-empty')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-data-empty'));

    await expect(host.getAttribute('data-empty')).toBe('');
    await expect(canvas.getByTestId('empty-content').textContent?.trim()).toBe('no data');

    await userEvent.click(canvas.getByTestId('ctl-data-full'));

    await expect(host.getAttribute('data-empty')).toBeNull();
  },
};

export const RendersLoadingBlockerWhenLoading: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const blocker = host.querySelector('org-loading-blocker') as HTMLElement | null;

    await expect(blocker).not.toBeNull();

    await expect(blocker?.getAttribute('data-visible')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-loading-on'));

    await waitFor(() => expect(blocker?.getAttribute('data-visible')).toBe('1'));
  },
};

export const RendersSelectAllCheckboxWhenSelectionEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await expect(host.querySelector('thead org-checkbox')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    await expect(host.querySelector('thead org-checkbox')).not.toBeNull();
    await expect(host.querySelectorAll('tbody org-checkbox').length).toBe(SAMPLE_USERS.length);
  },
};

export const SelectingRowCheckboxAddsToSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const firstRowCheckboxLabel = host.querySelector(
      'tbody org-table-tr:first-of-type org-checkbox label'
    ) as HTMLLabelElement;

    await userEvent.click(firstRowCheckboxLabel);

    await waitFor(() => expect(readout.textContent).toContain('selected=[user-1]'));
  },
};

export const SelectAllCheckboxSelectsEveryRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const selectAllCheckboxLabel = host.querySelector('thead org-checkbox label') as HTMLLabelElement;

    await userEvent.click(selectAllCheckboxLabel);

    await waitFor(() => expect(readout.textContent).toContain('selected=[user-1,user-2,user-3]'));
  },
};

export const ShowsSelectedActionsBarWhenSelectionActive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    await expect(host.querySelector('.selected-actions-bar')).toBeNull();

    const firstRowCheckboxLabel = host.querySelector(
      'tbody org-table-tr:first-of-type org-checkbox label'
    ) as HTMLLabelElement;

    await userEvent.click(firstRowCheckboxLabel);

    await waitFor(() => expect(host.querySelector('.selected-actions-bar')).not.toBeNull());
    await expect(host.querySelector('.selected-count')?.textContent?.trim()).toBe('1 selected');
    await expect(canvas.getByTestId('selected-action')).not.toBeNull();
  },
};

export const ClearButtonInSelectedActionsBarClearsSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const firstRowCheckboxLabel = host.querySelector(
      'tbody org-table-tr:first-of-type org-checkbox label'
    ) as HTMLLabelElement;

    await userEvent.click(firstRowCheckboxLabel);

    await waitFor(() => expect(host.querySelector('.selected-actions-bar')).not.toBeNull());

    const clearButton = host.querySelector('.selected-actions-bar org-button button') as HTMLButtonElement;

    await userEvent.click(clearButton);

    await waitFor(() => expect(readout.textContent).toContain('selected=[]'));
  },
};

export const ClickingRowTogglesSelectionWhenSelectionEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await userEvent.click(firstRow);

    await waitFor(() => expect(readout.textContent).toContain('selected=[user-1]'));

    await userEvent.click(firstRow);

    await waitFor(() => expect(readout.textContent).toContain('selected=[]'));
  },
};

export const SelectedRowHasSelectedStateAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await expect(firstRow.getAttribute('aria-selected')).toBe('false');
    await expect(firstRow.getAttribute('data-selected')).toBeNull();

    await userEvent.click(firstRow);

    await waitFor(() => expect(firstRow.getAttribute('aria-selected')).toBe('true'));
    await expect(firstRow.getAttribute('data-selected')).toBe('');
  },
};

export const ClickingRowTogglesExpansionWhenExpansionEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expansion-on'));

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await userEvent.click(firstRow);

    await waitFor(() => expect(readout.textContent).toContain('expanded=[user-1]'));
    await expect(canvas.queryByTestId('expanded-user-1')).not.toBeNull();
    await expect(firstRow.getAttribute('aria-expanded')).toBe('true');
    await expect(firstRow.getAttribute('data-expanded')).toBe('');

    await userEvent.click(firstRow);

    await waitFor(() => expect(canvas.queryByTestId('expanded-user-1')).toBeNull());
    await expect(firstRow.getAttribute('aria-expanded')).toBe('false');
  },
};

export const ExpansionWinsOverSelectionWhenBothEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));
    await userEvent.click(canvas.getByTestId('ctl-expansion-on'));

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await userEvent.click(firstRow);

    await waitFor(() => expect(readout.textContent).toContain('expanded=[user-1]'));
    await expect(readout.textContent).toContain('selected=[]');
  },
};

export const EmitsRowClickedWhenNoSelectionOrExpansion: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await userEvent.click(firstRow);

    await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
  },
};

export const RowsAreNotClickableWhenNoListenerOrStoresPresent: Story = {
  render: renderNoListenerShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await expect(firstRow.getAttribute('role')).toBeNull();
    await expect(firstRow.getAttribute('tabindex')).toBeNull();
    await expect(firstRow.getAttribute('data-clickable')).toBeNull();
  },
};

export const ClickableRowExposesButtonRoleAndTabindex: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await expect(firstRow.getAttribute('role')).toBe('button');
    await expect(firstRow.getAttribute('tabindex')).toBe('0');
    await expect(firstRow.getAttribute('data-clickable')).toBe('');
  },
};

export const KeyboardEnterActivatesClickableRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');
    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    firstRow.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
  },
};

export const KeyboardSpaceActivatesClickableRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const readout = await canvas.findByTestId('readout');
    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    firstRow.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
  },
};

export const HeaderRowHasHeaderVariantAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const headerRow = host.querySelector('thead tr') as HTMLElement;

    await expect(headerRow.getAttribute('data-variant')).toBe('header');
    await expect(headerRow.getAttribute('aria-selected')).toBeNull();
    await expect(headerRow.getAttribute('aria-expanded')).toBeNull();
  },
};

export const BodyRowHasBodyVariantAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const bodyRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await expect(bodyRow.getAttribute('data-variant')).toBe('body');
  },
};

export const EmptyRowHasEmptyAttribute: Story = {
  render: renderEmptyShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');
    const emptyRow = host.querySelector('tbody tr') as HTMLElement;

    await expect(emptyRow.getAttribute('data-empty')).toBe('');
  },
};

export const ExpandedSectionRowHasExpandedSectionAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('table');

    await userEvent.click(canvas.getByTestId('ctl-expansion-on'));

    const firstRow = host.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

    await userEvent.click(firstRow);

    await waitFor(() => {
      const expandedRow = host.querySelector('tbody tr[data-expanded-section]') as HTMLElement;

      expect(expandedRow).not.toBeNull();
      expect(expandedRow.getAttribute('aria-selected')).toBeNull();
      expect(expandedRow.getAttribute('aria-expanded')).toBeNull();
    });
  },
};

export const TableCellAppliesDefaultAttributes: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-default');
    const td = host.querySelector('td') as HTMLElement;

    await expect(td.getAttribute('data-numeric')).toBeNull();
    await expect(td.getAttribute('data-muted')).toBeNull();
    await expect(td.getAttribute('data-faint')).toBeNull();
    await expect(td.getAttribute('data-select-col')).toBeNull();
    await expect(td.querySelector('.cell-inner')?.classList.contains('org-table-ellipsis')).toBe(false);
  },
};

export const TableCellAppliesNumericAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-numeric');
    const td = host.querySelector('td') as HTMLElement;

    await expect(td.getAttribute('data-numeric')).toBe('');
  },
};

export const TableCellAppliesMutedAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-muted');
    const td = host.querySelector('td') as HTMLElement;

    await expect(td.getAttribute('data-muted')).toBe('');
  },
};

export const TableCellAppliesFaintAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-faint');
    const td = host.querySelector('td') as HTMLElement;

    await expect(td.getAttribute('data-faint')).toBe('');
  },
};

export const TableCellAppliesSelectColumnAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-select');
    const td = host.querySelector('td') as HTMLElement;

    await expect(td.getAttribute('data-select-col')).toBe('');
  },
};

export const TableCellAppliesEllipsisLinesStyle: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('cell-ellipsis');
    const inner = host.querySelector('.cell-inner') as HTMLElement;

    await expect(inner.classList.contains('org-table-ellipsis')).toBe(true);
    await expect(inner.style.getPropertyValue('--ellipsis-lines')).toBe('2');
  },
};

export const TableHeaderAppliesDefaultAttributes: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('header-default');
    const th = host.querySelector('th') as HTMLElement;

    await expect(th.getAttribute('data-numeric')).toBeNull();
    await expect(th.getAttribute('data-select-col')).toBeNull();
    await expect(th.getAttribute('data-sortable')).toBeNull();
    await expect(th.getAttribute('aria-sort')).toBeNull();
  },
};

export const TableHeaderAppliesNumericAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('header-numeric');
    const th = host.querySelector('th') as HTMLElement;

    await expect(th.getAttribute('data-numeric')).toBe('');
  },
};

export const TableHeaderAppliesSelectColumnAttribute: Story = {
  render: renderCellShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('header-select');
    const th = host.querySelector('th') as HTMLElement;

    await expect(th.getAttribute('data-select-col')).toBe('');
  },
};

export const TableHeaderReflectsSortableState: Story = {
  render: renderSortableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sortableHeader = await canvas.findByTestId('header-sortable');
    const sortableTh = sortableHeader.querySelector('th') as HTMLElement;
    const nonSortableHeader = await canvas.findByTestId('header-non-sortable');
    const nonSortableTh = nonSortableHeader.querySelector('th') as HTMLElement;

    await expect(sortableTh.getAttribute('data-sortable')).toBe('');
    await expect(sortableTh.getAttribute('aria-sort')).toBe('none');
    await expect(sortableTh.getAttribute('data-actively-sorting')).toBeNull();
    await expect(nonSortableTh.getAttribute('data-sortable')).toBeNull();
    await expect(nonSortableTh.getAttribute('aria-sort')).toBeNull();
  },
};

export const TableHeaderCyclesSortDirectionOnClick: Story = {
  render: renderSortableShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sortableHeader = await canvas.findByTestId('header-sortable');
    const sortableTh = sortableHeader.querySelector('th') as HTMLElement;
    const trigger = await canvas.findByTestId('sortable-trigger');

    await userEvent.click(trigger);

    await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('ascending'));
    await expect(sortableTh.getAttribute('data-actively-sorting')).toBe('');

    await userEvent.click(trigger);

    await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('descending'));

    await userEvent.click(trigger);

    await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('none'));
    await expect(sortableTh.getAttribute('data-actively-sorting')).toBeNull();
  },
};

export const ClickingGuardedActionButtonDoesNotEmitRowClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const guardedButton = await canvas.findByTestId('row-action-guarded-user-1');

    await userEvent.click(guardedButton);

    await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
    await expect(readout.textContent).toContain('rowClicked=[]');
  },
};

export const ClickingUnguardedActionButtonAlsoEmitsRowClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const unguardedButton = await canvas.findByTestId('row-action-unguarded-user-1');

    await userEvent.click(unguardedButton);

    await waitFor(() => expect(readout.textContent).toContain('unguardedAction=1'));
    await expect(readout.textContent).toContain('rowClicked=[user-1]');
  },
};

export const KeyboardEnterOnGuardedActionButtonDoesNotActivateRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const guardedButton = (await canvas.findByTestId('row-action-guarded-user-1')) as HTMLButtonElement;

    guardedButton.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(readout.textContent).toContain('rowClicked=[]'));
    await expect(readout.textContent).toContain('guardedAction=0');
  },
};

export const KeyboardSpaceOnGuardedActionButtonDoesNotActivateRow: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');
    const guardedButton = (await canvas.findByTestId('row-action-guarded-user-1')) as HTMLButtonElement;

    guardedButton.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => expect(readout.textContent).toContain('rowClicked=[]'));
    await expect(readout.textContent).toContain('guardedAction=0');
  },
};

export const ClickingGuardedActionButtonDoesNotToggleSelection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-selection-on'));

    const guardedButton = await canvas.findByTestId('row-action-guarded-user-1');

    await userEvent.click(guardedButton);

    await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
    await expect(readout.textContent).toContain('selected=[]');
  },
};

export const ClickingGuardedActionButtonDoesNotToggleExpansion: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-expansion-on'));

    const guardedButton = await canvas.findByTestId('row-action-guarded-user-1');

    await userEvent.click(guardedButton);

    await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
    await expect(readout.textContent).toContain('expanded=[]');
  },
};
