import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** default value for the card header title input */
export const CARD_HEADER_TITLE_DEFAULT: string | null = null;

/** default value for the card header subtitle input */
export const CARD_HEADER_SUBTITLE_DEFAULT: string | null = null;

/** default value for the card header heading level input */
export const CARD_HEADER_HEADING_LEVEL_DEFAULT = 3;

@Component({
  selector: 'org-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-header.html',
  styleUrl: './card-header.css',
})
export class CardHeader {
  /** the title text displayed in the card header */
  public title = input<string | null>(CARD_HEADER_TITLE_DEFAULT);

  /** the subtitle text displayed below the title */
  public subtitle = input<string | null>(CARD_HEADER_SUBTITLE_DEFAULT);

  /** the html heading level (1-6) used for the title element */
  public headingLevel = input<number>(CARD_HEADER_HEADING_LEVEL_DEFAULT);

  /** whether the title has a non-empty value */
  protected readonly hasTitle = computed<boolean>(() => !!this.title());

  /** whether the subtitle has a non-empty value */
  protected readonly hasSubtitle = computed<boolean>(() => !!this.subtitle());
}
