import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChatBrainDirective } from '../../brain/chat-brain/chat-brain';

/**
 * the chat thread shell. composes `ChatBrainDirective` for the live-region aria semantics (role + aria-live).
 * owns the column layout for the thread shell and the inner max-width container that clamps message width and
 * centres the conversation. consumers project messages, day separators, and the empty-state inside.
 */
@Component({
  selector: 'org-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  hostDirectives: [
    {
      directive: ChatBrainDirective,
      inputs: ['role', 'ariaLive'],
    },
  ],
})
export class Chat {}
