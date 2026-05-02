import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  forwardRef,
  model,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon, type IconName } from '../icon/icon';
import { Tag } from '../tag/tag';
import { TagIcon } from '../tag/tag-icon';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FORM_FIELD_COMPONENT } from '../form-field/form-field';
import { angularUtils, logManager } from '@organization/shared-utils';
import { TextareaBrainDirective } from '../../brain/textarea-brain/textarea-brain';

/** default value for the variant input */
export const TEXTAREA_VARIANT_DEFAULT: TextareaVariant = 'bordered';

/** default value for the placeholder input */
export const TEXTAREA_PLACEHOLDER_DEFAULT = '';

/** default value for the value input */
export const TEXTAREA_VALUE_DEFAULT = '';

/** default value for the disabled input */
export const TEXTAREA_DISABLED_DEFAULT = false;

/** default value for the readonly input */
export const TEXTAREA_READONLY_DEFAULT = false;

/** default value for the preIcon input */
export const TEXTAREA_PRE_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the preIconAriaLabel input */
export const TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the postIcon input */
export const TEXTAREA_POST_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the postIconAriaLabel input */
export const TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT: string | undefined = undefined;

/** default value for the preIconAlignment input */
export const TEXTAREA_PRE_ICON_ALIGNMENT_DEFAULT: TextareaIconAlignment = 'start';

/** default value for the postIconAlignment input */
export const TEXTAREA_POST_ICON_ALIGNMENT_DEFAULT: TextareaIconAlignment = 'end';

/** default value for the inlineItems input */
export const TEXTAREA_INLINE_ITEMS_DEFAULT: TextareaInlineItem[] = [];

/** default value for the selectAllOnFocus input */
export const TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT = false;

/** default value for the autoFocus input */
export const TEXTAREA_AUTO_FOCUS_DEFAULT = false;

/** default value for the inverseEnter input */
export const TEXTAREA_INVERSE_ENTER_DEFAULT = false;

/** default value for the rows input */
export const TEXTAREA_ROWS_DEFAULT = 3;

/** default value for the lines input */
export const TEXTAREA_LINES_DEFAULT: number[] = [0, 0];

/** available visual variants for the textarea component */
export const allTextareaVariants = ['bordered', 'borderless'] as const;

/** union type of all available visual variants */
export type TextareaVariant = (typeof allTextareaVariants)[number];

/** available icon alignment options for the textarea component */
export const allTextareaIconAlignments = ['start', 'center', 'end'] as const;

/** union type of all available icon alignment options */
export type TextareaIconAlignment = (typeof allTextareaIconAlignments)[number];

/** represents a tag/chip item displayed inline within the textarea */
export type TextareaInlineItem = {
  id: string;
  label: string;
  removable?: boolean;
};

@Component({
  selector: 'org-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Tag, TagIcon],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  hostDirectives: [
    {
      directive: TextareaBrainDirective,
      inputs: ['selectAllOnFocus', 'disabled', 'inverseEnter'],
      outputs: ['focused', 'blurred', 'enterPressed'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-pre-icon-align]': 'preIconAlignment()',
    '[attr.data-post-icon-align]': 'postIconAlignment()',
    '[attr.data-focused]': 'isFocused() ? "" : null',
    '[attr.data-auto-resize]': 'isLinesValid() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements AfterViewInit, ControlValueAccessor {
  private readonly _formField = inject(FORM_FIELD_COMPONENT, { optional: true, host: true });
  protected readonly brain = inject(TextareaBrainDirective, { self: true });

  /** callback registered by angular forms to notify the form of value changes */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};

  /** callback registered by angular forms to notify the form of touched state */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private _preIconClicked$ = new Subject<void>();
  private _postIconClicked$ = new Subject<void>();

  /** measured line height in pixels for the auto-resize calculation */
  private readonly _lineHeightPx = signal<number>(0);

  /**
   * @internal only exposed for testing purposes
   */
  // we need the static to make sure we can bind the dom event to properly manage the focused state
  @ViewChild('textareaRef', { static: true })
  public readonly textareaRef!: ElementRef<HTMLTextAreaElement>;

  /** visual variant of the textarea */
  public readonly variant = input<TextareaVariant>(TEXTAREA_VARIANT_DEFAULT);

  /** placeholder text displayed when the textarea is empty */
  public readonly placeholder = input<string>(TEXTAREA_PLACEHOLDER_DEFAULT);

  /** current value of the textarea, supports two-way binding via [(value)] */
  public readonly value = model<string>(TEXTAREA_VALUE_DEFAULT);

  /** whether the textarea is disabled */
  public readonly disabled = input<boolean>(TEXTAREA_DISABLED_DEFAULT);

  /** whether the textarea is readonly */
  public readonly readonly = input<boolean>(TEXTAREA_READONLY_DEFAULT);

  /** icon displayed before the textarea text */
  public readonly preIcon = input<IconName | undefined, IconName | null | undefined>(TEXTAREA_PRE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the pre-icon button when it is interactive */
  public readonly preIconAriaLabel = input<string | undefined, string | null | undefined>(
    TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** icon displayed after the textarea text */
  public readonly postIcon = input<IconName | undefined, IconName | null | undefined>(TEXTAREA_POST_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the post-icon button when it is interactive */
  public readonly postIconAriaLabel = input<string | undefined, string | null | undefined>(
    TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** vertical alignment of the pre-icon button */
  public readonly preIconAlignment = input<TextareaIconAlignment>(TEXTAREA_PRE_ICON_ALIGNMENT_DEFAULT);

  /** vertical alignment of the post-icon button */
  public readonly postIconAlignment = input<TextareaIconAlignment>(TEXTAREA_POST_ICON_ALIGNMENT_DEFAULT);

  /** array of inline tag items displayed inside the textarea */
  public readonly inlineItems = input<TextareaInlineItem[]>(TEXTAREA_INLINE_ITEMS_DEFAULT);

  /** whether to select all text when the textarea receives focus */
  public readonly selectAllOnFocus = input<boolean>(TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT);

  /** whether the textarea should automatically receive focus on mount */
  public readonly autoFocus = input<boolean>(TEXTAREA_AUTO_FOCUS_DEFAULT);

  /** when true, enter submits and shift+enter adds a new line; when false, the behavior is reversed */
  public readonly inverseEnter = input<boolean>(TEXTAREA_INVERSE_ENTER_DEFAULT);

  /** number of visible text rows */
  public readonly rows = input<number>(TEXTAREA_ROWS_DEFAULT);

  /**
   * min and max number of visible lines; when valid ([min, max] with both greater than 0 and max greater than min),
   * the textarea starts at `min` rows and auto-grows up to `max` rows before scrolling
   */
  public readonly lines = input<number[]>(TEXTAREA_LINES_DEFAULT);

  /** name attribute for the textarea element, also used as the element id */
  public readonly name = input.required<string>();

  /** emitted when the pre-icon button is clicked */
  public readonly preIconClicked = outputFromObservable(this._preIconClicked$);

  /** emitted when the post-icon button is clicked */
  public readonly postIconClicked = outputFromObservable(this._postIconClicked$);

  /** emitted when an inline item's remove button is clicked */
  public readonly inlineItemRemoved = output<TextareaInlineItem>();

  /** whether the textarea is currently disabled, combining the disabled input and reactive form state */
  public readonly isDisabled = computed<boolean>(() => this.brain.isDisabled());

  /** whether the textarea currently has focus */
  public readonly isFocused = computed<boolean>(() => this.brain.isFocused());

  /** whether a pre-icon is present */
  protected readonly hasPreIcon = computed<boolean>(() => !!this.preIcon());

  /** whether a post-icon is present */
  protected readonly hasPostIcon = computed<boolean>(() => !!this.postIcon());

  /** whether any inline items are present */
  protected readonly hasTextareaInlineItems = computed<boolean>(() => this.inlineItems().length > 0);

  /** whether the pre-icon output is observed and should be rendered as an interactive button */
  public readonly isPreIconClickable = computed<boolean>(() => this._preIconClicked$.observed);

  /** whether the post-icon output is observed and should be rendered as an interactive button */
  public readonly isPostIconClickable = computed<boolean>(() => this._postIconClicked$.observed);

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

  /** whether the lines input is properly configured to enable auto-resize behavior */
  public readonly isLinesValid = computed<boolean>(() => {
    const lines = this.lines();

    return lines.length === 2 && lines[0] > 0 && lines[1] > 0 && lines[1] > lines[0];
  });

  /** effective rows value to bind to the native textarea: uses lines[0] when valid, otherwise falls back to rows */
  protected readonly effectiveRows = computed<number>(() => {
    if (this.isLinesValid()) {
      return this.lines()[0];
    }

    return this.rows();
  });

  public constructor() {
    // validates the lines input and logs a unique error for each failure mode
    effect(() => {
      const lines = this.lines();
      const isDefault = lines.length === 2 && lines[0] === 0 && lines[1] === 0;

      if (isDefault) {
        return;
      }

      if (lines.length !== 2) {
        logManager.error({
          type: 'textarea-lines-invalid-length',
          message: 'lines input must contain exactly 2 elements',
        });

        return;
      }

      if (lines[0] <= 0 || lines[1] <= 0) {
        logManager.error({
          type: 'textarea-lines-invalid-values',
          message: 'lines input elements must both be greater than 0',
        });

        return;
      }

      if (lines[1] <= lines[0]) {
        logManager.error({
          type: 'textarea-lines-invalid-order',
          message: 'lines input second element must be greater than the first',
        });
      }
    });

    // auto-resizes the textarea height between min and max lines when lines is valid; clears overrides otherwise
    // @todo(browser-support) field-sizing: content CSS property could replace / simplify this once better browser support is available
    effect(() => {
      const textarea = this.textareaRef?.nativeElement;

      if (!textarea) {
        return;
      }

      if (!this.isLinesValid()) {
        textarea.style.height = '';

        return;
      }

      this.value();

      const lineHeightPx = this._lineHeightPx();

      if (lineHeightPx === 0) {
        return;
      }

      const linesValue = this.lines();

      textarea.style.height = 'auto';

      const scrollHeight = textarea.scrollHeight;
      const minHeight = lineHeightPx * linesValue[0];
      const maxHeight = lineHeightPx * linesValue[1];
      const targetHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));

      textarea.style.height = `${targetHeight}px`;
    });
  }

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this.brain.setTextareaElement(this.textareaRef.nativeElement);

    if (this.autoFocus()) {
      this.textareaRef.nativeElement.focus();
    }

    const style = window.getComputedStyle(this.textareaRef.nativeElement);
    let lineHeightPx = parseFloat(style.lineHeight);

    if (isNaN(lineHeightPx)) {
      lineHeightPx = parseFloat(style.fontSize) * 1.2;
    }

    this._lineHeightPx.set(lineHeightPx);
  }

  /** handles native input change events and forwards the value to the form control and value model */
  protected onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;

    this._onChange(newValue);
    this.value.set(newValue);
  }

  /** handles native blur events and notifies the reactive form that the field was touched */
  protected onBlur(): void {
    this._onTouched();
  }

  /** handles keydown events by delegating to the brain (which respects inverseEnter) */
  protected onKeyDown(event: KeyboardEvent): void {
    this.brain.handleKeyDown(event);
  }

  /** handles pre-icon button click events */
  protected onPreIconClick(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    this._preIconClicked$.next();
  }

  /** handles post-icon button click events */
  protected onPostIconClick(): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    this._postIconClicked$.next();
  }

  /** handles inline item remove button clicks */
  protected onInlineItemRemove(item: TextareaInlineItem): void {
    if (this.isDisabled() || this.readonly()) {
      return;
    }

    this.inlineItemRemoved.emit(item);
  }

  /** programmatically focuses the native textarea element */
  public focusTextarea(): void {
    this.brain.focusTextarea();
  }

  /** @inheritdoc */
  public writeValue(value: string): void {
    if (this.textareaRef?.nativeElement) {
      this.textareaRef.nativeElement.value = value ?? '';
      this.value.set(value ?? '');
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
