import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { angularUtils } from '@organization/shared-utils';
import { Icon, type IconName } from '../icon/icon';
import { Tag } from '../tag/tag';
import { TagIcon } from '../tag/tag-icon';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FORM_FIELD_COMPONENT } from '../form-fields/form-field';
import { InputBrainDirective } from '../../brain/input-brain/input-brain';

/** default value for the variant input */
export const INPUT_VARIANT_DEFAULT: InputVariant = 'bordered';

/** default value for the type input */
export const INPUT_TYPE_DEFAULT: InputType = 'text';

/** default value for the placeholder input */
export const INPUT_PLACEHOLDER_DEFAULT = '';

/** default value for the value input */
export const INPUT_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const INPUT_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const INPUT_READONLY_DEFAULT = false;

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

/** default value for the selectAllOnFocus input */
export const INPUT_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the autoFocus input */
export const INPUT_AUTO_FOCUS_DEFAULT = false;

/** default value for the showPasswordToggle input */
export const INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT = false;

/** default value for the autocomplete input */
export const INPUT_AUTOCOMPLETE_DEFAULT = 'off';

/** default value for the blockPasswordManager input */
export const INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT = true;

/** default value for the ariaExpanded input */
export const INPUT_ARIA_EXPANDED_DEFAULT: boolean | undefined = undefined;

/** default value for the ariaHasPopup input */
export const INPUT_ARIA_HAS_POPUP_DEFAULT: string | undefined = undefined;

/** default value for the ariaAutoComplete input */
export const INPUT_ARIA_AUTO_COMPLETE_DEFAULT: string | undefined = undefined;

/** default value for the ariaActiveDescendant input */
export const INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT: string | undefined = undefined;

/** default value for the ariaControls input */
export const INPUT_ARIA_CONTROLS_DEFAULT: string | undefined = undefined;

/** default value for the inputRole input */
export const INPUT_ROLE_DEFAULT: string | undefined = undefined;

/** default value for the ariaLabel input */
export const INPUT_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** available visual variants for the input component */
export const allInputVariants = ['bordered', 'borderless'] as const;

/** union type of all available visual variants */
export type InputVariant = (typeof allInputVariants)[number];

/** available html input types supported by the input component */
export const allInputTypes = ['text', 'password', 'email', 'number', 'tel', 'url'] as const;

/** union type of all available html input types */
export type InputType = (typeof allInputTypes)[number];

/** represents a tag/chip item displayed inline within the input */
export type InputInlineItem = {
  id: string;
  label: string;
  removable?: boolean;
};

@Component({
  selector: 'org-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Tag, TagIcon],
  templateUrl: './input.html',
  styleUrl: './input.css',
  hostDirectives: [
    {
      directive: InputBrainDirective,
      inputs: ['selectAllOnFocus', 'disabled'],
      outputs: ['focused', 'blurred'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-show-password-toggle]': 'showPasswordToggle() ? "" : null',
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
export class Input implements AfterViewInit, ControlValueAccessor {
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true, host: true });
  protected readonly brain = inject(InputBrainDirective, { self: true });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private _preIconClicked$ = new Subject<void>();
  private _postIconClicked$ = new Subject<void>();

  /**
   * @internal only exposed for testing purposes
   */
  @ViewChild('inputRef', { static: true })
  public readonly inputRef!: ElementRef<HTMLInputElement>;

  /** visual variant of the input */
  public readonly variant = input<InputVariant>(INPUT_VARIANT_DEFAULT);

  /** html input type */
  public readonly type = input<InputType>(INPUT_TYPE_DEFAULT);

  /** placeholder text displayed when the input is empty */
  public readonly placeholder = input<string>(INPUT_PLACEHOLDER_DEFAULT);

  /** current value of the input */
  public readonly value = input<string>(INPUT_VALUE_DEFAULT);

  /** whether the input is disabled */
  public readonly disabled = input<boolean>(INPUT_DISABLED_DEFAULT);

  /** whether the input is readonly */
  public readonly readonly = input<boolean>(INPUT_READONLY_DEFAULT);

  /** icon displayed before the input text */
  public readonly preIcon = input<IconName | undefined, IconName | null | undefined>(INPUT_PRE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the pre-icon button when it is interactive */
  public readonly preIconAriaLabel = input<string | undefined, string | null | undefined>(
    INPUT_PRE_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** icon displayed after the input text */
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

  /** whether to select all text when the input receives focus */
  public readonly selectAllOnFocus = input<boolean>(INPUT_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the input should automatically receive focus on mount */
  public readonly autoFocus = input<boolean>(INPUT_AUTO_FOCUS_DEFAULT);

  /** whether to show a password visibility toggle (only applies when type is password) */
  public readonly showPasswordToggle = input<boolean>(INPUT_SHOW_PASSWORD_TOGGLE_DEFAULT);

  /** value for the html autocomplete attribute */
  public readonly autocomplete = input<string>(INPUT_AUTOCOMPLETE_DEFAULT);

  /** name attribute for the input element, also used as the element id */
  public readonly name = input.required<string>();

  /** whether to add a data attribute that blocks password managers */
  public readonly blockPasswordManager = input<boolean>(INPUT_BLOCK_PASSWORD_MANAGER_DEFAULT);

  /** aria-expanded attribute value forwarded to the native input */
  public readonly ariaExpanded = input<boolean | undefined, boolean | null | undefined>(INPUT_ARIA_EXPANDED_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-haspopup attribute value forwarded to the native input */
  public readonly ariaHasPopup = input<string | undefined, string | null | undefined>(INPUT_ARIA_HAS_POPUP_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** aria-autocomplete attribute value forwarded to the native input */
  public readonly ariaAutoComplete = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_AUTO_COMPLETE_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-activedescendant attribute value forwarded to the native input */
  public readonly ariaActiveDescendant = input<string | undefined, string | null | undefined>(
    INPUT_ARIA_ACTIVE_DESCENDANT_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** aria-controls attribute value forwarded to the native input */
  public readonly ariaControls = input<string | undefined, string | null | undefined>(INPUT_ARIA_CONTROLS_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** role attribute value forwarded to the native input */
  public readonly inputRole = input<string | undefined, string | null | undefined>(INPUT_ROLE_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label forwarded to the native input element */
  public readonly ariaLabel = input<string | undefined, string | null | undefined>(INPUT_ARIA_LABEL_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** emitted when the input value changes */
  public readonly valueChange = output<string>();

  /** emitted when the pre-icon button is clicked */
  public readonly preIconClicked = outputFromObservable(this._preIconClicked$);

  /** emitted when the post-icon button is clicked */
  public readonly postIconClicked = outputFromObservable(this._postIconClicked$);

  /** emitted when an inline item's remove button is clicked */
  public readonly inlineItemRemoved = output<InputInlineItem>();

  /** whether the input is currently disabled, combining the disabled input and reactive form state */
  protected readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());

  /** whether the input currently has focus */
  protected readonly isFocused = computed<boolean>(() => this.brain.isFocused());

  /** whether the password is currently visible (proxied from brain) */
  protected readonly showPassword = computed<boolean>(() => this.brain.showPassword());

  /** the effective html input type, accounting for the password visibility toggle */
  protected readonly currentInputType = computed<InputType>(() => {
    if (this.type() === 'password' && this.showPasswordToggle()) {
      return this.brain.showPassword() ? 'text' : 'password';
    }

    return this.type();
  });

  /** the effective post icon, accounting for the password visibility toggle */
  protected readonly currentPostIcon = computed<IconName | undefined>(() => {
    if (this.showPasswordToggle() && this.type() === 'password') {
      return this.brain.showPassword() ? 'eye-off' : 'eye';
    }

    return this.postIcon();
  });

  /** whether a pre-icon is present */
  protected readonly hasPreIcon = computed<boolean>(() => !!this.preIcon());

  /** whether a post-icon is present */
  protected readonly hasPostIcon = computed<boolean>(() => !!this.currentPostIcon());

  /** whether any inline items are present */
  protected readonly hasInputInlineItems = computed<boolean>(() => this.inlineItems().length > 0);

  /** whether the pre-icon has an observer and should be rendered as an interactive button */
  protected readonly isPreIconClickable = computed<boolean>(() => this._preIconClicked$.observed);

  /** whether the post-icon should be rendered as an interactive button (password toggle or observed output) */
  protected readonly isPostIconInteractive = computed<boolean>(() => {
    return (this.showPasswordToggle() && this.type() === 'password') || this._postIconClicked$.observed;
  });

  /** whether the associated form-field currently has a validation message */
  protected readonly hasValidationMessage = computed<boolean>(() => {
    return !!this._formField?.hasValidationMessage();
  });

  /** aria-describedby value pointing to the validation message element when present */
  protected readonly ariaDescribedBy = computed<string | null>(() => {
    if (this.hasValidationMessage()) {
      return `validation-message-${this.name()}`;
    }

    return null;
  });

  /** aria-invalid attribute value, set to true when a validation message is present */
  protected readonly ariaInvalid = computed<boolean | null>(() => {
    if (this.hasValidationMessage()) {
      return true;
    }

    return null;
  });

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this.brain.setInputElement(this.inputRef.nativeElement);

    if (this.autoFocus()) {
      this.inputRef.nativeElement.focus();
    }
  }

  /** handles native input change events and forwards the value to the form control and valueChange output */
  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this._onChange(value);
    this.valueChange.emit(value);
  }

  /** handles native blur events and notifies the reactive form that the field was touched */
  protected onBlur(): void {
    this._onTouched();
  }

  /** handles pre-icon button click events */
  protected onPreIconClick(_event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    this._preIconClicked$.next();
  }

  /** handles post-icon button click events, toggling password visibility or emitting the output */
  protected onPostIconClick(_event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.showPasswordToggle() && this.type() === 'password') {
      this.brain.togglePasswordVisibility();

      return;
    }

    this._postIconClicked$.next();
  }

  /** handles inline item remove button clicks */
  protected onInlineItemRemove(item: InputInlineItem): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    this.inlineItemRemoved.emit(item);
  }

  /** programmatically focuses the native input element */
  public focusInput(): void {
    this.brain.focusInput();
  }

  /** @inheritdoc */
  public writeValue(value: string): void {
    if (this.inputRef?.nativeElement) {
      this.inputRef.nativeElement.value = value ?? '';
    }
  }

  /** @inheritdoc */
  public registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  /** @inheritdoc */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** @inheritdoc */
  public setDisabledState(isDisabled: boolean): void {
    this.brain.setFormDisabled(isDisabled);
  }
}
