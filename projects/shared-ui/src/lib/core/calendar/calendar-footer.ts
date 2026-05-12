import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// input defaults
export const CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT = '';

/**
 * calendar footer component — renders a left / right action row populated entirely by the consumer
 * via the `org-calendar-footer-left-actions` and `org-calendar-footer-right-actions` named projection
 * slots.
 */
@Component({
  selector: 'org-calendar-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-footer.html',
  styleUrl: './calendar-footer.css',
})
export class CalendarFooter {
  /** additional css classes applied to the outer footer container */
  public readonly containerClass = input<string>(CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT);
}
