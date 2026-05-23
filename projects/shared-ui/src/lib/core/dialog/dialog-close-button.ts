import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Button } from '../button/button';
import { DialogCloseButtonBrainDirective } from '../dialog/dialog-close-button-brain';

@Component({
  selector: 'org-dialog-close-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './dialog-close-button.html',
  styleUrl: './dialog-close-button.css',
  hostDirectives: [DialogCloseButtonBrainDirective],
})
export class DialogCloseButton {
  /** brain directive providing visibility, enabled state, and aria label for the template */
  protected readonly brain = inject(DialogCloseButtonBrainDirective);
}
