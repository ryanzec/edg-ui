import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils } from '@organization/shared-utils';
import { ComponentSize } from '../types/component-types';
import { AvatarBrainDirective } from '../avatar/avatar-brain';
import { ButtonBrainDirective } from '../button/button-brain';
import { Indicator, INDICATOR_COLOR_DEFAULT, IndicatorColor, IndicatorPosition } from '../indicator/indicator';
import { IndicatorAnchor } from '../indicator/indicator-anchor';
import { AvatarShape } from './avatar-shape';
import { AvatarImage } from './avatar-image';
import { AvatarLabel } from './avatar-label';
import { AvatarStack } from './avatar-stack';

/** available size variants for the avatar component. */
export const allAvatarSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** size variant for the avatar component. */
export type AvatarSize = (typeof allAvatarSizes)[number];

/** available shape variants for the avatar component. */
export const allAvatarShapeVariants = ['circle', 'square'] as const;

/** shape variant for the avatar component. */
export type AvatarShapeVariant = (typeof allAvatarShapeVariants)[number];

/** default value for the size input. */
export const AVATAR_SIZE_DEFAULT: AvatarSize = 'base';

/** default value for the shape input. */
export const AVATAR_SHAPE_VARIANT_DEFAULT: AvatarShapeVariant = 'circle';

/** default value for the hasIndicator input. */
export const AVATAR_HAS_INDICATOR_DEFAULT = false;

/** default value for the indicatorColor input. */
export const AVATAR_INDICATOR_COLOR_DEFAULT: IndicatorColor = INDICATOR_COLOR_DEFAULT;

/** default value for the indicatorNumber input. */
export const AVATAR_INDICATOR_NUMBER_DEFAULT: number | undefined = undefined;

/** default value for the indicatorPosition input. */
export const AVATAR_INDICATOR_POSITION_DEFAULT: IndicatorPosition = 'bottom-right';

/** default value for the showLabel input. */
export const AVATAR_SHOW_LABEL_DEFAULT = false;

/** default value for the subLabel input. */
export const AVATAR_SUB_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the imgSrc input. */
export const AVATAR_IMG_SRC_DEFAULT: string | undefined = undefined;

/** default value for the imgEmail input. */
export const AVATAR_IMG_EMAIL_DEFAULT: string | undefined = undefined;

/** default value for the imgAlt input. */
export const AVATAR_IMG_ALT_DEFAULT: string | undefined = undefined;

/** default value for the count input. */
export const AVATAR_COUNT_DEFAULT = 0;

/** total number of distinct background colors cycled through based on the first label character. */
const AVATAR_COLOR_COUNT = 8;

@Component({
  selector: 'org-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ButtonBrainDirective, Indicator, IndicatorAnchor, AvatarShape, AvatarImage, AvatarLabel],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  hostDirectives: [
    {
      directive: AvatarBrainDirective,
      inputs: ['label', 'disabled', 'isOverflow'],
      outputs: ['clicked'],
    },
  ],
  host: {
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-color-index]': 'colorIndex()',
    '[attr.data-overflow]': 'avatarBrainDirective.isOverflow() ? "true" : null',
    '[attr.data-clickable]': 'avatarBrainDirective.isClickable() ? "true" : null',
    '[attr.data-disabled]': 'avatarBrainDirective.isDisabled() ? "true" : null',
  },
})
export class Avatar {
  /** reference to the host avatar brain directive owning label, disabled, and click state. */
  protected readonly avatarBrainDirective = inject(AvatarBrainDirective);

  /** optional parent avatar stack used to drive the effective size when present. */
  private readonly _avatarStack = inject(AvatarStack, { optional: true });

  /** background color index (0-7) derived from the first character of the brain label; falls back to 0 when empty. */
  protected readonly colorIndex = computed<number>(() => {
    const label = this.avatarBrainDirective.label().trim();

    if (!label) {
      return 0;
    }

    return (label.toLowerCase().codePointAt(0) ?? 0) % AVATAR_COLOR_COUNT;
  });

  /** resolved size honoring the parent avatar stack (if present) over the locally provided size. */
  protected readonly effectiveSize = computed<AvatarSize>(() => this._avatarStack?.size() ?? this.size());

  /** the size variant shared with internal sub-components. */
  public size = input<AvatarSize>(AVATAR_SIZE_DEFAULT);

  /** the shape variant shared with internal sub-components; circle for people, square for organisations / teams / projects. */
  public shape = input<AvatarShapeVariant>(AVATAR_SHAPE_VARIANT_DEFAULT);

  /** when true, renders a status indicator pinned to the corner of the avatar circle. */
  public hasIndicator = input<boolean>(AVATAR_HAS_INDICATOR_DEFAULT);

  /** the color of the rendered status indicator (only used when hasIndicator is true). */
  public indicatorColor = input<IndicatorColor>(AVATAR_INDICATOR_COLOR_DEFAULT);

  /** optional number rendered inside the status indicator (only used when hasIndicator is true). */
  public indicatorNumber = input<number | undefined, number | null | undefined>(AVATAR_INDICATOR_NUMBER_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** which corner of the avatar circle the status indicator is pinned to (only used when hasIndicator is true). */
  public indicatorPosition = input<IndicatorPosition>(AVATAR_INDICATOR_POSITION_DEFAULT);

  /** when true, renders the adjacent name / sub-label block to the side of the avatar shape. */
  public showLabel = input<boolean>(AVATAR_SHOW_LABEL_DEFAULT);

  /** optional secondary text rendered below the main label (only used when showLabel is true). */
  public subLabel = input<string | undefined, string | null | undefined>(AVATAR_SUB_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** explicit image url overlaying the colored shape; takes priority over imgEmail. */
  public imgSrc = input<string | undefined, string | null | undefined>(AVATAR_IMG_SRC_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** email used to fetch a gravatar image when no imgSrc is provided. */
  public imgEmail = input<string | undefined, string | null | undefined>(AVATAR_IMG_EMAIL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** overrides the alt text on the rendered image; falls back to the avatar label when omitted. */
  public imgAlt = input<string | undefined, string | null | undefined>(AVATAR_IMG_ALT_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the count rendered as "+N" inside the overflow pill (only used when isOverflow is true). */
  public count = input<number>(AVATAR_COUNT_DEFAULT);
}
