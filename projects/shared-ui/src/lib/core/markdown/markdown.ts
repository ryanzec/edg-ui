import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { domUtils } from '@organization/shared-utils';

@Component({
  selector: 'org-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './markdown.html',
  styleUrl: './markdown.css',
})
export class Markdown {
  private readonly _domSanitizer = inject(DomSanitizer);

  /** remarkable instance used to parse and render markdown to html */
  private readonly _remarkable = new Remarkable({
    html: true,
    breaks: true,
    typographer: true,
  }).use(linkify);

  /** the raw markdown string to render */
  public markdown = input.required<string>();

  /** rendered and sanitized html derived from the markdown input */
  protected renderedHtml = computed<SafeHtml>(() => {
    const rawHtml = this._remarkable.render(this.markdown());
    const sanitizedHtml = domUtils.sanitizeHtml(rawHtml);

    // dompurify has already sanitized the html so it is safe to bypass angular's sanitizer
    return this._domSanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  });

  constructor() {
    this._remarkable.renderer.rules['link_open'] = (tokens, idx, options) => {
      const token = tokens[idx] as { href: string; title?: string };
      const href = domUtils.escapeHtmlAttribute(token.href);
      const title = token.title ? ` title="${domUtils.escapeHtmlAttribute(token.title)}"` : '';
      const target = options?.linkTarget ? ` target="${options.linkTarget}"` : '';
      const isExternal = /^(https?:)?\/\//.test(token.href);
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';

      return `<a href="${href}"${title}${target}${rel}>`;
    };
  }
}
