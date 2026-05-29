import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
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
  selector: 'test-table-interactive-host',
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
  `,
})
class TableInteractiveHost {
  public readonly initialData = SAMPLE_USERS;
  public readonly data = signal<TestUser[]>(SAMPLE_USERS);
  public readonly size = signal<TableSize>('base');
  public readonly bordered = signal<boolean>(true);
  public readonly striped = signal<boolean>(false);
  public readonly hover = signal<boolean>(true);
  public readonly stickyHeader = signal<boolean>(true);
  public readonly stickyFirstColumn = signal<boolean>(false);
  public readonly emphasizeFirst = signal<boolean>(false);
  public readonly isLoading = signal<boolean>(false);
  public readonly isBackgroundLoading = signal<boolean>(false);
  public readonly selectionEnabled = signal<boolean>(false);
  public readonly expansionEnabled = signal<boolean>(false);

  public readonly selectionStore = new DataSelectionStore<TestUser>();
  public readonly expansionStore = new DataSelectionStore<TestUser>();

  protected readonly selectionStoreValue = computed<DataSelectionStore<TestUser> | undefined>(() =>
    this.selectionEnabled() ? this.selectionStore : undefined
  );

  protected readonly expansionStoreValue = computed<DataSelectionStore<TestUser> | undefined>(() =>
    this.expansionEnabled() ? this.expansionStore : undefined
  );

  protected readonly rowClickedIds = signal<string[]>([]);
  protected readonly guardedActionCount = signal<number>(0);
  protected readonly unguardedActionCount = signal<number>(0);

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
  selector: 'test-table-no-listener-host',
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
class TableNoListenerHost {
  protected readonly data = SAMPLE_USERS;
}

@Component({
  selector: 'test-table-no-templates-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Table],
  host: { class: 'block' },
  template: `<org-table data-testid="table" [data]="data" />`,
})
class TableNoTemplatesHost {
  protected readonly data = SAMPLE_USERS;
}

@Component({
  selector: 'test-table-empty-host',
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
class TableEmptyHost {
  protected readonly data: TestUser[] = [];
}

@Component({
  selector: 'test-table-cell-host',
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
class TableCellHost {
  protected readonly data = [{ id: 'only', label: 'value' }];
}

@Component({
  selector: 'test-table-sortable-host',
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
class TableSortableHost {
  protected readonly data = [{ id: 'only', label: 'value' }];
}

describe('Table (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveTable = (): ComponentFixture<TableInteractiveHost> => createFixture(TableInteractiveHost);

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default host attributes', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.getAttribute('data-size')).toBe('base');
      expect(tableHost.getAttribute('data-bordered')).toBe('');
      expect(tableHost.getAttribute('data-hover')).toBe('');
      expect(tableHost.getAttribute('data-sticky-header')).toBe('');
      expect(tableHost.getAttribute('data-striped')).toBeNull();
      expect(tableHost.getAttribute('data-sticky-first-column')).toBeNull();
      expect(tableHost.getAttribute('data-emphasize-first')).toBeNull();
      expect(tableHost.getAttribute('data-empty')).toBeNull();
      expect(tableHost.getAttribute('data-loading')).toBeNull();
      expect(tableHost.getAttribute('data-background-loading')).toBeNull();
      expect(tableHost.getAttribute('aria-busy')).toBeNull();
    });

    it('reflects the size input on the host', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);

      expect(tableHost.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('lg');
      await flush(fixture);

      expect(tableHost.getAttribute('data-size')).toBe('lg');
    });

    it('removes data-bordered when bordered is false', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.bordered.set(false);
      await flush(fixture);

      expect(tableHost.getAttribute('data-bordered')).toBeNull();
    });

    it('adds data-striped when striped is true', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.striped.set(true);
      await flush(fixture);

      expect(tableHost.getAttribute('data-striped')).toBe('');
    });

    it('removes data-hover when hover is false', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.hover.set(false);
      await flush(fixture);

      expect(tableHost.getAttribute('data-hover')).toBeNull();
    });

    it('removes data-sticky-header when stickyHeader is false', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.stickyHeader.set(false);
      await flush(fixture);

      expect(tableHost.getAttribute('data-sticky-header')).toBeNull();
    });

    it('adds data-sticky-first-column when stickyFirstColumn is true', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.stickyFirstColumn.set(true);
      await flush(fixture);

      expect(tableHost.getAttribute('data-sticky-first-column')).toBe('');
    });

    it('adds data-emphasize-first when emphasizeFirst is true', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.emphasizeFirst.set(true);
      await flush(fixture);

      expect(tableHost.getAttribute('data-emphasize-first')).toBe('');
    });

    it('adds data-loading and aria-busy when isLoading is true, removes them when false', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.isLoading.set(true);
      await flush(fixture);

      expect(tableHost.getAttribute('data-loading')).toBe('');
      expect(tableHost.getAttribute('aria-busy')).toBe('true');

      fixture.componentInstance.isLoading.set(false);
      await flush(fixture);

      expect(tableHost.getAttribute('data-loading')).toBeNull();
      expect(tableHost.getAttribute('aria-busy')).toBeNull();
    });

    it('adds data-background-loading and renders the spinner when isBackgroundLoading is true', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.isBackgroundLoading.set(true);
      await flush(fixture);

      expect(tableHost.getAttribute('data-background-loading')).toBe('');
      expect(tableHost.querySelector('org-loading-spinner')).not.toBeNull();
    });
  });

  describe('template rendering', () => {
    it('renders the header template row', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.querySelector('thead')).not.toBeNull();
      expect(queryByTestId(fixture, 'header-name').textContent?.trim()).toBe('Name');
      expect(queryByTestId(fixture, 'header-records').textContent?.trim()).toBe('Records');
    });

    it('renders the body template for each data item', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const bodyRows = tableHost.querySelectorAll('tbody > org-table-tr');

      expect(bodyRows.length).toBe(SAMPLE_USERS.length);
      expect(queryByTestId(fixture, 'body-name-user-1').textContent?.trim()).toBe('Alice');
      expect(queryByTestId(fixture, 'body-name-user-2').textContent?.trim()).toBe('Bob');
      expect(queryByTestId(fixture, 'body-name-user-3').textContent?.trim()).toBe('Carol');
    });

    it('omits thead and tbody when no templates are provided', () => {
      const fixture = createFixture(TableNoTemplatesHost);
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.querySelector('thead')).toBeNull();
      expect(tableHost.querySelector('tbody')).toBeNull();
    });
  });

  describe('empty state', () => {
    it('renders the empty template and sets data-empty when data is empty', () => {
      const fixture = createFixture(TableEmptyHost);
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.getAttribute('data-empty')).toBe('');
      expect(queryByTestId(fixture, 'empty-content').textContent?.trim()).toBe('nothing here');
    });

    it('toggles the data-empty attribute and empty template when data changes', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.getAttribute('data-empty')).toBeNull();

      fixture.componentInstance.data.set([]);
      await flush(fixture);

      expect(tableHost.getAttribute('data-empty')).toBe('');
      expect(queryByTestId(fixture, 'empty-content').textContent?.trim()).toBe('no data');

      fixture.componentInstance.data.set(fixture.componentInstance.initialData);
      await flush(fixture);

      expect(tableHost.getAttribute('data-empty')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('shows the loading blocker when isLoading becomes true', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const blocker = tableHost.querySelector('org-loading-blocker') as HTMLElement | null;

      expect(blocker).not.toBeNull();
      expect(blocker?.getAttribute('data-visible')).toBeNull();

      fixture.componentInstance.isLoading.set(true);
      await flush(fixture);

      await waitFor(() => expect(blocker?.getAttribute('data-visible')).toBe('1'));
    });
  });

  describe('selection', () => {
    it('renders the select-all checkbox and per-row checkboxes when selection is enabled', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      expect(tableHost.querySelector('thead org-checkbox')).toBeNull();

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      expect(tableHost.querySelector('thead org-checkbox')).not.toBeNull();
      expect(tableHost.querySelectorAll('tbody org-checkbox').length).toBe(SAMPLE_USERS.length);
    });

    it('adds the clicked row to the selection when the row checkbox is clicked', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const firstRowCheckboxLabel = tableHost.querySelector(
        'tbody org-table-tr:first-of-type org-checkbox label'
      ) as HTMLLabelElement;

      await userEvent.click(firstRowCheckboxLabel);

      await waitFor(() => expect(readout.textContent).toContain('selected=[user-1]'));
    });

    it('selects all rows when the select-all checkbox is clicked', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const selectAllCheckboxLabel = tableHost.querySelector('thead org-checkbox label') as HTMLLabelElement;

      await userEvent.click(selectAllCheckboxLabel);

      await waitFor(() => expect(readout.textContent).toContain('selected=[user-1,user-2,user-3]'));
    });

    it('shows the selected actions bar with count and actions when a row is selected', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      expect(tableHost.querySelector('.selected-actions-bar')).toBeNull();

      const firstRowCheckboxLabel = tableHost.querySelector(
        'tbody org-table-tr:first-of-type org-checkbox label'
      ) as HTMLLabelElement;

      await userEvent.click(firstRowCheckboxLabel);

      await waitFor(() => expect(tableHost.querySelector('.selected-actions-bar')).not.toBeNull());
      expect(tableHost.querySelector('.selected-count')?.textContent?.trim()).toBe('1 selected');
      expect(queryByTestId(fixture, 'selected-action')).not.toBeNull();
    });

    it('clears the selection when the clear button in the selected actions bar is clicked', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const firstRowCheckboxLabel = tableHost.querySelector(
        'tbody org-table-tr:first-of-type org-checkbox label'
      ) as HTMLLabelElement;

      await userEvent.click(firstRowCheckboxLabel);

      await waitFor(() => expect(tableHost.querySelector('.selected-actions-bar')).not.toBeNull());

      const clearButton = tableHost.querySelector('.selected-actions-bar org-button button') as HTMLButtonElement;

      await userEvent.click(clearButton);

      await waitFor(() => expect(readout.textContent).toContain('selected=[]'));
    });

    it('toggles selection when a row is clicked while selection is enabled', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      await userEvent.click(firstRow);

      await waitFor(() => expect(readout.textContent).toContain('selected=[user-1]'));

      await userEvent.click(firstRow);

      await waitFor(() => expect(readout.textContent).toContain('selected=[]'));
    });

    it('applies aria-selected and data-selected attributes to the selected row', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      expect(firstRow.getAttribute('aria-selected')).toBe('false');
      expect(firstRow.getAttribute('data-selected')).toBeNull();

      await userEvent.click(firstRow);

      await waitFor(() => expect(firstRow.getAttribute('aria-selected')).toBe('true'));
      expect(firstRow.getAttribute('data-selected')).toBe('');
    });
  });

  describe('expansion', () => {
    it('toggles expansion and shows the expanded section when a row is clicked', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.expansionEnabled.set(true);
      await flush(fixture);

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      await userEvent.click(firstRow);

      await waitFor(() => expect(readout.textContent).toContain('expanded=[user-1]'));
      expect(queryByTestId(fixture, 'expanded-user-1')).not.toBeNull();
      expect(firstRow.getAttribute('aria-expanded')).toBe('true');
      expect(firstRow.getAttribute('data-expanded')).toBe('');

      await userEvent.click(firstRow);

      await waitFor(() => {
        expect(tableHost.querySelector('[data-testid="expanded-user-1"]')).toBeNull();
      });
      expect(firstRow.getAttribute('aria-expanded')).toBe('false');
    });

    it('expands instead of selecting when both expansion and selection are enabled', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      fixture.componentInstance.expansionEnabled.set(true);
      await flush(fixture);

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      await userEvent.click(firstRow);

      await waitFor(() => expect(readout.textContent).toContain('expanded=[user-1]'));
      expect(readout.textContent).toContain('selected=[]');
    });
  });

  describe('row click output', () => {
    it('emits rowClicked when a row is clicked and no selection or expansion stores are active', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      await userEvent.click(firstRow);

      await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
    });

    it('omits role, tabindex, and data-clickable when no listener or stores are present', () => {
      const fixture = createFixture(TableNoListenerHost);
      const tableHost = queryByTestId(fixture, 'table');
      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      expect(firstRow.getAttribute('role')).toBeNull();
      expect(firstRow.getAttribute('tabindex')).toBeNull();
      expect(firstRow.getAttribute('data-clickable')).toBeNull();
    });

    it('applies role=button, tabindex=0, and data-clickable when a rowClicked listener is attached', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      expect(firstRow.getAttribute('role')).toBe('button');
      expect(firstRow.getAttribute('tabindex')).toBe('0');
      expect(firstRow.getAttribute('data-clickable')).toBe('');
    });

    it('activates the row on keyboard Enter', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');
      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      firstRow.focus();
      await userEvent.keyboard('{Enter}');
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
    });

    it('activates the row on keyboard Space', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const readout = queryByTestId(fixture, 'readout');
      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      firstRow.focus();
      await userEvent.keyboard(' ');
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('rowClicked=[user-1]'));
    });
  });

  describe('row variants', () => {
    it('applies data-variant=header to the header row and omits aria-selected and aria-expanded', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const headerRow = tableHost.querySelector('thead tr') as HTMLElement;

      expect(headerRow.getAttribute('data-variant')).toBe('header');
      expect(headerRow.getAttribute('aria-selected')).toBeNull();
      expect(headerRow.getAttribute('aria-expanded')).toBeNull();
    });

    it('applies data-variant=body to body rows', () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');
      const bodyRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      expect(bodyRow.getAttribute('data-variant')).toBe('body');
    });

    it('applies data-empty to the empty state row', () => {
      const fixture = createFixture(TableEmptyHost);
      const tableHost = queryByTestId(fixture, 'table');
      const emptyRow = tableHost.querySelector('tbody tr') as HTMLElement;

      expect(emptyRow.getAttribute('data-empty')).toBe('');
    });

    it('applies data-expanded-section to the expanded section row without aria-selected or aria-expanded', async () => {
      const fixture = createInteractiveTable();
      const tableHost = queryByTestId(fixture, 'table');

      fixture.componentInstance.expansionEnabled.set(true);
      await flush(fixture);

      const firstRow = tableHost.querySelector('tbody org-table-tr:first-of-type tr') as HTMLElement;

      await userEvent.click(firstRow);

      await waitFor(() => {
        const expandedRow = tableHost.querySelector('tbody tr[data-expanded-section]') as HTMLElement;

        expect(expandedRow).not.toBeNull();
        expect(expandedRow.getAttribute('aria-selected')).toBeNull();
        expect(expandedRow.getAttribute('aria-expanded')).toBeNull();
      });
    });
  });

  describe('table cell', () => {
    it('applies no special attributes by default', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-default');
      const td = host.querySelector('td') as HTMLElement;

      expect(td.getAttribute('data-numeric')).toBeNull();
      expect(td.getAttribute('data-muted')).toBeNull();
      expect(td.getAttribute('data-faint')).toBeNull();
      expect(td.getAttribute('data-select-col')).toBeNull();
      expect(td.querySelector('.cell-inner')?.classList.contains('org-table-ellipsis')).toBe(false);
    });

    it('applies data-numeric for a numeric cell', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-numeric');
      const td = host.querySelector('td') as HTMLElement;

      expect(td.getAttribute('data-numeric')).toBe('');
    });

    it('applies data-muted for a muted cell', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-muted');
      const td = host.querySelector('td') as HTMLElement;

      expect(td.getAttribute('data-muted')).toBe('');
    });

    it('applies data-faint for a faint cell', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-faint');
      const td = host.querySelector('td') as HTMLElement;

      expect(td.getAttribute('data-faint')).toBe('');
    });

    it('applies data-select-col for a select column cell', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-select');
      const td = host.querySelector('td') as HTMLElement;

      expect(td.getAttribute('data-select-col')).toBe('');
    });

    it('applies the ellipsis class and --ellipsis-lines custom property when ellipsisLines is set', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'cell-ellipsis');
      const inner = host.querySelector('.cell-inner') as HTMLElement;

      expect(inner.classList.contains('org-table-ellipsis')).toBe(true);
      expect(inner.style.getPropertyValue('--ellipsis-lines')).toBe('2');
    });
  });

  describe('table header', () => {
    it('applies no special attributes by default', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'header-default');
      const th = host.querySelector('th') as HTMLElement;

      expect(th.getAttribute('data-numeric')).toBeNull();
      expect(th.getAttribute('data-select-col')).toBeNull();
      expect(th.getAttribute('data-sortable')).toBeNull();
      expect(th.getAttribute('aria-sort')).toBeNull();
    });

    it('applies data-numeric for a numeric header', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'header-numeric');
      const th = host.querySelector('th') as HTMLElement;

      expect(th.getAttribute('data-numeric')).toBe('');
    });

    it('applies data-select-col for a select column header', () => {
      const fixture = createFixture(TableCellHost);
      const host = queryByTestId(fixture, 'header-select');
      const th = host.querySelector('th') as HTMLElement;

      expect(th.getAttribute('data-select-col')).toBe('');
    });

    it('reflects sortable state attributes on sortable headers and omits them on plain headers', () => {
      const fixture = createFixture(TableSortableHost);
      const sortableHost = queryByTestId(fixture, 'header-sortable');
      const sortableTh = sortableHost.querySelector('th') as HTMLElement;
      const nonSortableHost = queryByTestId(fixture, 'header-non-sortable');
      const nonSortableTh = nonSortableHost.querySelector('th') as HTMLElement;

      expect(sortableTh.getAttribute('data-sortable')).toBe('');
      expect(sortableTh.getAttribute('aria-sort')).toBe('none');
      expect(sortableTh.getAttribute('data-actively-sorting')).toBeNull();
      expect(nonSortableTh.getAttribute('data-sortable')).toBeNull();
      expect(nonSortableTh.getAttribute('aria-sort')).toBeNull();
    });

    it('cycles sort direction asc → desc → none when the sortable trigger is clicked', async () => {
      const fixture = createFixture(TableSortableHost);
      const sortableHost = queryByTestId(fixture, 'header-sortable');
      const sortableTh = sortableHost.querySelector('th') as HTMLElement;
      const trigger = queryByTestId(fixture, 'sortable-trigger');

      await userEvent.click(trigger);

      await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('ascending'));
      expect(sortableTh.getAttribute('data-actively-sorting')).toBe('');

      await userEvent.click(trigger);

      await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('descending'));

      await userEvent.click(trigger);

      await waitFor(() => expect(sortableTh.getAttribute('aria-sort')).toBe('none'));
      expect(sortableTh.getAttribute('data-actively-sorting')).toBeNull();
    });
  });

  describe('table actions directive', () => {
    it('stops click propagation on guarded buttons so rowClicked is not emitted', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');
      const guardedButton = queryByTestId(fixture, 'row-action-guarded-user-1');

      await userEvent.click(guardedButton);

      await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
      expect(readout.textContent).toContain('rowClicked=[]');
    });

    it('allows click propagation on unguarded buttons so rowClicked is also emitted', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');
      const unguardedButton = queryByTestId(fixture, 'row-action-unguarded-user-1');

      await userEvent.click(unguardedButton);

      await waitFor(() => expect(readout.textContent).toContain('unguardedAction=1'));
      expect(readout.textContent).toContain('rowClicked=[user-1]');
    });

    it('prevents keyboard Enter on a guarded button from activating the row', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');
      const guardedButton = queryByTestId(fixture, 'row-action-guarded-user-1') as HTMLButtonElement;

      guardedButton.focus();
      await userEvent.keyboard('{Enter}');
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('rowClicked=[]'));
      expect(readout.textContent).toContain('guardedAction=0');
    });

    it('prevents keyboard Space on a guarded button from activating the row', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');
      const guardedButton = queryByTestId(fixture, 'row-action-guarded-user-1') as HTMLButtonElement;

      guardedButton.focus();
      await userEvent.keyboard(' ');
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('rowClicked=[]'));
      expect(readout.textContent).toContain('guardedAction=0');
    });

    it('does not toggle selection when a guarded button is clicked', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.selectionEnabled.set(true);
      await flush(fixture);

      const guardedButton = queryByTestId(fixture, 'row-action-guarded-user-1');

      await userEvent.click(guardedButton);

      await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
      expect(readout.textContent).toContain('selected=[]');
    });

    it('does not toggle expansion when a guarded button is clicked', async () => {
      const fixture = createInteractiveTable();
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.expansionEnabled.set(true);
      await flush(fixture);

      const guardedButton = queryByTestId(fixture, 'row-action-guarded-user-1');

      await userEvent.click(guardedButton);

      await waitFor(() => expect(readout.textContent).toContain('guardedAction=1'));
      expect(readout.textContent).toContain('expanded=[]');
    });
  });
});
