import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';

/** default value for the card image full width input */
export const CARD_IMAGE_FULL_WIDTH_DEFAULT = true;

/** default value for the card image width input */
export const CARD_IMAGE_WIDTH_DEFAULT: number | undefined = undefined;

/** default value for the card image height input */
export const CARD_IMAGE_HEIGHT_DEFAULT: number | undefined = undefined;

/** default value for the card image priority input */
export const CARD_IMAGE_PRIORITY_DEFAULT = false;

/** displays an image inside a card; renders in fill mode when width and height are omitted */
@Component({
  selector: 'org-card-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './card-image.html',
  styleUrl: './card-image.css',
  host: {
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
    '[attr.data-priority]': 'priority() ? "" : null',
  },
})
export class CardImage {
  /** the image source url */
  public src = input.required<string>();

  /** the alternative text description for the image */
  public alt = input.required<string>();

  /** whether the image should stretch to fill the full width of the card */
  public fullWidth = input<boolean>(CARD_IMAGE_FULL_WIDTH_DEFAULT);

  /** the intrinsic width of the image in pixels; when omitted the image renders in fill mode */
  public width = input<number | undefined, number | null | undefined>(CARD_IMAGE_WIDTH_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the intrinsic height of the image in pixels; when omitted the image renders in fill mode */
  public height = input<number | undefined, number | null | undefined>(CARD_IMAGE_HEIGHT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** whether to treat this image as a lcp element and load it with high priority */
  public priority = input<boolean>(CARD_IMAGE_PRIORITY_DEFAULT);
}
