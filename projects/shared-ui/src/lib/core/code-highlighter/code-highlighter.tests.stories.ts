import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CodeHighlighter, type CodeHighlighterVariant } from './code-highlighter';

@Component({
  selector: 'story-code-highlighter-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeHighlighter],
  host: { class: 'block' },
  template: `
    <org-code-highlighter
      data-testid="highlighter"
      [text]="text()"
      [language]="language()"
      [variant]="variant()"
      [allowCopy]="allowCopy()"
      [copyAriaLabel]="copyAriaLabel()"
      [ellipsisAt]="ellipsisAt()"
      [scrollClass]="scrollClass()"
      (copied)="handleCopied($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-language-typescript" (click)="language.set('typescript')">
        language-typescript
      </button>
      <button type="button" data-testid="ctl-variant-inline" (click)="variant.set('inline')">variant-inline</button>
      <button type="button" data-testid="ctl-variant-block" (click)="variant.set('block')">variant-block</button>
      <button type="button" data-testid="ctl-allow-copy-on" (click)="allowCopy.set(true)">allow-copy-on</button>
      <button type="button" data-testid="ctl-allow-copy-off" (click)="allowCopy.set(false)">allow-copy-off</button>
      <button type="button" data-testid="ctl-copy-aria-label-set" (click)="copyAriaLabel.set('Copy snippet')">
        copy-aria-label-set
      </button>
      <button type="button" data-testid="ctl-ellipsis-at-3" (click)="ellipsisAt.set(3)">ellipsis-at-3</button>
      <button type="button" data-testid="ctl-scroll-class-set" (click)="scrollClass.set('h-base w-xl')">
        scroll-class-set
      </button>
    </div>
  `,
})
class StoryCodeHighlighterTestsShell {
  protected readonly text = signal<string>('const value = 1;');
  protected readonly language = signal<string>('text');
  protected readonly variant = signal<CodeHighlighterVariant>('block');
  protected readonly allowCopy = signal<boolean>(false);
  protected readonly copyAriaLabel = signal<string>('Copy code');
  protected readonly ellipsisAt = signal<number>(0);
  protected readonly scrollClass = signal<string>('');

  protected readonly copyCount = signal<number>(0);
  protected readonly lastCopiedText = signal<string>('');

  protected readout(): string {
    return `copyCount=${this.copyCount()} lastCopiedText=${this.lastCopiedText()}`;
  }

  protected handleCopied(text: string): void {
    this.copyCount.update((value) => value + 1);
    this.lastCopiedText.set(text);
  }
}

const meta: Meta = {
  title: 'Core/Components/Code Highlighter/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-code-highlighter-tests-shell />`,
  moduleMetadata: { imports: [StoryCodeHighlighterTestsShell] },
});

export const RendersDefaultVariantAndLanguageOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await expect(host.getAttribute('data-variant')).toBe('block');
    await expect(host.getAttribute('data-language')).toBe('text');
  },
};

export const OmitsAllowCopyAndHasEllipsisByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await expect(host.getAttribute('data-allow-copy')).toBeNull();
    await expect(host.getAttribute('data-has-ellipsis')).toBeNull();
  },
};

export const ReflectsLanguageInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-language-typescript'));

    await waitFor(() => expect(host.getAttribute('data-language')).toBe('typescript'));
  },
};

export const ReflectsVariantInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));

    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('inline'));
  },
};

export const ReflectsAllowCopyAttributeWhenAllowCopyTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-copy')).toBe(''));
  },
};

export const OmitsAllowCopyAttributeWhenAllowCopyFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));
    await waitFor(() => expect(host.getAttribute('data-allow-copy')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-off'));

    await waitFor(() => expect(host.getAttribute('data-allow-copy')).toBeNull());
  },
};

export const ReflectsHasEllipsisAttributeWhenEllipsisAtGreaterThanZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-ellipsis-at-3'));

    await waitFor(() => expect(host.getAttribute('data-has-ellipsis')).toBe(''));
  },
};

export const BlockRendersCopyButtonWithAriaLabelAndButtonType: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));
    await userEvent.click(canvas.getByTestId('ctl-copy-aria-label-set'));

    await waitFor(() => {
      const copyButton = host.querySelector('button.code-highlighter-copy-btn') as HTMLButtonElement | null;

      expect(copyButton).not.toBeNull();
      expect(copyButton?.getAttribute('aria-label')).toBe('Copy snippet');
      expect(copyButton?.type).toBe('button');
    });
  },
};

export const BlockOmitsCopyButtonWhenAllowCopyFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await expect(host.querySelector('button.code-highlighter-copy-btn')).toBeNull();
  },
};

export const BlockRendersPreAndCodeWithLanguageDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-language-typescript'));

    await waitFor(() => {
      const pre = host.querySelector('pre.code-highlighter-pre');
      const code = pre?.querySelector('code');

      expect(pre).not.toBeNull();
      expect(code).not.toBeNull();
      expect(code?.getAttribute('data-language')).toBe('typescript');
    });
  },
};

export const InlineRendersCodeElementWithLanguageDataAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-language-typescript'));
    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));

    await waitFor(() => {
      const inlineCode = host.querySelector('code.code-highlighter-inline');

      expect(inlineCode).not.toBeNull();
      expect(inlineCode?.getAttribute('data-language')).toBe('typescript');
    });
  },
};

export const InlineOmitsCopyButtonAndScrollArea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));

    await waitFor(() => {
      expect(host.querySelector('button.code-highlighter-copy-btn')).toBeNull();
      expect(host.querySelector('org-scroll-area')).toBeNull();
    });
  },
};

export const InlineOmitsCopyButtonEvenWhenAllowCopyTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));
    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));

    await waitFor(() => {
      expect(host.querySelector('button.code-highlighter-copy-btn')).toBeNull();
    });
  },
};

export const RendersRawTextInCodeBeforeShikiResolves: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await waitFor(() => {
      const code = host.querySelector('code') as HTMLElement | null;

      expect(code).not.toBeNull();
      expect(code?.textContent).toContain('const value = 1;');
    });
  },
};

export const ResolvesToSyntaxHighlightedSpansAfterShikiTokenizes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-language-typescript'));

    await waitFor(
      () => {
        const code = host.querySelector('code') as HTMLElement | null;

        expect(code).not.toBeNull();
        expect(code?.querySelector('[class^="org-syntax-"]')).not.toBeNull();
      },
      { timeout: 10000, interval: 50 }
    );
  },
};

export const EmitsCopiedWithTextWhenCopyButtonClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

    const copyButton = await waitFor(() => {
      const button = host.querySelector('button.code-highlighter-copy-btn') as HTMLButtonElement | null;

      expect(button).not.toBeNull();

      return button as HTMLButtonElement;
    });

    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('copyCount=1');
      expect(readout.textContent).toContain('lastCopiedText=const value = 1;');
    });
  },
};

export const BlockForwardsScrollClassToScrollArea: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('highlighter');

    await userEvent.click(canvas.getByTestId('ctl-scroll-class-set'));

    await waitFor(() => {
      const scrollbar = host.querySelector('org-scroll-area ng-scrollbar') as HTMLElement | null;

      expect(scrollbar).not.toBeNull();
      expect(scrollbar?.classList.contains('h-base')).toBe(true);
      expect(scrollbar?.classList.contains('w-xl')).toBe(true);
    });
  },
};
