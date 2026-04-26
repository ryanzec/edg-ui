import { Component, ChangeDetectionStrategy, input } from '@angular/core';

// input defaults
export const CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT = '';

/**
 * calendar footer component - generic container for footer content
 */
@Component({
  selector: 'org-calendar-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './calendar-footer.html',
  styleUrl: './calendar-footer.css',
})
export class CalendarFooter {
  public containerClass = input<string>(CALENDAR_FOOTER_CONTAINER_CLASS_DEFAULT);
}
