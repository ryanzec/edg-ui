import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../../core/avatar/avatar';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Tag } from '../../core/tags/tag';
import { Tags } from '../../core/tags/tags';
import { type TicketProperties } from './ticket-details-types';

@Component({
  selector: 'org-ticket-details-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Card, CardContent, CardHeader, Tag, Tags],
  templateUrl: './ticket-details-properties.html',
  host: {
    class: 'block',
  },
})
export class TicketDetailsProperties {
  /** the properties record to render */
  public readonly properties = input.required<TicketProperties>();
}
