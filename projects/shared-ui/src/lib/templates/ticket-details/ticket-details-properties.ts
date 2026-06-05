import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../../core/avatar/avatar';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Tag } from '../../core/tags/tag';
import { Tags } from '../../core/tags/tags';
import { type TicketProperties } from './ticket-details-types';

@Component({
  selector: 'org-ticket-details-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Box, BoxContent, BoxHeader, Tag, Tags],
  templateUrl: './ticket-details-properties.html',
  host: {
    class: 'block',
  },
})
export class TicketDetailsProperties {
  /** the properties record to render */
  public readonly properties = input.required<TicketProperties>();
}
