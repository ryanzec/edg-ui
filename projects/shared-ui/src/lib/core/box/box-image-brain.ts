import { Directive, input } from '@angular/core';

/**
 * headless brain directive for the box image. owns the image src and the alt accessibility label. carries no
 * styling, template, or styling-related host bindings — the presentation reads these to render the underlying
 * img element. apply via hostDirectives on a presentation component.
 */
@Directive({
  selector: '[orgBoxImageBrain]',
  exportAs: 'orgBoxImageBrain',
})
export class BoxImageBrainDirective {
  /** the image source url */
  public readonly src = input.required<string>();

  /** the alternative text description for the image */
  public readonly alt = input.required<string>();
}
