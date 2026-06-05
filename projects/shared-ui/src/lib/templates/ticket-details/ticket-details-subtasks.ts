import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../../core/button/button';
import { Box, type BoxExpandedState } from '../../core/box/box';
import { BoxContent } from '../../core/box/box-content';
import { BoxHeader } from '../../core/box/box-header';
import { Icon } from '../../core/icon/icon';
import { type TicketSubtask } from './ticket-details-types';

/** default value for the expandedState model */
export const TICKET_DETAILS_SUBTASKS_EXPANDED_STATE_DEFAULT: BoxExpandedState = 'header-only';

/** event payload emitted when a subtask's completed state is toggled by the user */
export type TicketDetailsSubtaskToggledEvent = {
  /** the id of the subtask that was toggled */
  id: string;
  /** the resulting completed state */
  completed: boolean;
};

@Component({
  selector: 'org-ticket-details-subtasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Box, BoxContent, BoxHeader, Icon],
  templateUrl: './ticket-details-subtasks.html',
  styleUrl: './ticket-details-subtasks.css',
  host: {
    class: 'block',
  },
})
export class TicketDetailsSubtasks {
  private readonly _subtaskToggled$ = new Subject<TicketDetailsSubtaskToggledEvent>();

  private readonly _subtaskAddRequested$ = new Subject<void>();

  /** the subtasks to render */
  public readonly subtasks = input.required<TicketSubtask[]>();

  /** two-way bindable expanded state of the card */
  public readonly expandedState = model<BoxExpandedState>(TICKET_DETAILS_SUBTASKS_EXPANDED_STATE_DEFAULT);

  /** emitted when a subtask checkbox is toggled */
  public readonly subtaskToggled = outputFromObservable(this._subtaskToggled$);

  /** emitted when the user clicks the Add subtask button */
  public readonly subtaskAddRequested = outputFromObservable(this._subtaskAddRequested$);

  /** count of completed subtasks */
  protected readonly completedCount = computed<number>(
    () => this.subtasks().filter((subtask) => subtask.completed).length
  );

  /** total count of subtasks */
  protected readonly totalCount = computed<number>(() => this.subtasks().length);

  /** progress as a percentage (0-100) for the thin progress bar */
  protected readonly progressPercent = computed<number>(() => {
    const total = this.totalCount();

    if (total === 0) {
      return 0;
    }

    return (this.completedCount() / total) * 100;
  });

  /** human-readable fraction text rendered in the header */
  protected readonly fractionLabel = computed<string>(() => `${this.completedCount()}/${this.totalCount()}`);

  /** handles a subtask checkbox toggle */
  protected onToggleSubtask(subtask: TicketSubtask): void {
    this._subtaskToggled$.next({ id: subtask.id, completed: !subtask.completed });
  }

  /** handles the Add subtask button click */
  protected onAddSubtaskClicked(): void {
    this._subtaskAddRequested$.next();
  }
}
