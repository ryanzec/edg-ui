import { ApplicationRef, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { Observable, map, take } from 'rxjs';
import { UnsavedChangesAware } from './unsaved-changes-aware';
import { UnsavedChangesDialog } from '../unsaved-changes-dialog/unsaved-changes-dialog';

const _isUnsavedChangesAware = (component: unknown): component is UnsavedChangesAware => {
  return !!component && typeof (component as UnsavedChangesAware).hasUnsavedChanges === 'function';
};

export const unsavedChangesGuard: CanDeactivateFn<unknown> = (component): Observable<boolean> | boolean => {
  if (!_isUnsavedChangesAware(component) || !component.hasUnsavedChanges()) {
    return true;
  }

  // since guard have not host component and the dialog brain required ones, we use cdk dialog directly and duplicate
  // the minimal amount of code needed for this one-off use case.
  const dialog = inject(Dialog);
  const appRef = inject(ApplicationRef);
  const dialogComponent = component.getDialogComponent?.() ?? UnsavedChangesDialog;
  // backdrop click is blocked via disableClose to prevent accidental dismissal; escape and the close icon are
  // allowed as soft-dismiss paths that resolve to "stay" since they close without a result and the guard's
  // result === true check below treats anything other than an explicit confirm as cancel.
  const dialogRef = dialog.open<boolean>(dialogComponent, {
    panelClass: ['dialog-panel-center'],
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
  });

  // disableClose blocks cdk's built-in escape handling along with backdrop click, so we re-add escape via a
  // document listener (mirroring DialogBrainDirective's approach) to preserve keyboard accessibility while still
  // blocking accidental backdrop dismissal.
  const onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dialogRef.close();
  };

  document.addEventListener('keydown', onDocumentKeydown);
  dialogRef.closed.pipe(take(1)).subscribe(() => {
    document.removeEventListener('keydown', onDocumentKeydown);
  });

  // the guard runs inside the router's async pipeline so no event is in flight when the dialog opens; in zoneless
  // mode the cdk attaches the new view via the change-detection scheduler (microtasks), so a sync tick — or one
  // queued on the same microtask round — runs before the dialog view has joined the render tree. afterNextRender
  // is not viable here because the guard's injection context is transient (destroyed when navigation settles), so
  // angular cleans up the registration before it fires. requestAnimationFrame is spec-guaranteed to run after the
  // microtask queue has drained but before the browser paints, which is the correct slot for this case.
  requestAnimationFrame(() => appRef.tick());

  return dialogRef.closed.pipe(map((result) => result === true));
};
