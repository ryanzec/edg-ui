import { Component, ChangeDetectionStrategy } from '@angular/core';

/** displays the main body content for a timeline item */
@Component({
  selector: 'org-timeline-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: '<ng-content />',
})
export class TimelineContent {}
