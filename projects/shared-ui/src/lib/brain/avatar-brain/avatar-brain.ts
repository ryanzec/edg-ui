import { Directive, computed } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

/**
 * headless brain directive for the avatar. owns clickable detection (whether any consumer is listening to the
 * clicked output), the click subject, and the click forwarding method. carries no styling or template — apply it
 * to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgAvatarBrain]',
  exportAs: 'orgAvatarBrain',
})
export class AvatarBrainDirective {
  /** @internal emits when the host avatar is clicked while it is in clickable mode */
  private readonly _clicked$ = new Subject<void>();

  /** emitted when the host avatar is clicked; binding this output causes the avatar to render as a button */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** true when at least one listener is bound to the clicked output */
  public readonly isClickable = computed<boolean>(() => this._clicked$.observed);

  /** triggers the clicked output; called by the presentation template's button click handler */
  public click(): void {
    this._clicked$.next();
  }
}
