import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** default value for the author input */
export const CHAT_QUOTE_AUTHOR_DEFAULT = '';

/** default value for the body input */
export const CHAT_QUOTE_BODY_DEFAULT = '';

/**
 * quoted-reply preview rendered above a chat message body to attribute the new message to a prior one. clickable
 * so a consumer can scroll the parent thread back to the source message; emits `clicked` rather than handling the
 * scroll itself.
 */
@Component({
  selector: 'org-chat-quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-quote.html',
  styleUrl: './chat-quote.css',
  host: {
    role: 'button',
    tabindex: '0',
    '(click)': 'handleClick()',
    '(keydown.enter)': 'handleClick()',
    '(keydown.space)': 'handleClick($event)',
  },
})
export class ChatQuote {
  /** the author of the quoted message (rendered above the excerpt) */
  public readonly quoteAuthor = input<string>(CHAT_QUOTE_AUTHOR_DEFAULT);

  /** the body excerpt of the quoted message (single line, ellipsised on overflow) */
  public readonly quoteBody = input<string>(CHAT_QUOTE_BODY_DEFAULT);

  /** emitted when the quote is activated by the viewer (click or keyboard) */
  public readonly clicked = output<void>();

  /** handles activation from click and keyboard events */
  protected handleClick(event?: Event): void {
    event?.preventDefault();

    this.clicked.emit();
  }
}
