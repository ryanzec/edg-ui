import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Dialog } from '@angular/cdk/dialog';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

@Component({
  selector: 'story-unsaved-changes-dialog-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <button type="button" data-testid="ctl-open" (click)="openDialog()">open</button>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class StoryUnsavedChangesDialogTestsShell {
  private readonly _dialog = inject(Dialog);

  protected readonly closedCount = signal<number>(0);
  protected readonly lastResult = signal<string>('none');

  protected readout(): string {
    return `closedCount=${this.closedCount()} lastResult=${this.lastResult()}`;
  }

  protected openDialog(): void {
    const dialogRef = this._dialog.open<boolean>(UnsavedChangesDialog, {
      hasBackdrop: true,
      disableClose: true,
    });

    dialogRef.closed.subscribe((result) => {
      this.closedCount.update((value) => value + 1);
      this.lastResult.set(result === undefined ? 'undefined' : String(result));
    });
  }
}

const meta: Meta = {
  title: 'Core/Components/UnsavedChangesDialog/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-unsaved-changes-dialog-tests-shell />`,
  moduleMetadata: { imports: [StoryUnsavedChangesDialogTestsShell] },
});

/** queries the active cdk overlay pane (dialog overlays render outside the canvas) */
const queryOverlayPane = (): HTMLElement | null => document.body.querySelector('.cdk-overlay-pane');

/** waits for the overlay pane to appear and returns it */
const waitForOverlayPane = async (): Promise<HTMLElement> => {
  await waitFor(() => expect(queryOverlayPane()).not.toBeNull());

  return queryOverlayPane() as HTMLElement;
};

/** waits for the overlay pane to be detached from the dom */
const waitForOverlayDetached = async (): Promise<void> => {
  await waitFor(() => expect(queryOverlayPane()).toBeNull());
};

/** finds an org-button rendered inside the overlay by its label text */
const findOverlayButtonByLabel = (pane: HTMLElement, label: string): HTMLButtonElement => {
  const orgButton = Array.from(pane.querySelectorAll('org-dialog-footer org-button')).find(
    (element) => element.querySelector('span')?.textContent?.trim() === label
  );

  return orgButton?.querySelector('button') as HTMLButtonElement;
};

export const RendersTitle: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    const pane = await waitForOverlayPane();

    await expect(pane.querySelector('h2.title')?.textContent?.trim()).toBe('Unsaved Changes');
  },
};

export const RendersBodyMessage: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    const pane = await waitForOverlayPane();

    const content = pane.querySelector('org-dialog-content');

    await expect(content?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'You have unsaved changes on this page. Leaving will discard them. Do you want to continue?'
    );
  },
};

export const RendersStayAndDiscardButtons: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('ctl-open'));
    const pane = await waitForOverlayPane();

    const buttons = pane.querySelectorAll('org-dialog-footer org-button');

    await expect(buttons.length).toBe(2);
    await expect(buttons[0].querySelector('span')?.textContent?.trim()).toBe('Stay');
    await expect(buttons[1].querySelector('span')?.textContent?.trim()).toBe('Discard Changes');
  },
};

export const ClickingStayClosesWithFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-open'));
    const pane = await waitForOverlayPane();
    const stayButton = findOverlayButtonByLabel(pane, 'Stay');

    await userEvent.click(stayButton);
    await waitForOverlayDetached();

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    await expect(readout.textContent).toContain('lastResult=false');
  },
};

export const ClickingDiscardChangesClosesWithTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-open'));
    const pane = await waitForOverlayPane();
    const discardButton = findOverlayButtonByLabel(pane, 'Discard Changes');

    await userEvent.click(discardButton);
    await waitForOverlayDetached();

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    await expect(readout.textContent).toContain('lastResult=true');
  },
};
