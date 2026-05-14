import { Directive, computed, input } from '@angular/core';

/** all available chat message role values */
export const allChatMessageRoles = ['user', 'assistant', 'system', 'error'] as const;

/** the semantic role of a chat message; drives both styling surface and aria semantics */
export type ChatMessageRole = (typeof allChatMessageRoles)[number];

/** all available chat message state values */
export const allChatMessageStates = ['idle', 'pending', 'failed'] as const;

/** the lifecycle state of a chat message */
export type ChatMessageState = (typeof allChatMessageStates)[number];

/** default value for the role input */
export const CHAT_MESSAGE_ROLE_DEFAULT: ChatMessageRole = 'assistant';

/** default value for the state input */
export const CHAT_MESSAGE_STATE_DEFAULT: ChatMessageState = 'idle';

/**
 * headless brain directive for the chat-message component. owns the aria role mapping (system messages announce as
 * a status, all other roles render as articles), aria-busy for in-flight pending messages, and aria-invalid for
 * failed messages. carries no styling — the presentation component reflects role and state as data attributes for
 * the surface mapping.
 */
@Directive({
  selector: '[orgChatMessageBrain]',
  exportAs: 'orgChatMessageBrain',
  host: {
    '[attr.role]': 'ariaRole()',
    '[attr.aria-busy]': 'ariaBusy()',
    '[attr.aria-invalid]': 'ariaInvalid()',
  },
})
export class ChatMessageBrainDirective {
  /** the semantic role of the message; system maps to a centred status banner, the rest render as articles */
  public readonly role = input<ChatMessageRole>(CHAT_MESSAGE_ROLE_DEFAULT);

  /** the lifecycle state of the message; pending dims the surface, failed wears the danger ramp */
  public readonly state = input<ChatMessageState>(CHAT_MESSAGE_STATE_DEFAULT);

  /** the aria role applied to the host element; status for system messages, article for everything else */
  public readonly ariaRole = computed<'article' | 'status'>(() => (this.role() === 'system' ? 'status' : 'article'));

  /** aria-busy attribute value — true while the message is in-flight, null otherwise */
  public readonly ariaBusy = computed<true | null>(() => (this.state() === 'pending' ? true : null));

  /** aria-invalid attribute value — true when the message has failed, null otherwise */
  public readonly ariaInvalid = computed<true | null>(() => (this.state() === 'failed' ? true : null));

  /** convenience computed exposed to the presentation: true while the message is pending */
  public readonly isPending = computed<boolean>(() => this.state() === 'pending');

  /** convenience computed exposed to the presentation: true once the message has failed */
  public readonly isFailed = computed<boolean>(() => this.state() === 'failed');
}
