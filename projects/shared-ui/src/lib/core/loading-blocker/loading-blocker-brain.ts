import { Directive, computed, effect, inject, input } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';

/** default value for the isVisible input */
export const LOADING_BLOCKER_IS_VISIBLE_DEFAULT = false;

/** default value for the label input */
export const LOADING_BLOCKER_LABEL_DEFAULT = '';

/** fallback accessibility label used when no label is provided */
export const LOADING_BLOCKER_FALLBACK_LABEL = 'Loading';

/**
 * headless brain directive for the loading-blocker component. owns the visibility state, the
 * accessibility surface (role, aria-live, aria-busy, aria-label), and focus trapping (via the
 * cdk CdkTrapFocus host directive with auto-capture forced on). carries no styling or template —
 * apply it to the host of a presentation component via hostDirectives.
 */
@Directive({
  selector: '[orgLoadingBlockerBrain]',
  exportAs: 'orgLoadingBlockerBrain',
  hostDirectives: [CdkTrapFocus],
  host: {
    role: 'status',
    tabindex: '-1',
    'aria-live': 'polite',
    '[attr.aria-busy]': 'isVisible()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class LoadingBlockerBrainDirective {
  /** focus trap directive applied via hostDirectives; auto-capture is forced on internally */
  private readonly _trapFocus = inject(CdkTrapFocus, { self: true });

  /** whether the loading blocker is currently visible */
  public readonly isVisible = input<boolean>(LOADING_BLOCKER_IS_VISIBLE_DEFAULT);

  /** accessible label describing what is loading; also drives the visible text in the presentation */
  public readonly label = input<string>(LOADING_BLOCKER_LABEL_DEFAULT);

  /** accessible label exposed to the host aria-label binding, falling back to a generic loading string */
  public readonly ariaLabel = computed<string>(() => this.label() || LOADING_BLOCKER_FALLBACK_LABEL);

  public constructor() {
    // a loading blocker should always trap and capture focus when active; auto-capture is an
    // internal accessibility detail, not a consumer-configurable knob, so it is hardcoded here
    this._trapFocus.autoCapture = true;

    // since the blocker stays mounted and only toggles data-visible, the focus trap must only be
    // enabled while the blocker is visible — otherwise it would steal focus even when hidden
    effect(() => {
      this._trapFocus.enabled = this.isVisible();
    });
  }
}
