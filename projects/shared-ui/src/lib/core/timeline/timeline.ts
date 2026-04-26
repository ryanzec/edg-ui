import { Component, ChangeDetectionStrategy } from '@angular/core';

/** container component for a vertical timeline list */
@Component({
  selector: 'org-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline {}
