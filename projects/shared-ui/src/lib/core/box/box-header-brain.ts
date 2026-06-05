import { Directive, input } from '@angular/core';

/** default value for the headingLevel input */
export const BOX_HEADER_HEADING_LEVEL_DEFAULT = 3;

/**
 * headless brain directive for the box header. owns the headingLevel input that drives the semantic html
 * heading element (h1-h6) rendered by the presentation. carries no styling, template, or styling-related host
 * bindings — the presentation reads it to choose the correct heading element for document outline and screen
 * reader navigation.
 */
@Directive({
  selector: '[orgBoxHeaderBrain]',
  exportAs: 'orgBoxHeaderBrain',
})
export class BoxHeaderBrainDirective {
  /** the html heading level (1-6) used for the title element */
  public readonly headingLevel = input<number>(BOX_HEADER_HEADING_LEVEL_DEFAULT);
}
