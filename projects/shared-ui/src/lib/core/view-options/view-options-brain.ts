import { Directive, DestroyRef, computed, inject, input, model, output, signal } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { ElementDragPayload } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { IconName } from '../icon/icon-brain';

/** the drag payload type marker for a view-options field source */
export const VIEW_OPTIONS_FIELD_DRAG_TYPE = 'view-options-field-source';

/** the drop target type marker placed on individual field rows */
export const VIEW_OPTIONS_FIELD_DROP_TYPE = 'view-options-field-drop';

/** which edge of a row the pointer is closer to during a drag-over */
export const allViewOptionsFieldEdges = ['top', 'bottom'] as const;

/** which edge of a row the pointer is closer to during a drag-over */
export type ViewOptionsFieldEdge = (typeof allViewOptionsFieldEdges)[number];

/** the shape of a single field row's data */
export type ViewField = {
  /** the internal stable id of the field; must be unique within the array */
  name: string;
  /** the human-readable label shown next to the toggle */
  label: string;
  /** whether the field is currently visible */
  enabled: boolean;
  /** optional icon shown to the left of the label; the row template renders a default icon when omitted */
  iconName?: IconName;
  /** when true, the row shows a lock icon instead of a toggle and its visibility cannot be changed; reorder is still allowed */
  locked?: boolean;
};

/** the payload emitted when one or more fields are reordered or toggled by the brain */
export type ViewOptionsFieldsChangeEvent = {
  /** the next ordered list of fields */
  fields: readonly ViewField[];
};

/** default value for the ariaLabel input */
export const VIEW_OPTIONS_BRAIN_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the fields model */
export const VIEW_OPTIONS_BRAIN_FIELDS_DEFAULT: readonly ViewField[] = [];

/** internal state shape for the view-options brain */
type ViewOptionsBrainState = {
  /** whether a field row is currently being dragged */
  isDragging: boolean;
  /** the field name currently being dragged, or null when no drag is in progress */
  draggingName: string | null;
};

/**
 * headless brain directive for view-options. owns the fields model, the global drag monitor (one per panel),
 * the active drag state, and the immutable reorder + toggle mutators. carries no styling — the presentation
 * reads the public computed signals to drive visual feedback.
 */
@Directive({
  selector: '[orgViewOptionsBrain]',
  exportAs: 'orgViewOptionsBrain',
  host: {
    role: 'region',
    '[attr.aria-label]': 'ariaLabel() ?? "View options"',
    '[attr.data-dragging]': 'isDragging() ? "" : null',
  },
})
export class ViewOptionsBrainDirective {
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _state = signal<ViewOptionsBrainState>({
    isDragging: false,
    draggingName: null,
  });

  /** optional accessible label describing the panel; falls back to a generic label */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(
    VIEW_OPTIONS_BRAIN_ARIA_LABEL_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** the ordered list of fields; two-way so the consumer can drive and observe order + visibility */
  public readonly fields = model<readonly ViewField[]>(VIEW_OPTIONS_BRAIN_FIELDS_DEFAULT);

  /** emitted whenever a drop, toggle, or keyboard reorder mutates the fields list */
  public readonly fieldsChanged = output<ViewOptionsFieldsChangeEvent>();

  /** whether a row is currently being dragged */
  public readonly isDragging = computed<boolean>(() => this._state().isDragging);

  /** the name of the field currently being dragged, or null when no drag is in progress */
  public readonly draggingName = computed<string | null>(() => this._state().draggingName);

  /** the number of fields whose enabled flag is true */
  public readonly enabledCount = computed<number>(() => this.fields().filter((field) => field.enabled).length);

  /** the total number of fields */
  public readonly totalCount = computed<number>(() => this.fields().length);

  constructor() {
    this._initializeMonitor();
  }

  /** whether the field with the given name is currently being dragged */
  public isBeingDragged(name: string): boolean {
    return this._state().draggingName === name;
  }

  /** sets the enabled flag on the field with the given name; no-op when the field is locked or missing */
  public setEnabledAt(name: string, enabled: boolean): void {
    const current = this.fields();
    const index = current.findIndex((field) => field.name === name);

    if (index === -1) {
      return;
    }

    if (current[index].locked) {
      return;
    }

    if (current[index].enabled === enabled) {
      return;
    }

    const next = current.map((field, currentIndex) => (currentIndex === index ? { ...field, enabled } : field));
    this._commit(next);
  }

  /** moves the field one position earlier in the order; no-op when the field is missing or already first */
  public moveUp(name: string): void {
    this._moveByDelta(name, -1);
  }

  /** moves the field one position later in the order; no-op when the field is missing or already last */
  public moveDown(name: string): void {
    this._moveByDelta(name, 1);
  }

  /** moves the field with `name` to a position computed from the target row + edge; no-op when source or target is missing */
  public moveRelativeTo(name: string, targetName: string, edge: ViewOptionsFieldEdge): void {
    const current = this.fields();
    const sourceIndex = current.findIndex((field) => field.name === name);
    const targetIndex = current.findIndex((field) => field.name === targetName);

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
      return;
    }

    const withoutSource = current.filter((_, index) => index !== sourceIndex);
    const targetIndexAfterRemoval = withoutSource.findIndex((field) => field.name === targetName);
    const insertAt = edge === 'top' ? targetIndexAfterRemoval : targetIndexAfterRemoval + 1;

    const next = [...withoutSource.slice(0, insertAt), current[sourceIndex], ...withoutSource.slice(insertAt)];

    if (this._isSameOrder(current, next)) {
      return;
    }

    this._commit(next);
  }

  /** writes the new fields array to the model and emits the change event */
  private _commit(next: readonly ViewField[]): void {
    this.fields.set(next);
    this.fieldsChanged.emit({ fields: next });
  }

  /** shared implementation for moveUp and moveDown */
  private _moveByDelta(name: string, delta: -1 | 1): void {
    const current = this.fields();
    const index = current.findIndex((field) => field.name === name);

    if (index === -1) {
      return;
    }

    const newIndex = index + delta;

    if (newIndex < 0 || newIndex >= current.length) {
      return;
    }

    const next = current.slice();
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    this._commit(next);
  }

  /** sets up the global drag monitor; runs once in the constructor and cleans up on destroy */
  private _initializeMonitor(): void {
    const cleanup = monitorForElements({
      canMonitor: ({ source }) => source.data['type'] === VIEW_OPTIONS_FIELD_DRAG_TYPE,
      onDragStart: ({ source }) => {
        const name = source.data['name'] as string | undefined;
        this._state.set({ isDragging: true, draggingName: name ?? null });
      },
      onDrop: ({ source, location }) => {
        this._state.set({ isDragging: false, draggingName: null });
        this._resolveAndApplyMove(source, location.current.dropTargets);
      },
    });

    this._destroyRef.onDestroy(() => cleanup());
  }

  /** resolves the destination of a completed drop and applies the move when valid */
  private _resolveAndApplyMove(
    source: ElementDragPayload,
    dropTargets: readonly { data: Record<string | symbol, unknown> }[]
  ): void {
    if (dropTargets.length === 0) {
      return;
    }

    const sourceName = source.data['name'] as string | undefined;

    if (!sourceName) {
      return;
    }

    const innermost = dropTargets[0];

    if (innermost.data['type'] !== VIEW_OPTIONS_FIELD_DROP_TYPE) {
      return;
    }

    const targetName = innermost.data['name'] as string | undefined;
    const edge = innermost.data['edge'] as ViewOptionsFieldEdge | undefined;

    if (!targetName || !edge) {
      return;
    }

    if (sourceName === targetName) {
      return;
    }

    this.moveRelativeTo(sourceName, targetName, edge);
  }

  /** returns true when two field arrays have identical ordering by name */
  private _isSameOrder(a: readonly ViewField[], b: readonly ViewField[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    for (let index = 0; index < a.length; index += 1) {
      if (a[index].name !== b[index].name) {
        return false;
      }
    }

    return true;
  }
}
