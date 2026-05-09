import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  ElementRef,
  AfterViewInit,
  forwardRef,
  model,
  effect,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type IconName } from '../../brain/icon-brain/icon-brain';
import { Icon } from '../icon/icon';
import { Tag } from '../tag/tag';
import { TagIcon } from '../tag/tag-icon';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { angularUtils, logManager } from '@organization/shared-utils';
import {
  TextareaBrainDirective,
  TEXTAREA_AUTO_FOCUS_DEFAULT,
  TEXTAREA_DISABLED_DEFAULT,
  TEXTAREA_INITIAL_VALUE,
  TEXTAREA_INVERSE_ENTER_DEFAULT,
  TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT,
  TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT,
  TEXTAREA_READONLY_DEFAULT,
  TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT,
} from '../../brain/textarea-brain/textarea-brain';

/** default value for the variant input */
export const TEXTAREA_VARIANT_DEFAULT: TextareaVariant = 'bordered';

/** default value for the placeholder input */
export const TEXTAREA_PLACEHOLDER_DEFAULT = '';

/** default value for the value input */
export const TEXTAREA_VALUE_DEFAULT = TEXTAREA_INITIAL_VALUE;

/** default value for the preIcon input */
export const TEXTAREA_PRE_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the postIcon input */
export const TEXTAREA_POST_ICON_DEFAULT: IconName | undefined = undefined;

/** default value for the preIconAlignment input */
export const TEXTAREA_PRE_ICON_ALIGNMENT_DEFAULT: TextareaIconAlignment = 'start';

/** default value for the postIconAlignment input */
export const TEXTAREA_POST_ICON_ALIGNMENT_DEFAULT: TextareaIconAlignment = 'end';

/** default value for the inlineItems input */
export const TEXTAREA_INLINE_ITEMS_DEFAULT: TextareaInlineItem[] = [];

/** default value for the rows input */
export const TEXTAREA_ROWS_DEFAULT = 3;

/** default value for the lines input */
export const TEXTAREA_LINES_DEFAULT: number[] = [0, 0];

// re-export brain-owned defaults so consumers can keep importing them from the core barrel
export {
  TEXTAREA_AUTO_FOCUS_DEFAULT,
  TEXTAREA_DISABLED_DEFAULT,
  TEXTAREA_INVERSE_ENTER_DEFAULT,
  TEXTAREA_POST_ICON_ARIA_LABEL_DEFAULT,
  TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT,
  TEXTAREA_READONLY_DEFAULT,
  TEXTAREA_SELECT_ALL_ON_FOCUS_DEFAULT,
};

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
  imports: [Icon, Tag, TagIcon, TextareaBrainDirective],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
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
  private readonly _brain = viewChild.required(TextareaBrainDirective);

  private readonly _preIconClicked$ = new Subject<void>();
  private readonly _postIconClicked$ = new Subject<void>();

  /** measured line height in pixels for the auto-resize calculation */
  private readonly _lineHeightPx = signal<number>(0);

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

  /** icon displayed before the textarea text */
  public readonly preIcon = input<IconName | undefined, IconName | null | undefined>(TEXTAREA_PRE_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the pre-icon button when it is interactive (forwarded to the brain) */
  public readonly preIconAriaLabel = input<string | undefined, string | null | undefined>(
    TEXTAREA_PRE_ICON_ARIA_LABEL_DEFAULT,
    { transform: angularUtils.transformNullToUndefined }
  );

  /** icon displayed after the textarea text */
  public readonly postIcon = input<IconName | undefined, IconName | null | undefined>(TEXTAREA_POST_ICON_DEFAULT, {
    transform: angularUtils.transformNullToUndefined,
  });

  /** accessible label for the post-icon button when it is interactive (forwarded to the brain) */
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

  /** number of visible text rows */
  public readonly rows = input<number>(TEXTAREA_ROWS_DEFAULT);

  /**
   * min and max number of visible lines; when valid ([min, max] with both greater than 0 and max greater than min),
   * the textarea starts at `min` rows and auto-grows up to `max` rows before scrolling
   */
  public readonly lines = input<number[]>(TEXTAREA_LINES_DEFAULT);

  /** emitted when the textarea receives focus (forwarded from the brain) */
  public readonly focused = output<void>();

  /** emitted when the textarea loses focus (forwarded from the brain) */
  public readonly blurred = output<void>();

  /** emitted when the configured submit key combination is pressed (forwarded from the brain) */
  public readonly submitKeyPressed = output<void>();

  /** emitted when the pre-icon button is clicked */
  public readonly preIconClicked = outputFromObservable(this._preIconClicked$);

  /** emitted when the post-icon button is clicked */
  public readonly postIconClicked = outputFromObservable(this._postIconClicked$);

  /** emitted when an inline item's remove button is clicked */
  public readonly inlineItemRemoved = output<TextareaInlineItem>();

  /** the resolved disabled state from the brain (used for the host data-attribute selector in styling) */
  protected readonly isDisabled = computed<boolean>(() => this._brain().isDisabled());

  /** whether the textarea currently has focus (used for the host data-focused attribute) */
  protected readonly isFocused = computed<boolean>(() => this._brain().isFocused());

  /** whether a pre-icon is present */
  protected readonly hasPreIcon = computed<boolean>(() => !!this.preIcon());

  /** whether a post-icon is present */
  protected readonly hasPostIcon = computed<boolean>(() => !!this.postIcon());

  /** whether any inline items are present */
  protected readonly hasTextareaInlineItems = computed<boolean>(() => this.inlineItems().length > 0);

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
      const textarea = this._brain().elementRef.nativeElement;

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
    const element = this._brain().elementRef.nativeElement;
    const style = window.getComputedStyle(element);
    let lineHeightPx = parseFloat(style.lineHeight);

    if (isNaN(lineHeightPx)) {
      lineHeightPx = parseFloat(style.fontSize) * 1.2;
    }

    this._lineHeightPx.set(lineHeightPx);
  }

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

  /** forwards the brain's pre-icon request to the public preIconClicked output */
  protected onBrainPreIconRequested(): void {
    this._preIconClicked$.next();
  }

  /** forwards the brain's post-icon request to the public postIconClicked output */
  protected onBrainPostIconRequested(): void {
    this._postIconClicked$.next();
  }

  /** handles inline item remove button clicks, gated by the brain's content modification rules */
  protected onInlineItemRemove(item: TextareaInlineItem): void {
    if (!this._brain().canModifyContent()) {
      return;
    }

    this.inlineItemRemoved.emit(item);
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
