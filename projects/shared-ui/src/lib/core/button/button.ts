import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { angularUtils, logManager } from '@organization/shared-utils';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { Icon, type IconSize } from '../icon/icon';
import { type IconName } from '../icon/icon-brain';
import { ComponentColor, ComponentSize } from '../types/component-types';
import {
  ButtonBrainDirective,
  BUTTON_ACTIVE_DEFAULT,
  BUTTON_ARIA_ACTIVEDESCENDANT_DEFAULT,
  BUTTON_ARIA_CONTROLS_DEFAULT,
  BUTTON_ARIA_EXPANDED_DEFAULT,
  BUTTON_ARIA_HASPOPUP_DEFAULT,
  BUTTON_ARIA_LABEL_DEFAULT,
  BUTTON_ARIA_PRESSED_DEFAULT,
  BUTTON_DISABLED_DEFAULT,
  BUTTON_ICON_ONLY_DEFAULT,
  BUTTON_LOADING_DEFAULT,
} from '../button/button-brain';

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
export const allButtonVariants = ['filled', 'ghost', 'text', 'soft', 'plain'] as const;

/** the visual style variant of the button */
export type ButtonVariant = (typeof allButtonVariants)[number];

/** the default color of the button */
export const BUTTON_COLOR_DEFAULT: ButtonColor = 'primary';

/** the default size of the button */
export const BUTTON_SIZE_DEFAULT: ButtonSize = 'base';

/** the default variant of the button */
export const BUTTON_VARIANT_DEFAULT: ButtonVariant = 'filled';

/** the default html button type */
export const BUTTON_TYPE_DEFAULT: ButtonType = 'button';

/** the default exclude-spacing state of the button */
export const BUTTON_EXCLUDE_SPACING_DEFAULT = false;

/** the default css class applied to the inner button element */
export const BUTTON_BUTTON_CLASS_DEFAULT = '';

/** the default pre-icon name */
export const BUTTON_PRE_ICON_DEFAULT: IconName | undefined = undefined;

/** the default post-icon name */
export const BUTTON_POST_ICON_DEFAULT: IconName | undefined = undefined;

@Component({
  selector: 'org-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner, Icon, NgTemplateOutlet, ButtonBrainDirective],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon-only]': 'iconOnly() ? "" : null',
    '[attr.data-exclude-spacing]': 'excludeSpacing() ? "" : null',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-active]': 'isActive() ? "" : null',
  },
})
export class Button {
  private readonly _buttonBrainDirective = viewChild.required(ButtonBrainDirective);

  /** projected template for the pre slot — when provided, takes precedence over the preIcon input */
  protected readonly preTemplate = contentChild<TemplateRef<unknown>>('pre');

  /** projected template for the post slot — when provided, takes precedence over the postIcon input */
  protected readonly postTemplate = contentChild<TemplateRef<unknown>>('post');

  /**
   * projected template for the main content slot — when provided, takes precedence over the label input;
   * use this when the visible content needs more structure than a single text label can express
   */
  protected readonly contentTemplate = contentChild<TemplateRef<unknown>>('content');

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

  /** the visible text label rendered inside the button */
  public readonly label = input.required<string>();

  /** optional icon rendered before the label; ignored when a projected #pre template is provided */
  public readonly preIcon = input<IconName | undefined, IconName | null | undefined>(BUTTON_PRE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** optional icon rendered after the label; ignored when a projected #post template is provided */
  public readonly postIcon = input<IconName | undefined, IconName | null | undefined>(BUTTON_POST_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for icon-only buttons or when the visual label needs an override */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(BUTTON_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates whether a controlled element is expanded or collapsed */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(BUTTON_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates the pressed/selected state when used as a toggle button */
  public readonly ariaPressed = input<boolean | undefined, boolean | null | undefined>(BUTTON_ARIA_PRESSED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** communicates that the button opens a popup (e.g. `'listbox'`, `'menu'`, `'dialog'`) */
  public readonly ariaHaspopup = input<string | undefined, string | null | undefined>(BUTTON_ARIA_HASPOPUP_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** identifies the element controlled by this button (e.g. the panel id) */
  public readonly ariaControls = input<string | undefined, string | null | undefined>(BUTTON_ARIA_CONTROLS_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** identifies the currently active descendant for composite widgets (e.g. listbox option ids) */
  public readonly ariaActivedescendant = input<string | undefined, string | null | undefined>(
    BUTTON_ARIA_ACTIVEDESCENDANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** when true, the button renders in its active (pressed) visual state and hover/active pseudo states have no effect */
  public readonly isActive = input<boolean>(BUTTON_ACTIVE_DEFAULT);

  /** emitted when the button is clicked while not disabled or loading */
  public readonly clicked = output<void>();

  /** whether the button is currently being pressed */
  public readonly isPressed = computed<boolean>(() => this._buttonBrainDirective().isPressed());

  /** whether the button currently holds keyboard or pointer focus */
  public readonly isFocused = computed<boolean>(() => this._buttonBrainDirective().isFocused());

  /** the icon size that maps from the parent button size (sm -> xs, base -> base, lg -> 2xl) */
  protected readonly iconSize = computed<IconSize>(() => {
    const buttonSize = this.size();

    if (buttonSize === 'sm') {
      return 'xs';
    }

    if (buttonSize === 'lg') {
      return '2xl';
    }

    return 'base';
  });

  /** whether the pre-icon should render (no projected pre template present) */
  protected readonly showPreIcon = computed<boolean>(() => this.preIcon() !== undefined && !this.preTemplate());

  /** whether the post-icon should render (no projected post template present) */
  protected readonly showPostIcon = computed<boolean>(() => this.postIcon() !== undefined && !this.postTemplate());

  constructor() {
    // warn when both preIcon input and projected #pre template are provided; the projected template wins
    effect(() => {
      if (this.preTemplate() && this.preIcon() !== undefined) {
        logManager.warn({
          type: 'button-conflicting-pre-slot',
          message: 'both preIcon input and projected #pre template were provided; the projected template wins',
        });
      }
    });

    // warn when both postIcon input and projected #post template are provided; the projected template wins
    effect(() => {
      if (this.postTemplate() && this.postIcon() !== undefined) {
        logManager.warn({
          type: 'button-conflicting-post-slot',
          message: 'both postIcon input and projected #post template were provided; the projected template wins',
        });
      }
    });
  }

  /** re-emits the brain's click as the component's public clicked output */
  protected onBrainClicked(): void {
    this.clicked.emit();
  }
}
