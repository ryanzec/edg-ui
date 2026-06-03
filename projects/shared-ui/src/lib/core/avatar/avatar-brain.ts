import { Directive, computed, input, output } from '@angular/core';

/** default value for the disabled input */
export const AVATAR_BRAIN_DISABLED_DEFAULT = false;

/** default value for the isOverflow input */
export const AVATAR_BRAIN_IS_OVERFLOW_DEFAULT = false;

/** default value for the isClickable input */
export const AVATAR_BRAIN_IS_CLICKABLE_DEFAULT = false;

/**
 * headless brain directive for the avatar. owns the display label (used to derive initials and accessible
 * surfaces), disabled state, the explicit clickable flag, the clicked output, and the click forwarding
 * method. carries no styling or template — apply it to the host of a presentation component via
 * hostDirectives.
 */
@Directive({
  selector: '[orgAvatarBrain]',
  exportAs: 'orgAvatarBrain',
})
export class AvatarBrainDirective {
  /** the display name; used to derive initials, image alt fallback, and the clickable button's aria-label */
  public readonly label = input.required<string>();

  /** whether the avatar is disabled and non-interactive */
  public readonly disabled = input<boolean>(AVATAR_BRAIN_DISABLED_DEFAULT);

  /** whether the avatar is rendered as a "+N" overflow pill; suppresses initials derivation */
  public readonly isOverflow = input<boolean>(AVATAR_BRAIN_IS_OVERFLOW_DEFAULT);

  /** whether the avatar renders as an interactive button and emits the clicked output */
  public readonly isClickable = input<boolean>(AVATAR_BRAIN_IS_CLICKABLE_DEFAULT);

  /** emitted when the host avatar is clicked while clickable and enabled */
  public readonly clicked = output<void>();

  /** true when the avatar should be treated as disabled */
  public readonly isDisabled = computed<boolean>(() => this.disabled());

  /** one or two uppercase initials derived from the label; empty when the avatar is in overflow mode */
  public readonly initials = computed<string>(() => {
    if (this.isOverflow()) {
      return '';
    }

    const label = this.label().trim();

    if (!label) {
      return '';
    }

    const words = label.split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  });

  /** triggers the clicked output; called by the presentation template's button click handler */
  public click(): void {
    if (!this.isClickable()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.clicked.emit();
  }
}
