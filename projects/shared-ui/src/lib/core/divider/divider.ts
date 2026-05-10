import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import {
  DIVIDER_DIRECTION_DEFAULT,
  DividerBrainDirective,
  type DividerDirection,
} from '../../brain/divider-brain/divider-brain';
import type { ComponentColor } from '../types/component-types';

export {
  type DividerDirection,
  allDividerDirections,
  DIVIDER_DIRECTION_DEFAULT,
} from '../../brain/divider-brain/divider-brain';

/** all available divider line styles */
export const allDividerStyles = ['solid', 'dashed', 'dotted'] as const;

/** the line style of the divider */
export type DividerStyle = (typeof allDividerStyles)[number];

/** all available divider line weights */
export const allDividerWeights = ['thin', 'thick'] as const;

/** the line weight (thickness) of the divider */
export type DividerWeight = (typeof allDividerWeights)[number];

/** all available divider padding sizes */
export const allDividerPaddings = ['none', 'sm', 'base', 'lg'] as const;

/** cross-axis breathing room around the divider line */
export type DividerPadding = (typeof allDividerPaddings)[number];

/** the semantic color of the divider line — when omitted the default border color token is used */
export type DividerColor = ComponentColor;

/** default value for the lineStyle input */
export const DIVIDER_LINE_STYLE_DEFAULT: DividerStyle = 'solid';

/** default value for the weight input */
export const DIVIDER_WEIGHT_DEFAULT: DividerWeight = 'thin';

/** default value for the padding input */
export const DIVIDER_PADDING_DEFAULT: DividerPadding = 'sm';

/** default value for the color input — undefined means the default border color is used */
export const DIVIDER_COLOR_DEFAULT: DividerColor | undefined = undefined;

@Component({
  selector: 'org-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './divider.css',
  hostDirectives: [
    {
      directive: DividerBrainDirective,
      inputs: ['direction'],
    },
  ],
  host: {
    '[attr.data-style]': 'lineStyle()',
    '[attr.data-weight]': 'weight()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-color]': 'color() ?? null',
  },
})
export class Divider {
  /** the orientation of the divider line — horizontal renders a top border across the full width, vertical renders a left border across the full height */
  public readonly direction = input<DividerDirection>(DIVIDER_DIRECTION_DEFAULT);

  /** the line style of the divider — named `lineStyle` (not `style`) because the `[style]` template binding is reserved for inline element styles */
  public readonly lineStyle = input<DividerStyle>(DIVIDER_LINE_STYLE_DEFAULT);

  /** the line weight (thickness) of the divider */
  public readonly weight = input<DividerWeight>(DIVIDER_WEIGHT_DEFAULT);

  /** cross-axis breathing room around the divider line — becomes vertical margin for horizontal direction, horizontal margin for vertical direction */
  public readonly padding = input<DividerPadding>(DIVIDER_PADDING_DEFAULT);

  /** the semantic color of the divider line — when omitted the default border color token is used */
  public readonly color = input<DividerColor | undefined, DividerColor | null | undefined>(DIVIDER_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });
}
