import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { delay } from 'es-toolkit';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Dialog, type DialogPosition } from './dialog';
import { DialogBrainDirective } from './dialog-brain';
import { DialogContent } from './dialog-content';
import { DialogFooter, type DialogFooterAlignment } from './dialog-footer';
import { DialogHeader } from './dialog-header';
import { DialogIcon, type DialogIconColor } from './dialog-icon';

type DialogOverlayData = {
  title: string;
  message: string;
};

@Component({
  selector: 'test-dialog-overlay-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, DialogIcon],
  hostDirectives: [DialogBrainDirective],
  template: `
    <org-dialog data-testid="overlay-dialog">
      <org-dialog-header data-testid="overlay-dialog-header" [title]="data.title">
        <org-dialog-icon icon data-testid="overlay-dialog-icon" color="info">
          <span data-testid="overlay-dialog-icon-glyph">i</span>
        </org-dialog-icon>
      </org-dialog-header>
      <org-dialog-content>
        <p data-testid="overlay-dialog-message">{{ data.message }}</p>
      </org-dialog-content>
      <org-dialog-footer data-testid="overlay-dialog-footer">
        <span data-testid="overlay-dialog-footer-text">footer</span>
      </org-dialog-footer>
    </org-dialog>
  `,
})
class DialogOverlayContentHost {
  protected readonly data = inject<DialogOverlayData>(DIALOG_DATA, { optional: true }) ?? {
    title: 'Overlay Title',
    message: 'overlay message',
  };
}

@Component({
  selector: 'test-dialog-trigger-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
  template: `
    <button type="button" data-testid="ctl-open" (click)="open()">open</button>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class DialogTriggerHost {
  public readonly brain = inject(DialogBrainDirective, { self: true });

  protected readonly closedCount = signal<number>(0);

  constructor() {
    this.brain.closed.subscribe(() => this.closedCount.update((value) => value + 1));
  }

  protected readout(): string {
    return `closedCount=${this.closedCount()}`;
  }

  protected open(): void {
    this.brain.openDialog(DialogOverlayContentHost, {
      title: 'Overlay Title',
      message: 'overlay message',
    });
  }
}

@Component({
  selector: 'test-dialog-inline-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogHeader, DialogContent, DialogFooter, DialogIcon],
  host: { class: 'block' },
  template: `
    <org-dialog data-testid="dialog" [position]="position()" [hasRoundedCorners]="hasRoundedCorners()">
      <org-dialog-header data-testid="dialog-header" [title]="title()">
        <org-dialog-icon icon data-testid="dialog-icon" [color]="iconColor()">
          <span data-testid="dialog-icon-glyph">i</span>
        </org-dialog-icon>
      </org-dialog-header>
      <org-dialog-content data-testid="dialog-content">
        <p data-testid="dialog-content-text">{{ contentText() }}</p>
      </org-dialog-content>
      <org-dialog-footer data-testid="dialog-footer" [alignment]="footerAlignment()">
        <span data-testid="dialog-footer-text">{{ footerText() }}</span>
      </org-dialog-footer>
    </org-dialog>
  `,
})
class DialogInlineHost {
  public readonly position = signal<DialogPosition>('center');
  public readonly hasRoundedCorners = signal<boolean>(true);
  public readonly title = signal<string>('Inline Title');
  public readonly contentText = signal<string>('Inline content message');
  public readonly footerText = signal<string>('Footer Text');
  public readonly footerAlignment = signal<DialogFooterAlignment>('end');
  public readonly iconColor = signal<DialogIconColor>('info');
}

type DialogTriggerConfig = {
  hasBackdrop?: boolean;
  enableCloseOnClickOutside?: boolean;
  enableEscapeKey?: boolean;
  showCloseIcon?: boolean;
};

describe('Dialog (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const { queryCdkOverlayPane, queryCdkOverlayBackdrop } = vitestBrowserUtils;

  const createTriggerHost = (config: DialogTriggerConfig = {}): ComponentFixture<DialogTriggerHost> => {
    const fixture = createFixture(DialogTriggerHost);

    if (config.hasBackdrop !== undefined) {
      fixture.componentRef.setInput('hasBackdrop', config.hasBackdrop);
    }

    if (config.enableCloseOnClickOutside !== undefined) {
      fixture.componentRef.setInput('enableCloseOnClickOutside', config.enableCloseOnClickOutside);
    }

    if (config.enableEscapeKey !== undefined) {
      fixture.componentRef.setInput('enableEscapeKey', config.enableEscapeKey);
    }

    if (config.showCloseIcon !== undefined) {
      fixture.componentRef.setInput('showCloseIcon', config.showCloseIcon);
    }

    return fixture;
  };

  const waitForOverlayPane = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(queryCdkOverlayPane()).not.toBeNull());

    return queryCdkOverlayPane() as HTMLElement;
  };

  const waitForOverlayDetached = async (): Promise<void> => {
    await waitFor(() => expect(queryCdkOverlayPane()).toBeNull());
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay elements left in the body so a stale dialog can't leak into the next test
    document.querySelectorAll('.cdk-overlay-pane, .cdk-overlay-backdrop').forEach((element) => element.remove());
  });

  describe('panel host attributes', () => {
    it('renders the default position attribute', () => {
      const fixture = createFixture(DialogInlineHost);
      const host = queryByTestId(fixture, 'dialog');

      expect(host.getAttribute('data-position')).toBe('center');
    });

    it('reflects custom position attributes', async () => {
      const fixture = createFixture(DialogInlineHost);
      const host = queryByTestId(fixture, 'dialog');

      fixture.componentInstance.position.set('top');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('top');

      fixture.componentInstance.position.set('bottom');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('bottom');

      fixture.componentInstance.position.set('left');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('left');

      fixture.componentInstance.position.set('right');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('right');
    });

    it('renders the rounded-corners attribute by default', () => {
      const fixture = createFixture(DialogInlineHost);
      const host = queryByTestId(fixture, 'dialog');

      expect(host.getAttribute('data-rounded')).toBe('');
    });

    it('omits the rounded-corners attribute when disabled', async () => {
      const fixture = createFixture(DialogInlineHost);
      const host = queryByTestId(fixture, 'dialog');

      fixture.componentInstance.hasRoundedCorners.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-rounded')).toBeNull();
    });
  });

  describe('dialog header', () => {
    it('renders the dialog header title text and reflects updates', async () => {
      const fixture = createFixture(DialogInlineHost);
      const header = queryByTestId(fixture, 'dialog-header');

      expect(header.querySelector('h2.title')?.textContent?.trim()).toBe('Inline Title');

      fixture.componentInstance.title.set('Updated Title');
      await flush(fixture);

      expect(header.querySelector('h2.title')?.textContent?.trim()).toBe('Updated Title');
    });

    it('renders the projected icon in the dialog header', () => {
      const fixture = createFixture(DialogInlineHost);
      const header = queryByTestId(fixture, 'dialog-header');

      expect(header.querySelector('[data-testid="dialog-icon"]')).not.toBeNull();
      expect(header.querySelector('[data-testid="dialog-icon-glyph"]')?.textContent?.trim()).toBe('i');
    });
  });

  describe('dialog footer', () => {
    it('renders the default footer alignment attribute', () => {
      const fixture = createFixture(DialogInlineHost);
      const footer = queryByTestId(fixture, 'dialog-footer');

      expect(footer.getAttribute('data-alignment')).toBe('end');
    });

    it('reflects custom footer alignment attributes', async () => {
      const fixture = createFixture(DialogInlineHost);
      const footer = queryByTestId(fixture, 'dialog-footer');

      fixture.componentInstance.footerAlignment.set('start');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('start');

      fixture.componentInstance.footerAlignment.set('center');
      await flush(fixture);
      expect(footer.getAttribute('data-alignment')).toBe('center');
    });
  });

  describe('dialog icon', () => {
    it('renders the default icon color attribute', () => {
      const fixture = createFixture(DialogInlineHost);
      const icon = queryByTestId(fixture, 'dialog-icon');

      expect(icon.getAttribute('data-color')).toBe('info');
    });

    it('reflects custom icon color attributes', async () => {
      const fixture = createFixture(DialogInlineHost);
      const icon = queryByTestId(fixture, 'dialog-icon');

      fixture.componentInstance.iconColor.set('danger');
      await flush(fixture);
      expect(icon.getAttribute('data-color')).toBe('danger');

      fixture.componentInstance.iconColor.set('warning');
      await flush(fixture);
      expect(icon.getAttribute('data-color')).toBe('warning');

      fixture.componentInstance.iconColor.set('safe');
      await flush(fixture);
      expect(icon.getAttribute('data-color')).toBe('safe');
    });
  });

  describe('dialog content', () => {
    it('renders the projected dialog content and reflects updates', async () => {
      const fixture = createFixture(DialogInlineHost);
      const content = queryByTestId(fixture, 'dialog-content');

      expect(content.querySelector('[data-testid="dialog-content-text"]')?.textContent?.trim()).toBe(
        'Inline content message'
      );

      fixture.componentInstance.contentText.set('Updated Content');
      await flush(fixture);

      expect(content.querySelector('[data-testid="dialog-content-text"]')?.textContent?.trim()).toBe('Updated Content');
    });
  });

  describe('brain — opening / overlay', () => {
    it('opens the dialog in an overlay when triggered', async () => {
      const fixture = createTriggerHost();

      expect(queryCdkOverlayPane()).toBeNull();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      expect(pane.querySelector('[data-testid="overlay-dialog"]')).not.toBeNull();
      expect(pane.querySelector('[data-testid="overlay-dialog-message"]')?.textContent?.trim()).toBe('overlay message');
    });

    it('applies role=dialog and aria-modal on the brain host', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      const overlayBrainHost = pane.querySelector('test-dialog-overlay-content');

      expect(overlayBrainHost?.getAttribute('role')).toBe('dialog');
      expect(overlayBrainHost?.getAttribute('aria-modal')).toBe('true');
    });

    it('wires the dialog header id to the brain aria-labelledby', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      const overlayBrainHost = pane.querySelector('test-dialog-overlay-content');
      const header = pane.querySelector('[data-testid="overlay-dialog-header"]');

      const labelledBy = overlayBrainHost?.getAttribute('aria-labelledby');
      const headerId = header?.getAttribute('id');

      expect(labelledBy).toBeTruthy();
      expect(headerId).toBeTruthy();
      expect(headerId).toBe(labelledBy);
    });
  });

  describe('brain — close button visibility / enablement', () => {
    it('renders the close button in the overlay by default', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      const closeButton = pane.querySelector('org-dialog-close-button org-button');

      expect(closeButton).not.toBeNull();
    });

    it('hides the close button in the overlay when showCloseIcon is false', async () => {
      const fixture = createTriggerHost({ showCloseIcon: false });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      const closeButton = pane.querySelector('org-dialog-close-button org-button');

      expect(closeButton).toBeNull();
    });

    it('disables the close button when enableEscapeKey is false at open time', async () => {
      const fixture = createTriggerHost({ enableEscapeKey: false });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();

      await waitFor(() => {
        const closeButton = pane.querySelector('org-dialog-close-button');
        expect(closeButton?.getAttribute('data-disabled')).toBe('');
      });
    });
  });

  describe('brain — closing behavior', () => {
    it('closes the dialog when the close button is clicked', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();
      const closeButton = pane.querySelector('org-dialog-close-button button') as HTMLButtonElement;

      await userEvent.click(closeButton);

      await waitForOverlayDetached();
    });

    it('emits the closed output when the dialog closes', async () => {
      const fixture = createTriggerHost();
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('closedCount=0');

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      fixture.componentInstance.brain.closeDialog();

      await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    });

    it('closes the dialog programmatically via the brain', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      fixture.componentInstance.brain.closeDialog();

      await waitForOverlayDetached();
    });

    it('closes the dialog on the escape key by default', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      await userEvent.keyboard('{Escape}');

      await waitForOverlayDetached();
    });

    it('does not close on escape when enableEscapeKey is false', async () => {
      const fixture = createTriggerHost({ enableEscapeKey: false });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      await userEvent.keyboard('{Escape}');

      // give cdk a tick to potentially close, then assert it is still open
      await delay(50);
      expect(queryCdkOverlayPane()).not.toBeNull();
    });

    it('closes on escape when enableCloseOnClickOutside is true', async () => {
      const fixture = createTriggerHost({ enableCloseOnClickOutside: true });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      await userEvent.keyboard('{Escape}');

      // with enableCloseOnClickOutside the brain leaves disableClose off and delegates escape closing to cdk,
      // which closes the focus-trapped overlay on escape (the brain's own escape handler returns early here)
      await waitForOverlayDetached();
    });
  });

  describe('brain — backdrop behavior', () => {
    it('renders the backdrop by default', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      await waitFor(() => expect(queryCdkOverlayBackdrop()).not.toBeNull());
    });

    it('does not render the backdrop when hasBackdrop is false', async () => {
      const fixture = createTriggerHost({ hasBackdrop: false });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      expect(queryCdkOverlayBackdrop()).toBeNull();
    });

    it('closes on backdrop click when enableCloseOnClickOutside is true', async () => {
      const fixture = createTriggerHost({ enableCloseOnClickOutside: true });

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      // click a corner of the full-screen backdrop that the centered dialog pane does not cover, so the
      // pointer lands on the backdrop instead of being intercepted by the pane
      const backdrop = queryCdkOverlayBackdrop() as HTMLElement;
      await userEvent.click(backdrop, { position: { x: 5, y: 5 } });

      await waitForOverlayDetached();
    });

    it('does not close on backdrop click when enableCloseOnClickOutside is false', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));
      await waitForOverlayPane();

      const backdrop = queryCdkOverlayBackdrop() as HTMLElement;
      await userEvent.click(backdrop, { position: { x: 5, y: 5 } });

      await delay(50);
      expect(queryCdkOverlayPane()).not.toBeNull();
    });
  });

  describe('brain — dynamic close-state controls', () => {
    it('dynamically disables the close button via setEnableEscapeKey', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();

      await waitFor(() => {
        const closeButton = pane.querySelector('org-dialog-close-button');
        expect(closeButton?.getAttribute('data-disabled')).toBeNull();
      });

      fixture.componentInstance.brain.setEnableEscapeKey(false);

      await waitFor(() => {
        const closeButton = pane.querySelector('org-dialog-close-button');
        expect(closeButton?.getAttribute('data-disabled')).toBe('');
      });

      fixture.componentInstance.brain.setEnableEscapeKey(true);

      await waitFor(() => {
        const closeButton = pane.querySelector('org-dialog-close-button');
        expect(closeButton?.getAttribute('data-disabled')).toBeNull();
      });
    });

    it('dynamically hides the close button via setShowCloseIcon', async () => {
      const fixture = createTriggerHost();

      await userEvent.click(queryByTestId(fixture, 'ctl-open'));

      const pane = await waitForOverlayPane();

      await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).not.toBeNull());

      fixture.componentInstance.brain.setShowCloseIcon(false);

      await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).toBeNull());

      fixture.componentInstance.brain.setShowCloseIcon(true);

      await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).not.toBeNull());
    });
  });
});
