import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * three-dot bouncing indicator rendered before an assistant has produced its first token. replaces the body text
 * until streaming actually begins. fully presentational — has no inputs and no state.
 */
@Component({
  selector: 'org-chat-typing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-typing.html',
  styleUrl: './chat-typing.css',
  host: {
    role: 'status',
    'aria-label': 'Assistant is typing',
  },
})
export class ChatTyping {}
