import { Directive, model, output } from '@angular/core';

/** default value for the selected model (unselected at rest) */
export const CHAT_REACTION_SELECTED_DEFAULT = false;

/** default value for the disabled input */
export const CHAT_REACTION_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the chat-reaction chip. owns the selected toggle state, click and keyboard
 * interaction, and the aria-pressed host binding so reactions read as toggle buttons to assistive tech. the
 * selected model is two-way bindable so consumers can either let the brain manage state internally or drive
 * it from outside.
 */
@Directive({
  selector: 'button[orgChatReactionBrain]',
  exportAs: 'orgChatReactionBrain',
  host: {
    type: 'button',
    '[attr.aria-pressed]': 'selected()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '(click)': 'handleClick()',
  },
})
export class ChatReactionBrainDirective {
  /** whether the reaction is currently selected by the viewer; two-way bindable via [(selected)] */
  public readonly selected = model<boolean>(CHAT_REACTION_SELECTED_DEFAULT);

  /** whether the reaction chip is disabled */
  public readonly disabled = model<boolean>(CHAT_REACTION_DISABLED_DEFAULT);

  /** emitted whenever the reaction is activated by the viewer; payload is the requested next selected value */
  public readonly toggled = output<boolean>();

  /** handles click activation — flips the selected state and emits the requested value */
  protected handleClick(): void {
    if (this.disabled()) {
      return;
    }

    const next = !this.selected();

    this.selected.set(next);
    this.toggled.emit(next);
  }
}
