import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { KanbanBoardBrainDirective } from '../../brain/kanban-board-brain/kanban-board-brain';
import { ScrollArea } from '../scroll-area/scroll-area';

export {
  KANBAN_BOARD_ARIA_LABEL_DEFAULT,
  KANBAN_BOARD_SELECTED_IDS_DEFAULT,
} from '../../brain/kanban-board-brain/kanban-board-brain';
export type { KanbanItemsMovedEvent } from '../../brain/kanban-board-brain/kanban-board-brain';

@Component({
  selector: 'org-kanban-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollArea],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
  hostDirectives: [
    {
      directive: KanbanBoardBrainDirective,
      inputs: ['ariaLabel', 'selectedIds'],
      outputs: ['selectedIdsChange', 'itemsMoved'],
    },
  ],
})
export class KanbanBoard {
  /** reference to the host kanban board brain directive; child components inject this via the board to read state */
  public readonly brain = inject(KanbanBoardBrainDirective);
}
