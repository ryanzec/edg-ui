import { Component, ChangeDetectionStrategy, TemplateRef, computed, contentChild, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { KanbanLaneBrainDirective, type KanbanItem } from '../../brain/kanban-board-brain/kanban-lane-brain';
import { KanbanBoardBrainDirective } from '../../brain/kanban-board-brain/kanban-board-brain';
import { ScrollArea } from '../scroll-area/scroll-area';
import { Tag } from '../tags/tag';
import { KanbanCard } from './kanban-card';

export type { KanbanItem } from '../../brain/kanban-board-brain/kanban-lane-brain';

/** default value for the showCount input */
export const KANBAN_LANE_SHOW_COUNT_DEFAULT = true;

@Component({
  selector: 'org-kanban-lane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ScrollArea, Tag, KanbanCard],
  templateUrl: './kanban-lane.html',
  styleUrl: './kanban-lane.css',
  hostDirectives: [
    {
      directive: KanbanLaneBrainDirective,
      inputs: ['laneId', 'items', 'heading', 'ariaLabel'],
    },
  ],
  host: {
    '[attr.data-show-count]': 'showCount() ? "" : null',
  },
})
export class KanbanLane {
  /** reference to the host lane brain directive; the card component reads laneId / drag state from this */
  public readonly brain = inject(KanbanLaneBrainDirective);

  /** the board brain; consulted so the empty-state hint only appears while a drag is in progress */
  private readonly _boardBrain = inject(KanbanBoardBrainDirective);

  /** the consumer-provided card template; receives the item as $implicit context */
  protected readonly cardTemplate = contentChild<TemplateRef<{ $implicit: KanbanItem }>>('card');

  /** whether to render the item count pill in the header */
  public readonly showCount = input<boolean>(KANBAN_LANE_SHOW_COUNT_DEFAULT);

  /** heading sourced from the brain so the template can render it without a redundant component-level input */
  protected readonly heading = computed<string | undefined>(() => this.brain.heading());

  /** lane id sourced from the brain so the template can pass it to each rendered card */
  protected readonly laneId = computed<string>(() => this.brain.laneId());

  /** items list sourced from the brain so the template can iterate */
  protected readonly items = computed<readonly KanbanItem[]>(() => this.brain.items());

  /** item count sourced from the brain so the template can render the count pill */
  protected readonly itemCount = computed<number>(() => this.brain.itemCount());

  /** whether there is at least one item in the lane (drives empty-state rendering) */
  protected readonly hasItems = computed<boolean>(() => this.itemCount() > 0);

  /** whether to render the drop-here hint: only when the lane is empty and a drag is in progress */
  protected readonly showEmptyHint = computed<boolean>(() => !this.hasItems() && this._boardBrain.isDragging());
}
