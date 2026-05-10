import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * row container for chat-reaction chips. owns the wrap, gap, and top spacing relative to the body. holds no
 * state — consumers project `org-chat-reaction` children inside.
 */
@Component({
  selector: 'org-chat-reactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './chat-reactions.css',
})
export class ChatReactions {}
