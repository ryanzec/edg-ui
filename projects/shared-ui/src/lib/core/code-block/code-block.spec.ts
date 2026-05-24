import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { CodeBlock } from './code-block';
import { CODE_BLOCK_COPY_CONFIRM_DURATION_MS, CodeBlockBrainDirective } from './code-block-brain';

const stubExecCommand = (returnValue: boolean): void => {
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    writable: true,
    value: () => returnValue,
  });
};

const restoreExecCommand = (): void => {
  if ('execCommand' in document) {
    delete (document as unknown as { execCommand?: unknown }).execCommand;
  }
};

describe('CodeBlock', () => {
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeEach(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
      globalThis.ResizeObserver = class {
        public observe(): void {}
        public unobserve(): void {}
        public disconnect(): void {}
      } as unknown as typeof ResizeObserver;
    }
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    vi.useRealTimers();
    vi.restoreAllMocks();
    restoreExecCommand();
  });

  describe('host attributes — defaults', () => {
    @Component({
      selector: 'test-code-block-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `<org-code-block text="hello" data-testid="block" />`,
    })
    class CodeBlockDefaultsHost {}

    let fixture: ComponentFixture<CodeBlockDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default variant on the host data-variant attribute', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

      expect(host.getAttribute('data-variant')).toBe('block');
    });

    it('omits the optional and boolean host attributes by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

      expect(host.getAttribute('data-tone')).toBeNull();
      expect(host.getAttribute('data-wrap')).toBeNull();
      expect(host.getAttribute('data-has-ellipsis')).toBeNull();
      expect(host.getAttribute('data-expanded')).toBeNull();
      expect(host.getAttribute('data-overflowing')).toBeNull();
      expect(host.getAttribute('data-copied')).toBeNull();
      expect(host.getAttribute('data-allow-copy')).toBeNull();
      expect(host.getAttribute('data-has-header')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-code-block-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `
        <org-code-block
          text="hello"
          [variant]="variant()"
          [tone]="tone()"
          [wrap]="wrap()"
          [allowCopy]="allowCopy()"
          [ellipsisAt]="ellipsisAt()"
          [headerLabel]="headerLabel()"
          [(expanded)]="expanded"
          data-testid="block"
        />
      `,
    })
    class CodeBlockAttrsHost {
      public readonly variant = signal<'block' | 'inline'>('block');
      public readonly tone = signal<'none' | 'token' | 'danger' | 'safe'>('none');
      public readonly wrap = signal<boolean>(false);
      public readonly allowCopy = signal<boolean>(false);
      public readonly ellipsisAt = signal<number>(0);
      public readonly headerLabel = signal<string | undefined>(undefined);
      public readonly expanded = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CodeBlockAttrsHost>;
    let component: CodeBlockAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getHost = () => fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

    it('reflects the variant input on the host data-variant attribute', async () => {
      component.variant.set('inline');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-variant')).toBe('inline');
    });

    it('omits data-tone when tone is none and sets it for other tones', async () => {
      expect(getHost().getAttribute('data-tone')).toBeNull();

      component.tone.set('token');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-tone')).toBe('token');
    });

    it('sets data-wrap when the wrap input is true', async () => {
      component.wrap.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-wrap')).toBe('');
    });

    it('sets data-allow-copy when the allowCopy input is true', async () => {
      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-allow-copy')).toBe('');
    });

    it('sets data-has-ellipsis when ellipsisAt is greater than 0', async () => {
      component.ellipsisAt.set(4);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-has-ellipsis')).toBe('');
    });

    it('sets data-expanded when the expanded model is true', async () => {
      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-expanded')).toBe('');
    });

    it('sets data-has-header when a headerLabel is provided', async () => {
      component.headerLabel.set('snippet.ts');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('data-has-header')).toBe('');
    });
  });

  describe('block variant rendering', () => {
    @Component({
      selector: 'test-code-block-block-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `<org-code-block [text]="text()" variant="block" data-testid="block" />`,
    })
    class CodeBlockBlockHost {
      public readonly text = signal<string>('const greeting = "hi";');
    }

    let fixture: ComponentFixture<CodeBlockBlockHost>;
    let component: CodeBlockBlockHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockBlockHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockBlockHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the text inside a <pre><code> body', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;
      const code = host.querySelector('pre code');

      expect(code?.textContent).toBe('const greeting = "hi";');
    });

    it('does not render the inline <code> branch in the block variant', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

      expect(host.querySelector('code.inline')).toBeNull();
    });

    it('updates the rendered text when the text input changes', async () => {
      component.text.set('let x = 1;');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;
      const code = host.querySelector('pre code');

      expect(code?.textContent).toBe('let x = 1;');
    });
  });

  describe('block header rendering', () => {
    @Component({
      selector: 'test-code-block-header-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `
        <org-code-block text="snippet" [headerLabel]="headerLabel()" [headerIcon]="headerIcon()" data-testid="block" />
      `,
    })
    class CodeBlockHeaderHost {
      public readonly headerLabel = signal<string | null | undefined>(undefined);
      public readonly headerIcon = signal<'file-text' | null | undefined>(undefined);
    }

    let fixture: ComponentFixture<CodeBlockHeaderHost>;
    let component: CodeBlockHeaderHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockHeaderHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockHeaderHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getHost = () => fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

    it('does not render the header when headerLabel is undefined', () => {
      expect(getHost().querySelector('.header')).toBeNull();
    });

    it('renders the header with the label text when headerLabel is set', async () => {
      component.headerLabel.set('app.tsx');
      fixture.detectChanges();
      await fixture.whenStable();

      const labelText = getHost().querySelector('.header .header-label-text');

      expect(labelText?.textContent?.trim()).toBe('app.tsx');
    });

    it('renders the header icon only when headerIcon is set', async () => {
      component.headerLabel.set('app.tsx');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getHost().querySelector('.header org-icon')).toBeNull();

      component.headerIcon.set('file-text');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('.header org-icon')).not.toBeNull();
    });

    it('treats a null headerLabel as undefined so the header is not rendered', async () => {
      component.headerLabel.set(null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('.header')).toBeNull();
    });
  });

  describe('copy button placement', () => {
    @Component({
      selector: 'test-code-block-copy-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `
        <org-code-block text="snippet" [allowCopy]="allowCopy()" [headerLabel]="headerLabel()" data-testid="block" />
      `,
    })
    class CodeBlockCopyHost {
      public readonly allowCopy = signal<boolean>(false);
      public readonly headerLabel = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<CodeBlockCopyHost>;
    let component: CodeBlockCopyHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockCopyHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockCopyHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getHost = () => fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

    it('does not render the copy button when allowCopy is false', () => {
      expect(getHost().querySelector('.copy')).toBeNull();
    });

    it('renders the copy button inside the header when allowCopy is true and a headerLabel is set', async () => {
      component.allowCopy.set(true);
      component.headerLabel.set('snippet.ts');
      fixture.detectChanges();
      await fixture.whenStable();

      const headerCopy = getHost().querySelector('.header .copy');

      expect(headerCopy).not.toBeNull();
      expect(headerCopy?.classList.contains('floating')).toBe(false);
    });

    it('renders a floating copy button when allowCopy is true and no header is present', async () => {
      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const copy = getHost().querySelector('.copy');

      expect(copy).not.toBeNull();
      expect(copy?.classList.contains('floating')).toBe(true);
      expect(getHost().querySelector('.header')).toBeNull();
    });
  });

  describe('copy interaction', () => {
    @Component({
      selector: 'test-code-block-copy-click-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `
        <org-code-block text="copy me" [allowCopy]="true" (copied)="onCopied($event)" data-testid="block" />
      `,
    })
    class CodeBlockCopyClickHost {
      public onCopied = vi.fn<(text: string) => void>();
    }

    let fixture: ComponentFixture<CodeBlockCopyClickHost>;
    let component: CodeBlockCopyClickHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockCopyClickHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockCopyClickHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits copied with the text and flips data-copied on a successful copy click', async () => {
      vi.useFakeTimers();
      stubExecCommand(true);

      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;
      const copyButton = host.querySelector('.copy button') as HTMLButtonElement;

      copyButton.click();
      fixture.detectChanges();

      expect(component.onCopied).toHaveBeenCalledTimes(1);
      expect(component.onCopied).toHaveBeenCalledWith('copy me');
      expect(host.getAttribute('data-copied')).toBe('');

      vi.advanceTimersByTime(CODE_BLOCK_COPY_CONFIRM_DURATION_MS);
      fixture.detectChanges();

      expect(host.getAttribute('data-copied')).toBeNull();
    });

    it('does not emit copied when the underlying clipboard write fails', async () => {
      stubExecCommand(false);

      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;
      const copyButton = host.querySelector('.copy button') as HTMLButtonElement;

      copyButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onCopied).not.toHaveBeenCalled();
      expect(host.getAttribute('data-copied')).toBeNull();
    });
  });

  describe('show-more affordance', () => {
    @Component({
      selector: 'test-code-block-show-more-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: ` <org-code-block text="multiline" [ellipsisAt]="4" [(expanded)]="expanded" data-testid="block" /> `,
    })
    class CodeBlockShowMoreHost {
      public readonly expanded = signal<boolean>(false);
      public readonly brain = viewChild.required(CodeBlockBrainDirective);
    }

    let fixture: ComponentFixture<CodeBlockShowMoreHost>;
    let component: CodeBlockShowMoreHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockShowMoreHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockShowMoreHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const getHost = () => fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

    it('does not render the show-more button when the body is not overflowing', () => {
      expect(getHost().querySelector('.show-more')).toBeNull();
    });

    it('renders the show-more button once the brain reports the body is overflowing', async () => {
      component.brain().setOverflowing(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().querySelector('.show-more')).not.toBeNull();
    });

    it('flips the expanded model and hides the show-more button when the show-more button is clicked', async () => {
      component.brain().setOverflowing(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const showMoreButton = getHost().querySelector('.show-more button') as HTMLButtonElement;
      showMoreButton.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.expanded()).toBe(true);
      expect(getHost().getAttribute('data-expanded')).toBe('');
      expect(getHost().querySelector('.show-more')).toBeNull();
    });
  });

  describe('inline variant rendering', () => {
    @Component({
      selector: 'test-code-block-inline-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CodeBlock],
      template: `
        <org-code-block
          variant="inline"
          [text]="text()"
          [allowCopy]="true"
          headerLabel="ignored-when-inline"
          data-testid="block"
        />
      `,
    })
    class CodeBlockInlineHost {
      public readonly text = signal<string>('--color-primary');
    }

    let fixture: ComponentFixture<CodeBlockInlineHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CodeBlockInlineHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CodeBlockInlineHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the text inside an inline <code class="inline"> element', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;
      const inlineCode = host.querySelector('code.inline');

      expect(inlineCode?.textContent).toBe('--color-primary');
    });

    it('does not render the block <pre>, header, copy button, or body wrapper', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="block"]') as HTMLElement;

      expect(host.querySelector('pre')).toBeNull();
      expect(host.querySelector('.header')).toBeNull();
      expect(host.querySelector('.copy')).toBeNull();
      expect(host.querySelector('.body')).toBeNull();
    });
  });
});
