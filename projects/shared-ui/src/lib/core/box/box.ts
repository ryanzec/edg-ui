import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { BoxBrainDirective } from '../box/box-brain';
import { ColorStrength, ComponentColor, allComponentColors } from '../types/component-types';

export { allBoxExpandedStates, BOX_EXPANDED_STATE_DEFAULT, type BoxExpandedState } from './box-brain';

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

/** all available box layout values */
export const allBoxLayouts = ['column', 'row'] as const;

/**
 * the layout type for the box component (describes how the box arranges its inner content as a flex container)
 *
 * column: a vertical flex container that spaces its slotted regions with a shared gap (default) —
 *   the foundation for composing header / image / content / footer sub-components into a card-like surface
 * row: a horizontal flex container that spaces its slotted regions with the same shared gap
 */
export type BoxLayout = (typeof allBoxLayouts)[number];

/** all available box padding application values */
export const allBoxPaddingApplications = ['container', 'inner-items'] as const;

/**
 * the padding application type for the box component (describes where the padding amount is applied)
 *
 * container: the padding is applied to the box surface itself (default) — the slotted regions, including any
 *   header / footer dividers, are inset from the box border by the padding
 * inner-items: the surface padding is removed and applied inside each slotted region instead, so the region
 *   dividers render full-bleed (touching the box border) while the region content stays inset
 */
export type BoxPaddingApplication = (typeof allBoxPaddingApplications)[number];

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

/** default value for the box layout input */
export const BOX_LAYOUT_DEFAULT: BoxLayout = 'column';

/** default value for the box paddingApplication input */
export const BOX_PADDING_APPLICATION_DEFAULT: BoxPaddingApplication = 'container';

/** default value for the box isClickable input */
export const BOX_IS_CLICKABLE_DEFAULT = false;

@Component({
  selector: 'org-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './box.html',
  styleUrl: './box.css',
  hostDirectives: [
    {
      directive: BoxBrainDirective,
      inputs: ['isExpandable', 'expandedState'],
      outputs: ['clicked', 'expandedStateChange'],
    },
  ],
  host: {
    // the semantic style attributes stay on the host (public attribute contract); box.css applies them to the
    // inner .box-surface element via :host([data-*]) .box-surface so the surface can be removed in the 'none'
    // state. data-collapsed also drives the slotted regions self-hiding via :host-context(org-box[data-collapsed]).
    '[attr.data-color]': 'color()',
    '[attr.data-color-strength]': 'colorStrength()',
    '[attr.data-border]': 'border()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-padding-application]': 'paddingApplication()',
    '[attr.data-background]': 'background()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-collapsed]': 'isHeaderOnly() ? "" : null',
  },
})
export class Box {
  /** reference to the host box brain directive; slotted sub-components inject Box to read / drive expand state */
  public readonly boxBrain = inject(BoxBrainDirective);
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

  /**
   * where the padding amount is applied; 'container' (default) pads the box surface, 'inner-items' moves the
   * padding into the slotted regions so their dividers render full-bleed while their content stays inset
   */
  public paddingApplication = input<BoxPaddingApplication>(BOX_PADDING_APPLICATION_DEFAULT);

  /** whether the color input should tint the background (colored) or leave the default background (colorless) */
  public background = input<BoxBackground>(BOX_BACKGROUND_DEFAULT);

  /** the corner shape of the box; 'square' drops the rounded radius to 0 */
  public shape = input<BoxShape>(BOX_SHAPE_DEFAULT);

  /** the flex layout of the box for composing slotted regions; 'column' (default) is vertical, 'row' is horizontal */
  public layout = input<BoxLayout>(BOX_LAYOUT_DEFAULT);

  /** optional class string forwarded onto the inner .box-surface element (e.g. a gradient utility class) */
  public readonly surfaceClass = input<string>('');

  /**
   * when true, flips the box into its clickable affordance so the whole surface is interactive and emits
   * clicked. ignored when the box is expandable — the expandable header drives the interaction instead.
   */
  public readonly isClickable = input<boolean>(BOX_IS_CLICKABLE_DEFAULT);

  /** whether the box surface renders at all; only the 'none' state (when expandable) removes the surface */
  protected readonly isRendered = computed<boolean>(
    () => !this.boxBrain.isExpandable() || this.boxBrain.expandedState() !== 'none'
  );

  /** whether the box is collapsed to header-only; drives hiding of slotted regions via host-context */
  protected readonly isHeaderOnly = computed<boolean>(
    () => this.boxBrain.isExpandable() && this.boxBrain.expandedState() === 'header-only'
  );

  constructor() {
    // drive the brain's clickable affordance from the box's own isClickable input, but suppress it while the
    // box is expandable: an expandable surface owns its click target on the header toggle and cannot share a
    // single click target with the whole surface.
    effect(() => {
      this.boxBrain.setExternallyClickable(this.isClickable() && !this.boxBrain.isExpandable());
    });
  }
}
