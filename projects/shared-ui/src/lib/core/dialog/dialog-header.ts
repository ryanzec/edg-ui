import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DialogHeaderBrainDirective } from '../../brain/dialog-header-brain/dialog-header-brain';

/** default value for the title input */
export const DIALOG_HEADER_TITLE_DEFAULT = '';

@Component({
  selector: 'org-dialog-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-header.html',
  styleUrl: './dialog-header.css',
  hostDirectives: [DialogHeaderBrainDirective],
})
export class DialogHeader {
  /** text content of the dialog title */
  public readonly title = input<string>(DIALOG_HEADER_TITLE_DEFAULT);
}
