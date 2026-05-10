import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { Button } from '../button/button';

/** default value for the sendAriaLabel input */
export const TEXTAREA_TOOLBAR_SEND_ARIA_LABEL_DEFAULT = 'send';

@Component({
  selector: 'org-textarea-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './textarea-toolbar.html',
  styleUrl: './textarea-toolbar.css',
})
export class TextareaToolbar {
  private _sendClicked$ = new Subject<void>();

  /** accessible label for the send icon button */
  public sendAriaLabel = input<string>(TEXTAREA_TOOLBAR_SEND_ARIA_LABEL_DEFAULT);

  /** emitted when the send button is clicked */
  public sendClicked = outputFromObservable(this._sendClicked$);

  /** handles the send button click */
  protected onSendClick(): void {
    this._sendClicked$.next();
  }
}
