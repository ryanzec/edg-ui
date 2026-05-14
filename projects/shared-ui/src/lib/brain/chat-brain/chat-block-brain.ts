import { Directive, model } from '@angular/core';

/** default value for the expanded model (collapsed at rest) */
export const CHAT_BLOCK_EXPANDED_DEFAULT = false;

/**
 * headless brain directive for the chat-block disclosure header. owns the expanded open/close state, the click
 * handler that flips it, and the aria-expanded host binding so the button reads as a real disclosure to assistive
 * tech. the expanded model is two-way bindable so consumers can either let the brain manage state internally or
 * drive it from outside (controlled mode).
 */
@Directive({
  selector: 'button[orgChatBlockBrain]',
  exportAs: 'orgChatBlockBrain',
  host: {
    type: 'button',
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'toggle()',
  },
})
export class ChatBlockBrainDirective {
  /** whether the block body is expanded; two-way bindable via [(expanded)] for consumer control */
  public readonly expanded = model<boolean>(CHAT_BLOCK_EXPANDED_DEFAULT);

  /** toggles the expanded state of the block body */
  public toggle(): void {
    this.expanded.update((current) => !current);
  }
}
