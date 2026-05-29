import { Directive, DestroyRef, computed, inject, input, model, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, from, of, switchMap } from 'rxjs';
import { createHighlighter, type BundledLanguage } from 'shiki';
import { angularUtils, logManager } from '@organization/shared-utils';

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

/** default value for the collapsable input */
export const CODE_BLOCK_COLLAPSABLE_DEFAULT = false;

/** default value for the collapsed model */
export const CODE_BLOCK_COLLAPSED_DEFAULT = false;

/** how long, in milliseconds, the copy-confirm visual state is held after a successful copy */
export const CODE_BLOCK_COPY_CONFIRM_DURATION_MS = 1200;

/** default value for the highlightLanguage input; undefined renders plain (unhighlighted) text */
export const CODE_BLOCK_HIGHLIGHT_LANGUAGE_DEFAULT: string | undefined = undefined;

/** all syntax-highlighting languages bundled into the block body's highlighter */
export const allCodeBlockHighlightLanguages = [
  'typescript',
  'javascript',
  'html',
  'css',
  'json',
  'bash',
  'shell',
  'sql',
  'yaml',
  'markdown',
  'text',
] as const;

/** all valid syntax token kinds emitted by the highlighter */
export const allSyntaxKinds = [
  'comment',
  'keyword',
  'string',
  'number',
  'function',
  'variable',
  'property',
  'tag',
  'attribute',
  'operator',
  'punctuation',
  'class',
  'builtin',
  'regex',
  'escape',
  'decorator',
  'deleted',
  'inserted',
] as const;

/** the syntax token kind a textmate scope maps to */
export type SyntaxKind = (typeof allSyntaxKinds)[number];

/** minimal shape of a shiki token scope (only the field we care about) */
type _TokenScope = { scopeName: string };

/** minimal shape of a shiki tokenization explanation entry — one per sub-token range */
type _TokenExplanation = { content: string; scopes: _TokenScope[] };

/** minimal shape of a shiki token relevant to our renderer */
type _Token = { content: string; explanation?: _TokenExplanation[] };

let _highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

const _getShikiHighlighter = (): ReturnType<typeof createHighlighter> => {
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: [...allCodeBlockHighlightLanguages],
    });
  }

  return _highlighterPromise;
};

/**
 * ordered scope-prefix → kind mapping. order matters — the first matching prefix wins, so more
 * specific prefixes (e.g. `keyword.operator`, `support.type.property-name`) must come before
 * broader ones with the same head (e.g. `keyword`, `support.type`).
 */
const _scopePrefixMap: { prefix: string; kind: SyntaxKind }[] = [
  { prefix: 'comment', kind: 'comment' },
  { prefix: 'punctuation.definition.decorator', kind: 'decorator' },
  { prefix: 'meta.decorator', kind: 'decorator' },
  { prefix: 'punctuation', kind: 'punctuation' },
  { prefix: 'string.regexp', kind: 'regex' },
  { prefix: 'constant.character.escape', kind: 'escape' },
  { prefix: 'string', kind: 'string' },
  { prefix: 'constant.numeric', kind: 'number' },
  { prefix: 'entity.name.function', kind: 'function' },
  { prefix: 'support.function', kind: 'function' },
  { prefix: 'entity.name.class', kind: 'class' },
  { prefix: 'entity.name.type', kind: 'class' },
  { prefix: 'support.class', kind: 'class' },
  { prefix: 'support.type.property-name', kind: 'property' },
  { prefix: 'support.type', kind: 'builtin' },
  { prefix: 'support.constant', kind: 'builtin' },
  { prefix: 'variable.language', kind: 'builtin' },
  { prefix: 'entity.name.tag', kind: 'tag' },
  { prefix: 'entity.other.attribute-name', kind: 'attribute' },
  { prefix: 'meta.object-literal.key', kind: 'property' },
  { prefix: 'variable.other.property', kind: 'property' },
  { prefix: 'markup.deleted', kind: 'deleted' },
  { prefix: 'markup.inserted', kind: 'inserted' },
  { prefix: 'keyword.operator', kind: 'operator' },
  { prefix: 'keyword', kind: 'keyword' },
  { prefix: 'variable', kind: 'variable' },
];

const _mapScopesToKind = (scopeNames: string[]): SyntaxKind | null => {
  // walk scopes most-specific to most-general (shiki orders them general → specific).
  for (let index = scopeNames.length - 1; index >= 0; index--) {
    const scopeName = scopeNames[index];

    for (const { prefix, kind } of _scopePrefixMap) {
      if (scopeName === prefix || scopeName.startsWith(`${prefix}.`)) {
        return kind;
      }
    }
  }

  return null;
};

const _escapeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const _renderExplanationSpan = (explanation: _TokenExplanation): string => {
  const escapedContent = _escapeHtml(explanation.content);

  if (explanation.content.trim() === '') {
    return escapedContent;
  }

  const scopeNames = explanation.scopes.map((scope: _TokenScope) => scope.scopeName);
  const kind = _mapScopesToKind(scopeNames);

  if (!kind) {
    return escapedContent;
  }

  return `<span class="org-syntax-${kind}">${escapedContent}</span>`;
};

const _renderTokenLines = (lines: _Token[][]): string => {
  const renderedLines: string[] = [];

  for (const line of lines) {
    let renderedLine = '';

    for (const token of line) {
      const explanations = token.explanation ?? [];

      // shiki splits a single token (e.g. a quoted json key like `"name"`) into multiple
      // sub-explanations — one for each scope range. emit one span per sub-explanation so each
      // character range gets its own classification.
      if (explanations.length > 0) {
        for (const explanation of explanations) {
          renderedLine += _renderExplanationSpan(explanation);
        }

        continue;
      }

      // fallback: language without grammar (e.g. plain text) — emit raw escaped content.
      renderedLine += _escapeHtml(token.content);
    }

    renderedLines.push(renderedLine);
  }

  return renderedLines.join('\n');
};

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

  private readonly _domSanitizer = inject(DomSanitizer);

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

  /** the language used to syntax-highlight the block body; undefined renders plain (unhighlighted) text */
  public readonly highlightLanguage = input<string | undefined, string | null | undefined>(
    CODE_BLOCK_HIGHLIGHT_LANGUAGE_DEFAULT,
    {
      transform: angularUtils.transformNullToUndefined,
    }
  );

  /** whether the clamped block body is currently expanded; modeled so consumers can drive it externally */
  public readonly expanded = model<boolean>(CODE_BLOCK_EXPANDED_DEFAULT);

  /** whether the block can be collapsed via the header toggle (only meaningful in the block variant) */
  public readonly collapsable = input<boolean>(CODE_BLOCK_COLLAPSABLE_DEFAULT);

  /** whether the block body is currently collapsed; modeled so consumers can drive it externally */
  public readonly collapsed = model<boolean>(CODE_BLOCK_COLLAPSED_DEFAULT);

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

  /** whether the collapse interaction is available (collapsable enabled and in the block variant) */
  public readonly canCollapse = computed<boolean>(() => this.collapsable() && this.variant() === 'block');

  /**
   * whether the expand toggle (show more / show less) should render. visible while the body overflows
   * its clamp, and remains visible once expanded so the user can collapse back to the clamped height.
   * hidden while the body is collapsed since the clamp affordance is meaningless without visible content.
   */
  public readonly showExpandToggle = computed<boolean>(
    () => this.hasEllipsis() && (this.isOverflowing() || this.expanded()) && !this.collapsed()
  );

  /** aria-expanded value applied to the expand toggle to communicate the clamp state */
  public readonly expandToggleAriaExpanded = computed<boolean>(() => this.expanded());

  /** aria-expanded value applied to the collapsible header toggle (true while the body is shown) */
  public readonly collapseToggleAriaExpanded = computed<boolean>(() => !this.collapsed());

  /** static native button type applied to the copy and show-more buttons to prevent accidental form submission */
  public readonly copyButtonType = 'button' as const;

  /** combined params used as the source for the reactive shiki tokenization pipeline; null when highlighting is off */
  private readonly _highlightParams = computed<{ text: string; language: string } | null>(() => {
    const language = this.highlightLanguage();

    // highlighting is a block-only concern; the inline variant always renders plain (toned) text
    if (language === undefined || this.variant() !== 'block') {
      return null;
    }

    return { text: this.text(), language };
  });

  /**
   * the syntax-highlighted html content as a stream of `.org-syntax-*` spans, or null when highlighting
   * is off, while shiki initialises, or if tokenization errored. token colors are driven by css design
   * tokens, not shiki theme — light/dark theming flows through the existing `.dark` selector.
   */
  public readonly highlightedHtml = toSignal<SafeHtml | null>(
    toObservable(this._highlightParams).pipe(
      switchMap((params) => {
        if (params === null) {
          return of(null);
        }

        return from(
          _getShikiHighlighter().then((highlighter) => {
            const result = highlighter.codeToTokens(params.text, {
              lang: params.language as BundledLanguage,
              theme: 'github-light',
              includeExplanation: 'scopeName',
            });
            const html = _renderTokenLines(result.tokens);

            return this._domSanitizer.bypassSecurityTrustHtml(html);
          })
        ).pipe(
          catchError((error) => {
            logManager.warn({
              type: 'code-block-render-error',
              message: logManager.getErrorMessage(error),
              error,
            });

            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

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

  /** flips the expanded model; used by the expand toggle to lift the clamp or collapse back to it */
  public toggleExpanded(): void {
    this.expanded.update((current) => !current);
  }

  /** flips the collapsed model; used by the collapsible header toggle to hide or reveal the body */
  public toggleCollapsed(): void {
    if (!this.canCollapse()) {
      return;
    }

    this.collapsed.update((current) => !current);
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
