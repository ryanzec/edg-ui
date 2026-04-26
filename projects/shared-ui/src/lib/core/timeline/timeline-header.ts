import { Component, ChangeDetectionStrategy } from '@angular/core';

/** displays the header for a timeline item using lg text sizing */
@Component({
  selector: 'org-timeline-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
  styleUrl: './timeline-header.css',
})
export class TimelineHeader {}
