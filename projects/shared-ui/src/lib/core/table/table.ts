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
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { ScrollArea } from '../scroll-area/scroll-area';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { LoadingBlocker } from '../loading-blocker/loading-blocker';
import { Button } from '../button/button';
import { Checkbox } from '../checkbox/checkbox';
import { FormField } from '../form-field/form-field';
import { DataSelectionStore } from '../data-selection-store/data-selection-store';
import { TableRow } from './table-row';
import { TableHeader } from './table-header';
import { TableCell } from './table-cell';
import { TableBrainDirective } from '../../brain/table-brain/table-brain';

/** default value for the isLoading input */
export const TABLE_IS_LOADING_DEFAULT = false;

/** default value for the isBackgroundLoading input */
export const TABLE_IS_BACKGROUND_LOADING_DEFAULT = false;

/** default value for the selectionData input */
export const TABLE_SELECTION_DATA_DEFAULT = undefined;

/** default value for the stickyHeader input */
export const TABLE_STICKY_HEADER_DEFAULT = true;

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
  hostDirectives: [TableBrainDirective],
  host: {
    '[attr.data-loading]': 'isLoading() ? "" : null',
    '[attr.data-background-loading]': 'isBackgroundLoading() ? "" : null',
    '[attr.aria-busy]': 'isLoading() ? "true" : null',
  },
})
export class Table<T = unknown> {
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(TableBrainDirective, { self: true });

  /** array of data items to render in the table body */
  public readonly data = input.required<T[]>();

  /** whether to show the blocking loading overlay (for initial loads) */
  public readonly isLoading = input<boolean>(TABLE_IS_LOADING_DEFAULT);

  /** whether to show the background loading spinner (for data refreshes) */
  public readonly isBackgroundLoading = input<boolean>(TABLE_IS_BACKGROUND_LOADING_DEFAULT);

  /**
   * the selection store driving the built-in selection column and selected actions bar; when provided, the table
   * automatically renders a select-all checkbox in the header and a per-row checkbox in the body
   */
  public readonly selectionData = input<
    DataSelectionStore<T & { id: string }> | undefined,
    DataSelectionStore<T & { id: string }> | null | undefined
  >(TABLE_SELECTION_DATA_DEFAULT, { transform: angularUtils.transformNullToUndefined });

  /** whether the auto-rendered header row should be sticky */
  public readonly stickyHeader = input<boolean>(TABLE_STICKY_HEADER_DEFAULT);

  /** function used to track items in the for loop for optimal re-rendering */
  public readonly trackBy = input<(item: T) => unknown>(TABLE_TRACK_BY_DEFAULT as (item: T) => unknown);

  /** whether the scroll area scroll indicators are currently needed (proxied from brain) */
  protected readonly isScrollNeeded = computed<boolean>(() => this.brain.isScrollNeeded());

  protected readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  protected readonly bodyTemplate = contentChild<TemplateRef<{ $implicit: T }>>('body');

  protected readonly selectedActionsTemplate = contentChild<TemplateRef<void>>('selectedActions');

  /** number of currently selected rows (derived from selectionData) */
  protected readonly selectedCount = computed<number>(() => this.selectionData()?.selectedCount() ?? 0);

  /** whether the selected actions bar should render (selection active and template provided) */
  protected readonly showSelectedActions = computed<boolean>(
    () => !!this.selectionData()?.hasSelection() && !!this.selectedActionsTemplate()
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

  /** template helper that narrows an item to the `T & { id: string }` shape required by the selection store */
  protected asSelectable(item: T): T & { id: string } {
    return item as T & { id: string };
  }

  /** template helper that narrows the data array to the `(T & { id: string })[]` shape required by the selection store */
  protected asSelectableData(items: T[]): (T & { id: string })[] {
    return items as (T & { id: string })[];
  }

  /** clears the current selection via the provided selectionData store */
  protected onClearSelection(): void {
    this.selectionData()?.clear();
  }
}
