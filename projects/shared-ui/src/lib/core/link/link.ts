import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';

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

/** the default href value for the link */
export const LINK_HREF_DEFAULT: string | undefined = undefined;

/** the default target value for the link */
export const LINK_TARGET_DEFAULT: LinkTarget | undefined = undefined;

/** the default rel value for the link */
export const LINK_REL_DEFAULT: string | undefined = undefined;

/** the default download value for the link */
export const LINK_DOWNLOAD_DEFAULT: string | undefined = undefined;

/** the default hreflang value for the link */
export const LINK_HREFLANG_DEFAULT: string | undefined = undefined;

/** the default referrer policy value for the link */
export const LINK_REFERRER_POLICY_DEFAULT: LinkReferrerPolicy | undefined = undefined;

/** the default aria-label value for the link */
export const LINK_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the default disabled state for the link */
export const LINK_DISABLED_DEFAULT = false;

@Component({
  selector: 'org-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './link.html',
  styleUrl: './link.css',
})
export class Link {
  /** the url the link navigates to; when omitted the link acts as a clickable action and emits the clicked output */
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

  /** when true the link renders as a span styled like a disabled link with cursor not-allowed */
  public readonly disabled = input<boolean>(LINK_DISABLED_DEFAULT);

  /** emitted when the link is activated by mouse or keyboard, only when href is not provided so consumers can handle action-style clicks */
  public readonly clicked = output<MouseEvent | KeyboardEvent>();

  /** whether the link should behave as a clickable action because no href is provided */
  protected readonly isActionLink = computed<boolean>(() => this.href() === undefined);

  /** the rel attribute applied to the rendered anchor; defaults to "noopener noreferrer" when target is "_blank" and consumer did not provide one */
  protected readonly effectiveRel = computed<string | undefined>(() => {
    const consumerRel = this.rel();

    if (consumerRel !== undefined) {
      return consumerRel;
    }

    return this.target() === '_blank' ? 'noopener noreferrer' : undefined;
  });

  /** handles anchor click; emits clicked when the link is acting as an action link */
  protected onClick(event: MouseEvent): void {
    if (!this.isActionLink()) {
      return;
    }

    this.clicked.emit(event);
  }

  /** handles keyboard activation of the action link via Enter or Space */
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isActionLink()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.clicked.emit(event);
  }
}
