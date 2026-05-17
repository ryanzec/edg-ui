import { Directive, DestroyRef, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  KANBAN_CARD_DRAG_TYPE,
  KANBAN_CARD_DROP_TYPE,
  KanbanBoardBrainDirective,
  type KanbanCardEdge,
  type KanbanSelectionModifier,
} from './kanban-board-brain';

/** internal state shape for the card brain */
type KanbanCardState = {
  /** the edge (top or bottom) of the card the dragged pointer is currently closer to, or null when not over */
  closestEdge: KanbanCardEdge | null;
};

/** offset in pixels applied to each subsequent card silhouette in a multi-drag preview stack */
const MULTI_DRAG_PREVIEW_STACK_OFFSET = 6;

/** maximum number of silhouettes to render in a multi-drag preview stack (extras are summarized by the badge) */
const MULTI_DRAG_PREVIEW_MAX_STACK = 3;

/**
 * headless brain directive for a kanban card. owns the draggable + drop-target registrations on the card
 * element, the per-card drag/over state (closestEdge, isBeingDragged via the board brain's draggingCardIds),
 * the click-to-select handler with modifier-key routing, and the custom native drag preview construction
 * (single card → cloned silhouette; multi card → stacked silhouettes plus count badge). carries no styling —
 * the presentation reads the public computed signals to render the fade-out and drop-indicator line.
 */
@Directive({
  selector: '[orgKanbanCardBrain]',
  exportAs: 'orgKanbanCardBrain',
  host: {
    role: 'listitem',
    '[attr.data-card-id]': 'cardId()',
    '[attr.data-lane-id]': 'laneId()',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-being-dragged]': 'isBeingDragged() ? "" : null',
    '[attr.data-closest-edge]': 'closestEdge()',
    tabindex: '0',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class KanbanCardBrainDirective {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _boardBrain = inject(KanbanBoardBrainDirective);

  private readonly _state = signal<KanbanCardState>({ closestEdge: null });

  /** stable id of the card; must be unique across the entire board */
  public readonly cardId = input.required<string>();

  /** the lane id this card belongs to */
  public readonly laneId = input.required<string>();

  /** whether this card is part of the current selection */
  public readonly isSelected = computed<boolean>(() => this._boardBrain.isSelected(this.cardId()));

  /** whether this card is part of the active drag */
  public readonly isBeingDragged = computed<boolean>(() => this._boardBrain.draggingCardIds().has(this.cardId()));

  /** the edge of this card the drag pointer is closer to, or null when not currently over */
  public readonly closestEdge = computed<KanbanCardEdge | null>(() => this._state().closestEdge);

  constructor() {
    this._initializeDraggable();
    this._initializeDropTarget();

    // clear the local closest-edge state when no drag is in progress (defensive — onDragLeave usually wins)
    effect(() => {
      if (!this._boardBrain.isDragging()) {
        this._state.set({ closestEdge: null });
      }
    });
  }

  /** handles a pointer click on the card; routes to the board brain with the appropriate modifier */
  public onClick(event: MouseEvent): void {
    const modifier = this._resolveModifier(event);
    this._boardBrain.handleCardClicked(this.cardId(), this.laneId(), modifier);
  }

  /** handles keyboard activation: space and enter toggle this card's selection */
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    const modifier: KanbanSelectionModifier =
      event.ctrlKey || event.metaKey ? 'toggle' : event.shiftKey ? 'range' : 'none';
    this._boardBrain.handleCardClicked(this.cardId(), this.laneId(), modifier);
  }

  /** resolves the selection modifier from a mouse event's modifier keys */
  private _resolveModifier(event: MouseEvent): KanbanSelectionModifier {
    if (event.shiftKey) {
      return 'range';
    }

    if (event.ctrlKey || event.metaKey) {
      return 'toggle';
    }

    return 'none';
  }

  /** sets up the card element as a draggable, including the custom multi-card preview */
  private _initializeDraggable(): void {
    const cleanup = draggable({
      element: this._elementRef.nativeElement,
      getInitialData: () => {
        const draggingIds = this._boardBrain.resolveDragIds(this.cardId());

        return {
          type: KANBAN_CARD_DRAG_TYPE,
          cardId: this.cardId(),
          laneId: this.laneId(),
          draggingIds,
        };
      },
      onGenerateDragPreview: ({ nativeSetDragImage, source }) => {
        if (!nativeSetDragImage) {
          return;
        }

        const draggingIds = source.data['draggingIds'] as ReadonlySet<string> | undefined;
        const count = draggingIds?.size ?? 1;
        const sourceElement = this._elementRef.nativeElement;

        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: () => ({ x: 12, y: 12 }),
          render: ({ container }) => {
            this._renderPreview(container, sourceElement, count);

            return () => {
              container.replaceChildren();
            };
          },
        });
      },
    });

    this._destroyRef.onDestroy(() => cleanup());
  }

  /** sets up the card element as a drop target so drops on a specific card resolve to an above/below edge */
  private _initializeDropTarget(): void {
    const cleanup = dropTargetForElements({
      element: this._elementRef.nativeElement,
      canDrop: ({ source }) => source.data['type'] === KANBAN_CARD_DRAG_TYPE,
      getData: ({ input: pointerInput }) => {
        const edge = this._computeClosestEdge(pointerInput.clientY);

        return {
          type: KANBAN_CARD_DROP_TYPE,
          cardId: this.cardId(),
          laneId: this.laneId(),
          edge,
        };
      },
      onDragEnter: ({ location }) => {
        const edge = this._computeClosestEdge(location.current.input.clientY);
        this._state.set({ closestEdge: edge });
      },
      onDrag: ({ location }) => {
        const edge = this._computeClosestEdge(location.current.input.clientY);

        if (edge !== this._state().closestEdge) {
          this._state.set({ closestEdge: edge });
        }
      },
      onDragLeave: () => {
        this._state.set({ closestEdge: null });
      },
      onDrop: () => {
        this._state.set({ closestEdge: null });
      },
    });

    this._destroyRef.onDestroy(() => cleanup());
  }

  /** returns "top" when the pointer is in the upper half of this card and "bottom" otherwise */
  private _computeClosestEdge(clientY: number): KanbanCardEdge {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    return clientY < midpoint ? 'top' : 'bottom';
  }

  /**
   * builds the drag preview dom: clones the source card silhouette; when more than one card is in the drag,
   * stacks additional offset silhouettes behind the front card and appends a count badge.
   *
   * RULE BREAK — intentional: this method violates several brain/styling rules (inline sizing, colors, fonts,
   * padding, border-radius, box-shadow, raw px values, var() fallbacks) AND the brain-must-not-contain-styling
   * rule. these are kept here on purpose because the preview is rendered inside the browser's drag-image
   * portal — a separate DOM where component stylesheets are not reliably loaded. moving the static styles
   * into a CSS class + tokens would require either a globally-loaded preview stylesheet outside the normal
   * component CSS lifecycle, or fragile class-application from the brain into a portal DOM. inline styling
   * is the pragmatic choice; do not "refactor" this back into the standard pattern.
   */
  private _renderPreview(container: HTMLElement, sourceElement: HTMLElement, count: number): void {
    const rect = sourceElement.getBoundingClientRect();
    const stack = Math.min(count, MULTI_DRAG_PREVIEW_MAX_STACK);

    container.style.position = 'relative';
    container.style.width = `${rect.width}px`;
    container.style.height = `${rect.height + (stack - 1) * MULTI_DRAG_PREVIEW_STACK_OFFSET}px`;

    // back-most silhouettes first so the cloned source ends up on top
    for (let i = stack - 1; i >= 1; i--) {
      const silhouette = sourceElement.cloneNode(true) as HTMLElement;
      silhouette.style.position = 'absolute';
      silhouette.style.top = `${i * MULTI_DRAG_PREVIEW_STACK_OFFSET}px`;
      silhouette.style.left = `${i * MULTI_DRAG_PREVIEW_STACK_OFFSET}px`;
      silhouette.style.width = `${rect.width}px`;
      silhouette.style.opacity = '0.8';
      silhouette.style.pointerEvents = 'none';
      container.appendChild(silhouette);
    }

    const front = sourceElement.cloneNode(true) as HTMLElement;
    front.style.position = 'absolute';
    front.style.top = '0px';
    front.style.left = '0px';
    front.style.width = `${rect.width}px`;
    front.style.pointerEvents = 'none';
    container.appendChild(front);

    if (count > 1) {
      const badge = document.createElement('div');
      badge.textContent = String(count);
      badge.setAttribute('data-org-kanban-preview-badge', '');
      // inline styles so the badge renders without depending on stylesheet loading inside the preview portal
      badge.style.position = 'absolute';
      badge.style.top = '-8px';
      badge.style.right = '-8px';
      badge.style.minWidth = '24px';
      badge.style.height = '24px';
      badge.style.padding = '0 6px';
      badge.style.borderRadius = '12px';
      badge.style.background = 'var(--color-primary, #2563eb)';
      badge.style.color = 'var(--color-primary-on, white)';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = '600';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.pointerEvents = 'none';
      badge.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
      container.appendChild(badge);
    }
  }
}
