import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CodeBlock, type CodeBlockTone, type CodeBlockVariant } from './code-block';
import { type IconName } from '../icon/icon-brain';

const stubExecCommand = (returnValue: boolean): (() => void) => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');

  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    writable: true,
    value: () => returnValue,
  });

  return () => {
    if (originalDescriptor) {
      Object.defineProperty(document, 'execCommand', originalDescriptor);

      return;
    }

    delete (document as unknown as { execCommand?: unknown }).execCommand;
  };
};

const wait = (durationMs: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, durationMs));

@Component({
  selector: 'story-code-block-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-variant-inline" (click)="variant.set('inline')">variant-inline</button>
      <button type="button" data-testid="ctl-variant-block" (click)="variant.set('block')">variant-block</button>
      <button type="button" data-testid="ctl-tone-token" (click)="tone.set('token')">tone-token</button>
      <button type="button" data-testid="ctl-tone-none" (click)="tone.set('none')">tone-none</button>
      <button type="button" data-testid="ctl-wrap-on" (click)="wrap.set(true)">wrap-on</button>
      <button type="button" data-testid="ctl-allow-copy-on" (click)="allowCopy.set(true)">allow-copy-on</button>
      <button type="button" data-testid="ctl-allow-copy-off" (click)="allowCopy.set(false)">allow-copy-off</button>
      <button type="button" data-testid="ctl-ellipsis-4" (click)="ellipsisAt.set(4)">ellipsis-4</button>
      <button type="button" data-testid="ctl-ellipsis-0" (click)="ellipsisAt.set(0)">ellipsis-0</button>
      <button type="button" data-testid="ctl-header-label-set" (click)="headerLabel.set('app.tsx')">
        header-label-set
      </button>
      <button type="button" data-testid="ctl-header-label-null" (click)="headerLabel.set(null)">
        header-label-null
      </button>
      <button type="button" data-testid="ctl-header-icon-set" (click)="headerIcon.set('file-text')">
        header-icon-set
      </button>
      <button type="button" data-testid="ctl-text-update" (click)="text.set('let x = 1;')">text-update</button>
      <button type="button" data-testid="ctl-expanded-on" (click)="expanded.set(true)">expanded-on</button>
    </div>
  `,
})
class StoryCodeBlockTestsShell {
  protected readonly text = signal<string>('const greeting = "hi";');
  protected readonly variant = signal<CodeBlockVariant>('block');
  protected readonly tone = signal<CodeBlockTone>('none');
  protected readonly wrap = signal<boolean>(false);
  protected readonly allowCopy = signal<boolean>(false);
  protected readonly ellipsisAt = signal<number>(0);
  protected readonly headerLabel = signal<string | null | undefined>(undefined);
  protected readonly headerIcon = signal<IconName | null | undefined>(undefined);
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
  selector: 'story-code-block-overflow-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .overflow-stage {
        width: 20rem;
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
class StoryCodeBlockOverflowShell {
  protected readonly text = 'line one\nline two\nline three\nline four\nline five\nline six';
  protected readonly expanded = signal<boolean>(false);
}

@Component({
  selector: 'story-code-block-inline-shell',
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
class StoryCodeBlockInlineShell {}

const meta: Meta = {
  title: 'Core/Components/Code Block/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-code-block-tests-shell />`,
  moduleMetadata: { imports: [StoryCodeBlockTestsShell] },
});

const renderOverflowShell: Story['render'] = () => ({
  template: `<story-code-block-overflow-shell />`,
  moduleMetadata: { imports: [StoryCodeBlockOverflowShell] },
});

const renderInlineShell: Story['render'] = () => ({
  template: `<story-code-block-inline-shell />`,
  moduleMetadata: { imports: [StoryCodeBlockInlineShell] },
});

export const RendersDefaultVariantAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.getAttribute('data-variant')).toBe('block');
  },
};

export const OmitsOptionalBooleanHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.getAttribute('data-tone')).toBeNull();
    await expect(host.getAttribute('data-wrap')).toBeNull();
    await expect(host.getAttribute('data-has-ellipsis')).toBeNull();
    await expect(host.getAttribute('data-expanded')).toBeNull();
    await expect(host.getAttribute('data-overflowing')).toBeNull();
    await expect(host.getAttribute('data-copied')).toBeNull();
    await expect(host.getAttribute('data-allow-copy')).toBeNull();
    await expect(host.getAttribute('data-has-header')).toBeNull();
  },
};

export const ReflectsVariantInputOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-variant-inline'));

    await waitFor(() => expect(host.getAttribute('data-variant')).toBe('inline'));
  },
};

export const OmitsDataToneWhenNoneSetsForOtherTones: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.getAttribute('data-tone')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-tone-token'));

    await waitFor(() => expect(host.getAttribute('data-tone')).toBe('token'));
  },
};

export const SetsDataWrapWhenWrapTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-wrap-on'));

    await waitFor(() => expect(host.getAttribute('data-wrap')).toBe(''));
  },
};

export const SetsDataAllowCopyWhenAllowCopyTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

    await waitFor(() => expect(host.getAttribute('data-allow-copy')).toBe(''));
  },
};

export const SetsDataHasEllipsisWhenEllipsisAtGreaterThanZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-ellipsis-4'));

    await waitFor(() => expect(host.getAttribute('data-has-ellipsis')).toBe(''));
  },
};

export const SetsDataExpandedWhenExpandedTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-expanded-on'));

    await waitFor(() => expect(host.getAttribute('data-expanded')).toBe(''));
  },
};

export const SetsDataHasHeaderWhenHeaderLabelProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-header-label-set'));

    await waitFor(() => expect(host.getAttribute('data-has-header')).toBe(''));
  },
};

export const RendersTextInsidePreCodeForBlockVariant: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await waitFor(() => {
      const code = host.querySelector('pre code');

      expect(code?.textContent).toBe('const greeting = "hi";');
    });
  },
};

export const DoesNotRenderInlineBranchInBlockVariant: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.querySelector('code.inline')).toBeNull();
  },
};

export const UpdatesRenderedTextWhenTextInputChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-text-update'));

    await waitFor(() => {
      const code = host.querySelector('pre code');

      expect(code?.textContent).toBe('let x = 1;');
    });
  },
};

export const DoesNotRenderHeaderWhenHeaderLabelUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.querySelector('.header')).toBeNull();
  },
};

export const RendersHeaderLabelText: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-header-label-set'));

    await waitFor(() => {
      const labelText = host.querySelector('.header .header-label-text');

      expect(labelText?.textContent?.trim()).toBe('app.tsx');
    });
  },
};

export const RendersHeaderIconOnlyWhenHeaderIconSet: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-header-label-set'));

    await waitFor(() => expect(host.querySelector('.header')).not.toBeNull());
    await expect(host.querySelector('.header org-icon')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-header-icon-set'));

    await waitFor(() => expect(host.querySelector('.header org-icon')).not.toBeNull());
  },
};

export const TreatsNullHeaderLabelAsUndefined: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-header-label-null'));

    await waitFor(() => expect(host.getAttribute('data-has-header')).toBeNull());
    await expect(host.querySelector('.header')).toBeNull();
  },
};

export const DoesNotRenderCopyButtonWhenAllowCopyFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.querySelector('.copy')).toBeNull();
  },
};

export const RendersCopyButtonInsideHeaderWhenAllowCopyAndHeaderLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));
    await userEvent.click(canvas.getByTestId('ctl-header-label-set'));

    await waitFor(() => {
      const headerCopy = host.querySelector('.header .copy');

      expect(headerCopy).not.toBeNull();
      expect(headerCopy?.classList.contains('floating')).toBe(false);
    });
  },
};

export const RendersFloatingCopyButtonWhenAllowCopyAndNoHeader: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

    await waitFor(() => {
      const copy = host.querySelector('.copy');

      expect(copy).not.toBeNull();
      expect(copy?.classList.contains('floating')).toBe(true);
    });
    await expect(host.querySelector('.header')).toBeNull();
  },
};

export const DoesNotRenderCopyButtonInInlineVariantEvenWithAllowCopy: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.querySelector('.copy')).toBeNull();
  },
};

export const EmitsCopiedAndFlipsDataCopiedOnSuccessfulCopy: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');
    const readout = await canvas.findByTestId('readout');
    const restoreExecCommand = stubExecCommand(true);

    try {
      await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

      const copyButton = await waitFor(() => {
        const button = host.querySelector('.copy button') as HTMLButtonElement | null;

        expect(button).not.toBeNull();

        return button as HTMLButtonElement;
      });

      await userEvent.click(copyButton);

      await waitFor(() => {
        expect(readout.textContent).toContain('copiedCount=1');
        expect(readout.textContent).toContain('lastCopiedText=const greeting = "hi";');
        expect(host.getAttribute('data-copied')).toBe('');
      });

      await waitFor(() => expect(host.getAttribute('data-copied')).toBeNull(), { timeout: 2500 });
    } finally {
      restoreExecCommand();
    }
  },
};

export const DoesNotEmitCopiedWhenClipboardWriteFails: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');
    const readout = await canvas.findByTestId('readout');
    const restoreExecCommand = stubExecCommand(false);

    try {
      await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

      const copyButton = await waitFor(() => {
        const button = host.querySelector('.copy button') as HTMLButtonElement | null;

        expect(button).not.toBeNull();

        return button as HTMLButtonElement;
      });

      await userEvent.click(copyButton);

      await expect(readout.textContent).toContain('copiedCount=0');
      await expect(host.getAttribute('data-copied')).toBeNull();
    } finally {
      restoreExecCommand();
    }
  },
};

export const RestartsConfirmWindowWhenCopyIsClickedAgain: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');
    const restoreExecCommand = stubExecCommand(true);

    try {
      await userEvent.click(canvas.getByTestId('ctl-allow-copy-on'));

      const copyButton = await waitFor(() => {
        const button = host.querySelector('.copy button') as HTMLButtonElement | null;

        expect(button).not.toBeNull();

        return button as HTMLButtonElement;
      });

      await userEvent.click(copyButton);
      await waitFor(() => expect(host.getAttribute('data-copied')).toBe(''));

      // wait near the end of the first confirm window then click again to restart it
      await wait(900);
      await userEvent.click(copyButton);

      // we are now past the original 1200ms window (>1300ms since first click) — the attribute
      // must still be set, which only happens if the first timer was cleared
      await wait(500);
      await expect(host.getAttribute('data-copied')).toBe('');

      // and once the second window elapses the attribute clears
      await waitFor(() => expect(host.getAttribute('data-copied')).toBeNull(), { timeout: 2500 });
    } finally {
      restoreExecCommand();
    }
  },
};

export const DoesNotRenderShowMoreWhenNotOverflowing: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await userEvent.click(canvas.getByTestId('ctl-ellipsis-4'));

    // give the resize observer / measurement effect a tick to run
    await wait(50);

    await expect(host.querySelector('.show-more')).toBeNull();
  },
};

export const RendersShowMoreWhenOverflowing: Story = {
  render: renderOverflowShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await waitFor(() => expect(host.getAttribute('data-overflowing')).toBe(''));
    await waitFor(() => expect(host.querySelector('.show-more')).not.toBeNull());
  },
};

export const FlipsExpandedAndHidesShowMoreOnClick: Story = {
  render: renderOverflowShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');
    const readout = await canvas.findByTestId('readout');

    const showMoreButton = await waitFor(() => {
      const button = host.querySelector('.show-more button') as HTMLButtonElement | null;

      expect(button).not.toBeNull();

      return button as HTMLButtonElement;
    });

    await expect(showMoreButton.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(showMoreButton);

    await waitFor(() => {
      expect(readout.textContent).toContain('expanded=true');
      expect(host.getAttribute('data-expanded')).toBe('');
      expect(host.querySelector('.show-more')).toBeNull();
    });
  },
};

export const RendersInlineCodeElementForInlineVariant: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    const inlineCode = host.querySelector('code.inline');

    await expect(inlineCode?.textContent).toBe('--color-primary');
  },
};

export const DoesNotRenderBlockChromeForInlineVariant: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('block');

    await expect(host.querySelector('pre')).toBeNull();
    await expect(host.querySelector('.header')).toBeNull();
    await expect(host.querySelector('.copy')).toBeNull();
    await expect(host.querySelector('.body')).toBeNull();
  },
};
