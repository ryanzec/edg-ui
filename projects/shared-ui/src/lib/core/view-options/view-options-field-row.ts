import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ViewOptionsBrainDirective, type ViewField } from '../view-options/view-options-brain';
import {
  VIEW_OPTIONS_FIELD_ROW_BRAIN_LOCKED_DEFAULT,
  ViewOptionsFieldRowBrainDirective,
} from '../view-options/view-options-field-row-brain';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icon-brain';
import { TextDirective } from '../text-directive/text-directive';

/** default icon used by the row when the field has no iconName */
const VIEW_OPTIONS_FIELD_ROW_DEFAULT_ICON: IconName = 'circle';

/** the icon used to indicate a locked field row */
const VIEW_OPTIONS_FIELD_ROW_LOCK_ICON: IconName = 'lock';

/** the icon used for the row drag handle */
const VIEW_OPTIONS_FIELD_ROW_DRAG_HANDLE_ICON: IconName = 'grip-vertical';

@Component({
  selector: 'org-view-options-field-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle, Icon, TextDirective],
  templateUrl: './view-options-field-row.html',
  styleUrl: './view-options-field-row.css',
  hostDirectives: [
    {
      directive: ViewOptionsFieldRowBrainDirective,
      inputs: ['name', 'locked'],
    },
  ],
})
export class ViewOptionsFieldRow {
  private readonly _injector = inject(Injector);

  /** reference to the host row brain directive; template reads closestEdge and isBeingDragged */
  protected readonly brain = inject(ViewOptionsFieldRowBrainDirective);

  /** reference to the parent view-options brain; row calls setEnabledAt on toggle and moveUp/moveDown on keyboard */
  protected readonly parentBrain = inject(ViewOptionsBrainDirective);

  /** the field this row represents; the full shape is needed for the visual content (label, icon) */
  public readonly field = input.required<ViewField>();

  /** the drag handle button element; only present in the dom when the row is not locked */
  protected readonly dragHandleRef = viewChild<ElementRef<HTMLElement>>('dragHandleRef');

  constructor() {
    // forwards the current drag handle element to the brain so it can constrain drag initiation to that element
    effect(() => {
      this.brain.setDragHandle(this.dragHandleRef()?.nativeElement ?? null);
    });
  }

  /** the resolved icon name used for the row, defaulting to a generic icon when the field provides none */
  protected readonly resolvedIconName = computed<IconName>(
    () => this.field().iconName ?? VIEW_OPTIONS_FIELD_ROW_DEFAULT_ICON
  );

  /** the resolved locked state used for templating; defaults to false when the field omits the flag */
  protected readonly resolvedLocked = computed<boolean>(
    () => this.field().locked ?? VIEW_OPTIONS_FIELD_ROW_BRAIN_LOCKED_DEFAULT
  );

  /** the icon name used to indicate a locked row */
  protected readonly lockIconName: IconName = VIEW_OPTIONS_FIELD_ROW_LOCK_ICON;

  /** the icon name used for the drag handle */
  protected readonly dragHandleIconName: IconName = VIEW_OPTIONS_FIELD_ROW_DRAG_HANDLE_ICON;

  /** the accessible label for the drag handle, derived from the field label */
  protected readonly dragHandleAriaLabel = computed<string>(() => `Reorder ${this.field().label}`);

  /** handles the toggle change event by delegating to the parent brain */
  protected onToggle(enabled: boolean): void {
    this.parentBrain.setEnabledAt(this.field().name, enabled);
  }

  /** handles a click on the row body (icon + label region); flips the enabled flag on the field */
  protected onBodyClick(): void {
    if (this.resolvedLocked()) {
      return;
    }

    this.parentBrain.setEnabledAt(this.field().name, !this.field().enabled);
  }

  /** handles keyboard interaction on the drag handle; arrow keys delegate to the row brain's move methods */
  protected onDragHandleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowUp') {
      this.brain.moveUp();
    } else {
      this.brain.moveDown();
    }

    // angular's @for may detach + re-attach the row's dom node when reconciling the reorder, which drops focus
    // to the document body. restoring focus after the next render keeps keyboard reorder feeling continuous in
    // both directions.
    afterNextRender(
      () => {
        this.dragHandleRef()?.nativeElement?.focus();
      },
      { injector: this._injector }
    );
  }
}
