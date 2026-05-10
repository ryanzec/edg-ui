import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** default value for the label input */
export const CHAT_STREAMING_LABEL_DEFAULT = 'Streaming...';

/**
 * inline pill badge rendered alongside an assistant message body to indicate that more tokens are still
 * arriving. owns no state — drop in or remove based on the lifecycle of the surrounding message.
 */
@Component({
  selector: 'org-chat-streaming',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-streaming.html',
  styleUrl: './chat-streaming.css',
  host: {
    role: 'status',
  },
})
export class ChatStreaming {
  /** the visible label rendered next to the pulsing dot */
  public readonly label = input<string>(CHAT_STREAMING_LABEL_DEFAULT);
}
