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
  hostDirectives: [
    {
      directive: TableBrainDirective,
      inputs: ['isLoading', 'isBackgroundLoading', 'selectionData'],
    },
  ],
  host: {
    '[attr.data-loading]': 'brain.isLoading() ? "" : null',
    '[attr.data-background-loading]': 'brain.isBackgroundLoading() ? "" : null',
  },
})
export class Table<T = unknown> {
  private readonly _injector = inject(Injector);
  protected readonly brain = inject(TableBrainDirective, { self: true });

  /** array of data items to render in the table body */
  public readonly data = input.required<T[]>();

  /** whether the auto-rendered header row should be sticky */
  public readonly stickyHeader = input<boolean>(TABLE_STICKY_HEADER_DEFAULT);

  /** function used to track items in the for loop for optimal re-rendering */
  public readonly trackBy = input<(item: T) => unknown>(TABLE_TRACK_BY_DEFAULT as (item: T) => unknown);

  protected readonly headerTemplate = contentChild<TemplateRef<void>>('header');

  protected readonly bodyTemplate = contentChild<TemplateRef<{ $implicit: T }>>('body');

  protected readonly selectedActionsTemplate = contentChild<TemplateRef<void>>('selectedActions');

  /** whether the selected actions bar should render (selection active and template provided) */
  protected readonly showSelectedActions = computed<boolean>(
    () => this.brain.hasSelection() && !!this.selectedActionsTemplate()
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
}
