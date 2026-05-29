import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { CodeBlock, type CodeBlockTone, type CodeBlockVariant } from './code-block';
import { CodeBlockBrainDirective } from './code-block-brain';
import { type IconName } from '../icon/icon-brain';

const clipboardStub = vitestBrowserUtils.createClipboardStub();

@Component({
  selector: 'test-code-block-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
  providers: [{ provide: Clipboard, useValue: clipboardStub.service }],
  template: `
    <org-code-block
      data-testid="block"
      [text]="text()"
      [variant]="variant()"
      [tone]="tone()"
      [wrap]="wrap()"
      [allowCopy]="allowCopy()"
      [ellipsisAt]="ellipsisAt()"
      [headerLabel]="headerLabel()"
      [headerIcon]="headerIcon()"
      [(expanded)]="expanded"
      (copied)="handleCopied($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CodeBlockInteractiveHost {
  public readonly text = signal<string>('const greeting = "hi";');
  public readonly variant = signal<CodeBlockVariant>('block');
  public readonly tone = signal<CodeBlockTone>('none');
  public readonly wrap = signal<boolean>(false);
  public readonly allowCopy = signal<boolean>(false);
  public readonly ellipsisAt = signal<number>(0);
  public readonly headerLabel = signal<string | null | undefined>(undefined);
  public readonly headerIcon = signal<IconName | null | undefined>(undefined);
  public readonly expanded = signal<boolean>(false);

  protected readonly copiedCount = signal<number>(0);
  protected readonly lastCopiedText = signal<string>('');

  protected readout(): string {
    return `copiedCount=${this.copiedCount()} lastCopiedText=${this.lastCopiedText()}`;
  }

  protected handleCopied(text: string): void {
    this.copiedCount.update((value) => value + 1);
    this.lastCopiedText.set(text);
  }
}

@Component({
  selector: 'test-code-block-overflow-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      /*
       * the component clamp reads --code-block-line-height (max-height: calc(var(--ellipsis-lines) *
       * var(--code-block-line-height) * 1em)). the design-token css files are not loaded in the browser
       * test env, so the token is defined here to make the clamp — and therefore overflow — deterministic.
       */
      .overflow-stage {
        width: 20rem;
        --code-block-line-height: 1.5;
      }
    `,
  ],
  template: `
    <div class="overflow-stage">
      <org-code-block data-testid="block" [text]="text" [ellipsisAt]="2" [(expanded)]="expanded" />
    </div>
    <pre data-testid="readout">expanded={{ expanded() }}</pre>
  `,
})
class CodeBlockOverflowHost {
  /**
   * the brain owns the overflow flag the presentation feeds it after measuring the clamped body.
   * ngx-scrollbar (inside the block body) never establishes its content-derived height headlessly, so
   * the live measurement always reports "not overflowing" in the browser test env; tests drive the
   * flag through this seam — the exact input the presentation uses — to exercise the show-more logic.
   */
  public readonly brain = viewChild.required(CodeBlockBrainDirective);

  protected readonly text = 'line one\nline two\nline three\nline four\nline five\nline six';
  public readonly expanded = signal<boolean>(false);
}

@Component({
  selector: 'test-code-block-inline-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
  template: `
    <org-code-block
      data-testid="block"
      variant="inline"
      text="--color-primary"
      [allowCopy]="true"
      headerLabel="ignored-when-inline"
    />
  `,
})
class CodeBlockInlineHost {}

type CodeBlockHostConfig = {
  text?: string;
  variant?: CodeBlockVariant;
  tone?: CodeBlockTone;
  wrap?: boolean;
  allowCopy?: boolean;
  ellipsisAt?: number;
  headerLabel?: string | null;
  headerIcon?: IconName | null;
  expanded?: boolean;
};

describe('CodeBlock (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractive = (config: CodeBlockHostConfig = {}): ComponentFixture<CodeBlockInteractiveHost> =>
    createFixture(CodeBlockInteractiveHost, (instance) => {
      if (config.text !== undefined) {
        instance.text.set(config.text);
      }

      if (config.variant !== undefined) {
        instance.variant.set(config.variant);
      }

      if (config.tone !== undefined) {
        instance.tone.set(config.tone);
      }

      if (config.wrap !== undefined) {
        instance.wrap.set(config.wrap);
      }

      if (config.allowCopy !== undefined) {
        instance.allowCopy.set(config.allowCopy);
      }

      if (config.ellipsisAt !== undefined) {
        instance.ellipsisAt.set(config.ellipsisAt);
      }

      if (config.headerLabel !== undefined) {
        instance.headerLabel.set(config.headerLabel);
      }

      if (config.headerIcon !== undefined) {
        instance.headerIcon.set(config.headerIcon);
      }

      if (config.expanded !== undefined) {
        instance.expanded.set(config.expanded);
      }
    });

  /**
   * resolves the inner native button of the floating / header copy affordance once it renders. the
   * copy and show-more affordances are absolutely positioned and overlap the code body, so synthetic
   * pointer hit-testing lands on the code element; callers fire a native button.click() (a real
   * bubbling click that still drives org-button's clicked output) rather than userEvent.click.
   */
  const findCopyButton = async (host: HTMLElement): Promise<HTMLButtonElement> => {
    await waitFor(() => expect(host.querySelector('.copy button')).not.toBeNull());

    return host.querySelector<HTMLButtonElement>('.copy button') as HTMLButtonElement;
  };

  beforeEach(async () => {
    clipboardStub.reset();
    await setupTestBed();
  });

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default variant attribute', () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.getAttribute('data-variant')).toBe('block');
    });

    it('omits the optional boolean host attributes by default', () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.getAttribute('data-tone')).toBeNull();
      expect(host.getAttribute('data-wrap')).toBeNull();
      expect(host.getAttribute('data-has-ellipsis')).toBeNull();
      expect(host.getAttribute('data-expanded')).toBeNull();
      expect(host.getAttribute('data-overflowing')).toBeNull();
      expect(host.getAttribute('data-copied')).toBeNull();
      expect(host.getAttribute('data-allow-copy')).toBeNull();
      expect(host.getAttribute('data-has-header')).toBeNull();
    });

    it('reflects the variant input on the host', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.variant.set('inline');
      await flush(fixture);

      expect(host.getAttribute('data-variant')).toBe('inline');
    });

    it('omits data-tone for the none tone and sets it for other tones', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.getAttribute('data-tone')).toBeNull();

      fixture.componentInstance.tone.set('token');
      await flush(fixture);

      expect(host.getAttribute('data-tone')).toBe('token');
    });

    it('sets data-wrap when wrap is true', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.wrap.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-wrap')).toBe('');
    });

    it('sets data-allow-copy when allowCopy is true', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.allowCopy.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-allow-copy')).toBe('');
    });

    it('sets data-has-ellipsis when ellipsisAt is greater than zero', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.ellipsisAt.set(4);
      await flush(fixture);

      expect(host.getAttribute('data-has-ellipsis')).toBe('');
    });

    it('sets data-expanded when expanded is true', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.expanded.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-expanded')).toBe('');
    });

    it('sets data-has-header when a header label is provided', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.headerLabel.set('app.tsx');
      await flush(fixture);

      expect(host.getAttribute('data-has-header')).toBe('');
    });
  });

  describe('block body rendering', () => {
    it('renders the text inside pre code for the block variant', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      await waitFor(() => {
        const code = host.querySelector('pre code');

        expect(code?.textContent).toBe('const greeting = "hi";');
      });
    });

    it('does not render the inline branch in the block variant', () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.querySelector('code.inline')).toBeNull();
    });

    it('updates the rendered text when the text input changes', async () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      fixture.componentInstance.text.set('let x = 1;');
      await flush(fixture);

      await waitFor(() => {
        const code = host.querySelector('pre code');

        expect(code?.textContent).toBe('let x = 1;');
      });
    });
  });

  describe('header', () => {
    it('does not render the header when the header label is undefined', () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.querySelector('.header')).toBeNull();
    });

    it('renders the header label text', async () => {
      const fixture = createInteractive({ headerLabel: 'app.tsx' });
      const host = queryByTestId(fixture, 'block');

      await waitFor(() => {
        const labelText = host.querySelector('.header .header-label-text');

        expect(labelText?.textContent?.trim()).toBe('app.tsx');
      });
    });

    it('renders the header icon only when the header icon is set', async () => {
      const fixture = createInteractive({ headerLabel: 'app.tsx' });
      const host = queryByTestId(fixture, 'block');

      await waitFor(() => expect(host.querySelector('.header')).not.toBeNull());
      expect(host.querySelector('.header org-icon')).toBeNull();

      fixture.componentInstance.headerIcon.set('file-text');
      await flush(fixture);

      await waitFor(() => expect(host.querySelector('.header org-icon')).not.toBeNull());
    });

    it('treats a null header label as undefined', async () => {
      const fixture = createInteractive({ headerLabel: null });
      const host = queryByTestId(fixture, 'block');

      expect(host.getAttribute('data-has-header')).toBeNull();
      expect(host.querySelector('.header')).toBeNull();
    });
  });

  describe('copy button presence', () => {
    it('does not render the copy button when allowCopy is false', () => {
      const fixture = createInteractive();
      const host = queryByTestId(fixture, 'block');

      expect(host.querySelector('.copy')).toBeNull();
    });

    it('renders the copy button inside the header when allowCopy and a header label are set', async () => {
      const fixture = createInteractive({ allowCopy: true, headerLabel: 'app.tsx' });
      const host = queryByTestId(fixture, 'block');

      await waitFor(() => {
        const headerCopy = host.querySelector('.header .copy');

        expect(headerCopy).not.toBeNull();
        expect(headerCopy?.classList.contains('floating')).toBe(false);
      });
    });

    it('renders a floating copy button when allowCopy is set and there is no header', async () => {
      const fixture = createInteractive({ allowCopy: true });
      const host = queryByTestId(fixture, 'block');

      await waitFor(() => {
        const copy = host.querySelector('.copy');

        expect(copy).not.toBeNull();
        expect(copy?.classList.contains('floating')).toBe(true);
      });
      expect(host.querySelector('.header')).toBeNull();
    });

    it('does not render the copy button in the inline variant even with allowCopy', () => {
      const fixture = createFixture(CodeBlockInlineHost);
      const host = queryByTestId(fixture, 'block');

      expect(host.querySelector('.copy')).toBeNull();
    });
  });

  describe('copy interaction', () => {
    it('emits copied and flips data-copied on a successful copy', async () => {
      const fixture = createInteractive({ allowCopy: true });
      const host = queryByTestId(fixture, 'block');
      const readout = queryByTestId(fixture, 'readout');

      const copyButton = await findCopyButton(host);

      copyButton.click();

      await waitFor(() => {
        expect(readout.textContent).toContain('copiedCount=1');
        expect(readout.textContent).toContain('lastCopiedText=const greeting = "hi";');
        expect(host.getAttribute('data-copied')).toBe('');
      });

      await waitFor(() => expect(host.getAttribute('data-copied')).toBeNull());
    });

    it('does not emit copied when the clipboard write fails', async () => {
      clipboardStub.setShouldSucceed(false);

      const fixture = createInteractive({ allowCopy: true });
      const host = queryByTestId(fixture, 'block');
      const readout = queryByTestId(fixture, 'readout');

      const copyButton = await findCopyButton(host);

      copyButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('copiedCount=0');
      expect(host.getAttribute('data-copied')).toBeNull();
    });

    it('restarts the confirm window when copy is clicked again', async () => {
      const fixture = createInteractive({ allowCopy: true });
      const host = queryByTestId(fixture, 'block');

      const copyButton = await findCopyButton(host);

      copyButton.click();
      await waitFor(() => expect(host.getAttribute('data-copied')).toBe(''));

      // wait near the end of the first confirm window then click again to restart it
      await vitestBrowserUtils.sleep(900);
      copyButton.click();

      // we are now past the original 1200ms window (>1300ms since first click) — the attribute
      // must still be set, which only happens if the first timer was cleared
      await vitestBrowserUtils.sleep(500);
      await flush(fixture);
      expect(host.getAttribute('data-copied')).toBe('');

      // and once the second window elapses the attribute clears
      await waitFor(() => expect(host.getAttribute('data-copied')).toBeNull());
    });
  });

  describe('overflow / show more', () => {
    it('does not render show-more when not overflowing', async () => {
      const fixture = createInteractive({ ellipsisAt: 4 });
      const host = queryByTestId(fixture, 'block');

      // give the resize observer / measurement effect a tick to run
      await vitestBrowserUtils.sleep(50);
      await flush(fixture);

      expect(host.querySelector('.show-more')).toBeNull();
    });

    // the live measurement (effect microtask + ResizeObserver first callback) runs shortly after the
    // first change detection and would overwrite an eagerly-applied stub; let it settle, then drive
    // the overflow flag through the brain's measurement seam so the show-more logic is deterministic.
    const applyOverflowing = async (fixture: ComponentFixture<CodeBlockOverflowHost>): Promise<void> => {
      await flush(fixture);
      await vitestBrowserUtils.sleep(50);
      fixture.componentInstance.brain().setOverflowing(true);
      await flush(fixture);
    };

    it('renders show-more when overflowing', async () => {
      const fixture = createFixture(CodeBlockOverflowHost);
      const host = queryByTestId(fixture, 'block');

      await applyOverflowing(fixture);

      expect(host.getAttribute('data-overflowing')).toBe('');
      expect(host.querySelector('.show-more')).not.toBeNull();
    });

    it('toggles expanded and collapses on click', async () => {
      const fixture = createFixture(CodeBlockOverflowHost);
      const host = queryByTestId(fixture, 'block');
      const readout = queryByTestId(fixture, 'readout');

      await applyOverflowing(fixture);

      const showMoreButton = host.querySelector<HTMLButtonElement>('.show-more button') as HTMLButtonElement;

      expect(showMoreButton).not.toBeNull();
      expect(showMoreButton.getAttribute('aria-expanded')).toBe('false');
      expect(showMoreButton.textContent).toContain('Show more');

      // expanding keeps the toggle present so it can collapse back, now reading "Show less"
      showMoreButton.click();
      await flush(fixture);

      expect(readout.textContent).toContain('expanded=true');
      expect(host.getAttribute('data-expanded')).toBe('');

      const expandedButton = host.querySelector('.show-more button');

      expect(expandedButton).not.toBeNull();
      expect(expandedButton?.getAttribute('aria-expanded')).toBe('true');
      expect(expandedButton?.textContent).toContain('Show less');

      // collapsing returns the body to the clamp and the toggle back to "Show more". the expanded
      // change re-runs the live measurement, so re-apply the overflow seam after it settles.
      host.querySelector<HTMLButtonElement>('.show-more button')?.click();
      await applyOverflowing(fixture);

      expect(readout.textContent).toContain('expanded=false');
      expect(host.getAttribute('data-expanded')).toBeNull();

      const collapsedButton = host.querySelector('.show-more button');

      expect(collapsedButton).not.toBeNull();
      expect(collapsedButton?.getAttribute('aria-expanded')).toBe('false');
      expect(collapsedButton?.textContent).toContain('Show more');
    });
  });

  describe('inline variant', () => {
    it('renders the inline code element for the inline variant', () => {
      const fixture = createFixture(CodeBlockInlineHost);
      const host = queryByTestId(fixture, 'block');

      const inlineCode = host.querySelector('code.inline');

      expect(inlineCode?.textContent).toBe('--color-primary');
    });

    it('does not render block chrome for the inline variant', () => {
      const fixture = createFixture(CodeBlockInlineHost);
      const host = queryByTestId(fixture, 'block');

      expect(host.querySelector('pre')).toBeNull();
      expect(host.querySelector('.header')).toBeNull();
      expect(host.querySelector('.copy')).toBeNull();
      expect(host.querySelector('.body')).toBeNull();
    });
  });
});
