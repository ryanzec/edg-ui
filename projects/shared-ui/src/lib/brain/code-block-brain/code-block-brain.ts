import { Directive, DestroyRef, computed, inject, input, model, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

/** all valid code block variants */
export const allCodeBlockVariants = ['block', 'inline'] as const;

/** the rendering variant of the code block */
export type CodeBlockVariant = (typeof allCodeBlockVariants)[number];

/** default value for the variant input */
export const CODE_BLOCK_VARIANT_DEFAULT: CodeBlockVariant = 'block';

/** default value for the allowCopy input */
export const CODE_BLOCK_ALLOW_COPY_DEFAULT = false;

/** default value for the copyAriaLabel input */
export const CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT = 'Copy code';

/** default value for the ellipsisAt input */
export const CODE_BLOCK_ELLIPSIS_AT_DEFAULT = 0;

/** default value for the expanded model */
export const CODE_BLOCK_EXPANDED_DEFAULT = false;

/** how long, in milliseconds, the copy-confirm visual state is held after a successful copy */
export const CODE_BLOCK_COPY_CONFIRM_DURATION_MS = 1200;

/**
 * headless brain directive for the code-block component. owns the code text data, the variant routing
 * (which determines whether the copy interaction is available and the semantic html branch in the
 * presentation), the copy-to-clipboard click handler with its short-lived confirm state, the
 * expand/collapse interaction for clamped block bodies, and the accessibility surface for both the
 * copy and show-more buttons. the overflow signal used to gate the show-more button is set
 * externally by the presentation component once it measures the body. carries no styling, sizing,
 * or layout concerns — those live in the presentation component.
 */
@Directive({
  selector: '[orgCodeBlockBrain]',
  exportAs: 'orgCodeBlockBrain',
})
export class CodeBlockBrainDirective {
  private readonly _clipboard = inject(Clipboard);

  private readonly _destroyRef = inject(DestroyRef);

  private readonly _copied$ = new Subject<string>();

  private readonly _isCopied = signal<boolean>(false);

  private readonly _isOverflowing = signal<boolean>(false);

  private _copyConfirmTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** the code text content used for both display and clipboard interactions */
  public readonly text = input.required<string>();

  /** the rendering variant; routes whether the copy interaction is available and drives the semantic html branch */
  public readonly variant = input<CodeBlockVariant>(CODE_BLOCK_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled (only meaningful in the block variant) */
  public readonly allowCopy = input<boolean>(CODE_BLOCK_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button */
  public readonly copyAriaLabel = input<string>(CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT);

  /** number of lines the body is clamped to; 0 disables the clamp and the expand interaction */
  public readonly ellipsisAt = input<number>(CODE_BLOCK_ELLIPSIS_AT_DEFAULT);

  /** whether the clamped block body is currently expanded; modeled so consumers can drive it externally */
  public readonly expanded = model<boolean>(CODE_BLOCK_EXPANDED_DEFAULT);

  /** emitted with the copied text when a copy interaction completes successfully */
  public readonly copied = outputFromObservable(this._copied$);

  /** whether the copy button should render (allowCopy enabled and in the block variant) */
  public readonly canCopy = computed<boolean>(() => this.allowCopy() && this.variant() === 'block');

  /** whether the body is configured to clamp to a fixed line count */
  public readonly hasEllipsis = computed<boolean>(() => this.ellipsisAt() > 0);

  /** whether the copy-confirm visual state is currently active */
  public readonly isCopied = computed<boolean>(() => this._isCopied());

  /** whether the body content is currently overflowing its clamp; written by the presentation after it measures */
  public readonly isOverflowing = computed<boolean>(() => this._isOverflowing());

  /** whether the show-more affordance should render (clamped, overflowing, and not yet expanded) */
  public readonly showShowMore = computed<boolean>(
    () => this.hasEllipsis() && this.isOverflowing() && !this.expanded(),
  );

  /** aria-expanded value applied to the show-more button to communicate the clamp state */
  public readonly showMoreAriaExpanded = computed<boolean>(() => this.expanded());

  /** static native button type applied to the copy and show-more buttons to prevent accidental form submission */
  public readonly copyButtonType = 'button' as const;

  public constructor() {
    this._destroyRef.onDestroy(() => {
      this._clearCopyConfirmTimeout();
    });
  }

  /** triggers the copy-to-clipboard action, holding the copy-confirm visual state for a short window on success */
  public copy(): void {
    if (!this.canCopy()) {
      return;
    }

    const text = this.text();
    const succeeded = this._clipboard.copy(text);

    if (!succeeded) {
      return;
    }

    this._copied$.next(text);
    this._clearCopyConfirmTimeout();
    this._isCopied.set(true);
    this._copyConfirmTimeoutId = setTimeout(() => {
      this._isCopied.set(false);
      this._copyConfirmTimeoutId = null;
    }, CODE_BLOCK_COPY_CONFIRM_DURATION_MS);
  }

  /** flips the expanded model; used by the show-more affordance to lift the clamp */
  public toggleExpanded(): void {
    this.expanded.update((current) => !current);
  }

  /** updates the overflow flag based on a measurement performed by the presentation component */
  public setOverflowing(value: boolean): void {
    this._isOverflowing.set(value);
  }

  private _clearCopyConfirmTimeout(): void {
    if (this._copyConfirmTimeoutId === null) {
      return;
    }

    clearTimeout(this._copyConfirmTimeoutId);
    this._copyConfirmTimeoutId = null;
  }
}
