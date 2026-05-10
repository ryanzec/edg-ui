import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  TextareaBrainDirective,
  TEXTAREA_AUTO_FOCUS_DEFAULT,
  TEXTAREA_DISABLED_DEFAULT,
  TEXTAREA_INITIAL_VALUE,
  TEXTAREA_INVERSE_ENTER_DEFAULT,
  TEXTAREA_READONLY_DEFAULT,
  TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT,
} from '../../brain/textarea-brain/textarea-brain';
import { TextareaToolbar } from './textarea-toolbar';

/** all available visual variants for the textarea component */
export const allTextareaVariants = ['bordered', 'borderless'] as const;

/** union type of all available visual variants */
export type TextareaVariant = (typeof allTextareaVariants)[number];

/** default value for the variant input */
export const TEXTAREA_VARIANT_DEFAULT: TextareaVariant = 'bordered';

/** default value for the placeholder input */
export const TEXTAREA_PLACEHOLDER_DEFAULT = '';

/** default value for the value input */
export const TEXTAREA_VALUE_DEFAULT = TEXTAREA_INITIAL_VALUE;

/** default value for the minLines input */
export const TEXTAREA_MIN_LINES_DEFAULT = 3;

/** default value for the maxLines input */
export const TEXTAREA_MAX_LINES_DEFAULT = 8;

/** default value for the loading input */
export const TEXTAREA_LOADING_DEFAULT = false;

// re-export brain-owned defaults so consumers can keep importing them from the core barrel
export {
  TEXTAREA_AUTO_FOCUS_DEFAULT,
  TEXTAREA_DISABLED_DEFAULT,
  TEXTAREA_INVERSE_ENTER_DEFAULT,
  TEXTAREA_READONLY_DEFAULT,
  TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT,
};

@Component({
  selector: 'org-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaBrainDirective],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-state]': 'isError() ? "error" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-readonly]': 'isReadonly() ? "" : null',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-has-toolbar]': 'hasToolbar() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[style.--textarea-min-lines]': 'minLines()',
    '[style.--textarea-max-lines]': 'maxLines()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor {
  private readonly _brain = viewChild.required(TextareaBrainDirective);

  /** the projected toolbar (when present, drives the data-has-toolbar attribute) */
  protected readonly projectedToolbar = contentChild<TextareaToolbar>(TextareaToolbar);

  /** visual variant of the textarea */
  public readonly variant = input<TextareaVariant>(TEXTAREA_VARIANT_DEFAULT);

  /** placeholder text displayed when the textarea is empty */
  public readonly placeholder = input<string>(TEXTAREA_PLACEHOLDER_DEFAULT);

  /** current value of the textarea, two-way bindable via [(value)] (synced to the brain) */
  public readonly value = model<string>(TEXTAREA_VALUE_DEFAULT);

  /** name attribute for the textarea element, also used as the element id (forwarded to the brain) */
  public readonly name = input.required<string>();

  /** whether the textarea is disabled, forwarded to the brain */
  public readonly disabled = input<boolean>(TEXTAREA_DISABLED_DEFAULT);

  /** whether the textarea is readonly, forwarded to the brain */
  public readonly readonly = input<boolean>(TEXTAREA_READONLY_DEFAULT);

  /** whether the textarea should auto-focus on first commit, forwarded to the brain */
  public readonly autoFocus = input<boolean>(TEXTAREA_AUTO_FOCUS_DEFAULT);

  /** whether to select all text when the textarea receives focus, forwarded to the brain */
  public readonly selectAllOnFocus = input<boolean>(TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** when true, enter submits and shift+enter adds a new line; when false, the behavior is reversed (forwarded to the brain) */
  public readonly inverseEnter = input<boolean>(TEXTAREA_INVERSE_ENTER_DEFAULT);

  /** minimum number of visible lines — the textarea never collapses below this height */
  public readonly minLines = input<number>(TEXTAREA_MIN_LINES_DEFAULT);

  /** maximum number of visible lines — the textarea scrolls instead of growing past this height */
  public readonly maxLines = input<number>(TEXTAREA_MAX_LINES_DEFAULT);

  /** whether the textarea is in a loading state — tones any spinner inside the toolbar */
  public readonly loading = input<boolean>(TEXTAREA_LOADING_DEFAULT);

  /** emitted when the textarea receives focus (forwarded from the brain) */
  public readonly focused = output<void>();

  /** emitted when the textarea loses focus (forwarded from the brain) */
  public readonly blurred = output<void>();

  /** emitted when the configured submit key combination is pressed (forwarded from the brain) */
  public readonly submitKeyPressed = output<void>();

  /** the resolved disabled state from the brain (used for the host data-attribute selector in styling) */
  protected readonly isDisabled = computed<boolean>(() => this._brain().isDisabled());

  /** whether the host should expose the readonly data attribute (consumer readonly only — loading uses its own visual treatment) */
  protected readonly isReadonly = computed<boolean>(() => this.readonly());

  /** the readonly value forwarded to the brain — combines consumer readonly with the loading state */
  protected readonly effectiveReadonly = computed<boolean>(() => this.readonly() || this.loading());

  /** whether the host should expose the error data-state — driven by the form-field validation message */
  protected readonly isError = computed<boolean>(() => this._brain().hasValidationMessage());

  /** whether a toolbar has been projected into the component */
  protected readonly hasToolbar = computed<boolean>(() => !!this.projectedToolbar());

  /** forwards the brain's focused emission to the public output */
  protected onBrainFocused(): void {
    this.focused.emit();
  }

  /** forwards the brain's blurred emission to the public output */
  protected onBrainBlurred(): void {
    this.blurred.emit();
  }

  /** forwards the brain's submit-key emission to the public output */
  protected onBrainSubmitKeyPressed(): void {
    this.submitKeyPressed.emit();
  }

  /** programmatically focuses the native textarea */
  public focusInput(): void {
    this._brain().focusInput();
  }

  /** programmatically blurs the native textarea */
  public blurInput(): void {
    this._brain().blurInput();
  }

  /** the ElementRef of the native textarea element, exposed for consumers that need direct DOM access */
  public get textareaElementRef(): ElementRef<HTMLTextAreaElement> {
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
