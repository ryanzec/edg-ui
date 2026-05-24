import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import {
  CODE_BLOCK_COPY_CONFIRM_DURATION_MS,
  CodeBlockBrainDirective,
  type CodeBlockVariant,
} from './code-block-brain';

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

@Component({
  selector: 'test-code-block-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlockBrainDirective],
  template: `
    <div
      orgCodeBlockBrain
      #brainDirective="orgCodeBlockBrain"
      [text]="text()"
      [variant]="variant()"
      [allowCopy]="allowCopy()"
      [copyAriaLabel]="copyAriaLabel()"
      [ellipsisAt]="ellipsisAt()"
      [(expanded)]="expanded"
      (copied)="onCopied($event)"
      data-testid="brain-host"
    ></div>
  `,
})
class CodeBlockBrainHost {
  public readonly text = signal<string>('hello world');
  public readonly variant = signal<CodeBlockVariant>('block');
  public readonly allowCopy = signal<boolean>(false);
  public readonly copyAriaLabel = signal<string>('Copy code');
  public readonly ellipsisAt = signal<number>(0);
  public readonly expanded = signal<boolean>(false);

  public onCopied = vi.fn<(text: string) => void>();

  public readonly brainDirective = viewChild.required<CodeBlockBrainDirective>('brainDirective');
}

describe('CodeBlockBrainDirective', () => {
  let fixture: ComponentFixture<CodeBlockBrainHost>;
  let component: CodeBlockBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeBlockBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeBlockBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    restoreExecCommand();
  });

  describe('canCopy', () => {
    it('is false by default because allowCopy defaults to false', () => {
      expect(component.brainDirective().canCopy()).toBe(false);
    });

    it('is true when allowCopy is true and variant is block', async () => {
      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().canCopy()).toBe(true);
    });

    it('is false when allowCopy is true but the variant is inline', async () => {
      component.allowCopy.set(true);
      component.variant.set('inline');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().canCopy()).toBe(false);
    });
  });

  describe('hasEllipsis', () => {
    it('is false when ellipsisAt is 0', () => {
      expect(component.brainDirective().hasEllipsis()).toBe(false);
    });

    it('is true when ellipsisAt is greater than 0', async () => {
      component.ellipsisAt.set(4);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().hasEllipsis()).toBe(true);
    });
  });

  describe('isOverflowing', () => {
    it('is false by default', () => {
      expect(component.brainDirective().isOverflowing()).toBe(false);
    });

    it('reflects the value passed to setOverflowing', async () => {
      component.brainDirective().setOverflowing(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().isOverflowing()).toBe(true);

      component.brainDirective().setOverflowing(false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().isOverflowing()).toBe(false);
    });
  });

  describe('showShowMore', () => {
    beforeEach(async () => {
      component.ellipsisAt.set(4);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('is false when the body is not overflowing', () => {
      expect(component.brainDirective().showShowMore()).toBe(false);
    });

    it('is true when ellipsis is configured, the body is overflowing, and the block is not expanded', async () => {
      component.brainDirective().setOverflowing(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().showShowMore()).toBe(true);
    });

    it('is false once expanded is true even while overflowing', async () => {
      component.brainDirective().setOverflowing(true);
      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().showShowMore()).toBe(false);
    });

    it('is false when ellipsis is disabled even while overflowing', async () => {
      component.ellipsisAt.set(0);
      component.brainDirective().setOverflowing(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().showShowMore()).toBe(false);
    });
  });

  describe('showMoreAriaExpanded', () => {
    it('mirrors the expanded model value', async () => {
      expect(component.brainDirective().showMoreAriaExpanded()).toBe(false);

      component.expanded.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().showMoreAriaExpanded()).toBe(true);
    });
  });

  describe('toggleExpanded', () => {
    it('flips the expanded model value on each call', async () => {
      component.brainDirective().toggleExpanded();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.expanded()).toBe(true);

      component.brainDirective().toggleExpanded();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.expanded()).toBe(false);
    });
  });

  describe('copy', () => {
    beforeEach(async () => {
      component.allowCopy.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('emits copied with the current text when the clipboard write succeeds', () => {
      stubExecCommand(true);

      component.brainDirective().copy();

      expect(component.onCopied).toHaveBeenCalledTimes(1);
      expect(component.onCopied).toHaveBeenCalledWith('hello world');
    });

    it('sets isCopied to true on success and clears it after the confirm window elapses', async () => {
      vi.useFakeTimers();
      stubExecCommand(true);

      component.brainDirective().copy();
      expect(component.brainDirective().isCopied()).toBe(true);

      vi.advanceTimersByTime(CODE_BLOCK_COPY_CONFIRM_DURATION_MS);

      expect(component.brainDirective().isCopied()).toBe(false);
    });

    it('does not emit copied or flip isCopied when canCopy is false', async () => {
      stubExecCommand(true);

      component.allowCopy.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().copy();

      expect(component.brainDirective().isCopied()).toBe(false);
      expect(component.onCopied).not.toHaveBeenCalled();
    });

    it('does not emit copied or flip isCopied when the clipboard write fails', () => {
      stubExecCommand(false);

      component.brainDirective().copy();

      expect(component.brainDirective().isCopied()).toBe(false);
      expect(component.onCopied).not.toHaveBeenCalled();
    });

    it('restarts the confirm window when copy is called again before it elapses', () => {
      vi.useFakeTimers();
      stubExecCommand(true);

      component.brainDirective().copy();
      vi.advanceTimersByTime(CODE_BLOCK_COPY_CONFIRM_DURATION_MS - 100);
      expect(component.brainDirective().isCopied()).toBe(true);

      component.brainDirective().copy();
      // had the original timer not been cleared, it would have fired by now
      vi.advanceTimersByTime(CODE_BLOCK_COPY_CONFIRM_DURATION_MS - 100);
      expect(component.brainDirective().isCopied()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(component.brainDirective().isCopied()).toBe(false);
    });
  });

  describe('destroy cleanup', () => {
    it('clears the pending confirm timeout so it never fires after destroy', () => {
      vi.useFakeTimers();
      stubExecCommand(true);

      component.allowCopy.set(true);
      fixture.detectChanges();

      const brain = component.brainDirective();
      brain.copy();
      expect(brain.isCopied()).toBe(true);

      fixture.destroy();

      // without cleanup, the pending timer would flip isCopied back to false
      vi.advanceTimersByTime(CODE_BLOCK_COPY_CONFIRM_DURATION_MS);

      expect(brain.isCopied()).toBe(true);
    });
  });
});
