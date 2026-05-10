import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../button/button';

/** default value for the showSendButton input */
export const TEXTAREA_TOOLBAR_SHOW_SEND_BUTTON_DEFAULT = true;

/** default value for the sendDisabled input */
export const TEXTAREA_TOOLBAR_SEND_DISABLED_DEFAULT = false;

/** default value for the sendAriaLabel input */
export const TEXTAREA_TOOLBAR_SEND_ARIA_LABEL_DEFAULT = 'send';

/** default value for the showHint input */
export const TEXTAREA_TOOLBAR_SHOW_HINT_DEFAULT = false;

/** default value for the hintLabel input */
export const TEXTAREA_TOOLBAR_HINT_LABEL_DEFAULT = 'to send';

/** default value for the hintKey input */
export const TEXTAREA_TOOLBAR_HINT_KEY_DEFAULT = '↵';

@Component({
  selector: 'org-textarea-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './textarea-toolbar.html',
  styleUrl: './textarea-toolbar.css',
})
export class TextareaToolbar {
  private readonly _sendClicked$ = new Subject<void>();

  /** whether to render the built-in send icon button on the right edge */
  public readonly showSendButton = input<boolean>(TEXTAREA_TOOLBAR_SHOW_SEND_BUTTON_DEFAULT);

  /** whether the built-in send button is disabled */
  public readonly sendDisabled = input<boolean>(TEXTAREA_TOOLBAR_SEND_DISABLED_DEFAULT);

  /** accessible label for the built-in send icon button */
  public readonly sendAriaLabel = input<string>(TEXTAREA_TOOLBAR_SEND_ARIA_LABEL_DEFAULT);

  /** whether to render the keyboard hint (e.g. "↵ to send") to the left of the send button */
  public readonly showHint = input<boolean>(TEXTAREA_TOOLBAR_SHOW_HINT_DEFAULT);

  /** descriptive text rendered after the kbd in the keyboard hint */
  public readonly hintLabel = input<string>(TEXTAREA_TOOLBAR_HINT_LABEL_DEFAULT);

  /** keyboard glyph rendered inside the kbd in the keyboard hint */
  public readonly hintKey = input<string>(TEXTAREA_TOOLBAR_HINT_KEY_DEFAULT);

  /** emitted when the built-in send button is clicked */
  public readonly sendClicked = outputFromObservable(this._sendClicked$);

  /** whether the toolbar should reserve space for any default-slot content */
  protected readonly hasBuiltInRight = computed<boolean>(() => this.showSendButton() || this.showHint());

  /** handles the send button click */
  protected onSendClick(): void {
    if (this.sendDisabled()) {
      return;
    }

    this._sendClicked$.next();
  }
}
