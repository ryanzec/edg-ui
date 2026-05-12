import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * named projection slot for the right-aligned actions inside an `org-calendar-footer`. uses
 * `display: contents` so projected children participate directly in the footer's flex layout.
 */
@Component({
  selector: 'org-calendar-footer-right-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-footer-right-actions.html',
  styleUrl: './calendar-footer-right-actions.css',
})
export class CalendarFooterRightActions {}
