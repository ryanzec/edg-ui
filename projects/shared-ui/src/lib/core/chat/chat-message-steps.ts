import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ChatMessage } from './chat-message';
import { Checklist, type ChecklistItemData } from '../checklist/checklist';
import { Button } from '../button/button';
import { ButtonIcon } from '../button/button-icon';
import { ChatMessageStepsBrainDirective } from '../../brain/chat-message-steps-brain/chat-message-steps-brain';

@Component({
  selector: 'org-chat-message-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checklist, Button, ButtonIcon],
  templateUrl: './chat-message-steps.html',
  styleUrl: './chat-message-steps.css',
  hostDirectives: [ChatMessageStepsBrainDirective],
})
export class ChatMessageSteps {
  /** reference to the parent chat message component for shared message context. */
  protected readonly chatMessageComponent = inject(ChatMessage, { host: true });

  private readonly _brain = inject(ChatMessageStepsBrainDirective, { self: true });

  /** the steps list read from the parent chat message data */
  protected readonly steps = computed<ChecklistItemData[]>(() => this.chatMessageComponent.chatMessage().steps ?? []);

  /** whether the parent chat message has any steps to display */
  protected readonly hasSteps = computed<boolean>(() => this.steps().length > 0);

  /** whether the steps checklist is currently expanded (proxied from brain) */
  protected readonly isExpanded = computed<boolean>(() => this._brain.isExpanded());

  /** toggles the steps checklist between expanded and collapsed (proxied to brain) */
  protected toggleExpanded(): void {
    this._brain.toggleExpanded();
  }
}
