import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { IconName } from '../../brain/icon-brain/icon-brain';
import { ComponentColor } from '../types/component-types';
import { TimelineItemBrainDirective } from '../../brain/timeline-item-brain/timeline-item-brain';

/** color options for the timeline item component */
export type TimelineItemColor = ComponentColor;

/** default value for the color input */
export const TIMELINE_ITEM_COLOR_DEFAULT: TimelineItemColor = 'neutral';

/** default value for the dotIcon input */
export const TIMELINE_ITEM_DOT_ICON_DEFAULT: IconName | undefined = undefined;

/** a single item in the timeline containing a colored dot, an optional dot icon, a connecting rail, and projected content */
@Component({
  selector: 'org-timeline-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './timeline-item.html',
  styleUrl: './timeline-item.css',
  hostDirectives: [
    {
      directive: TimelineItemBrainDirective,
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-has-icon]': 'dotIcon() ? "" : null',
  },
})
export class TimelineItem {
  /** the semantic color applied to the dot and the connector running below it */
  public readonly color = input<TimelineItemColor>(TIMELINE_ITEM_COLOR_DEFAULT);

  /** when set, renders the named icon inside the dot and grows the dot to host it */
  public readonly dotIcon = input<IconName | undefined, IconName | null | undefined>(TIMELINE_ITEM_DOT_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
