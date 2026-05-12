import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * named projection slot for the left-aligned actions inside an `org-calendar-footer`. uses
 * `display: contents` so projected children participate directly in the footer's flex layout.
 */
@Component({
  selector: 'org-calendar-footer-left-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-footer-left-actions.html',
  styleUrl: './calendar-footer-left-actions.css',
})
export class CalendarFooterLeftActions {}
