import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TimelineHeaderBrainDirective } from '../../brain/timeline-brain/timeline-header-brain';

/** displays the header for a timeline item, rendering as the html heading element selected by headingLevel */
@Component({
  selector: 'org-timeline-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.css',
  hostDirectives: [
    {
      directive: TimelineHeaderBrainDirective,
      inputs: ['headingLevel'],
    },
  ],
})
export class TimelineHeader {
  /** reference to the host timeline header brain directive owning the headingLevel input */
  protected readonly brain = inject(TimelineHeaderBrainDirective, { self: true });
}
