import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { dateUtils } from '@organization/shared-utils';
import { Avatar } from '../../core/avatar/avatar';
import { Box } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxFooter } from '../../core/box/box-footer';
import { BoxHeader } from '../../core/box/box-header';
import { Tag } from '../../core/tags/tag';
import { type KanbanTicket } from './tickets-kanban-types';

@Component({
  selector: 'org-tickets-kanban-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Box, BoxContent, BoxFooter, BoxHeader, Tag],
  templateUrl: './tickets-kanban-card.html',
})
export class TicketsKanbanCard {
  /** the ticket record to render */
  public readonly ticket = input.required<KanbanTicket>();

  /** human-readable relative timestamp shown in the footer (e.g. "5 minutes ago") */
  protected readonly updatedRelative = computed<string>(() => dateUtils.fromNow(this.ticket().updatedAt));

  /** initials derived from the creator's name; used as the avatar label */
  protected readonly creatorInitials = computed<string>(() => {
    const parts = this.ticket().createdBy.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';

    return `${first}${last}`.toUpperCase();
  });
}
