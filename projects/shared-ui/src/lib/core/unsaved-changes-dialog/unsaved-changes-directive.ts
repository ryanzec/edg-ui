import { Directive, input } from '@angular/core';

/** default value for the orgUnsavedChanges input */
export const ORG_UNSAVED_CHANGES_DEFAULT = false;

/**
 * applies a browser `beforeunload` listener that prompts the native browser confirmation when the host has unsaved
 * changes. complements the route-level unsaved changes guard, which only fires on angular router navigation, by
 * covering tab close and full page reload paths.
 */
@Directive({
  selector: '[orgUnsavedChanges]',
  host: {
    '(window:beforeunload)': '_onBeforeUnload($event)',
  },
})
export class UnsavedChangesDirective {
  /** when true, the browser shows its native confirmation prompt before unloading the page */
  public orgUnsavedChanges = input<boolean>(ORG_UNSAVED_CHANGES_DEFAULT);

  protected _onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.orgUnsavedChanges()) {
      return;
    }

    event.preventDefault();
  }
}
