import { Directive, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the listRole input */
export const LIST_LIST_ROLE_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the list component. owns the list-role accessibility input shared with the
 * presentation. carries no styling, template, or styling-related host bindings — the presentation reads it to
 * drive the role attribute on the inner list element.
 */
@Directive({
  selector: '[orgListBrain]',
  exportAs: 'orgListBrain',
})
export class ListBrainDirective {
  /** overrides the role attribute on the inner ul element; use "none" to remove list semantics when needed */
  public readonly listRole = input<string | undefined, string | null | undefined>(LIST_LIST_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
