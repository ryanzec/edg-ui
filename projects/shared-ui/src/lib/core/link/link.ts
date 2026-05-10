import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { Icon } from '../icon/icon';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import {
  LinkBrainDirective,
  LinkReferrerPolicy,
  LinkTarget,
  LINK_AFFORDANCE_DEFAULT,
  LINK_ARIA_LABEL_DEFAULT,
  LINK_DISABLED_DEFAULT,
  LINK_DOWNLOAD_DEFAULT,
  LINK_HREFLANG_DEFAULT,
  LINK_HREF_DEFAULT,
  LINK_REFERRER_POLICY_DEFAULT,
  LINK_REL_DEFAULT,
  LINK_TARGET_DEFAULT,
} from '../../brain/link-brain/link-brain';

@Component({
  selector: 'org-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkBrainDirective, NgTemplateOutlet, Icon],
  templateUrl: './link.html',
  styleUrl: './link.css',
})
export class Link {
  private readonly _linkBrainDirective = viewChild.required(LinkBrainDirective);

  /** projected template for the pre slot — content rendered before the default content */
  protected readonly preTemplate = contentChild<TemplateRef<unknown>>('pre');

  /** projected template for the post slot — content rendered after the default content; suppresses the auto-injected affordance icon */
  protected readonly postTemplate = contentChild<TemplateRef<unknown>>('post');

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

  /** when true the link renders styled as disabled with cursor not-allowed and is non-interactive */
  public readonly disabled = input<boolean>(LINK_DISABLED_DEFAULT);

  /** when true, an external-link or download icon is auto-injected as a trailing affordance when applicable */
  public readonly affordance = input<boolean>(LINK_AFFORDANCE_DEFAULT);

  /** emitted when the link is activated by mouse or keyboard, only when href is not provided so consumers can handle action-style clicks */
  public readonly clicked = output<MouseEvent | KeyboardEvent>();

  /** whether the link is rendering as an action-link (no href provided) */
  public readonly isActionLink = computed<boolean>(() => this._linkBrainDirective().isActionLink());

  /** the icon name for the auto-injected trailing affordance icon, or undefined when none should render */
  protected readonly affordanceIcon = computed<IconName | undefined>(() => {
    const icon = this._linkBrainDirective().affordanceIcon();

    return icon;
  });

  /** whether the auto-injected affordance icon should render — suppressed when a manual #post template wins */
  protected readonly showAffordanceIcon = computed<boolean>(() => {
    return this.affordanceIcon() !== undefined && !this.postTemplate();
  });

  /** re-emits the brain's clicked event as the component's public clicked output */
  protected onBrainClicked(event: MouseEvent | KeyboardEvent): void {
    this.clicked.emit(event);
  }
}
