import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * row container for chat-suggestion chips. owns the wrap, gap, and top spacing relative to the body. holds no
 * state — consumers project `org-chat-suggestion` children inside.
 */
@Component({
  selector: 'org-chat-suggestions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './chat-suggestions.css',
})
export class ChatSuggestions {}
