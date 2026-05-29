import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

@Component({
  selector: 'test-unsaved-changes-dialog-trigger-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <button type="button" data-testid="ctl-open" (click)="openDialog()">open</button>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class UnsavedChangesDialogTriggerHost {
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

describe('UnsavedChangesDialog (browser)', () => {
  const { createFixture, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  // the dialog overlay renders on document.body, outside any fixture
  const waitForOverlayPane = async (): Promise<HTMLElement> => {
    await waitFor(() => expect(vitestBrowserUtils.queryCdkOverlayPane()).not.toBeNull());

    return vitestBrowserUtils.queryCdkOverlayPane() as HTMLElement;
  };

  const waitForOverlayDetached = async (): Promise<void> => {
    await waitFor(() => expect(vitestBrowserUtils.queryCdkOverlayPane()).toBeNull());
  };

  const findOverlayButtonByLabel = (pane: HTMLElement, label: string): HTMLButtonElement => {
    const orgButton = Array.from(pane.querySelectorAll('org-dialog-footer org-button')).find(
      (element) => element.querySelector('span')?.textContent?.trim() === label
    );

    return orgButton?.querySelector('button') as HTMLButtonElement;
  };

  beforeEach(setupTestBed);

  afterEach(() => {
    destroyFixture();

    // defensively clear any overlay elements left in the body so a stale dialog can't leak into the next test
    document.querySelectorAll('.cdk-overlay-pane, .cdk-overlay-backdrop').forEach((element) => element.remove());
  });

  it('renders the dialog title', async () => {
    const fixture = createFixture(UnsavedChangesDialogTriggerHost);

    await userEvent.click(queryByTestId(fixture, 'ctl-open'));
    const pane = await waitForOverlayPane();

    expect(pane.querySelector('h2.title')?.textContent?.trim()).toBe('Unsaved Changes');
  });

  it('renders the dialog body message', async () => {
    const fixture = createFixture(UnsavedChangesDialogTriggerHost);

    await userEvent.click(queryByTestId(fixture, 'ctl-open'));
    const pane = await waitForOverlayPane();

    const content = pane.querySelector('org-dialog-content');

    expect(content?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'You have unsaved changes on this page. Leaving will discard them. Do you want to continue?'
    );
  });

  it('renders the stay and discard buttons', async () => {
    const fixture = createFixture(UnsavedChangesDialogTriggerHost);

    await userEvent.click(queryByTestId(fixture, 'ctl-open'));
    const pane = await waitForOverlayPane();

    const buttons = pane.querySelectorAll('org-dialog-footer org-button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].querySelector('span')?.textContent?.trim()).toBe('Stay');
    expect(buttons[1].querySelector('span')?.textContent?.trim()).toBe('Discard Changes');
  });

  it('closes with false when stay is clicked', async () => {
    const fixture = createFixture(UnsavedChangesDialogTriggerHost);
    const readout = queryByTestId(fixture, 'readout');

    await userEvent.click(queryByTestId(fixture, 'ctl-open'));
    const pane = await waitForOverlayPane();
    const stayButton = findOverlayButtonByLabel(pane, 'Stay');

    await userEvent.click(stayButton);
    await waitForOverlayDetached();

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    expect(readout.textContent).toContain('lastResult=false');
  });

  it('closes with true when discard changes is clicked', async () => {
    const fixture = createFixture(UnsavedChangesDialogTriggerHost);
    const readout = queryByTestId(fixture, 'readout');

    await userEvent.click(queryByTestId(fixture, 'ctl-open'));
    const pane = await waitForOverlayPane();
    const discardButton = findOverlayButtonByLabel(pane, 'Discard Changes');

    await userEvent.click(discardButton);
    await waitForOverlayDetached();

    await waitFor(() => expect(readout.textContent).toContain('closedCount=1'));
    expect(readout.textContent).toContain('lastResult=true');
  });
});
