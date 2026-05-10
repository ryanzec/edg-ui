import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import {
  EMPTY_INDICATOR_BRAIN_STATUS_ROLE_DEFAULT,
  EmptyIndicatorBrainDirective,
} from '../../brain/empty-indicator-brain/empty-indicator-brain';
import { Button } from '../button/button';
import {
  Box,
  BOX_BACKGROUND_DEFAULT,
  BOX_BORDER_DEFAULT,
  BOX_COLOR_DEFAULT,
  BOX_PADDING_DEFAULT,
  type BoxBackground,
  type BoxBorder,
  type BoxColor,
  type BoxPadding,
} from '../box/box';

/** default value for the {@link EmptyIndicator.description} input */
export const EMPTY_INDICATOR_DESCRIPTION_DEFAULT: string | undefined = undefined;

/** default value for the {@link EmptyIndicator.actionLabel} input */
export const EMPTY_INDICATOR_ACTION_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the {@link EmptyIndicator.boxColor} input */
export const EMPTY_INDICATOR_BOX_COLOR_DEFAULT: BoxColor | undefined = BOX_COLOR_DEFAULT;

/** default value for the {@link EmptyIndicator.boxBorder} input */
export const EMPTY_INDICATOR_BOX_BORDER_DEFAULT: BoxBorder = BOX_BORDER_DEFAULT;

/** default value for the {@link EmptyIndicator.boxPadding} input */
export const EMPTY_INDICATOR_BOX_PADDING_DEFAULT: BoxPadding = BOX_PADDING_DEFAULT;

/** default value for the {@link EmptyIndicator.boxBackground} input */
export const EMPTY_INDICATOR_BOX_BACKGROUND_DEFAULT: BoxBackground = BOX_BACKGROUND_DEFAULT;

/** default value for the {@link EmptyIndicator.statusRole} input */
export const EMPTY_INDICATOR_STATUS_ROLE_DEFAULT: boolean = EMPTY_INDICATOR_BRAIN_STATUS_ROLE_DEFAULT;

@Component({
  selector: 'org-empty-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Box],
  templateUrl: './empty-indicator.html',
  styleUrl: './empty-indicator.css',
  hostDirectives: [
    {
      directive: EmptyIndicatorBrainDirective,
      inputs: ['statusRole'],
      outputs: ['actionTriggered'],
    },
  ],
})
export class EmptyIndicator {
  /** reference to the host empty-indicator brain directive owning the action event plumbing and a11y role */
  protected readonly brain = inject(EmptyIndicatorBrainDirective, { self: true });

  /** required header text displayed above the description */
  public header = input.required<string>();

  /** optional description text displayed below the header; when undefined no description is rendered */
  public description = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_DESCRIPTION_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional label for the action button; when undefined no button is rendered */
  public actionLabel = input<string | undefined, string | null | undefined>(EMPTY_INDICATOR_ACTION_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the semantic color applied to the inner Box component */
  public boxColor = input<BoxColor | undefined, BoxColor | null | undefined>(EMPTY_INDICATOR_BOX_COLOR_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** the border/visual style variant applied to the inner Box component */
  public boxBorder = input<BoxBorder>(EMPTY_INDICATOR_BOX_BORDER_DEFAULT);

  /** the internal padding size applied to the inner Box component */
  public boxPadding = input<BoxPadding>(EMPTY_INDICATOR_BOX_PADDING_DEFAULT);

  /** whether the inner Box component tints its background using the boxColor input */
  public boxBackground = input<BoxBackground>(EMPTY_INDICATOR_BOX_BACKGROUND_DEFAULT);

  /** whether the action button should be rendered */
  protected readonly hasActionButton = computed<boolean>(() => {
    return !!this.actionLabel() && this.brain.hasActionListener();
  });
}
