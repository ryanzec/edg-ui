import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ComponentColor, ComponentSize } from '../types/component-types';

/** the color variant of the tag */
export type TagColor = ComponentColor;

/** all available tag size values */
export const allTagSizes = ['xs', 'sm', 'base'] as const satisfies readonly ComponentSize[];

/** the size variant of the tag */
export type TagSize = (typeof allTagSizes)[number];

/** all available tag variant values */
export const allTagVariants = ['strong', 'weak'] as const;

/** the visual style variant of the tag */
export type TagVariant = (typeof allTagVariants)[number];

/** the default size of the tag */
export const TAG_SIZE_DEFAULT: TagSize = 'sm';

/** the default variant of the tag */
export const TAG_VARIANT_DEFAULT: TagVariant = 'weak';

@Component({
  selector: 'org-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.css',
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class Tag {
  /** the color variant applied to the tag */
  public readonly color = input.required<TagColor>();

  /** the size of the tag */
  public readonly size = input<TagSize>(TAG_SIZE_DEFAULT);

  /** the visual style variant of the tag */
  public readonly variant = input<TagVariant>(TAG_VARIANT_DEFAULT);
}
