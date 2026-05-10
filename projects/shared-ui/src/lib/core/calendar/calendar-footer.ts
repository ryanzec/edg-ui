import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Button } from '../button/button';
import { Calendar } from './calendar';

// input defaults
export const CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT = '';
export const CALENDAR_FOOTER_SHOW_TODAY_DEFAULT = false;
export const CALENDAR_FOOTER_SHOW_CANCEL_APPLY_DEFAULT = false;

/**
 * calendar footer component — supports both built-in actions (Today / Cancel / Apply) and arbitrary
 * projected content via `<ng-content/>`. consumers can opt into either or both via the `showToday` and
 * `showCancelApply` inputs.
 */
@Component({
  selector: 'org-calendar-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './calendar-footer.html',
  styleUrl: './calendar-footer.css',
})
export class CalendarFooter {
  /** optional reference to the parent calendar; used to inherit the disabled state when nested */
  private readonly _parentCalendar = inject(Calendar, { optional: true });

  /** additional css classes applied to the outer footer container */
  public readonly containerClass = input<string>(CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT);

  /** whether to render the built-in Today action button on the left */
  public readonly showToday = input<boolean>(CALENDAR_FOOTER_SHOW_TODAY_DEFAULT);

  /** whether to render the built-in Cancel + Apply action buttons on the right */
  public readonly showCancelApply = input<boolean>(CALENDAR_FOOTER_SHOW_CANCEL_APPLY_DEFAULT);

  /** the resolved disabled state — inherited from the parent calendar when nested */
  protected readonly isDisabled = computed<boolean>(() => this._parentCalendar?.disabled() ?? false);

  /** emitted when the built-in Today action button is clicked */
  public readonly today = output<void>();

  /** emitted when the built-in Cancel action button is clicked */
  public readonly cancel = output<void>();

  /** emitted when the built-in Apply action button is clicked */
  public readonly apply = output<void>();

  /** whether any built-in action is enabled, used to render the actions row */
  protected readonly hasBuiltInActions = computed<boolean>(() => this.showToday() || this.showCancelApply());

  /** handles built-in Today click */
  protected onTodayClicked(): void {
    this.today.emit();
  }

  /** handles built-in Cancel click */
  protected onCancelClicked(): void {
    this.cancel.emit();
  }

  /** handles built-in Apply click */
  protected onApplyClicked(): void {
    this.apply.emit();
  }
}
