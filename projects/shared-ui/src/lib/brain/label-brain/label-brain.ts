import { Directive, effect, input } from '@angular/core';
import { angularUtils, logManager } from '@organization/shared-utils';

/** default value for the asLabel input */
export const LABEL_AS_LABEL_DEFAULT = true;

/** default value for the isLoading input */
export const LABEL_IS_LOADING_DEFAULT = false;

/** default value for the isRequired input */
export const LABEL_IS_REQUIRED_DEFAULT = false;

/** default value for the htmlFor input */
export const LABEL_HTML_FOR_DEFAULT: string | undefined = undefined;

/**
 * headless brain directive for the label component. owns the rendered semantic-element choice
 * (native label vs div), the form-control association via htmlFor, the loading / required state, and
 * the accessible text content. carries no styling or template — apply it to a presentation component
 * via hostDirectives.
 */
@Directive({
  selector: '[orgLabelBrain]',
  exportAs: 'orgLabelBrain',
})
export class LabelBrainDirective {
  /** whether to render as a native label element; when false, the presentation renders a div */
  public readonly asLabel = input<boolean>(LABEL_AS_LABEL_DEFAULT);

  /** the visible text content acting as the accessible name for the associated form control */
  public readonly text = input.required<string>();

  /** whether the presentation should surface a loading indicator */
  public readonly isLoading = input<boolean>(LABEL_IS_LOADING_DEFAULT);

  /** whether the presentation should surface a required-field indicator */
  public readonly isRequired = input<boolean>(LABEL_IS_REQUIRED_DEFAULT);

  /** the html for attribute value linking the label to its associated form control */
  public readonly htmlFor = input<string | undefined, string | null | undefined>(LABEL_HTML_FOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  constructor() {
    // warns when the directive is configured to render a native label without an htmlFor association
    effect(() => {
      if (this.asLabel() && !this.htmlFor()) {
        logManager.warn({
          type: 'label-missing-html-for',
          message: 'htmlFor input is required when asLabel is set to true',
        });
      }
    });
  }
}
