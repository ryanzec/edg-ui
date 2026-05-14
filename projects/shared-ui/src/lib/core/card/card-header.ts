import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { CardHeaderBrainDirective } from '../../brain/card-brain/card-header-brain';

/** default value for the card header title input */
export const CARD_HEADER_TITLE_DEFAULT: string | undefined = undefined;

/** default value for the card header subtitle input */
export const CARD_HEADER_SUBTITLE_DEFAULT: string | undefined = undefined;

@Component({
  selector: 'org-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  },
})
export class CardHeader {
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

  /** whether the header is in actions-only mode (no title and no subtitle) — drives the right-aligned single-column grid */
  protected readonly actionsOnly = computed<boolean>(() => !this.hasTitle() && !this.hasSubtitle());
}
