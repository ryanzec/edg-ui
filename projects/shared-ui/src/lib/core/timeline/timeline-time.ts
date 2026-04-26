import { Component, ChangeDetectionStrategy } from '@angular/core';

/** displays the time label for a timeline item using subtle text styling */
@Component({
  selector: 'org-timeline-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './timeline-time.css',
})
export class TimelineTime {}
