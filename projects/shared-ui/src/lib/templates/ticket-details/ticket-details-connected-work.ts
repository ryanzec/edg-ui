import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { Avatar } from '../../core/avatar/avatar';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Icon } from '../../core/icon/icon';
import { Indicator } from '../../core/indicator/indicator';
import { Tag, type TagColor } from '../../core/tags/tag';
import {
  ticketLinkedPullRequestStateColorMap,
  ticketStatusColorMap,
  ticketStatusLabelMap,
  type TicketConnectedBlockedBy,
  type TicketConnectedLinkedPullRequest,
  type TicketConnectedParent,
  type TicketConnectedWorkItem,
} from './ticket-details-types';

/** default value for the isExpanded model */
export const TICKET_DETAILS_CONNECTED_WORK_IS_EXPANDED_DEFAULT = false;

@Component({
  selector: 'org-ticket-details-connected-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Card, CardContent, CardHeader, Icon, Indicator, Tag],
  templateUrl: './ticket-details-connected-work.html',
  host: {
    class: 'block',
  },
})
export class TicketDetailsConnectedWork {
  /** the connected-work items to render */
  public readonly items = input.required<TicketConnectedWorkItem[]>();

  /** the count of connected-work items needing attention, rendered as a red badge */
  public readonly attentionCount = input<number>(0);

  /** two-way bindable expanded state of the card */
  public readonly isExpanded = model<boolean>(TICKET_DETAILS_CONNECTED_WORK_IS_EXPANDED_DEFAULT);

  /** parent items, grouped under the PARENT section */
  protected readonly parentItems = computed<TicketConnectedParent[]>(() =>
    this.items().filter((item): item is TicketConnectedParent => item.kind === 'parent')
  );

  /** blocked-by items, grouped under the BLOCKED BY section */
  protected readonly blockedByItems = computed<TicketConnectedBlockedBy[]>(() =>
    this.items().filter((item): item is TicketConnectedBlockedBy => item.kind === 'blocked-by')
  );

  /** linked pr items, grouped under the LINKED PRS section */
  protected readonly linkedPullRequestItems = computed<TicketConnectedLinkedPullRequest[]>(() =>
    this.items().filter((item): item is TicketConnectedLinkedPullRequest => item.kind === 'linked-pr')
  );

  /** total count of all connected-work items, rendered in the header */
  protected readonly totalCount = computed<number>(() => this.items().length);

  /** whether the attention badge should render */
  protected readonly showAttentionBadge = computed<boolean>(() => this.attentionCount() > 0);

  /** resolves the status tag color for a blocked-by item */
  protected getBlockedByStatusColor(item: TicketConnectedBlockedBy): TagColor {
    return ticketStatusColorMap[item.status];
  }

  /** resolves the status tag label for a blocked-by item */
  protected getBlockedByStatusLabel(item: TicketConnectedBlockedBy): string {
    return ticketStatusLabelMap[item.status];
  }

  /** resolves the state tag color for a linked-pr item */
  protected getLinkedPrStateColor(item: TicketConnectedLinkedPullRequest): TagColor {
    return ticketLinkedPullRequestStateColorMap[item.state];
  }
}
