import { Directive, computed, signal } from '@angular/core';

/** the internal state shape for the chat message steps brain directive */
type ChatMessageStepsState = {
  expanded: boolean;
};

/**
 * headless brain directive for the chat-message-steps component. owns the expanded open/close state, the
 * `toggleExpanded` event handler, and the aria-expanded host attribute. the presentation reads the expanded
 * signal to decide whether to render the steps checklist and proxies the toggle through to the brain.
 */
@Directive({
  selector: '[orgChatMessageStepsBrain]',
  exportAs: 'orgChatMessageStepsBrain',
  host: {
    '[attr.aria-expanded]': 'isExpanded()',
  },
})
export class ChatMessageStepsBrainDirective {
  private readonly _state = signal<ChatMessageStepsState>({
    expanded: false,
  });

  /** whether the steps checklist is currently expanded */
  public readonly isExpanded = computed<boolean>(() => this._state().expanded);

  /** toggles the expanded state of the steps checklist */
  public toggleExpanded(): void {
    this._state.update((state) => ({
      ...state,
      expanded: !state.expanded,
    }));
  }
}
