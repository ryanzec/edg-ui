import { Directive, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the role input */
export const TIMELINE_ROLE_DEFAULT: string | undefined = 'list';

/**
 * headless brain directive for the timeline component. owns the role accessibility attribute applied to the
 * host element so the timeline is exposed as a list to screen readers; the role can be overridden by consumers
 * when alternate semantics are needed (e.g. "feed", "none"). carries no styling, template, or styling-related
 * host bindings — apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgTimelineBrain]',
  exportAs: 'orgTimelineBrain',
  host: {
    '[attr.role]': 'role() ?? null',
  },
})
export class TimelineBrainDirective {
  /** the role attribute applied to the host element; defaults to "list", pass null to remove list semantics */
  public readonly role = input<string | undefined, string | null | undefined>(TIMELINE_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
