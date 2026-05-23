import { Directive, input } from '@angular/core';

/** all available chat role values */
export const allChatRoles = ['log', 'region', 'feed'] as const;

/** the aria role applied to the chat host element */
export type ChatRole = (typeof allChatRoles)[number];

/** all available chat aria-live politeness values */
export const allChatAriaLives = ['off', 'polite', 'assertive'] as const;

/** the aria-live politeness setting applied to the chat host element */
export type ChatAriaLive = (typeof allChatAriaLives)[number];

/** default value for the role input */
export const CHAT_ROLE_DEFAULT: ChatRole = 'log';

/** default value for the ariaLive input */
export const CHAT_ARIA_LIVE_DEFAULT: ChatAriaLive = 'polite';

/**
 * headless brain directive for the chat component. owns the aria role and aria-live host bindings that turn the
 * chat container into an accessible live region. carries no styling or template — apply it via hostDirectives on
 * the chat presentation component.
 */
@Directive({
  selector: '[orgChatBrain]',
  exportAs: 'orgChatBrain',
  host: {
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'ariaLive()',
  },
})
export class ChatBrainDirective {
  /** the aria role applied to the chat host; defaults to "log" for chat transcripts */
  public readonly role = input<ChatRole>(CHAT_ROLE_DEFAULT);

  /** the aria-live politeness applied to the chat host; controls how assistive tech announces new messages */
  public readonly ariaLive = input<ChatAriaLive>(CHAT_ARIA_LIVE_DEFAULT);
}
