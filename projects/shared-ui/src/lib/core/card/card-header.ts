import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { CardHeaderBrainDirective } from '../../brain/card-brain/card-header-brain';
import { Button } from '../button/button';
import { Card } from './card';

/** default value for the card header title input */
export const CARD_HEADER_TITLE_DEFAULT: string | undefined = undefined;

/** default value for the card header subtitle input */
export const CARD_HEADER_SUBTITLE_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Button],
  templateUrl: './card-header.html',
  styleUrl: './card-header.css',
  hostDirectives: [
    {
      directive: CardHeaderBrainDirective,
      inputs: ['headingLevel'],
    },
  ],
  host: {
    '[attr.data-actions-only]': 'actionsOnly() ? "" : null',
    '[attr.data-expandable]': 'isExpandable() ? "" : null',
  },
})
export class CardHeader {
  private readonly _card = inject(Card);

  /** reference to the host card header brain directive owning the headingLevel input */
  protected readonly cardHeaderBrainDirective = inject(CardHeaderBrainDirective);

  /** the title text displayed in the card header */
  public title = input<string | undefined, string | null | undefined>(CARD_HEADER_TITLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the subtitle text displayed below the title */
  public subtitle = input<string | undefined, string | null | undefined>(CARD_HEADER_SUBTITLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether the title has a non-empty value */
  protected readonly hasTitle = computed<boolean>(() => !!this.title());

  /** whether the subtitle has a non-empty value */
  protected readonly hasSubtitle = computed<boolean>(() => !!this.subtitle());

  /** whether the parent card has opted in to the expandable affordance */
  protected readonly isExpandable = computed<boolean>(() => this._card.expandableBrain.isExpandable());

  /** the current expanded state of the parent card; only meaningful when isExpandable() is true */
  protected readonly isExpanded = computed<boolean>(() => this._card.expandableBrain.isExpanded());

  /** the accessible label / icon name pairing for the toggle button driven by the current expanded state */
  protected readonly toggleLabel = computed<string>(() => (this.isExpanded() ? 'Collapse' : 'Expand'));

  /**
   * whether the header is in actions-only mode (no title and no subtitle and not expandable) — drives the
   * right-aligned single-column grid. an expandable header always renders a left-column toggle row (with at
   * least the chevron), so it never enters actions-only mode.
   */
  protected readonly actionsOnly = computed<boolean>(
    () => !this.isExpandable() && !this.hasTitle() && !this.hasSubtitle()
  );

  /** handles activation of the toggle area; delegates to the brain so the no-op-when-non-expandable guard stays in one place */
  protected onToggle(): void {
    this._card.expandableBrain.toggle();
  }
}
