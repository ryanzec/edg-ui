import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Dialog, type DialogPosition } from './dialog';
import { DialogBrainDirective } from './dialog-brain';
import { DialogContent } from './dialog-content';
import { DialogFooter, type DialogFooterAlignment } from './dialog-footer';
import { DialogHeader } from './dialog-header';
import { DialogIcon, type DialogIconColor } from './dialog-icon';

type StoryDialogOverlayData = {
  title: string;
  message: string;
};

@Component({
  selector: 'story-dialog-overlay-content',
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
class StoryDialogOverlayContent {
  protected readonly data = inject<StoryDialogOverlayData>(DIALOG_DATA, { optional: true }) ?? {
    title: 'Overlay Title',
    message: 'overlay message',
  };
}

@Component({
  selector: 'story-dialog-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'data-testid': 'shell' },
  hostDirectives: [
    {
      directive: DialogBrainDirective,
      inputs: ['hasBackdrop', 'enableCloseOnClickOutside', 'enableEscapeKey', 'showCloseIcon'],
      outputs: ['closed'],
    },
  ],
  template: `
    <button type="button" data-testid="ctl-open" (click)="openDialog()">open</button>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-close-programmatic" (click)="brain.closeDialog()">
        close-programmatic
      </button>
      <button type="button" data-testid="ctl-set-escape-off" (click)="brain.setEnableEscapeKey(false)">
        set-escape-off
      </button>
      <button type="button" data-testid="ctl-set-escape-on" (click)="brain.setEnableEscapeKey(true)">
        set-escape-on
      </button>
      <button type="button" data-testid="ctl-set-icon-off" (click)="brain.setShowCloseIcon(false)">set-icon-off</button>
      <button type="button" data-testid="ctl-set-icon-on" (click)="brain.setShowCloseIcon(true)">set-icon-on</button>
    </div>
  `,
})
class StoryDialogTestsShell {
  protected readonly brain = inject(DialogBrainDirective, { self: true });

  protected readonly closedCount = signal<number>(0);

  constructor() {
    this.brain.closed.subscribe(() => this.closedCount.update((value) => value + 1));
  }

  protected readout(): string {
    return `closedCount=${this.closedCount()}`;
  }

  protected openDialog(): void {
    this.brain.openDialog(StoryDialogOverlayContent, {
      title: 'Overlay Title',
      message: 'overlay message',
    });
  }
}

@Component({
  selector: 'story-dialog-inline-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-position-top" (click)="position.set('top')">position-top</button>
      <button type="button" data-testid="ctl-position-bottom" (click)="position.set('bottom')">position-bottom</button>
      <button type="button" data-testid="ctl-position-left" (click)="position.set('left')">position-left</button>
      <button type="button" data-testid="ctl-position-right" (click)="position.set('right')">position-right</button>
      <button type="button" data-testid="ctl-rounded-off" (click)="hasRoundedCorners.set(false)">rounded-off</button>
      <button type="button" data-testid="ctl-rounded-on" (click)="hasRoundedCorners.set(true)">rounded-on</button>
      <button type="button" data-testid="ctl-title-updated" (click)="title.set('Updated Title')">title-updated</button>
      <button type="button" data-testid="ctl-content-text-updated" (click)="contentText.set('Updated Content')">
        content-text-updated
      </button>
      <button type="button" data-testid="ctl-footer-alignment-start" (click)="footerAlignment.set('start')">
        footer-alignment-start
      </button>
      <button type="button" data-testid="ctl-footer-alignment-center" (click)="footerAlignment.set('center')">
        footer-alignment-center
      </button>
      <button type="button" data-testid="ctl-icon-color-danger" (click)="iconColor.set('danger')">
        icon-color-danger
      </button>
      <button type="button" data-testid="ctl-icon-color-warning" (click)="iconColor.set('warning')">
        icon-color-warning
      </button>
      <button type="button" data-testid="ctl-icon-color-safe" (click)="iconColor.set('safe')">icon-color-safe</button>
    </div>
  `,
})
class StoryDialogInlineShell {
  protected readonly position = signal<DialogPosition>('center');
  protected readonly hasRoundedCorners = signal<boolean>(true);
  protected readonly title = signal<string>('Inline Title');
  protected readonly contentText = signal<string>('Inline content message');
  protected readonly footerText = signal<string>('Footer Text');
  protected readonly footerAlignment = signal<DialogFooterAlignment>('end');
  protected readonly iconColor = signal<DialogIconColor>('info');
}

const meta: Meta = {
  title: 'Core/Components/Dialog/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderInlineShell: Story['render'] = () => ({
  template: `<story-dialog-inline-shell />`,
  moduleMetadata: { imports: [StoryDialogInlineShell] },
});

const renderShell: Story['render'] = () => ({
  template: `<story-dialog-tests-shell />`,
  moduleMetadata: { imports: [StoryDialogTestsShell] },
});

const renderShellNoBackdrop: Story['render'] = () => ({
  template: `<story-dialog-tests-shell [hasBackdrop]="false" />`,
  moduleMetadata: { imports: [StoryDialogTestsShell] },
});

const renderShellCloseOnClickOutside: Story['render'] = () => ({
  template: `<story-dialog-tests-shell [enableCloseOnClickOutside]="true" />`,
  moduleMetadata: { imports: [StoryDialogTestsShell] },
});

const renderShellEscapeDisabled: Story['render'] = () => ({
  template: `<story-dialog-tests-shell [enableEscapeKey]="false" />`,
  moduleMetadata: { imports: [StoryDialogTestsShell] },
});

const renderShellNoCloseIcon: Story['render'] = () => ({
  template: `<story-dialog-tests-shell [showCloseIcon]="false" />`,
  moduleMetadata: { imports: [StoryDialogTestsShell] },
});

/** queries the active cdk overlay pane (dialog overlays render outside the canvas) */
const queryOverlayPane = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-pane');

/** queries the active cdk overlay backdrop element */
const queryOverlayBackdrop = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-backdrop');

/** waits for the overlay pane to appear and returns it */
const waitForOverlayPane = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPane()).not.toBeNull());

  return queryOverlayPane() as HTMLElement;
};

/** waits for the overlay pane to be detached from the dom */
const waitForOverlayDetached = async (): Promise<void> => {
  await waitFor(() => expect(queryOverlayPane()).toBeNull());
};

// dialog (panel) host attributes

export const RendersDefaultPositionAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('dialog');

    await expect(host.getAttribute('data-position')).toBe('center');
  },
};

export const ReflectsCustomPositionAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('dialog');

    await userEvent.click(canvas.getByTestId('ctl-position-top'));
    await waitFor(() => expect(host.getAttribute('data-position')).toBe('top'));

    await userEvent.click(canvas.getByTestId('ctl-position-bottom'));
    await waitFor(() => expect(host.getAttribute('data-position')).toBe('bottom'));

    await userEvent.click(canvas.getByTestId('ctl-position-left'));
    await waitFor(() => expect(host.getAttribute('data-position')).toBe('left'));

    await userEvent.click(canvas.getByTestId('ctl-position-right'));
    await waitFor(() => expect(host.getAttribute('data-position')).toBe('right'));
  },
};

export const RendersRoundedCornersAttributeByDefault: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('dialog');

    await expect(host.getAttribute('data-rounded')).toBe('');
  },
};

export const OmitsRoundedCornersAttributeWhenDisabled: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('dialog');

    await userEvent.click(canvas.getByTestId('ctl-rounded-off'));

    await waitFor(() => expect(host.getAttribute('data-rounded')).toBeNull());
  },
};

// dialog header

export const RendersDialogHeaderTitleText: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('dialog-header');

    await expect(header.querySelector('h2.title')?.textContent?.trim()).toBe('Inline Title');

    await userEvent.click(canvas.getByTestId('ctl-title-updated'));

    await waitFor(() => expect(header.querySelector('h2.title')?.textContent?.trim()).toBe('Updated Title'));
  },
};

export const RendersProjectedIconInDialogHeader: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = await canvas.findByTestId('dialog-header');

    await expect(header.querySelector('[data-testid="dialog-icon"]')).not.toBeNull();
    await expect(header.querySelector('[data-testid="dialog-icon-glyph"]')?.textContent?.trim()).toBe('i');
  },
};

// dialog footer

export const RendersDefaultFooterAlignmentAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('dialog-footer');

    await expect(footer.getAttribute('data-alignment')).toBe('end');
  },
};

export const ReflectsCustomFooterAlignmentAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = await canvas.findByTestId('dialog-footer');

    await userEvent.click(canvas.getByTestId('ctl-footer-alignment-start'));
    await waitFor(() => expect(footer.getAttribute('data-alignment')).toBe('start'));

    await userEvent.click(canvas.getByTestId('ctl-footer-alignment-center'));
    await waitFor(() => expect(footer.getAttribute('data-alignment')).toBe('center'));
  },
};

// dialog icon

export const RendersDefaultIconColorAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('dialog-icon');

    await expect(icon.getAttribute('data-color')).toBe('info');
  },
};

export const ReflectsCustomIconColorAttribute: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('dialog-icon');

    await userEvent.click(canvas.getByTestId('ctl-icon-color-danger'));
    await waitFor(() => expect(icon.getAttribute('data-color')).toBe('danger'));

    await userEvent.click(canvas.getByTestId('ctl-icon-color-warning'));
    await waitFor(() => expect(icon.getAttribute('data-color')).toBe('warning'));

    await userEvent.click(canvas.getByTestId('ctl-icon-color-safe'));
    await waitFor(() => expect(icon.getAttribute('data-color')).toBe('safe'));
  },
};

// dialog content

export const RendersProjectedDialogContent: Story = {
  render: renderInlineShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = await canvas.findByTestId('dialog-content');

    await expect(content.querySelector('[data-testid="dialog-content-text"]')?.textContent?.trim()).toBe(
      'Inline content message'
    );

    await userEvent.click(canvas.getByTestId('ctl-content-text-updated'));

    await waitFor(() =>
      expect(content.querySelector('[data-testid="dialog-content-text"]')?.textContent?.trim()).toBe('Updated Content')
    );
  },
};

// dialog brain — opening / overlay rendering

export const OpensDialogInOverlayWhenTriggered: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(queryOverlayPane()).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    await expect(pane.querySelector('[data-testid="overlay-dialog"]')).not.toBeNull();
    await expect(pane.querySelector('[data-testid="overlay-dialog-message"]')?.textContent?.trim()).toBe(
      'overlay message'
    );
  },
};

export const AppliesRoleDialogAndAriaModalOnBrainHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    const overlayBrainHost = pane.querySelector('story-dialog-overlay-content');

    await expect(overlayBrainHost?.getAttribute('role')).toBe('dialog');
    await expect(overlayBrainHost?.getAttribute('aria-modal')).toBe('true');
  },
};

export const WiresDialogHeaderIdToBrainAriaLabelledBy: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    const overlayBrainHost = pane.querySelector('story-dialog-overlay-content');
    const header = pane.querySelector('[data-testid="overlay-dialog-header"]');

    const labelledBy = overlayBrainHost?.getAttribute('aria-labelledby');
    const headerId = header?.getAttribute('id');

    await expect(labelledBy).toBeTruthy();
    await expect(headerId).toBeTruthy();
    await expect(headerId).toBe(labelledBy);
  },
};

// dialog brain — close button visibility / enablement

export const RendersCloseButtonInOverlayByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    const closeButton = pane.querySelector('org-dialog-close-button org-button');

    await expect(closeButton).not.toBeNull();
  },
};

export const HidesCloseButtonInOverlayWhenShowCloseIconIsFalse: Story = {
  render: renderShellNoCloseIcon,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    const closeButton = pane.querySelector('org-dialog-close-button org-button');

    await expect(closeButton).toBeNull();
  },
};

export const DisablesCloseButtonWhenEnableEscapeKeyIsFalseAtOpenTime: Story = {
  render: renderShellEscapeDisabled,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();

    await waitFor(() => {
      const closeButton = pane.querySelector('org-dialog-close-button');
      expect(closeButton?.getAttribute('data-disabled')).toBe('');
    });
  },
};

// dialog brain — closing behavior

export const ClosesDialogWhenCloseButtonClicked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();
    const closeButton = pane.querySelector('org-dialog-close-button button') as HTMLButtonElement;

    await userEvent.click(closeButton);

    await waitForOverlayDetached();
  },
};

export const EmitsClosedOutputWhenDialogCloses: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('closedCount=0');

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await userEvent.click(canvas.getByTestId('ctl-close-programmatic'));

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
  },
};

export const ClosesDialogProgrammaticallyViaBrain: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await userEvent.click(canvas.getByTestId('ctl-close-programmatic'));

    await waitForOverlayDetached();
  },
};

export const ClosesDialogOnEscapeKeyByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await userEvent.keyboard('{Escape}');

    await waitForOverlayDetached();
  },
};

export const DoesNotCloseOnEscapeWhenEnableEscapeKeyIsFalse: Story = {
  render: renderShellEscapeDisabled,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await userEvent.keyboard('{Escape}');

    // give cdk a tick to potentially close, then assert it is still open
    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(queryOverlayPane()).not.toBeNull();
  },
};

export const DoesNotCloseOnEscapeWhenEnableCloseOnClickOutsideIsTrue: Story = {
  render: renderShellCloseOnClickOutside,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await userEvent.keyboard('{Escape}');

    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(queryOverlayPane()).not.toBeNull();
  },
};

// dialog brain — backdrop behavior

export const RendersBackdropByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await waitFor(() => expect(queryOverlayBackdrop()).not.toBeNull());
  },
};

export const DoesNotRenderBackdropWhenHasBackdropIsFalse: Story = {
  render: renderShellNoBackdrop,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    await expect(queryOverlayBackdrop()).toBeNull();
  },
};

export const ClosesOnBackdropClickWhenEnableCloseOnClickOutsideIsTrue: Story = {
  render: renderShellCloseOnClickOutside,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    const backdrop = queryOverlayBackdrop() as HTMLElement;
    await userEvent.click(backdrop);

    await waitForOverlayDetached();
  },
};

export const DoesNotCloseOnBackdropClickWhenEnableCloseOnClickOutsideIsFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    await waitForOverlayPane();

    const backdrop = queryOverlayBackdrop() as HTMLElement;
    await userEvent.click(backdrop);

    await new Promise((resolve) => setTimeout(resolve, 50));
    await expect(queryOverlayPane()).not.toBeNull();
  },
};

// dialog brain — dynamic close-state controls

export const DynamicallyDisablesCloseButtonViaSetEnableEscapeKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();

    await waitFor(() => {
      const closeButton = pane.querySelector('org-dialog-close-button');
      expect(closeButton?.getAttribute('data-disabled')).toBeNull();
    });

    await userEvent.click(canvas.getByTestId('ctl-set-escape-off'));

    await waitFor(() => {
      const closeButton = pane.querySelector('org-dialog-close-button');
      expect(closeButton?.getAttribute('data-disabled')).toBe('');
    });

    await userEvent.click(canvas.getByTestId('ctl-set-escape-on'));

    await waitFor(() => {
      const closeButton = pane.querySelector('org-dialog-close-button');
      expect(closeButton?.getAttribute('data-disabled')).toBeNull();
    });
  },
};

export const DynamicallyHidesCloseButtonViaSetShowCloseIcon: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));

    const pane = await waitForOverlayPane();

    await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-set-icon-off'));

    await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-set-icon-on'));

    await waitFor(() => expect(pane.querySelector('org-dialog-close-button org-button')).not.toBeNull());
  },
};
