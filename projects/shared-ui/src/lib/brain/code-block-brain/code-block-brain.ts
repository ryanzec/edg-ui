import { Directive, computed, inject, input } from '@angular/core';
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

/**
 * headless brain directive for the code-block component. owns the code text data, the variant routing
 * (which determines whether the copy interaction is available and the semantic html branch in the
 * presentation), the copy-to-clipboard click handler, and the accessibility surface for the copy button
 * (aria-label, native type). carries no styling, sizing, or layout concerns — those live in the
 * presentation component.
 */
@Directive({
  selector: '[orgCodeBlockBrain]',
  exportAs: 'orgCodeBlockBrain',
})
export class CodeBlockBrainDirective {
  private readonly _clipboard = inject(Clipboard);

  private readonly _copied$ = new Subject<string>();

  /** the code text content used for both display and clipboard interactions */
  public readonly text = input.required<string>();

  /** the rendering variant; routes whether the copy interaction is available and drives the semantic html branch */
  public readonly variant = input<CodeBlockVariant>(CODE_BLOCK_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled (only meaningful in the block variant) */
  public readonly allowCopy = input<boolean>(CODE_BLOCK_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button */
  public readonly copyAriaLabel = input<string>(CODE_BLOCK_COPY_ARIA_LABEL_DEFAULT);

  /** emitted with the copied text when a copy interaction completes successfully */
  public readonly copied = outputFromObservable(this._copied$);

  /** whether the copy button should render (allowCopy enabled and in the block variant) */
  public readonly canCopy = computed<boolean>(() => this.allowCopy() && this.variant() === 'block');

  /** static native button type applied to the copy button to prevent accidental form submission */
  public readonly copyButtonType = 'button' as const;

  /** triggers the copy-to-clipboard action, emitting the copied output on success */
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
  }
}
