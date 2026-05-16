import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Avatar } from '../../core/avatar/avatar';
import { AvatarStack } from '../../core/avatar/avatar-stack';
import { Button } from '../../core/button/button';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Checklist, type ChecklistItemData } from '../../core/checklist/checklist';
import { Divider } from '../../core/divider/divider';
import { DropDownSelector, type DropDownSelectorPosition } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../brain/drop-down-selector-brain/drop-down-selector-brain';
import { Icon } from '../../core/icon/icon';
import { Indicator } from '../../core/indicator/indicator';
import { Tag } from '../../core/tags/tag';
import { TicketDetailsActivity } from './ticket-details-activity';
import { TicketDetailsBlockedBanner } from './ticket-details-blocked-banner';
import { TicketDetailsConnectedWork } from './ticket-details-connected-work';
import { TicketDetailsProperties } from './ticket-details-properties';
import { TicketDetailsSubtasks } from './ticket-details-subtasks';
import {
  allTicketStatuses,
  ticketPriorityColorMap,
  ticketPriorityLabelMap,
  ticketStatusColorMap,
  ticketStatusDescriptorMap,
  ticketStatusLabelMap,
  ticketTypeLabelMap,
  type Ticket,
  type TicketStatus,
} from './ticket-details-types';
import { type ComponentColor } from '../../core/types/component-types';

/** the status drop-down's overlay position relative to the trigger */
const STATUS_POSITION: DropDownSelectorPosition = 'below';

/** event payload emitted when a subtask's completed state is toggled */
export type TicketDetailsSubtaskToggledEvent = {
  /** the id of the subtask that was toggled */
  id: string;
  /** the resulting completed state */
  completed: boolean;
};

/** event payload emitted when an acceptance criterion is toggled */
export type TicketDetailsAcceptanceCriterionToggledEvent = {
  /** the id of the criterion that was toggled */
  id: string;
  /** the resulting completed state */
  completed: boolean;
};

@Component({
  selector: 'org-ticket-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar,
    AvatarStack,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checklist,
    Divider,
    DropDownSelector,
    Icon,
    Indicator,
    Tag,
    TicketDetailsActivity,
    TicketDetailsBlockedBanner,
    TicketDetailsConnectedWork,
    TicketDetailsProperties,
    TicketDetailsSubtasks,
  ],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
  host: {
    class: 'block',
  },
})
export class TicketDetails {
  private readonly _statusChanged$ = new Subject<TicketStatus>();

  private readonly _commentSubmitted$ = new Subject<string>();

  private readonly _subtaskToggled$ = new Subject<TicketDetailsSubtaskToggledEvent>();

  private readonly _subtaskAddRequested$ = new Subject<void>();

  private readonly _acceptanceCriterionToggled$ = new Subject<TicketDetailsAcceptanceCriterionToggledEvent>();

  private readonly _unblockClicked$ = new Subject<void>();

  private readonly _pingOwnerClicked$ = new Subject<void>();

  private readonly _descriptionEditRequested$ = new Subject<void>();

  /** the ticket record to render */
  public readonly ticket = input.required<Ticket>();

  /** emitted when the user changes the status via the drop-down */
  public readonly statusChanged = outputFromObservable(this._statusChanged$);

  /** emitted when the user submits a new comment via the composer */
  public readonly commentSubmitted = outputFromObservable(this._commentSubmitted$);

  /** emitted when the user toggles a subtask's completed state */
  public readonly subtaskToggled = outputFromObservable(this._subtaskToggled$);

  /** emitted when the user clicks Add subtask */
  public readonly subtaskAddRequested = outputFromObservable(this._subtaskAddRequested$);

  /** emitted when the user toggles an acceptance criterion */
  public readonly acceptanceCriterionToggled = outputFromObservable(this._acceptanceCriterionToggled$);

  /** emitted when the user clicks the Unblock action in the blocked banner */
  public readonly unblock = outputFromObservable(this._unblockClicked$);

  /** emitted when the user clicks the Ping owner action in the blocked banner */
  public readonly pingOwner = outputFromObservable(this._pingOwnerClicked$);

  /** emitted when the user clicks the description's edit (pencil) button */
  public readonly descriptionEditRequested = outputFromObservable(this._descriptionEditRequested$);

  /** static drop-down position used by the status drop-down (exposed for the template) */
  protected readonly statusPosition: DropDownSelectorPosition = STATUS_POSITION;

  /** the resolved type label for the meta row */
  protected readonly typeLabel = computed<string>(() => ticketTypeLabelMap[this.ticket().type]);

  /** the resolved priority label */
  protected readonly priorityLabel = computed<string>(() => ticketPriorityLabelMap[this.ticket().priority]);

  /** the resolved priority color */
  protected readonly priorityColor = computed<ComponentColor>(() => ticketPriorityColorMap[this.ticket().priority]);

  /** the resolved status color for the dropdown trigger */
  protected readonly statusColor = computed<ComponentColor>(() => ticketStatusColorMap[this.ticket().status]);

  /** the resolved status label */
  protected readonly statusLabel = computed<string>(() => ticketStatusLabelMap[this.ticket().status]);

  /** items rendered inside the status drop-down */
  protected readonly statusItems = computed<SelectionValue<TicketStatus>[]>(() =>
    allTicketStatuses.map((status) => ({
      value: status,
      display: `${ticketStatusLabelMap[status]} — ${ticketStatusDescriptorMap[status]}`,
    }))
  );

  /** the currently selected status as a SelectionValue array for the drop-down model */
  protected readonly statusSelectedItems = computed<SelectionValue<TicketStatus>[]>(() => {
    const status = this.ticket().status;

    return [
      {
        value: status,
        display: `${ticketStatusLabelMap[status]} — ${ticketStatusDescriptorMap[status]}`,
      },
    ];
  });

  /** acceptance criteria mapped into the org-checklist's data shape */
  protected readonly acceptanceChecklistItems = computed<ChecklistItemData[]>(() =>
    this.ticket().acceptanceCriteria.map((criterion) => ({
      id: criterion.id,
      label: criterion.label,
      status: criterion.completed ? 'valid' : 'not-started',
    }))
  );

  /** formatted long-form date used in the meta line (e.g. "Apr 24, 2026") */
  protected readonly openedAtFormatted = computed<string>(() => this.ticket().openedAt.toFormat('MMM d, yyyy'));

  /** formatted short due-date label (e.g. "May 19") */
  protected readonly dueDateFormatted = computed<string>(() => this.ticket().dueDate.toFormat('MMM d'));

  /** handles a status drop-down selection change */
  protected onStatusSelectionChange(selected: SelectionValue<TicketStatus>[]): void {
    const first = selected[0];

    if (!first) {
      return;
    }

    if (first.value === this.ticket().status) {
      return;
    }

    this._statusChanged$.next(first.value);
  }

  /** handles a comment submission from the activity composer */
  protected onCommentSubmitted(comment: string): void {
    this._commentSubmitted$.next(comment);
  }

  /** handles a subtask toggle from the subtasks sub-component */
  protected onSubtaskToggled(event: TicketDetailsSubtaskToggledEvent): void {
    this._subtaskToggled$.next(event);
  }

  /** handles an Add subtask request from the subtasks sub-component */
  protected onSubtaskAddRequested(): void {
    this._subtaskAddRequested$.next();
  }

  /** handles an acceptance-criteria item state change from the checklist */
  protected onAcceptanceItemsChange(items: ChecklistItemData[]): void {
    const previousById = new Map(this.ticket().acceptanceCriteria.map((criterion) => [criterion.id, criterion]));

    for (const item of items) {
      const previous = previousById.get(item.id);

      if (!previous) {
        continue;
      }

      const nextCompleted = item.status === 'valid';

      if (previous.completed === nextCompleted) {
        continue;
      }

      this._acceptanceCriterionToggled$.next({ id: item.id, completed: nextCompleted });
    }
  }

  /** handles an Unblock action from the blocked banner */
  protected onUnblockClicked(): void {
    this._unblockClicked$.next();
  }

  /** handles a Ping owner action from the blocked banner */
  protected onPingOwnerClicked(): void {
    this._pingOwnerClicked$.next();
  }

  /** handles the description edit (pencil) button click */
  protected onDescriptionEditClicked(): void {
    this._descriptionEditRequested$.next();
  }
}
