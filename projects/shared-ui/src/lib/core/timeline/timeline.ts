import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TimelineBrainDirective } from '../../brain/timeline-brain/timeline-brain';

/** container component for a vertical timeline list */
@Component({
  selector: 'org-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
  hostDirectives: [
    {
      directive: TimelineBrainDirective,
      inputs: ['role'],
    },
  ],
})
export class Timeline {}
