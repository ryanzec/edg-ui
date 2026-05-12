import {
  Component,
  ChangeDetectionStrategy,
  input,
  TemplateRef,
  computed,
  effect,
  untracked,
  afterNextRender,
  inject,
  Injector,
  contentChild,
  viewChild,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { ScrollArea } from '../scroll-area/scroll-area';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { LoadingBlocker } from '../loading-blocker/loading-blocker';
import { Button } from '../button/button';
import { Checkbox } from '../checkbox/checkbox';
import { FormField } from '../form-fields/form-field';
import { TableRow } from './table-row';
import { TableHeader } from './table-header';
import { TableCell } from './table-cell';
import { TableBrainDirective } from '../../brain/table-brain/table-brain';

/** all available table size values */
export const allTableSizes = ['sm', 'base', 'lg'] as const;

/** the size variant of the table; controls row height, cell padding, and font size */
export type TableSize = (typeof allTableSizes)[number];

/** default value for the size input */
export const TABLE_SIZE_DEFAULT: TableSize = 'base';

/** default value for the bordered input */
export const TABLE_BORDERED_DEFAULT = true;

/** default value for the striped input */
export const TABLE_STRIPED_DEFAULT = false;

/** default value for the hover input */
export const TABLE_HOVER_DEFAULT = true;

/** default value for the stickyHeader input */
export const TABLE_STICKY_HEADER_DEFAULT = true;

/** default value for the stickyFirstColumn input */
export const TABLE_STICKY_FIRST_COLUMN_DEFAULT = false;

/** default value for the emphasizeFirst input */
export const TABLE_EMPHASIZE_FIRST_DEFAULT = false;

/** default track-by function that uses item identity */
export const TABLE_TRACK_BY_DEFAULT = (item: unknown): unknown => item;

@Component({
  selector: 'org-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    ScrollArea,
    LoadingSpinner,
    LoadingBlocker,
    Button,
    Checkbox,
    FormField,
    TableRow,
    TableHeader,
    TableCell,
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
  hostDirectives: [
    {
      directive: TableBrainDirective,
      inputs: ['isLoading', 'isBackgroundLoading', 'selectionData', 'expandedData'],
    },
  ],
  host: {
    '[attr.data-loading]': 'brain.isLoading() ? "" : null',
    '[attr.data-background-loading]': 'brain.isBackgroundLoading() ? "" : null',
    '[attr.data-empty]': 'isEmpty() ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-bordered]': 'bordered() ? "" : null',
    '[attr.data-striped]': 'striped() ? "" : null',
    '[attr.data-hover]': 'hover() ? "" : null',
    '[attr.data-sticky-header]': 'stickyHeader() ? "" : null',
    '[attr.data-sticky-first-column]': 'stickyFirstColumn() ? "" : null',
    '[attr.data-emphasize-first]': 'emphasizeFirst() ? "" : null',
  },
})
export class Table<T = unknown> {
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(TableBrainDirective, { self: true });
  private readonly _rowClicked$ = new Subject<T>();

  /** array of data items to render in the table body */
  public readonly data = input.required<T[]>();

  /** the size variant of the table; controls row height, cell padding, and font size */
  public readonly size = input<TableSize>(TABLE_SIZE_DEFAULT);

  /** whether the table draws its own top hairline + surface; turn off when wrapped by a card or shell */
  public readonly bordered = input<boolean>(TABLE_BORDERED_DEFAULT);

  /** whether even body rows are tinted with the same lifted surface as the header shelf */
  public readonly striped = input<boolean>(TABLE_STRIPED_DEFAULT);

  /** whether body rows tint on hover */
  public readonly hover = input<boolean>(TABLE_HOVER_DEFAULT);

  /** whether the auto-rendered header row is sticky to the top of the scroll viewport */
  public readonly stickyHeader = input<boolean>(TABLE_STICKY_HEADER_DEFAULT);

  /** whether the first column is pinned to the pre edge during horizontal scroll */
  public readonly stickyFirstColumn = input<boolean>(TABLE_STICKY_FIRST_COLUMN_DEFAULT);

  /** whether the first body cell of each row is rendered with the emphasized weight + tone */
  public readonly emphasizeFirst = input<boolean>(TABLE_EMPHASIZE_FIRST_DEFAULT);

  /** function used to track items in the for loop for optimal re-rendering */
  public readonly trackBy = input<(item: T) => unknown>(TABLE_TRACK_BY_DEFAULT as (item: T) => unknown);

  /** emitted when a body row is clicked; binding this output makes every body row clickable + focusable */
  public readonly rowClicked = outputFromObservable(this._rowClicked$);

  protected readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  protected readonly bodyTemplate = contentChild<TemplateRef<{ $implicit: T }>>('body');

  protected readonly expandedTemplate = contentChild<TemplateRef<{ $implicit: T }>>('expanded');

  protected readonly selectedActionsTemplate = contentChild<TemplateRef<void>>('selectedActions');

  protected readonly emptyTemplate = contentChild<TemplateRef<void>>('empty');

  /** whether the auto-rendered selected actions bar should render (selection active and template provided) */
  protected readonly showSelectedActions = computed<boolean>(
    () => this.brain.hasSelection() && !!this.selectedActionsTemplate()
  );

  /** whether the data array is currently empty (no rows to render) */
  protected readonly isEmpty = computed<boolean>(() => this.data().length === 0);

  /** whether any consumer is listening to rowClicked; one of the inputs that drives row clickability */
  protected readonly hasRowClickedListener = computed<boolean>(() => this._rowClicked$.observed);

  /** whether body rows are interactive (focusable + role=button) — true when expansion, selection, or a rowClicked listener is active */
  protected readonly isRowClickable = computed<boolean>(
    () => this.brain.hasExpansionEnabled() || this.brain.hasSelectionEnabled() || this.hasRowClickedListener()
  );

  private readonly _scrollAreaComponent = viewChild<ScrollArea>('scrollAreaComponent');

  constructor() {
    // check if scrolling is needed when data changes
    effect(() => {
      // the data can cause the size of the element to change so we need to check when it changes
      this.data();

      untracked(() => {
        afterNextRender(
          () => {
            const scrollAreaComponent = this._scrollAreaComponent();
            const container = scrollAreaComponent?.containerElement() ?? null;

            this.brain.recalcScrollNeeded(container);
          },
          { injector: this._injector }
        );
      });
    });
  }

  /** template helper to call the trackBy function for use in @for tracking */
  protected trackByItem(item: T): unknown {
    return this.trackBy()(item);
  }

  /** template helper that narrows an item to the `{ id: string }` shape required by the selection store */
  protected asSelectable(item: T): T & { id: string } {
    return item as T & { id: string };
  }

  /** template helper that narrows the data array to the `{ id: string }[]` shape required by the selection store */
  protected asSelectableData(items: T[]): (T & { id: string })[] {
    return items as (T & { id: string })[];
  }

  /** whether the given item is currently selected via the selection store */
  protected isItemSelected(item: T): boolean {
    return this.brain.selectionData()?.isSelected(this.asSelectable(item)) ?? false;
  }

  /** whether the given item is currently expanded via the expansion store */
  protected isItemExpanded(item: T): boolean {
    return this.brain.expandedData()?.isSelected(this.asSelectable(item)) ?? false;
  }

  /**
   * routes a body row click based on which stores are wired:
   *   expansion mode wins over selection; if neither is active, the rowClicked output is emitted
   */
  protected onRowClicked(item: T): void {
    const expandedData = this.brain.expandedData();

    if (expandedData) {
      expandedData.toggle(this.asSelectable(item));

      return;
    }

    const selectionData = this.brain.selectionData();

    if (selectionData) {
      selectionData.toggle(this.asSelectable(item));

      return;
    }

    this._rowClicked$.next(item);
  }
}
