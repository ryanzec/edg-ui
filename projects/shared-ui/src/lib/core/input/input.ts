import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { angularUtils } from '@organization/shared-utils';
import { type IconName } from '../icon/icon-brain';
import { Icon } from '../icon/icon';
import { Tag } from '../tags/tag';
import { Button } from '../button/button';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import {
  allInputTypes,
  InputBrainDirective,
  type InputType,
  INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT,
  INPUT_ARIA_AUTO_COMPLETE_DEFAULT,
  INPUT_ARIA_CONTROLS_DEFAULT,
  INPUT_ARIA_EXPANDED_DEFAULT,
  INPUT_ARIA_HAS_POPUP_DEFAULT,
  INPUT_ARIA_LABEL_DEFAULT,
  INPUT_AUTOCOMPLETE_DEFAULT,
  INPUT_AUTO_FOCUS_DEFAULT,
  INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT,
  INPUT_DISABLED_DEFAULT,
  INPUT_INITIAL_VALUE,
  INPUT_READONLY_DEFAULT,
  INPUT_ROLE_DEFAULT,
  INPUT_SELECT_ALL_ON_FOCUS_DEFAULT,
  INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT,
  INPUT_TYPE_DEFAULT,
} from '../input/input-brain';

/** all available visual variants for the input component */
export const allInputVariants = ['bordered', 'borderless', 'inline'] as const;

/** union type of all available visual variants */
export type InputVariant = (typeof allInputVariants)[number];

/** all available clear-button visibility modes */
export const allInputShowClearModes = ['never', 'active', 'always'] as const;

/** union type of all available clear-button visibility modes */
export type InputShowClearMode = (typeof allInputShowClearModes)[number];

/** default value for the variant input */
export const INPUT_VARIANT_DEFAULT: InputVariant = 'bordered';

/** default value for the showClear input */
export const INPUT_SHOW_CLEAR_DEFAULT: InputShowClearMode = 'never';

/** default value for the loading input */
export const INPUT_LOADING_DEFAULT = false;

/** default value for the placeholder input */
export const INPUT_PLACEHOLDER_DEFAULT = '';

/** default value for the value input */
export const INPUT_VALUE_DEFAULT = INPUT_INITIAL_VALUE;

/** default value for the preIcon input */
export const INPUT_PRE_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the postIcon input */
export const INPUT_POST_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the preIconAriaLabel input */
export const INPUT_PRE_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the postIconAriaLabel input */
export const INPUT_POST_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the inlineItems input */
export const INPUT_INLINE_ITEMS_DEFAULT: InputInlineItem[] = [];

/** default value for the asTrigger input */
export const INPUT_AS_TRIGGER_DEFAULT = false;

// re-export the brain's input type union for consumer convenience
export { allInputTypes, type InputType };

/** represents a tag/chip item displayed inline within the input */
export type InputInlineItem = {
  id: string;
  label: string;
  removable?: boolean;
};

@Component({
  selector: 'org-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Tag, Button, LoadingSpinner, NgTemplateOutlet, InputBrainDirective],
  templateUrl: './input.html',
  styleUrl: './input.css',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-type]': 'type()',
    '[attr.data-state]': 'isError() ? "error" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-readonly]': 'isReadonly() ? "" : null',
    '[attr.data-as-trigger]': 'asTrigger() ? "" : null',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-show-clear]': 'showClear()',
    '[attr.data-has-pre]': 'hasPreSlot() ? "" : null',
    '[attr.data-has-post]': 'hasPostSlot() ? "" : null',
    '[attr.data-has-chips]': 'hasInputInlineItems() ? "" : null',
    '[attr.data-has-value]': 'hasValue() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  private readonly _brain = viewChild.required(InputBrainDirective);

  private readonly _preIconClicked$ = new Subject<void>();
  private readonly _postIconClicked$ = new Subject<void>();

  /** projected template for the pre slot — when provided, takes precedence over the preIcon input */
  protected readonly preTemplate = contentChild<TemplateRef<unknown>>('pre');

  /** projected template for the post slot — when provided, takes precedence over the postIcon input */
  protected readonly postTemplate = contentChild<TemplateRef<unknown>>('post');

  /** projected template for an individual inline chip — receives the InputInlineItem as the implicit context */
  protected readonly chipTemplate = contentChild<TemplateRef<{ $implicit: InputInlineItem }>>('chip');

  /** visual variant of the input */
  public readonly variant = input<InputVariant>(INPUT_VARIANT_DEFAULT);

  /** placeholder text displayed when the input is empty */
  public readonly placeholder = input<string>(INPUT_PLACEHOLDER_DEFAULT);

  /** current value of the input, two-way bindable via [(value)] (synced to the brain) */
  public readonly value = model<string>(INPUT_VALUE_DEFAULT);

  /** html input type forwarded to the brain */
  public readonly type = input<InputType>(INPUT_TYPE_DEFAULT);

  /** name attribute forwarded to the brain (also used as the element id) */
  public readonly name = input.required<string>();

  /** whether the input is disabled, forwarded to the brain */
  public readonly disabled = input<boolean>(INPUT_DISABLED_DEFAULT);

  /** whether the input is readonly, forwarded to the brain */
  public readonly readonly = input<boolean>(INPUT_READONLY_DEFAULT);

  /** whether the input should auto-focus on first commit, forwarded to the brain */
  public readonly autoFocus = input<boolean>(INPUT_AUTO_FOCUS_DEFAULT);

  /** whether to select all text when the input receives focus, forwarded to the brain */
  public readonly selectAllOnFocus = input<boolean>(INPUT_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether to expose a password visibility toggle, forwarded to the brain */
  public readonly showPasswordToggle = input<boolean>(INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT);

  /** whether the input is in a loading state — renders the spinner and forces the native input readonly */
  public readonly loading = input<boolean>(INPUT_LOADING_DEFAULT);

  /** clear-button visibility mode (`never` default, `active` shows on hover/focus when non-empty, `always` shows whenever non-empty) */
  public readonly showClear = input<InputShowClearMode>(INPUT_SHOW_CLEAR_DEFAULT);

  /** native autocomplete attribute, forwarded to the brain */
  public readonly autocomplete = input<string>(INPUT_AUTOCOMPLETE_DEFAULT);

  /** whether to add the data attribute that blocks password manager extensions, forwarded to the brain */
  public readonly blockPasswordManager = input<boolean>(INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT);

  /** aria-expanded forwarded to the brain */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(INPUT_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-haspopup forwarded to the brain */
  public readonly ariaHasPopup = input<string | undefined, string | null | undefined>(INPUT_ARIA_HAS_POPUP_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-autocomplete forwarded to the brain */
  public readonly ariaAutoComplete = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_AUTO_COMPLETE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-activedescendant forwarded to the brain */
  public readonly ariaActiveDescendant = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-controls forwarded to the brain */
  public readonly ariaControls = input<string | undefined, string | null | undefined>(INPUT_ARIA_CONTROLS_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** role forwarded to the brain */
  public readonly inputRole = input<string | undefined, string | null | undefined>(INPUT_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-label forwarded to the brain */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** icon displayed before the input text (ignored when a projected #pre template is provided) */
  public readonly preIcon = input<IconName | undefined, IconName | null | undefined>(INPUT_PRE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the pre-icon button when it is interactive */
  public readonly preIconAriaLabel = input<string | undefined, string | null | undefined>(
    INPUT_PRE_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** icon displayed after the input text (ignored when a projected #post template is provided) */
  public readonly postIcon = input<IconName | undefined, IconName | null | undefined>(INPUT_POST_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the post-icon button when it is interactive and not a password toggle */
  public readonly postIconAriaLabel = input<string | undefined, string | null | undefined>(
    INPUT_POST_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** array of inline tag items displayed inside the input */
  public readonly inlineItems = input<InputInlineItem[]>(INPUT_INLINE_ITEMS_DEFAULT);

  /**
   * when true, the input behaves as a popover/picker trigger — native typing is suppressed
   * (same as readonly) but the field renders with normal interactive visuals (pointer cursor,
   * standard bg, hover/focus feedback). intended for shell inputs whose value is wholly owned
   * by an external overlay (date picker, select, combobox, etc.). disabled always overrides
   * this — a disabled trigger still shows the not-allowed cursor.
   */
  public readonly asTrigger = input<boolean>(INPUT_AS_TRIGGER_DEFAULT);

  /** emitted when the input receives focus (forwarded from the brain) */
  public readonly focused = output<void>();

  /** emitted when the input loses focus (forwarded from the brain) */
  public readonly blurred = output<void>();

  /** emitted when the pre-icon button is clicked */
  public readonly preIconClicked = outputFromObservable(this._preIconClicked$);

  /** emitted when the post-icon button is clicked */
  public readonly postIconClicked = outputFromObservable(this._postIconClicked$);

  /** emitted when an inline item's remove button is clicked */
  public readonly inlineItemRemoved = output<InputInlineItem>();

  /** emitted when the clear button is clicked and the value is wiped */
  public readonly cleared = output<void>();

  /** the resolved disabled state from the brain (used for the host data-attribute selector in styling) */
  protected readonly isDisabled = computed<boolean>(() => this._brain().isDisabled());

  /** whether the host should expose the readonly data attribute (consumer readonly only — loading uses its own visual treatment) */
  protected readonly isReadonly = computed<boolean>(() => this.readonly());

  /**
   * the readonly value forwarded to the brain — combines consumer readonly, loading state,
   * and trigger mode (all three suppress native typing).
   */
  protected readonly effectiveReadonly = computed<boolean>(() => this.readonly() || this.loading() || this.asTrigger());

  /** whether the host should expose the error data-state — driven by the form-field validation message */
  protected readonly isError = computed<boolean>(() => this._brain().hasValidationMessage());

  /** whether the input currently has a non-empty value, mirrored from the brain */
  protected readonly hasValue = computed<boolean>(() => this._brain().hasValue());

  /** the effective post icon, swapping to eye/eye-off when the password toggle is active */
  protected readonly currentPostIcon = computed<IconName | undefined>(() => {
    const brain = this._brain();

    if (brain.isPasswordToggleActive()) {
      return brain.showPassword() ? 'eye-off' : 'eye';
    }

    return this.postIcon();
  });

  /** whether a pre slot is being rendered (projected template OR a preIcon input) */
  protected readonly hasPreSlot = computed<boolean>(() => !!this.preTemplate() || !!this.preIcon());

  /** whether a post slot is being rendered (any of: projected template, post icon, password toggle, clear, stepper, spinner) */
  protected readonly hasPostSlot = computed<boolean>(() => {
    if (this.postTemplate() || this.currentPostIcon() || this.loading()) {
      return true;
    }

    if (this.showClear() !== 'never' && this.hasValue()) {
      return true;
    }

    if (this.type() === 'number') {
      return true;
    }

    return false;
  });

  /** whether any inline items are present */
  protected readonly hasInputInlineItems = computed<boolean>(() => this.inlineItems().length > 0);

  /** whether the pre-icon should render as an interactive button (consumer is listening) */
  protected readonly isPreIconClickable = computed<boolean>(() => this._preIconClicked$.observed);

  /** whether the post-icon should render as an interactive button (password toggle active or consumer listening) */
  protected readonly isPostIconInteractive = computed<boolean>(() => {
    return this._brain().isPasswordToggleActive() || this._postIconClicked$.observed;
  });

  /** the effective aria-label for the post-icon button, swapping copy when in password-toggle mode */
  protected readonly postIconAriaLabelText = computed<string | undefined>(() => {
    const brain = this._brain();

    if (brain.isPasswordToggleActive()) {
      return brain.showPassword() ? 'Hide password' : 'Show password';
    }

    return this.postIconAriaLabel();
  });

  /** whether the number stepper should render (only for type=number) */
  protected readonly showStepper = computed<boolean>(() => this.type() === 'number');

  /** forwards the brain's focused emission to the public output */
  protected onBrainFocused(): void {
    this.focused.emit();
  }

  /** forwards the brain's blurred emission to the public output */
  protected onBrainBlurred(): void {
    this.blurred.emit();
  }

  /** forwards the brain's pre-icon request to the public preIconClicked output */
  protected onBrainPreIconRequested(): void {
    this._preIconClicked$.next();
  }

  /** forwards the brain's post-icon request to the public postIconClicked output */
  protected onBrainPostIconRequested(): void {
    this._postIconClicked$.next();
  }

  /** handles inline item remove button clicks, gated by the brain's content modification rules */
  protected onInlineItemRemove(item: InputInlineItem): void {
    if (!this._brain().canModifyContent()) {
      return;
    }

    this.inlineItemRemoved.emit(item);
  }

  /** handles the clear button click, wiping the value through the brain and emitting the public cleared event */
  protected onClearClick(): void {
    if (!this._brain().canModifyContent()) {
      return;
    }

    this._brain().clearValue();
    this.cleared.emit();
  }

  /** programmatically focuses the native input */
  public focusInput(): void {
    this._brain().focusInput();
  }

  /** programmatically blurs the native input */
  public blurInput(): void {
    this._brain().blurInput();
  }

  /** the ElementRef of the native input element, exposed for consumers that need direct DOM access */
  public get inputRef(): ElementRef<HTMLInputElement> {
    return this._brain().elementRef;
  }

  /** @inheritdoc */
  public writeValue(value: string): void {
    this._brain().writeValue(value);
  }

  /** @inheritdoc */
  public registerOnChange(fn: (value: string) => void): void {
    this._brain().setOnChange(fn);
  }

  /** @inheritdoc */
  public registerOnTouched(fn: () => void): void {
    this._brain().setOnTouched(fn);
  }

  /** @inheritdoc */
  public setDisabledState(isDisabled: boolean): void {
    this._brain().setFormDisabled(isDisabled);
  }
}
