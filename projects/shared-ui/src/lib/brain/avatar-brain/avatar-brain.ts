import { Directive, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/** default value for the disabled input */
export const AVATAR_BRAIN_DISABLED_DEFAULT = false;

/**
 * headless brain directive for the avatar. owns the display label (used to derive initials and accessible
 * surfaces), disabled state, clickable detection (whether any consumer is listening to the clicked output),
 * the click subject, and the click forwarding method. carries no styling or template — apply it to the host
 * of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgAvatarBrain]',
  exportAs: 'orgAvatarBrain',
})
export class AvatarBrainDirective {
  /** @internal emits when the host avatar is clicked while it is in clickable mode */
  private readonly _clicked$ = new Subject<void>();

  /** the display name; used to derive initials, image alt fallback, and the clickable button's aria-label */
  public readonly label = input.required<string>();

  /** whether the avatar is disabled and non-interactive */
  public readonly disabled = input<boolean>(AVATAR_BRAIN_DISABLED_DEFAULT);

  /** emitted when the host avatar is clicked; binding this output causes the avatar to render as a button */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** true when at least one listener is bound to the clicked output */
  public readonly isClickable = computed<boolean>(() => this._clicked$.observed);

  /** true when the avatar should be treated as disabled */
  public readonly isDisabled = computed<boolean>(() => this.disabled());

  /** one or two uppercase initials derived from the label */
  public readonly initials = computed<string>(() => {
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
    if (this.isDisabled()) {
      return;
    }

    this._clicked$.next();
  }
}
