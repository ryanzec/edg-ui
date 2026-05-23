import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { KanbanCardBrainDirective } from '../kanban-board/kanban-card-brain';

@Component({
  selector: 'org-kanban-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.css',
  hostDirectives: [
    {
      directive: KanbanCardBrainDirective,
      inputs: ['cardId', 'laneId'],
    },
  ],
})
export class KanbanCard {
  /** reference to the host card brain directive; template reads closestEdge for drop-indicator rendering */
  protected readonly brain = inject(KanbanCardBrainDirective);
}
