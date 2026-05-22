import { Directive, DestroyRef, ElementRef, computed, effect, inject, input, signal } from '@angular/core';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  VIEW_OPTIONS_FIELD_DRAG_TYPE,
  VIEW_OPTIONS_FIELD_DROP_TYPE,
  ViewOptionsBrainDirective,
  type ViewOptionsFieldEdge,
} from './view-options-brain';

/** default value for the locked input */
export const VIEW_OPTIONS_FIELD_ROW_BRAIN_LOCKED_DEFAULT = false;

/** internal state shape for the row brain */
type ViewOptionsFieldRowBrainState = {
  /** the edge (top or bottom) of the row the dragged pointer is currently closer to, or null when not over */
  closestEdge: ViewOptionsFieldEdge | null;
};

/**
 * headless brain directive for a view-options field row. owns the per-row draggable + drop-target registrations
 * on the row element, the closest-edge state during a drag-over, and the host attributes needed for list
 * semantics and drag visualization. carries no styling — the presentation reads the public computed signals to
 * render the drop-indicator and the drag affordance.
 */
@Directive({
  selector: '[orgViewOptionsFieldRowBrain]',
  exportAs: 'orgViewOptionsFieldRowBrain',
  host: {
    role: 'listitem',
    '[attr.data-name]': 'name()',
    '[attr.data-locked]': 'locked() ? "" : null',
    '[attr.data-being-dragged]': 'isBeingDragged() ? "" : null',
    '[attr.data-closest-edge]': 'closestEdge()',
    '[attr.aria-disabled]': 'locked() ? "true" : null',
  },
})
export class ViewOptionsFieldRowBrainDirective {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _parentBrain = inject(ViewOptionsBrainDirective);

  private readonly _state = signal<ViewOptionsFieldRowBrainState>({ closestEdge: null });

  /** the element used as the drag handle; the row stays the drag source but drag can only start from this element */
  private readonly _dragHandle = signal<HTMLElement | null>(null);

  /** stable name of the row's field; must be unique within the panel */
  public readonly name = input.required<string>();

  /** when true, this row cannot be picked up to drag (but remains a drop target) */
  public readonly locked = input<boolean>(VIEW_OPTIONS_FIELD_ROW_BRAIN_LOCKED_DEFAULT);

  /** whether this row is the active drag source */
  public readonly isBeingDragged = computed<boolean>(() => this._parentBrain.draggingName() === this.name());

  /** the edge of this row the drag pointer is closer to, or null when not currently over */
  public readonly closestEdge = computed<ViewOptionsFieldEdge | null>(() => this._state().closestEdge);

  constructor() {
    this._initializeDraggable();
    this._initializeDropTarget();

    // clear the local closest-edge state when no drag is in progress (defensive — onDragLeave usually wins)
    effect(() => {
      if (!this._parentBrain.isDragging()) {
        this._state.set({ closestEdge: null });
      }
    });
  }

  /** moves this row one position earlier in the parent's fields list */
  public moveUp(): void {
    this._parentBrain.moveUp(this.name());
  }

  /** moves this row one position later in the parent's fields list */
  public moveDown(): void {
    this._parentBrain.moveDown(this.name());
  }

  /**
   * registers the element that should serve as the drag handle. drag will only initiate from this element while
   * the rest of the row is unaffected. pass null to unregister (e.g. when the handle is removed because the
   * row became locked). the presentation calls this from a viewChild-driven effect.
   */
  public setDragHandle(element: HTMLElement | null): void {
    this._dragHandle.set(element);
  }

  /**
   * sets up the row as a draggable but constrained to start only from the handle element. re-runs whenever the
   * handle or the locked state changes — when there is no handle or the row is locked, no draggable is registered
   * for this row (defensive: the presentation also removes the handle from the dom when locked).
   */
  private _initializeDraggable(): void {
    let cleanup: (() => void) | null = null;

    effect(() => {
      cleanup?.();
      cleanup = null;

      const handle = this._dragHandle();

      if (!handle || this.locked()) {
        return;
      }

      cleanup = draggable({
        element: this._elementRef.nativeElement,
        dragHandle: handle,
        getInitialData: () => ({
          type: VIEW_OPTIONS_FIELD_DRAG_TYPE,
          name: this.name(),
        }),
      });
    });

    this._destroyRef.onDestroy(() => cleanup?.());
  }

  /** sets up the row element as a drop target; runs once and lives for the directive's lifetime */
  private _initializeDropTarget(): void {
    const cleanup = dropTargetForElements({
      element: this._elementRef.nativeElement,
      canDrop: ({ source }) => source.data['type'] === VIEW_OPTIONS_FIELD_DRAG_TYPE,
      getData: ({ input: pointerInput }) => {
        const edge = this._computeClosestEdge(pointerInput.clientY);

        return {
          type: VIEW_OPTIONS_FIELD_DROP_TYPE,
          name: this.name(),
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

  /** returns "top" when the pointer is in the upper half of this row and "bottom" otherwise */
  private _computeClosestEdge(clientY: number): ViewOptionsFieldEdge {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    return clientY < midpoint ? 'top' : 'bottom';
  }
}
