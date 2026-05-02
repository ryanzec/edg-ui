import { Directive, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, from, of, switchMap } from 'rxjs';
import { createHighlighter } from 'shiki';
import { UiThemeManager } from '../../ui-theme/ui-theme-manager/ui-theme-manager';
import { logManager } from '@organization/shared-utils';

/** default value for the language input */
export const CODE_HIGHLIGHTER_LANGUAGE_DEFAULT = 'text';

let _highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getShikiHighlighter(): ReturnType<typeof createHighlighter> {
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'shell', 'sql', 'yaml', 'markdown', 'text'],
    });
  }

  return _highlighterPromise;
}

/**
 * headless brain directive for the code-highlighter component. owns the shiki highlighter access, the
 * theme-reactive html generation pipeline, and shiki render error handling. exposes the rendered (or null while
 * shiki initialises) sanitised html as a signal that the presentation binds via [innerHTML].
 */
@Directive({
  selector: '[orgCodeHighlighterBrain]',
  exportAs: 'orgCodeHighlighterBrain',
})
export class CodeHighlighterBrainDirective {
  private readonly _domSanitizer = inject(DomSanitizer);
  private readonly _themeManager = inject(UiThemeManager);

  /** the code text to highlight */
  public readonly text = input.required<string>();

  /** the language to use for syntax highlighting */
  public readonly language = input<string>(CODE_HIGHLIGHTER_LANGUAGE_DEFAULT);

  /** combined params used as the source for the reactive shiki rendering pipeline */
  private readonly _params = computed<{ text: string; language: string; isDark: boolean }>(() => ({
    text: this.text(),
    language: this.language(),
    isDark: this._themeManager.isDarkMode(),
  }));

  /** the syntax-highlighted html content, or null while shiki initialises or if rendering errored */
  public readonly highlightedHtml = toSignal<SafeHtml | null>(
    toObservable(this._params).pipe(
      switchMap(({ text, language, isDark }) =>
        from(
          getShikiHighlighter().then((highlighter) => {
            const theme = isDark ? 'github-dark' : 'github-light';
            const html = highlighter.codeToHtml(text, { lang: language, theme });

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
}
