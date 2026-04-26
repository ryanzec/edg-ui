import { ApplicationRef, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { Observable, map } from 'rxjs';
import { UnsavedChangesAware } from './unsaved-changes-aware';
import { UnsavedChangesDialog } from '../unsaved-changes-dialog/unsaved-changes-dialog';

const _isUnsavedChangesAware = (component: unknown): component is UnsavedChangesAware => {
  return !!component && typeof (component as UnsavedChangesAware).hasUnsavedChanges === 'function';
};

export const unsavedChangesGuard: CanDeactivateFn<unknown> = (component): Observable<boolean> | boolean => {
  if (!_isUnsavedChangesAware(component) || !component.hasUnsavedChanges()) {
    return true;
  }

  const dialog = inject(Dialog);
  const appRef = inject(ApplicationRef);
  const dialogComponent = component.getDialogComponent?.() ?? UnsavedChangesDialog;
  // any close path other than the explicit "discard" button (escape, backdrop click, close icon) keeps the user on
  // the page, which is the safer default for unsaved-changes flows
  const dialogRef = dialog.open<boolean>(dialogComponent, {
    panelClass: ['dialog-panel-center'],
    hasBackdrop: true,
    closeOnNavigation: true,
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
