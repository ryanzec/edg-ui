import { ComponentType } from '@angular/cdk/portal';

/**
 * contract that view components opt into so the unsaved changes guard can decide whether to prompt the user before
 * navigating away from the route.
 */
export type UnsavedChangesAware = {
  /** returns true when the component is holding changes that have not been persisted */
  hasUnsavedChanges(): boolean;
  /**
   * optional override that returns the component to render inside the guard's confirmation dialog. when omitted, the
   * guard falls back to the default `UnsavedChangesDialog`. the returned component is responsible for closing its
   * dialog ref with `true` to allow navigation or anything else (`false` / `undefined`) to keep the user on the page.
   */
  getDialogComponent?(): ComponentType<unknown>;
};
