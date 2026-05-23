import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Avatar } from '../../core/avatar/avatar';
import { Box } from '../../core/box/box';
import { Button } from '../../core/button/button';
import { DatePipe } from '../../core/date-pipe/date-pipe';
import { Tab } from '../../core/tabs/tab';
import { Tabs } from '../../core/tabs/tabs';
import { Textarea } from '../../core/textarea/textarea';
import { TextareaToolbar } from '../../core/textarea/textarea-toolbar';
import { TextareaToolbarItem } from '../../core/textarea/textarea-toolbar-item';
import { Timeline } from '../../core/timeline/timeline';
import { TimelineItem, type TimelineItemColor } from '../../core/timeline/timeline-item';
import {
  ticketActivityChangeColorMap,
  ticketActivityChangeIconMap,
  type TicketActivityChange,
  type TicketActivityEntry,
  type TicketActivityFilter,
} from './ticket-details-types';
import { type IconName } from '../../core/icon/icon-brain';

@Component({
  selector: 'org-ticket-details-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar,
    Box,
    Button,
    DatePipe,
    Tab,
    Tabs,
    Textarea,
    TextareaToolbar,
    TextareaToolbarItem,
    Timeline,
    TimelineItem,
  ],
  templateUrl: './ticket-details-activity.html',
  host: {
    class: 'block',
  },
})
export class TicketDetailsActivity {
  private readonly _commentSubmitted$ = new Subject<string>();

  /** the full activity feed to render */
  public readonly activity = input.required<TicketActivityEntry[]>();

  /** two-way bindable filter selection — drives which entries are rendered */
  public readonly filter = model<TicketActivityFilter>('all');

  /** the current value of the composer textarea */
  protected readonly composerValue = signal<string>('');

  /** emitted when the user submits a new comment via the composer */
  public readonly commentSubmitted = outputFromObservable(this._commentSubmitted$);

  /** count of comment entries */
  protected readonly commentCount = computed<number>(
    () => this.activity().filter((entry) => entry.type === 'comment').length
  );

  /** count of change entries */
  protected readonly changeCount = computed<number>(
    () => this.activity().filter((entry) => entry.type === 'change').length
  );

  /** total count of activity entries */
  protected readonly totalCount = computed<number>(() => this.activity().length);

  /** the activity entries to render based on the current filter */
  protected readonly filteredActivity = computed<TicketActivityEntry[]>(() => {
    const current = this.filter();

    if (current === 'comments') {
      return this.activity().filter((entry) => entry.type === 'comment');
    }

    if (current === 'changes') {
      return this.activity().filter((entry) => entry.type === 'change');
    }

    return this.activity();
  });

  /** whether the composer's Comment submit button should be disabled (empty composer) */
  protected readonly isSubmitDisabled = computed<boolean>(() => this.composerValue().trim().length === 0);

  /** resolves the marker icon for a change entry */
  protected getChangeIcon(change: TicketActivityChange): IconName {
    return ticketActivityChangeIconMap[change.changeType];
  }

  /** resolves the marker color for a change entry */
  protected getChangeColor(change: TicketActivityChange): TimelineItemColor {
    return ticketActivityChangeColorMap[change.changeType];
  }

  /** handles a tab selection change */
  protected onFilterChange(value: string | undefined): void {
    if (value === 'all' || value === 'comments' || value === 'changes') {
      this.filter.set(value);
    }
  }

  /** handles a Comment submit interaction — emits the trimmed value and clears the composer */
  protected onSubmitComment(): void {
    const trimmed = this.composerValue().trim();

    if (trimmed.length === 0) {
      return;
    }

    this._commentSubmitted$.next(trimmed);
    this.composerValue.set('');
  }
}
