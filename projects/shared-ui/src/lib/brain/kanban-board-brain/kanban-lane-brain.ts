import { Directive, DestroyRef, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { KANBAN_CARD_DRAG_TYPE, KANBAN_LANE_DROP_TYPE, KanbanBoardBrainDirective } from './kanban-board-brain';

/** the headingLevel input default */
export const KANBAN_LANE_HEADING_LEVEL_DEFAULT = 3;

/** an item shape that the kanban lane accepts; all items must carry a stable id */
export type KanbanItem = {
  /** stable identifier for the item; must be unique across the entire board */
  id: string;
  /** additional consumer-defined fields are passed through to the card template */
  [key: string]: unknown;
};

/** internal state shape for the lane brain */
type KanbanLaneState = {
  /** whether the lane body is currently a drop target candidate */
  isDragOver: boolean;
};

/**
 * headless brain directive for a kanban lane. owns the drop-target registration for the lane body, the
 * dragOver state, the lane id, and the items list (used by the board brain to resolve drop indices). carries
 * no styling — the presentation reads isDragOver to highlight the lane.
 */
@Directive({
  selector: '[orgKanbanLaneBrain]',
  exportAs: 'orgKanbanLaneBrain',
  host: {
    role: 'list',
    '[attr.aria-label]': 'ariaLabel() ?? heading() ?? "Kanban lane"',
    '[attr.data-drag-over]': 'isDragOver() ? "" : null',
    '[attr.data-lane-id]': 'laneId()',
  },
})
export class KanbanLaneBrainDirective {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _boardBrain = inject(KanbanBoardBrainDirective);

  private readonly _state = signal<KanbanLaneState>({ isDragOver: false });

  /** stable lane id; must be unique across the entire board */
  public readonly laneId = input.required<string>();

  /** the heading text displayed in the lane header */
  public readonly heading = input<string | undefined, string | null | undefined>(undefined, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional explicit aria-label override; falls back to the heading */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(undefined, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the ordered list of items in the lane; data drives card rendering and drop index resolution */
  public readonly items = input.required<readonly KanbanItem[]>();

  /** whether a card is currently being dragged over the lane body */
  public readonly isDragOver = computed<boolean>(() => this._state().isDragOver);

  /** the ordered list of item ids derived from items() */
  public readonly itemIds = computed<readonly string[]>(() => this.items().map((item) => item.id));

  /** the count of items in the lane */
  public readonly itemCount = computed<number>(() => this.items().length);

  constructor() {
    // register/unregister with the board brain whenever the laneId changes so re-keyed lanes do not orphan
    effect((onCleanup) => {
      const id = this.laneId();
      this._boardBrain.registerLane({
        laneId: id,
        getItemIds: () => this.itemIds(),
      });

      onCleanup(() => {
        this._boardBrain.unregisterLane(id);
      });
    });

    this._initializeDropTarget();
  }

  /** sets up the lane body as a drop target so empty-space drops fall back to "append to end" */
  private _initializeDropTarget(): void {
    const cleanup = dropTargetForElements({
      element: this._elementRef.nativeElement,
      canDrop: ({ source }) => source.data['type'] === KANBAN_CARD_DRAG_TYPE,
      getData: () => ({
        type: KANBAN_LANE_DROP_TYPE,
        laneId: this.laneId(),
      }),
      onDragEnter: () => {
        this._state.set({ isDragOver: true });
      },
      onDragLeave: () => {
        this._state.set({ isDragOver: false });
      },
      onDrop: () => {
        this._state.set({ isDragOver: false });
      },
    });

    this._destroyRef.onDestroy(() => cleanup());
  }
}
