import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ChatMessage } from './chat-message';
import { Checklist, type ChecklistItemData } from '../checklist/checklist';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';

/** the internal state shape for the chat message steps component */
type ChatMessageStepsState = {
  expanded: boolean;
};

@Component({
  selector: 'org-chat-message-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checklist, Button, ButtonIcon],
  templateUrl: './chat-message-steps.html',
  styleUrl: './chat-message-steps.css',
})
export class ChatMessageSteps {
  /** reference to the parent chat message component for shared message context. */
  protected readonly chatMessageComponent = inject(ChatMessage, { host: true });

  private readonly _state = signal<ChatMessageStepsState>({
    expanded: false,
  });

  /** the steps list read from the parent chat message data */
  protected readonly steps = computed<ChecklistItemData[]>(() => this.chatMessageComponent.chatMessage().steps ?? []);

  /** whether the parent chat message has any steps to display */
  protected readonly hasSteps = computed<boolean>(() => this.steps().length > 0);

  /** whether the steps checklist is currently expanded */
  protected readonly isExpanded = computed<boolean>(() => this._state().expanded);

  /** toggles the steps checklist between expanded and collapsed */
  protected toggleExpanded(): void {
    this._state.update((state) => ({
      ...state,
      expanded: !state.expanded,
    }));
  }
}
