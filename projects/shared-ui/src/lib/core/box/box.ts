import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { BoxBrainDirective } from '../box/box-brain';
import { ColorStrength, ComponentColor, allComponentColors } from '../types/component-types';

/** the color variant type for the box component */
export type BoxColor = ComponentColor;

/** all available box color values */
export const allBoxColors = allComponentColors;

/** the color strength variant type for the box component */
export type BoxColorStrength = ColorStrength;

/** all available box border values */
export const allBoxBorders = ['bordered', 'borderless', 'border-thick', 'border-emphasize'] as const;

/**
 * the border/visual style variant type for the box component
 *
 * bordered: the box has a border around it, using the color input for the border color
 * borderless: the box has no border
 * border-thick: the box has a thick border, using the color input for the border color
 * border-emphasize: the box has a border that is more prominent, using the color input for the border color
 */
export type BoxBorder = (typeof allBoxBorders)[number];

/** all available box padding values */
export const allBoxPaddings = ['none', 'sm', 'base', 'lg'] as const;

/** the internal padding size type for the box component */
export type BoxPadding = (typeof allBoxPaddings)[number];

/** all available box background values */
export const allBoxBackgrounds = ['colored', 'colorless'] as const;

/**
 * the background mode type for the box component
 *
 * colored: the box has a colored background, using the color input
 * colorless: the box has a transparent background, using the color input for borders and text
 */
export type BoxBackground = (typeof allBoxBackgrounds)[number];

/** all available box shape values */
export const allBoxShapes = ['rounded', 'square'] as const;

/**
 * the corner shape type for the box component
 *
 * rounded: the box has rounded corners (default)
 * square: the box has square (0 radius) corners
 */
export type BoxShape = (typeof allBoxShapes)[number];

/** default value for the box color input */
export const BOX_COLOR_DEFAULT: BoxColor | undefined = undefined;

/** default value for the box colorStrength input */
export const BOX_COLOR_STRENGTH_DEFAULT: BoxColorStrength = 'soft';

/** default value for the box border input */
export const BOX_BORDER_DEFAULT: BoxBorder = 'bordered';

/** default value for the box padding input */
export const BOX_PADDING_DEFAULT: BoxPadding = 'base';

/** default value for the box background input */
export const BOX_BACKGROUND_DEFAULT: BoxBackground = 'colored';

/** default value for the box shape input */
export const BOX_SHAPE_DEFAULT: BoxShape = 'rounded';

@Component({
  selector: 'org-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './box.css',
  hostDirectives: [
    {
      directive: BoxBrainDirective,
      inputs: ['isClickable'],
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-color-strength]': 'colorStrength()',
    '[attr.data-border]': 'border()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-background]': 'background()',
    '[attr.data-shape]': 'shape()',
  },
})
export class Box {
  /**
   * the semantic color applied to the border and background of the box.
   * note: color variants (danger, warning, info, safe) convey meaning visually only —
   * consumers must add appropriate aria attributes (e.g. role="alert") when the color
   * carries semantic importance for assistive technologies.
   */
  public color = input<BoxColor | undefined, BoxColor | null | undefined>(BOX_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the color intensity of the box; 'strong' renders a solid fill while 'soft' renders the soft tint (only applies when background is 'colored') */
  public colorStrength = input<BoxColorStrength>(BOX_COLOR_STRENGTH_DEFAULT);

  /** the border/visual style variant of the box */
  public border = input<BoxBorder>(BOX_BORDER_DEFAULT);

  /** the internal padding size of the box */
  public padding = input<BoxPadding>(BOX_PADDING_DEFAULT);

  /** whether the color input should tint the background (colored) or leave the default background (colorless) */
  public background = input<BoxBackground>(BOX_BACKGROUND_DEFAULT);

  /** the corner shape of the box; 'square' drops the rounded radius to 0 */
  public shape = input<BoxShape>(BOX_SHAPE_DEFAULT);
}
