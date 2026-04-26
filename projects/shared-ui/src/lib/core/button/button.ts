import { Component, ChangeDetectionStrategy, computed, contentChildren, input, output, viewChild } from '@angular/core';
import { angularUtils } from '@organization/shared-utils';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { ComponentColor, ComponentSize } from '../types/component-types';
import { ButtonBrainDirective } from '../../brain/button-brain/button-brain';
import { ButtonIcon } from './button-icon';

/** the color variant of the button */
export type ButtonColor = ComponentColor;

/** all available button size values */
export const allButtonSizes = ['sm', 'base', 'lg'] as const satisfies readonly ComponentSize[];

/** the size variant of the button */
export type ButtonSize = (typeof allButtonSizes)[number];

/** all available button type values */
export const allButtonTypes = ['button', 'submit', 'reset'] as const;

/** the html button type attribute value */
export type ButtonType = (typeof allButtonTypes)[number];

/** all available button variant values */
export const allButtonVariants = ['filled', 'ghost', 'text'] as const;

/** the visual style variant of the button */
export type ButtonVariant = (typeof allButtonVariants)[number];

/** the default color of the button */
export const BUTTON_COLOR_DEFAULT: ButtonColor = 'primary';

/** the default size of the button */
export const BUTTON_SIZE_DEFAULT: ButtonSize = 'base';

/** the default variant of the button */
export const BUTTON_VARIANT_DEFAULT: ButtonVariant = 'filled';

/** the default disabled state of the button */
export const BUTTON_DISABLED_DEFAULT = false;

/** the default loading state of the button */
export const BUTTON_LOADING_DEFAULT = false;

/** the default icon-only state of the button */
export const BUTTON_ICON_ONLY_DEFAULT = false;

/** the default html button type */
export const BUTTON_TYPE_DEFAULT: ButtonType = 'button';

/** the default exclude-spacing state of the button */
export const BUTTON_EXCLUDE_SPACING_DEFAULT = false;

/** the default css class applied to the inner button element */
export const BUTTON_BUTTON_CLASS_DEFAULT = '';

/** the default aria-label of the button */
export const BUTTON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** the default aria-expanded state of the button */
export const BUTTON_ARIA_EXPANDED_DEFAULT: boolean | undefined = undefined;

@Component({
  selector: 'org-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, ButtonBrainDirective],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon-only]': 'iconOnly() ? "" : null',
    '[attr.data-exclude-spacing]': 'excludeSpacing() ? "" : null',
    '[attr.data-loading]': 'loading() ? "" : null',
  },
})
export class Button {
  private readonly _buttonBrainDirective = viewChild.required(ButtonBrainDirective);

  /** @internal all slotted button icon instances; used by ButtonIcon to determine spinner placement during loading. */
  private readonly _buttonIcons = contentChildren(ButtonIcon);

  /** the color variant applied to the button */
  public readonly color = input<ButtonColor>(BUTTON_COLOR_DEFAULT);

  /** the size of the button */
  public readonly size = input<ButtonSize>(BUTTON_SIZE_DEFAULT);

  /** the visual style variant of the button */
  public readonly variant = input<ButtonVariant>(BUTTON_VARIANT_DEFAULT);

  /** whether the button is disabled and non-interactive */
  public readonly disabled = input<boolean>(BUTTON_DISABLED_DEFAULT);

  /** whether the button is in a loading state, also disables interaction */
  public readonly loading = input<boolean>(BUTTON_LOADING_DEFAULT);

  /** whether the button renders in icon-only mode; drives icon-only padding styles */
  public readonly iconOnly = input<boolean>(BUTTON_ICON_ONLY_DEFAULT);

  /** the html button type attribute value */
  public readonly type = input<ButtonType>(BUTTON_TYPE_DEFAULT);

  /** when true, removes all padding from the inner button element */
  public readonly excludeSpacing = input<boolean>(BUTTON_EXCLUDE_SPACING_DEFAULT);

  /** additional css classes applied to the inner button element */
  public readonly buttonClass = input<string>(BUTTON_BUTTON_CLASS_DEFAULT);

  /** accessible label for icon-only buttons or when the visual label needs an override */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(BUTTON_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates whether a controlled element is expanded or collapsed */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(BUTTON_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** emitted when the button is clicked while not disabled or loading */
  public readonly clicked = output<void>();

  /** whether the button is currently being pressed */
  public readonly isPressed = computed<boolean>(() => this._buttonBrainDirective().isPressed());

  /** whether the button currently holds keyboard or pointer focus */
  public readonly isFocused = computed<boolean>(() => this._buttonBrainDirective().isFocused());

  /** the first slotted ButtonIcon instance, used by ButtonIcon to detect which one renders the loading spinner. */
  public readonly firstButtonIcon = computed<ButtonIcon | undefined>(() => this._buttonIcons()[0]);

  /** whether any button icon is slotted under this button */
  protected readonly hasButtonIcons = computed<boolean>(() => this._buttonIcons().length > 0);

  /** whether the standalone loading spinner should render (no icons slotted and loading is true) */
  protected readonly showStandaloneSpinner = computed<boolean>(() => this.loading() && !this.hasButtonIcons());

  /** re-emits the brain's click as the component's public clicked output */
  protected onBrainClicked(): void {
    this.clicked.emit();
  }
}
