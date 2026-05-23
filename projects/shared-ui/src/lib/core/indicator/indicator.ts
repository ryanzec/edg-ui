import { Component, ChangeDetectionStrategy, computed, contentChildren, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { ComponentColor, ComponentSize } from '../types/component-types';
import { Icon } from '../icon/icon';
import { IndicatorBrainDirective } from '../indicator/indicator-brain';

/** color options for the indicator component */
export type IndicatorColor = ComponentColor;

/** all available indicator size values */
export const allIndicatorSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size options for the indicator component */
export type IndicatorSize = (typeof allIndicatorSizes)[number];

/** all available indicator render modes */
export const allIndicatorModes = ['dot', 'number', 'icon'] as const;

/** the rendering mode for the indicator: bare dot, numeric pill, or glyph pill */
export type IndicatorMode = (typeof allIndicatorModes)[number];

/** all available indicator corner positions when pinned to an anchor */
export const allIndicatorPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

/** the corner position for the indicator inside its anchor */
export type IndicatorPosition = (typeof allIndicatorPositions)[number];

/** default value for the color input */
export const INDICATOR_COLOR_DEFAULT: IndicatorColor = 'primary';

/** default value for the size input */
export const INDICATOR_SIZE_DEFAULT: IndicatorSize = 'base';

/** default value for the position input */
export const INDICATOR_POSITION_DEFAULT: IndicatorPosition | undefined = undefined;

/** default value for the pulse input */
export const INDICATOR_PULSE_DEFAULT = false;

/** default value for the ring input */
export const INDICATOR_RING_DEFAULT = false;

/** default value for the hasFade input */
export const INDICATOR_HAS_FADE_DEFAULT = false;

@Component({
  selector: 'org-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './indicator.html',
  styleUrl: './indicator.css',
  hostDirectives: [
    {
      directive: IndicatorBrainDirective,
      inputs: ['number', 'ariaLabel'],
    },
  ],
  host: {
    '[attr.data-mode]': 'mode()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-position]': 'position() ?? null',
    '[attr.data-ring]': 'ring() ? "" : null',
    '[attr.data-pulse]': 'pulse() ? "" : null',
    '[attr.data-fade]': 'hasFade() ? "" : null',
  },
})
export class Indicator {
  /** projected icon children; presence drives icon mode when no number is set */
  private readonly _projectedIcons = contentChildren(Icon);

  /** reference to the host indicator brain directive owning numbered state and the a11y surface */
  protected readonly brain = inject(IndicatorBrainDirective, { self: true });

  /** the semantic color of the indicator */
  public readonly color = input<IndicatorColor>(INDICATOR_COLOR_DEFAULT);

  /** the size of the indicator */
  public readonly size = input<IndicatorSize>(INDICATOR_SIZE_DEFAULT);

  /** when set, pins the indicator to the named corner of its anchor (anchor must be position: relative) */
  public readonly position = input<IndicatorPosition | undefined, IndicatorPosition | null | undefined>(
    INDICATOR_POSITION_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** when true, paints a 2px outline ring matching the surface color so the indicator is visible over imagery */
  public readonly ring = input<boolean>(INDICATOR_RING_DEFAULT);

  /** when true, plays a continuous pulse animation behind the indicator to convey live status */
  public readonly pulse = input<boolean>(INDICATOR_PULSE_DEFAULT);

  /** when true, paints a 4px halo around the indicator using the matching soft color to give the illusion of a fade */
  public readonly hasFade = input<boolean>(INDICATOR_HAS_FADE_DEFAULT);

  /** the resolved render mode: number when a value is set, icon when an org-icon is projected, dot otherwise */
  protected readonly mode = computed<IndicatorMode>(() => {
    if (this.brain.hasNumber()) {
      return 'number';
    }

    if (this._projectedIcons().length > 0) {
      return 'icon';
    }

    return 'dot';
  });
}
