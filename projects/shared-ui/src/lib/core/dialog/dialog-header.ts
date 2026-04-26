import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { DIALOG_COMPONENT } from './dialog';

/** default value for the title input */
export const DIALOG_HEADER_TITLE_DEFAULT = '';

@Component({
  selector: 'org-dialog-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-header.html',
  styleUrl: './dialog-header.css',
})
export class DialogHeader {
  private readonly _dialogComponent = inject(DIALOG_COMPONENT, { host: true, optional: true });

  /** id to apply to the title element, sourced from the parent dialog for aria-labelledby wiring */
  protected readonly titleId: string | null = this._dialogComponent?.titleId ?? null;

  /** text content of the dialog title */
  public readonly title = input<string>(DIALOG_HEADER_TITLE_DEFAULT);
}
