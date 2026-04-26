import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Icon } from '../icon/icon';
import { ScrollArea } from '../scroll-area/scroll-area';
import { CodeHighlighterBrainDirective } from '../../brain/code-highlighter-brain/code-highlighter-brain';

/** available display variants for the code highlighter */
export const allCodeHighlighterVariants = ['block', 'inline'] as const;

/** the display variant of the code highlighter */
export type CodeHighlighterVariant = (typeof allCodeHighlighterVariants)[number];

/** default value for the language input */
export const CODE_HIGHLIGHTER_LANGUAGE_DEFAULT = 'text';

/** default value for the variant input */
export const CODE_HIGHLIGHTER_VARIANT_DEFAULT: CodeHighlighterVariant = 'block';

/** default value for the allowCopy input */
export const CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT = false;

/** default value for the ellipsisAt input */
export const CODE_HIGHLIGHTER_ELLIPSIS_AT_DEFAULT = 0;

/** default value for the scrollClass input */
export const CODE_HIGHLIGHTER_SCROLL_CLASS_DEFAULT = '';

@Component({
  selector: 'org-code-highlighter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, CdkCopyToClipboard, ScrollArea],
  templateUrl: './code-highlighter.html',
  styleUrl: './code-highlighter.css',
  hostDirectives: [
    {
      directive: CodeHighlighterBrainDirective,
      inputs: ['codeHighlighterText: text', 'codeHighlighterLanguage: language'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-has-ellipsis]': 'hasEllipsis() ? "" : null',
    '[attr.data-allow-copy]': 'allowCopy() ? "" : null',
    '[attr.data-language]': 'language()',
  },
})
export class CodeHighlighter {
  protected readonly brain = inject(CodeHighlighterBrainDirective, { self: true });

  /** the code text to display */
  public readonly text = input.required<string>();

  /** the language to use for syntax highlighting */
  public readonly language = input<string>(CODE_HIGHLIGHTER_LANGUAGE_DEFAULT);

  /** the display variant of the code block */
  public readonly variant = input<CodeHighlighterVariant>(CODE_HIGHLIGHTER_VARIANT_DEFAULT);

  /** whether to show the copy-to-clipboard button */
  public readonly allowCopy = input<boolean>(CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT);

  /** number of lines before ellipsis truncation; 0 disables ellipsis */
  public readonly ellipsisAt = input<number>(CODE_HIGHLIGHTER_ELLIPSIS_AT_DEFAULT);

  /** css class applied to the scroll area */
  public readonly scrollClass = input<string>(CODE_HIGHLIGHTER_SCROLL_CLASS_DEFAULT);

  /** whether the current variant is block */
  protected readonly isBlock = computed<boolean>(() => this.variant() === 'block');

  /** whether the current variant is inline */
  protected readonly isInline = computed<boolean>(() => this.variant() === 'inline');

  /** whether ellipsis truncation is active */
  protected readonly hasEllipsis = computed<boolean>(() => this.ellipsisAt() > 0);

  /** the syntax-highlighted html content (proxied from brain) */
  protected readonly _highlightedHtml = computed<SafeHtml | null>(() => this.brain.highlightedHtml());
}
