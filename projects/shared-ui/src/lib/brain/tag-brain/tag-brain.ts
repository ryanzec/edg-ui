import { Directive, computed, input, output } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

/** default value for the removable input */
export const TAG_REMOVABLE_DEFAULT = false;

/** default value for the removeAriaLabel input */
export const TAG_REMOVE_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default accessible label used when removable and no removeAriaLabel is provided */
export const TAG_REMOVE_DEFAULT_LABEL = 'Remove tag';

/** the static html button type for the inner remove button */
export const TAG_REMOVE_BUTTON_TYPE = 'button';

/**
 * headless brain directive for the tag. owns the removable affordance state (whether the tag exposes a
 * built-in remove "x" button, the accessible label for that button, the static button type that prevents
 * form submission, and the click routing that emits the removed output). carries no styling, sizing, or
 * template — apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgTagBrain]',
  exportAs: 'orgTagBrain',
})
export class TagBrainDirective {
  /** when true, the tag exposes a built-in remove (x) affordance and overrides any trailing slot icon */
  public readonly removable = input<boolean>(TAG_REMOVABLE_DEFAULT);

  /** accessible label for the built-in remove button; defaults to "Remove tag" when omitted */
  public readonly removeAriaLabel = input<string | undefined, string | null | undefined>(
    TAG_REMOVE_ARIA_LABEL_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** emitted when the remove affordance is activated */
  public readonly removed = output<void>();

  /** the static html button type — owned by brain so interaction behavior stays in brain */
  public readonly removeButtonType = TAG_REMOVE_BUTTON_TYPE;

  /** the resolved accessible label for the remove button */
  public readonly resolvedRemoveAriaLabel = computed<string>(() => this.removeAriaLabel() ?? TAG_REMOVE_DEFAULT_LABEL);

  /** handles activation of the remove button, emitting the removed output when removable is enabled */
  public remove(): void {
    if (!this.removable()) {
      return;
    }

    this.removed.emit();
  }
}
