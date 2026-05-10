import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** default value for the label input */
export const CHAT_DAY_LABEL_DEFAULT = '';

/**
 * day separator rendered inside the thread between date groups. centered tiny meta line with hairlines on either
 * side. the consumer chooses when to render it — the chat thread does not auto-detect day boundaries.
 */
@Component({
  selector: 'org-chat-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-day.html',
  styleUrl: './chat-day.css',
})
export class ChatDay {
  /** the visible label rendered between the two hairlines (e.g. "Today", "Yesterday", "Mar 5") */
  public readonly label = input<string>(CHAT_DAY_LABEL_DEFAULT);
}
