import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { ScrollArea } from '../scroll-area/scroll-area';
import {
  CodeHighlighterBrainDirective,
  CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT,
  CODE_HIGHLIGHTER_COPY_ARIA_LABEL_DEFAULT,
  CODE_HIGHLIGHTER_LANGUAGE_DEFAULT,
  CODE_HIGHLIGHTER_VARIANT_DEFAULT,
  type CodeHighlighterVariant,
} from '../code-highlighter/code-highlighter-brain';

export type { CodeHighlighterVariant, SyntaxKind } from '../code-highlighter/code-highlighter-brain';
export {
  allCodeHighlighterVariants,
  allSyntaxKinds,
  CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT,
  CODE_HIGHLIGHTER_COPY_ARIA_LABEL_DEFAULT,
  CODE_HIGHLIGHTER_LANGUAGE_DEFAULT,
  CODE_HIGHLIGHTER_VARIANT_DEFAULT,
} from '../code-highlighter/code-highlighter-brain';

/** default value for the ellipsisAt input */
export const CODE_HIGHLIGHTER_ELLIPSIS_AT_DEFAULT = 0;

/** default value for the scrollClass input */
export const CODE_HIGHLIGHTER_SCROLL_CLASS_DEFAULT = '';

@Component({
  selector: 'org-code-highlighter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, ScrollArea],
  templateUrl: './code-highlighter.html',
  styleUrl: './code-highlighter.css',
  hostDirectives: [
    {
      directive: CodeHighlighterBrainDirective,
      inputs: ['text', 'language', 'variant', 'allowCopy', 'copyAriaLabel'],
      outputs: ['copied'],
    },
  ],
  host: {
    '[attr.data-variant]': 'brain.variant()',
    '[attr.data-has-ellipsis]': 'hasEllipsis() ? "" : null',
    '[attr.data-allow-copy]': 'brain.allowCopy() ? "" : null',
    '[attr.data-language]': 'brain.language()',
  },
})
export class CodeHighlighter {
  protected readonly brain = inject(CodeHighlighterBrainDirective, { self: true });

  /** the code text to display; forwarded to the host brain directive */
  public readonly text = input.required<string>();

  /** the language to use for syntax highlighting; forwarded to the host brain directive */
  public readonly language = input<string>(CODE_HIGHLIGHTER_LANGUAGE_DEFAULT);

  /** the rendering variant; forwarded to the host brain directive */
  public readonly variant = input<CodeHighlighterVariant>(CODE_HIGHLIGHTER_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled; forwarded to the host brain directive */
  public readonly allowCopy = input<boolean>(CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button; forwarded to the host brain directive */
  public readonly copyAriaLabel = input<string>(CODE_HIGHLIGHTER_COPY_ARIA_LABEL_DEFAULT);

  /** number of lines after which to apply ellipsis line clamping; 0 disables ellipsis */
  public readonly ellipsisAt = input<number>(CODE_HIGHLIGHTER_ELLIPSIS_AT_DEFAULT);

  /** additional css class applied to the inner scroll-area element */
  public readonly scrollClass = input<string>(CODE_HIGHLIGHTER_SCROLL_CLASS_DEFAULT);

  /** whether the ellipsis line clamp should be active */
  protected readonly hasEllipsis = computed<boolean>(() => this.ellipsisAt() > 0);
}
