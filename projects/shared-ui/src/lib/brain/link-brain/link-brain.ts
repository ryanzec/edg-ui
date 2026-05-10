import { Directive, computed, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { angularUtils } from '@organization/shared-utils';

/** semantic identifiers for the trailing affordance icon auto-injected for external / download links */
export const allLinkAffordanceIcons = ['external-link', 'download'] as const;

/** the affordance icon name auto-injected for external / download links */
export type LinkAffordanceIcon = (typeof allLinkAffordanceIcons)[number];

/** all available link target values matching the standard html anchor target attribute */
export const allLinkTargets = ['_self', '_blank', '_parent', '_top'] as const;

/** the html target attribute value for the link */
export type LinkTarget = (typeof allLinkTargets)[number];

/** all available referrer policy values matching the standard html anchor referrerpolicy attribute */
export const allLinkReferrerPolicies = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
] as const;

/** the html referrerpolicy attribute value for the link */
export type LinkReferrerPolicy = (typeof allLinkReferrerPolicies)[number];

/** default value for the href input */
export const LINK_HREF_DEFAULT: string | undefined = undefined;

/** default value for the target input */
export const LINK_TARGET_DEFAULT: LinkTarget | undefined = undefined;

/** default value for the rel input */
export const LINK_REL_DEFAULT: string | undefined = undefined;

/** default value for the download input */
export const LINK_DOWNLOAD_DEFAULT: string | undefined = undefined;

/** default value for the hreflang input */
export const LINK_HREFLANG_DEFAULT: string | undefined = undefined;

/** default value for the referrerPolicy input */
export const LINK_REFERRER_POLICY_DEFAULT: LinkReferrerPolicy | undefined = undefined;

/** default value for the ariaLabel input */
export const LINK_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the disabled input */
export const LINK_DISABLED_DEFAULT = false;

/** default value for the affordance input — when true, an external-link / download icon is auto-injected when applicable */
export const LINK_AFFORDANCE_DEFAULT = true;

/**
 * headless brain directive for the link. owns href / target / rel / download / hreflang / referrerpolicy
 * navigation behavior, action-link mode (no href emits clicked), keyboard activation via enter / space, the
 * full accessibility surface (role, tabindex, data-disabled, aria-label), and the auto-injected trailing
 * affordance icon decision for external / download links. carries no styling — apply it to a native anchor
 * (or span when disabled) inside a presentation component.
 */
@Directive({
  selector: 'a[orgLinkBrain], span[orgLinkBrain]',
  exportAs: 'orgLinkBrain',
  host: {
    '[attr.href]': 'effectiveHref()',
    '[attr.target]': 'effectiveTarget()',
    '[attr.rel]': 'effectiveRel()',
    '[attr.download]': 'effectiveDownload()',
    '[attr.hreflang]': 'effectiveHreflang()',
    '[attr.referrerpolicy]': 'effectiveReferrerPolicy()',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.data-disabled]': 'disabled() ? "1" : null',
    '[attr.role]': 'effectiveRole()',
    '[attr.tabindex]': 'effectiveTabindex()',
    '(click)': 'click($event)',
    '(keydown)': 'keydown($event)',
  },
})
export class LinkBrainDirective {
  private readonly _clicked$ = new Subject<MouseEvent | KeyboardEvent>();

  /** the url the host anchor navigates to; when omitted the link acts as a clickable action and emits the clicked output */
  public readonly href = input<string | undefined, string | null | undefined>(LINK_HREF_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the html target attribute controlling where the linked resource opens */
  public readonly target = input<LinkTarget | undefined, LinkTarget | null | undefined>(LINK_TARGET_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the html rel attribute; auto-set to "noopener noreferrer" when target is "_blank" and no consumer value is provided */
  public readonly rel = input<string | undefined, string | null | undefined>(LINK_REL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the html download attribute; pass an empty string to use the resource's filename or a string to set a custom filename */
  public readonly download = input<string | undefined, string | null | undefined>(LINK_DOWNLOAD_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the html hreflang attribute describing the language of the linked resource */
  public readonly hreflang = input<string | undefined, string | null | undefined>(LINK_HREFLANG_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the html referrerpolicy attribute controlling the referrer information sent with the request */
  public readonly referrerPolicy = input<LinkReferrerPolicy | undefined, LinkReferrerPolicy | null | undefined>(
    LINK_REFERRER_POLICY_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** the accessible name for the link, used when the visible content does not adequately describe the destination */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(LINK_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the link is disabled and non-interactive; sets data-disabled, removes href, and gates click / keydown */
  public readonly disabled = input<boolean>(LINK_DISABLED_DEFAULT);

  /** when true, a trailing affordance icon (external-link or download) is auto-rendered when applicable */
  public readonly affordance = input<boolean>(LINK_AFFORDANCE_DEFAULT);

  /** emitted when an action-link is activated by mouse or keyboard, only when href is not provided */
  public readonly clicked = outputFromObservable(this._clicked$);

  /** whether the host should behave as a clickable action because no href is provided */
  public readonly isActionLink = computed<boolean>(() => this.href() === undefined);

  /** the rel attribute applied to the anchor; defaults to "noopener noreferrer" when target is "_blank" and consumer did not provide one */
  public readonly effectiveRel = computed<string | null>(() => {
    if (this.disabled()) {
      return null;
    }

    const consumerRel = this.rel();

    if (consumerRel !== undefined) {
      return consumerRel;
    }

    return this.target() === '_blank' ? 'noopener noreferrer' : null;
  });

  /** the href attribute applied to the anchor; cleared when disabled so the link is non-navigable */
  public readonly effectiveHref = computed<string | null>(() => {
    if (this.disabled()) {
      return null;
    }

    return this.href() ?? null;
  });

  /** the target attribute applied to the anchor; cleared when disabled */
  public readonly effectiveTarget = computed<LinkTarget | null>(() => {
    if (this.disabled()) {
      return null;
    }

    return this.target() ?? null;
  });

  /** the download attribute applied to the anchor; cleared when disabled */
  public readonly effectiveDownload = computed<string | null>(() => {
    if (this.disabled()) {
      return null;
    }

    return this.download() ?? null;
  });

  /** the hreflang attribute applied to the anchor; cleared when disabled */
  public readonly effectiveHreflang = computed<string | null>(() => {
    if (this.disabled()) {
      return null;
    }

    return this.hreflang() ?? null;
  });

  /** the referrerpolicy attribute applied to the anchor; cleared when disabled */
  public readonly effectiveReferrerPolicy = computed<LinkReferrerPolicy | null>(() => {
    if (this.disabled()) {
      return null;
    }

    return this.referrerPolicy() ?? null;
  });

  /** the role attribute applied to the anchor; "button" in action-link mode so screen readers announce it correctly */
  public readonly effectiveRole = computed<string | null>(() => {
    return this.isActionLink() ? 'button' : null;
  });

  /** the tabindex applied to the anchor; -1 when disabled, 0 in action-link mode, native default otherwise */
  public readonly effectiveTabindex = computed<number | null>(() => {
    if (this.disabled()) {
      return -1;
    }

    if (this.isActionLink()) {
      return 0;
    }

    return null;
  });

  /**
   * the auto-injected trailing affordance icon for external / download links.
   * returns undefined when affordance is disabled, when the link is disabled, when the link is in
   * action-link mode, or when neither target="_blank" nor download is set. download wins over external-link
   * when both are present since downloading is the more specific action.
   */
  public readonly affordanceIcon = computed<LinkAffordanceIcon | undefined>(() => {
    if (!this.affordance() || this.disabled() || this.isActionLink()) {
      return undefined;
    }

    if (this.download() !== undefined) {
      return 'download';
    }

    if (this.target() === '_blank') {
      return 'external-link';
    }

    return undefined;
  });

  /** handles anchor click; emits clicked when the host is acting as an action link and not disabled */
  protected click(event: Event): void {
    const mouseEvent = event as MouseEvent;

    if (this.disabled()) {
      mouseEvent.preventDefault();

      return;
    }

    if (!this.isActionLink()) {
      return;
    }

    this._clicked$.next(mouseEvent);
  }

  /** handles keyboard activation of the action link via enter or space */
  protected keydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (this.disabled()) {
      return;
    }

    if (!this.isActionLink()) {
      return;
    }

    if (keyboardEvent.key !== 'Enter' && keyboardEvent.key !== ' ') {
      return;
    }

    keyboardEvent.preventDefault();
    this._clicked$.next(keyboardEvent);
  }
}
