import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { CodeHighlighterBrainDirective, type CodeHighlighterVariant } from './code-highlighter-brain';

describe('CodeHighlighterBrainDirective', () => {
  @Component({
    selector: 'test-code-highlighter-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CodeHighlighterBrainDirective],
    template: `
      <div
        orgCodeHighlighterBrain
        #brain="orgCodeHighlighterBrain"
        [text]="text()"
        [language]="language()"
        [variant]="variant()"
        [allowCopy]="allowCopy()"
        [copyAriaLabel]="copyAriaLabel()"
        (copied)="onCopied($event)"
        data-testid="brain"
      ></div>
    `,
  })
  class CodeHighlighterBrainHost {
    public readonly text = signal<string>('const value = 1;');
    public readonly language = signal<string>('typescript');
    public readonly variant = signal<CodeHighlighterVariant>('block');
    public readonly allowCopy = signal<boolean>(false);
    public readonly copyAriaLabel = signal<string>('Copy code');

    public onCopied = vi.fn();

    public readonly brain = viewChild.required<CodeHighlighterBrainDirective>('brain');
  }

  let fixture: ComponentFixture<CodeHighlighterBrainHost>;
  let component: CodeHighlighterBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeHighlighterBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeHighlighterBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('canCopy', () => {
    it('is false when allowCopy is false in the block variant', () => {
      expect(component.brain().canCopy()).toBe(false);
    });

    it('is false when allowCopy is true but variant is inline', async () => {
      component.allowCopy.set(true);
      component.variant.set('inline');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().canCopy()).toBe(false);
    });

    it('is true when allowCopy is true and variant is block', async () => {
      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brain().canCopy()).toBe(true);
    });
  });

  describe('copy', () => {
    it('does not emit copied when canCopy is false because allowCopy is off', () => {
      component.brain().copy();

      expect(component.onCopied).not.toHaveBeenCalled();
    });

    it('does not emit copied when canCopy is false because variant is inline', async () => {
      component.allowCopy.set(true);
      component.variant.set('inline');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().copy();

      expect(component.onCopied).not.toHaveBeenCalled();
    });

    it('emits copied with the text when canCopy is true and the clipboard copy succeeds', async () => {
      // jsdom does not define document.execCommand, so the cdk clipboard cannot succeed.
      // stub it so the real cdk clipboard reports success and the brain emits.
      Object.defineProperty(document, 'execCommand', {
        configurable: true,
        value: vi.fn().mockReturnValue(true),
      });

      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brain().copy();

      expect(component.onCopied).toHaveBeenCalledTimes(1);
      expect(component.onCopied).toHaveBeenCalledWith('const value = 1;');
    });
  });

  describe('highlightedHtml', () => {
    it('starts as null before shiki resolves', () => {
      const freshFixture = TestBed.createComponent(CodeHighlighterBrainHost);
      freshFixture.detectChanges();

      expect(freshFixture.componentInstance.brain().highlightedHtml()).toBeNull();
    });

    it('resolves to a non-null SafeHtml value after shiki tokenizes the text', async () => {
      await vi.waitFor(
        () => {
          fixture.detectChanges();

          expect(component.brain().highlightedHtml()).not.toBeNull();
        },
        { timeout: 10000, interval: 50 }
      );
    });
  });
});
