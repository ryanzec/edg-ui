import { Directive, computed, inject, input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { catchError, from, of, Subject, switchMap } from 'rxjs';
import { createHighlighter, type BundledLanguage } from 'shiki';
import { logManager } from '@organization/shared-utils';

/** minimal shape of a shiki token scope (only the field we care about) */
type _TokenScope = { scopeName: string };

/** minimal shape of a shiki tokenization explanation entry — one per sub-token range */
type _TokenExplanation = { content: string; scopes: _TokenScope[] };

/** minimal shape of a shiki token relevant to our renderer */
type _Token = { content: string; explanation?: _TokenExplanation[] };

/** all valid code highlighter variants */
export const allCodeHighlighterVariants = ['block', 'inline'] as const;

/** the rendering variant of the code highlighter */
export type CodeHighlighterVariant = (typeof allCodeHighlighterVariants)[number];

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

/** default value for the language input */
export const CODE_HIGHLIGHTER_LANGUAGE_DEFAULT = 'text';

/** default value for the variant input */
export const CODE_HIGHLIGHTER_VARIANT_DEFAULT: CodeHighlighterVariant = 'block';

/** default value for the allowCopy input */
export const CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT = false;

/** default value for the copyAriaLabel input */
export const CODE_HIGHLIGHTER_COPY_ARIA_LABEL_DEFAULT = 'Copy code';

let _highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

const _getShikiHighlighter = (): ReturnType<typeof createHighlighter> => {
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'shell', 'sql', 'yaml', 'markdown', 'text'],
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
 * headless brain directive for the code-highlighter component. owns the shiki tokenization, the
 * scope → kind mapping that turns shiki tokens into `.org-syntax-*` spans, the copy-to-clipboard
 * action, and the accessibility surface for the copy button. carries no styling, sizing, or layout
 * concerns — those live in the presentation component.
 */
@Directive({
  selector: '[orgCodeHighlighterBrain]',
  exportAs: 'orgCodeHighlighterBrain',
})
export class CodeHighlighterBrainDirective {
  private readonly _domSanitizer = inject(DomSanitizer);
  private readonly _clipboard = inject(Clipboard);

  private readonly _copied$ = new Subject<string>();

  /** the code text to highlight */
  public readonly text = input.required<string>();

  /** the language to use for syntax highlighting */
  public readonly language = input<string>(CODE_HIGHLIGHTER_LANGUAGE_DEFAULT);

  /** the rendering variant; routes whether the copy interaction is available and drives the semantic html branch */
  public readonly variant = input<CodeHighlighterVariant>(CODE_HIGHLIGHTER_VARIANT_DEFAULT);

  /** whether the copy-to-clipboard interaction is enabled (only meaningful in the block variant) */
  public readonly allowCopy = input<boolean>(CODE_HIGHLIGHTER_ALLOW_COPY_DEFAULT);

  /** accessible label applied to the copy button */
  public readonly copyAriaLabel = input<string>(CODE_HIGHLIGHTER_COPY_ARIA_LABEL_DEFAULT);

  /** emitted with the copied text when a copy interaction completes successfully */
  public readonly copied = outputFromObservable(this._copied$);

  /** whether the copy button should render (allowCopy enabled and in the block variant) */
  public readonly canCopy = computed<boolean>(() => this.allowCopy() && this.variant() === 'block');

  /** static native button type applied to the copy button to prevent accidental form submission */
  public readonly copyButtonType = 'button' as const;

  /** combined params used as the source for the reactive shiki tokenization pipeline */
  private readonly _params = computed<{ text: string; language: string }>(() => ({
    text: this.text(),
    language: this.language(),
  }));

  /**
   * the syntax-highlighted html content as a stream of `.org-syntax-*` spans, or null while shiki
   * initialises or if tokenization errored. token colors are driven by css design tokens, not shiki
   * theme — light/dark theming flows through the existing `.dark` selector.
   */
  public readonly highlightedHtml = toSignal<SafeHtml | null>(
    toObservable(this._params).pipe(
      switchMap(({ text, language }) =>
        from(
          _getShikiHighlighter().then((highlighter) => {
            const result = highlighter.codeToTokens(text, {
              lang: language as BundledLanguage,
              theme: 'github-light',
              includeExplanation: 'scopeName',
            });
            const html = _renderTokenLines(result.tokens);

            return this._domSanitizer.bypassSecurityTrustHtml(html);
          })
        ).pipe(
          catchError((error) => {
            logManager.warn({
              type: 'code-highlighter-render-error',
              message: logManager.getErrorMessage(error),
              error,
            });

            return of(null);
          })
        )
      )
    ),
    { initialValue: null }
  );

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
