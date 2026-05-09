import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Indicator } from '../indicator/indicator';
import { ComponentColor } from '../types/component-types';
import { TimelineItemBrainDirective } from '../../brain/timeline-item-brain/timeline-item-brain';

/** color options for the timeline item component */
export type TimelineItemColor = ComponentColor;

/** default value for the color input */
export const TIMELINE_ITEM_COLOR_DEFAULT: TimelineItemColor = 'primary';

/** a single item in the timeline containing an indicator with connecting lines and projected content */
@Component({
  selector: 'org-timeline-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator],
  templateUrl: './timeline-item.html',
  styleUrl: './timeline-item.css',
  hostDirectives: [
    {
      directive: TimelineItemBrainDirective,
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
  },
})
export class TimelineItem {
  /** the semantic color applied to the indicator dot and connecting lines */
  public color = input<TimelineItemColor>(TIMELINE_ITEM_COLOR_DEFAULT);
}
