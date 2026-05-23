import { Directive, DestroyRef, computed, inject, input, model, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { angularUtils, logManager } from '@organization/shared-utils';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

/** the drag payload type marker for a kanban card source */
export const KANBAN_CARD_DRAG_TYPE = 'kanban-card-source';

/** the drop target type marker placed on individual kanban cards */
export const KANBAN_CARD_DROP_TYPE = 'kanban-card-drop';

/** the drop target type marker placed on the lane body */
export const KANBAN_LANE_DROP_TYPE = 'kanban-lane-drop';

/** the modifier flavor that drives how a selection click is interpreted */
export const allKanbanSelectionModifiers = ['none', 'toggle', 'range'] as const;

/** the modifier flavor that drives how a selection click is interpreted */
export type KanbanSelectionModifier = (typeof allKanbanSelectionModifiers)[number];

/** which edge of a card the pointer is closer to during a drag-over */
export const allKanbanCardEdges = ['top', 'bottom'] as const;

/** which edge of a card the pointer is closer to during a drag-over */
export type KanbanCardEdge = (typeof allKanbanCardEdges)[number];

/** the payload emitted when one or more cards have been dropped at a new position */
export type KanbanItemsMovedEvent = {
  /** the ordered list of item ids being moved */
  itemIds: readonly string[];
  /** the lane id the drag originated from */
  sourceLaneId: string;
  /** the lane id the drop landed in */
  targetLaneId: string;
  /** the index in the target lane (after removing the moved items from their source positions) */
  targetIndex: number;
};

/** the ariaLabel input default */
export const KANBAN_BOARD_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the selectedIds model default */
export const KANBAN_BOARD_SELECTED_IDS_DEFAULT: ReadonlySet<string> = new Set<string>();

/** lane registration shape — lanes self-register so the brain can resolve drop indices */
type RegisteredLane = {
  /** stable lane id */
  laneId: string;
  /** ordered list of item ids currently in the lane (signal accessor) */
  getItemIds: () => readonly string[];
};

/** internal state shape for the board brain */
type KanbanBoardState = {
  /** whether a drag is currently in progress */
  isDragging: boolean;
  /** the set of card ids currently participating in the active drag */
  draggingCardIds: ReadonlySet<string>;
  /** the card id last clicked (anchor for shift-click range select) */
  anchorCardId: string | null;
  /** the lane id the anchor card belongs to (range select is scoped to a single lane) */
  anchorLaneId: string | null;
};

/**
 * headless brain directive for the kanban board. owns the global drag monitor (one per board), the selection
 * set, the shift-click anchor, the active drag state, and the lane registry used to resolve drop indices.
 * carries no styling — the presentation reads the public computed signals to drive visual feedback.
 */
@Directive({
  selector: '[orgKanbanBoardBrain]',
  exportAs: 'orgKanbanBoardBrain',
  host: {
    role: 'region',
    '[attr.aria-label]': 'ariaLabel() ?? "Kanban board"',
    '[attr.data-dragging]': 'isDragging() ? "" : null',
  },
})
export class KanbanBoardBrainDirective {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<KanbanBoardState>({
    isDragging: false,
    draggingCardIds: new Set(),
    anchorCardId: null,
    anchorLaneId: null,
  });

  private readonly _lanes = new Map<string, RegisteredLane>();

  private readonly _itemsMoved$ = new Subject<KanbanItemsMovedEvent>();

  /** optional accessible label describing the board; falls back to a generic label */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(KANBAN_BOARD_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the set of selected card ids; two-way so the consumer can drive and observe selection */
  public readonly selectedIds = model<ReadonlySet<string>>(KANBAN_BOARD_SELECTED_IDS_DEFAULT);

  /** emitted whenever a drop completes and produces a valid move */
  public readonly itemsMoved = outputFromObservable(this._itemsMoved$.asObservable());

  /** whether a drag is currently in progress anywhere on the board */
  public readonly isDragging = computed<boolean>(() => this._state().isDragging);

  /** the set of card ids participating in the active drag (empty when not dragging) */
  public readonly draggingCardIds = computed<ReadonlySet<string>>(() => this._state().draggingCardIds);

  constructor() {
    this._initializeMonitor();
  }

  /** lane self-registration; called by lane brain on init */
  public registerLane(lane: RegisteredLane): void {
    this._lanes.set(lane.laneId, lane);
  }

  /** lane self-unregistration; called by lane brain on destroy */
  public unregisterLane(laneId: string): void {
    this._lanes.delete(laneId);
  }

  /** whether the given card id is currently part of the selection */
  public isSelected(cardId: string): boolean {
    return this.selectedIds().has(cardId);
  }

  /**
   * applies the selection rules for a card click given the modifier keys present at click time. mutates the
   * selection model and updates the shift-click anchor. the rules:
   * - none: clears selection, selects only the clicked card, sets it as anchor
   * - toggle (cmd/ctrl): toggles the clicked card's membership, sets anchor to the clicked card
   * - range (shift): when anchor is in the same lane, selects every card between anchor and clicked inclusive;
   *   when anchor is missing or in another lane, falls back to single-select with a logged warning
   */
  public handleCardClicked(cardId: string, laneId: string, modifier: KanbanSelectionModifier): void {
    const currentState = this._state();
    const currentSelection = this.selectedIds();
    const next = new Set(currentSelection);

    if (modifier === 'toggle') {
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }

      this.selectedIds.set(next);
      this._state.set({ ...currentState, anchorCardId: cardId, anchorLaneId: laneId });

      return;
    }

    if (modifier === 'range') {
      const anchorId = currentState.anchorCardId;
      const anchorLaneId = currentState.anchorLaneId;

      if (!anchorId || anchorLaneId !== laneId) {
        if (anchorId && anchorLaneId !== laneId) {
          logManager.warn({
            type: 'kanban-board-range-select-cross-lane',
            message: 'shift-click range select fell back to single-select because the anchor is in a different lane',
          });
        }

        const fallback = new Set<string>([cardId]);
        this.selectedIds.set(fallback);
        this._state.set({ ...currentState, anchorCardId: cardId, anchorLaneId: laneId });

        return;
      }

      const laneItemIds = this._lanes.get(laneId)?.getItemIds() ?? [];
      const anchorIndex = laneItemIds.indexOf(anchorId);
      const targetIndex = laneItemIds.indexOf(cardId);

      if (anchorIndex === -1 || targetIndex === -1) {
        const fallback = new Set<string>([cardId]);
        this.selectedIds.set(fallback);
        this._state.set({ ...currentState, anchorCardId: cardId, anchorLaneId: laneId });

        return;
      }

      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);
      const range = new Set<string>(laneItemIds.slice(start, end + 1));
      this.selectedIds.set(range);

      // anchor stays put for repeated shift-clicks to extend the range
      return;
    }

    // none: plain click resets the selection
    const single = new Set<string>([cardId]);
    this.selectedIds.set(single);
    this._state.set({ ...currentState, anchorCardId: cardId, anchorLaneId: laneId });
  }

  /** clears the selection and the shift-click anchor */
  public clearSelection(): void {
    this.selectedIds.set(new Set<string>());
    this._state.update((state) => ({ ...state, anchorCardId: null, anchorLaneId: null }));
  }

  /**
   * resolves the set of card ids that should travel with a drag for a given grabbed card. if the grabbed card
   * is in the current selection, the entire selection travels; otherwise only the grabbed card travels (and the
   * selection is reset to it so visual feedback matches).
   */
  public resolveDragIds(grabbedCardId: string): ReadonlySet<string> {
    const selection = this.selectedIds();

    if (selection.has(grabbedCardId) && selection.size > 1) {
      return new Set(selection);
    }

    if (!selection.has(grabbedCardId)) {
      const single = new Set<string>([grabbedCardId]);
      this.selectedIds.set(single);
      this._state.update((state) => ({ ...state, anchorCardId: grabbedCardId }));

      return single;
    }

    return new Set<string>([grabbedCardId]);
  }

  /** sets up the global drag monitor; runs once in the constructor and cleans up on destroy */
  private _initializeMonitor(): void {
    const cleanup = monitorForElements({
      canMonitor: ({ source }) => source.data['type'] === KANBAN_CARD_DRAG_TYPE,
      onDragStart: ({ source }) => {
        const draggingIds = source.data['draggingIds'] as ReadonlySet<string> | undefined;
        this._state.update((state) => ({
          ...state,
          isDragging: true,
          draggingCardIds: draggingIds ?? new Set<string>(),
        }));
      },
      onDrop: ({ source, location }) => {
        this._state.update((state) => ({
          ...state,
          isDragging: false,
          draggingCardIds: new Set<string>(),
        }));

        this._resolveAndEmitMove(source, location.current.dropTargets);
      },
    });

    this._destroyRef.onDestroy(() => cleanup());
  }

  /**
   * resolves the destination of a completed drop and emits an itemsMoved event when the move is valid (i.e.
   * lands on a registered drop target and produces a different position than the source).
   */
  private _resolveAndEmitMove(
    source: ElementDragPayload,
    dropTargets: readonly { data: Record<string | symbol, unknown> }[]
  ): void {
    if (dropTargets.length === 0) {
      return;
    }

    const sourceLaneId = source.data['laneId'] as string | undefined;
    const draggingIds = source.data['draggingIds'] as ReadonlySet<string> | undefined;

    if (!sourceLaneId || !draggingIds || draggingIds.size === 0) {
      return;
    }

    // innermost drop target wins — pdnd bubbles from innermost to outermost
    const innermost = dropTargets[0];
    const innermostType = innermost.data['type'];

    const targetLaneId = innermost.data['laneId'] as string | undefined;

    if (!targetLaneId) {
      return;
    }

    const targetLane = this._lanes.get(targetLaneId);

    if (!targetLane) {
      return;
    }

    const targetItemIds = targetLane.getItemIds();

    // compute the destination index in the post-removal list (i.e. after the dragged items are pulled out
    // of their source positions). this is the index passed to the consumer.
    const targetItemIdsWithoutDragged = targetItemIds.filter((id) => !draggingIds.has(id));

    let targetIndex: number;

    if (innermostType === KANBAN_CARD_DROP_TYPE) {
      const overCardId = innermost.data['cardId'] as string;
      const edge = innermost.data['edge'] as KanbanCardEdge;

      // if the over-card is itself being dragged, fall back to "append to end"
      if (draggingIds.has(overCardId)) {
        targetIndex = targetItemIdsWithoutDragged.length;
      } else {
        const overIndex = targetItemIdsWithoutDragged.indexOf(overCardId);

        if (overIndex === -1) {
          targetIndex = targetItemIdsWithoutDragged.length;
        } else {
          targetIndex = edge === 'top' ? overIndex : overIndex + 1;
        }
      }
    } else if (innermostType === KANBAN_LANE_DROP_TYPE) {
      // dropping on the lane body (not on a specific card) → append to end
      targetIndex = targetItemIdsWithoutDragged.length;
    } else {
      return;
    }

    // skip no-op moves: same lane and the dragged ids would land in their original positions
    if (sourceLaneId === targetLaneId) {
      const orderedDraggedIds = targetItemIds.filter((id) => draggingIds.has(id));
      const sourceStartIndex = targetItemIds.indexOf(orderedDraggedIds[0]);

      if (sourceStartIndex === targetIndex) {
        return;
      }
    }

    const orderedItemIds = targetItemIds.filter((id) => draggingIds.has(id));
    // if the source lane differs, the source lane's item order is what we use to preserve drag order
    const itemIds =
      sourceLaneId === targetLaneId
        ? orderedItemIds
        : this._orderedDraggingIdsFromSourceLane(sourceLaneId, draggingIds);

    this._itemsMoved$.next({
      itemIds,
      sourceLaneId,
      targetLaneId,
      targetIndex,
    });
  }

  /** returns the dragging ids in the order they appear in the source lane (preserves visual order on move) */
  private _orderedDraggingIdsFromSourceLane(sourceLaneId: string, draggingIds: ReadonlySet<string>): readonly string[] {
    const sourceLane = this._lanes.get(sourceLaneId);

    if (!sourceLane) {
      return Array.from(draggingIds);
    }

    return sourceLane.getItemIds().filter((id) => draggingIds.has(id));
  }
}
