import { Directive } from '@angular/core';

/**
 * headless brain directive for the timeline item component. carries no inputs — applies the static
 * role="listitem" accessibility attribute so each timeline item is exposed to screen readers as a list item
 * paired with the parent timeline's list role. carries no styling, template, or styling-related host bindings
 * — apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgTimelineItemBrain]',
  exportAs: 'orgTimelineItemBrain',
  host: {
    role: 'listitem',
  },
})
export class TimelineItemBrainDirective {}
