import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { Dialog } from '../dialog/dialog';
import { DialogHeader } from '../dialog/dialog-header';
import { DialogContent } from '../dialog/dialog-content';
import { DialogFooter } from '../dialog/dialog-footer';
import { Button } from '../button/button';

@Component({
  selector: 'org-unsaved-changes-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, Button],
  template: `
    <org-dialog>
      <org-dialog-header title="Unsaved Changes" />
      <org-dialog-content>
        You have unsaved changes on this page. Leaving will discard them. Do you want to continue?
      </org-dialog-content>
      <org-dialog-footer>
        <org-button color="neutral" (clicked)="cancel()">Stay</org-button>
        <org-button color="danger" (clicked)="confirm()">Discard Changes</org-button>
      </org-dialog-footer>
    </org-dialog>
  `,
})
export class UnsavedChangesDialog {
  private readonly _dialogRef = inject(DialogRef<boolean>);

  /** keeps the user on the current page; the guard sees a falsy result and cancels navigation */
  protected cancel(): void {
    this._dialogRef.close(false);
  }

  /** allows navigation away from the page, discarding the unsaved changes */
  protected confirm(): void {
    this._dialogRef.close(true);
  }
}
