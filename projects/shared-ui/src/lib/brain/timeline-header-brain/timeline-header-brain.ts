import { Directive, input } from '@angular/core';

/** default value for the headingLevel input */
export const TIMELINE_HEADER_HEADING_LEVEL_DEFAULT = 3;

/**
 * headless brain directive for the timeline header. owns the headingLevel input that drives the semantic html
 * heading element (h1-h6) rendered by the presentation. carries no styling, template, or styling-related host
 * bindings — the presentation reads it to choose the correct heading element for document outline and screen
 * reader navigation.
 */
@Directive({
  selector: '[orgTimelineHeaderBrain]',
  exportAs: 'orgTimelineHeaderBrain',
})
export class TimelineHeaderBrainDirective {
  /** the html heading level (1-6) used for the timeline item heading element */
  public readonly headingLevel = input<number>(TIMELINE_HEADER_HEADING_LEVEL_DEFAULT);
}
