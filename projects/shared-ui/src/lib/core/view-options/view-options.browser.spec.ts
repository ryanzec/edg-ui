import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { ViewOptions, type ViewField } from './view-options';

const buildFields = (): ViewField[] => [
  { name: 'name', label: 'Name', enabled: true, locked: true, iconName: 'at-sign' },
  { name: 'email', label: 'Email', enabled: true, iconName: 'at-sign' },
  { name: 'role', label: 'Role', enabled: true, iconName: 'shield' },
  { name: 'status', label: 'Status', enabled: false, iconName: 'circle' },
];

@Component({
  selector: 'test-view-options-default-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  template: `
    <org-view-options [(fields)]="fields" />
    <pre data-testid="view-options-readout">{{ readout() }}</pre>
  `,
})
class ViewOptionsDefaultHost {
  public readonly fields = signal<ViewField[]>(buildFields());

  protected readonly readout = (): string =>
    this.fields()
      .map((field) => `${field.name}:${field.enabled ? '1' : '0'}${field.locked ? '!' : ''}`)
      .join(',');
}

@Component({
  selector: 'test-view-options-labels-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  template: ` <org-view-options [(fields)]="fields" [panelLabel]="panelLabel()" [sectionLabel]="sectionLabel()" /> `,
})
class ViewOptionsLabelsHost {
  public readonly fields = signal<ViewField[]>(buildFields());
  public readonly panelLabel = signal<string>('Customize view');
  public readonly sectionLabel = signal<string>('Columns');
}

@Component({
  selector: 'test-view-options-closed-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  template: `
    <org-view-options [(fields)]="fields" [closable]="true" (closed)="onClose()" />
    <pre data-testid="view-options-closed-readout">{{ readout() }}</pre>
  `,
})
class ViewOptionsClosedHost {
  public readonly fields = signal<ViewField[]>(buildFields());
  public readonly closeCount = signal<number>(0);

  protected readonly readout = (): string => `closeCount=${this.closeCount()}`;

  protected onClose(): void {
    this.closeCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-view-options-closed-not-closable-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ViewOptions],
  host: { class: 'block' },
  template: `<org-view-options [(fields)]="fields" (closed)="onClose()" />`,
})
class ViewOptionsClosedNotClosableHost {
  public readonly fields = signal<ViewField[]>(buildFields());

  protected onClose(): void {
    // intentionally empty — present only to bind the closed output without marking the panel closable
  }
}

describe('ViewOptions (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  const queryHost = (fixture: ComponentFixture<unknown>): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector('org-view-options') as HTMLElement;

  const queryAll = (fixture: ComponentFixture<unknown>, testId: string): HTMLElement[] =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll(`[data-testid="${testId}"]`));

  describe('panel host a11y', () => {
    it('exposes the region role on the host', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      expect(queryHost(fixture).getAttribute('role')).toBe('region');
    });

    it('renders the default panel label', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const host = queryHost(fixture);

      expect(host.getAttribute('aria-label')).toBe('View options');
      expect(host.textContent).toContain('View options');
    });

    it('applies a custom panel label', async () => {
      const fixture = createFixture(ViewOptionsLabelsHost);
      await flush(fixture);

      const host = queryHost(fixture);

      expect(host.getAttribute('aria-label')).toBe('Customize view');
      expect(host.textContent).toContain('Customize view');
    });
  });

  describe('field-selection section a11y', () => {
    const querySection = (fixture: ComponentFixture<unknown>): HTMLElement =>
      (fixture.nativeElement as HTMLElement).querySelector('org-view-options-field-selection') as HTMLElement;

    it('exposes the group role on the section', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      expect(querySection(fixture).getAttribute('role')).toBe('group');
    });

    it('renders the default section label', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const section = querySection(fixture);

      expect(section.getAttribute('aria-label')).toBe('Fields');
      expect(section.textContent).toContain('Fields');
    });

    it('applies a custom section label', async () => {
      const fixture = createFixture(ViewOptionsLabelsHost);
      await flush(fixture);

      const section = querySection(fixture);

      expect(section.getAttribute('aria-label')).toBe('Columns');
      expect(section.textContent).toContain('Columns');
    });
  });

  describe('close button', () => {
    it('hides the close button when closable is false', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      expect(queryAll(fixture, 'view-options-close-button').length).toBe(0);
    });

    it('shows the close button when closable is true', async () => {
      const fixture = createFixture(ViewOptionsClosedHost);
      await flush(fixture);

      expect(queryAll(fixture, 'view-options-close-button').length).toBe(1);
    });

    it('hides the close button when closed is bound but closable is false', async () => {
      const fixture = createFixture(ViewOptionsClosedNotClosableHost);
      await flush(fixture);

      expect(queryAll(fixture, 'view-options-close-button').length).toBe(0);
    });

    it('emits closed on each click', async () => {
      const fixture = createFixture(ViewOptionsClosedHost);
      const closeButton = queryByTestId(fixture, 'view-options-close-button');
      const readout = queryByTestId(fixture, 'view-options-closed-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('closeCount=0');

      await userEvent.click(closeButton);
      await waitFor(() => expect(readout.textContent).toBe('closeCount=1'));

      await userEvent.click(closeButton);
      await waitFor(() => expect(readout.textContent).toBe('closeCount=2'));
    });

    it('applies an aria-label on the close button', async () => {
      const fixture = createFixture(ViewOptionsClosedHost);
      const closeButton = queryByTestId(fixture, 'view-options-close-button');

      await flush(fixture);

      expect(closeButton.getAttribute('aria-label')).toBe('Close view options');
    });
  });

  describe('count tag & live announcement', () => {
    it('shows the initial enabled-over-total count', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const countTag = queryByTestId(fixture, 'view-options-field-selection-count');

      await flush(fixture);

      expect(countTag.textContent?.trim()).toBe('3/4');
    });

    it('updates the count when a toggle is flipped', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const countTag = queryByTestId(fixture, 'view-options-field-selection-count');

      await flush(fixture);
      expect(countTag.textContent?.trim()).toBe('3/4');

      // the toggle is presentational (pointer-events: none); the row body owns the click, so a real
      // user clicking the toggle area triggers the row-body handler. order: name, email, role, status
      const bodies = queryAll(fixture, 'view-options-field-row-body');
      await userEvent.click(bodies[3]);
      await waitFor(() => expect(countTag.textContent?.trim()).toBe('4/4'));

      await userEvent.click(bodies[2]);
      await waitFor(() => expect(countTag.textContent?.trim()).toBe('3/4'));
    });

    it('updates the live announcement when a toggle is flipped', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const liveSpan = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]') as HTMLElement;

      await flush(fixture);
      expect(liveSpan.textContent?.trim()).toBe('3 of 4 fields shown');

      // the toggle is presentational (pointer-events: none); the row body owns the click
      const bodies = queryAll(fixture, 'view-options-field-row-body');
      await userEvent.click(bodies[3]);

      await waitFor(() => expect(liveSpan.textContent?.trim()).toBe('4 of 4 fields shown'));
    });
  });

  describe('field row toggling', () => {
    it('flips the field and the toggle aria-checked when the toggle area is clicked', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      // toggles render on unlocked rows: [email, role, status]; the switch is presentational
      // (pointer-events: none) and reflects state via aria-checked while the row body owns the click
      const statusSwitch = queryAll(fixture, 'view-options-field-row-toggle')[2].querySelector('[role="switch"]');
      expect(statusSwitch?.getAttribute('aria-checked')).toBe('false');

      const bodies = queryAll(fixture, 'view-options-field-row-body');
      await userEvent.click(bodies[3]);

      await waitFor(() => {
        expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1');
        expect(statusSwitch?.getAttribute('aria-checked')).toBe('true');
      });
    });

    it('toggles the field when the row body is clicked', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const bodies = queryAll(fixture, 'view-options-field-row-body');
      await userEvent.click(bodies[3]);

      await waitFor(() => expect(readout.textContent).toBe('name:1!,email:1,role:1,status:1'));
    });

    it('does not toggle a locked row', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const lockIcons = queryAll(fixture, 'view-options-field-row-lock-icon');
      expect(lockIcons.length).toBe(1);

      await userEvent.click(lockIcons[0]);
      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const bodies = queryAll(fixture, 'view-options-field-row-body');
      await userEvent.click(bodies[0]);
      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
    });
  });

  describe('field row structure / a11y', () => {
    it('shows the lock icon and hides the toggle on a locked row', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('org-view-options-field-row');

      const lockedRow = rows[0] as HTMLElement;
      expect(lockedRow.getAttribute('data-locked')).toBe('');
      expect(lockedRow.querySelector('[data-testid="view-options-field-row-lock-icon"]')).not.toBeNull();
      expect(lockedRow.querySelector('[data-testid="view-options-field-row-toggle"]')).toBeNull();

      const unlockedRow = rows[1] as HTMLElement;
      expect(unlockedRow.getAttribute('data-locked')).toBeNull();
      expect(unlockedRow.querySelector('[data-testid="view-options-field-row-lock-icon"]')).toBeNull();
      expect(unlockedRow.querySelector('[data-testid="view-options-field-row-toggle"]')).not.toBeNull();
    });

    it('gives every row a focusable drag handle', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('org-view-options-field-row');
      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');

      expect(dragHandles.length).toBe(rows.length);

      for (const handle of dragHandles) {
        expect(handle.tagName).toBe('BUTTON');
      }
    });

    it('includes the field label in the drag handle aria-label', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');

      expect(dragHandles[0].getAttribute('aria-label')).toBe('Reorder Name');
      expect(dragHandles[1].getAttribute('aria-label')).toBe('Reorder Email');
      expect(dragHandles[2].getAttribute('aria-label')).toBe('Reorder Role');
      expect(dragHandles[3].getAttribute('aria-label')).toBe('Reorder Status');
    });
  });

  describe('keyboard reorder', () => {
    it('moves a row down on ArrowDown', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[1] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => expect(readout.textContent).toBe('name:1!,role:1,email:1,status:0'));
    });

    it('moves a row up on ArrowUp', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[2] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowUp}');

      await waitFor(() => expect(readout.textContent).toBe('name:1!,role:1,email:1,status:0'));
    });

    it('reorders a locked row via keyboard', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[0] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => expect(readout.textContent).toBe('email:1,name:1!,role:1,status:0'));
    });

    it('is a no-op when ArrowUp is pressed on the first row', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[0] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowUp}');
      await flush(fixture);

      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
    });

    it('is a no-op when ArrowDown is pressed on the last row', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[3] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowDown}');
      await flush(fixture);

      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
    });

    it('does not reorder on a non-arrow key', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      const readout = queryByTestId(fixture, 'view-options-readout');

      await flush(fixture);
      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[1] as HTMLButtonElement).focus();
      await userEvent.keyboard('{Enter}');
      await flush(fixture);

      expect(readout.textContent).toBe('name:1!,email:1,role:1,status:0');
    });

    it('returns focus to the drag handle after a reorder', async () => {
      const fixture = createFixture(ViewOptionsDefaultHost);
      await flush(fixture);

      const dragHandles = queryAll(fixture, 'view-options-field-row-drag-handle');
      (dragHandles[1] as HTMLButtonElement).focus();
      await userEvent.keyboard('{ArrowDown}');

      await waitFor(() => expect(document.activeElement?.getAttribute('aria-label')).toBe('Reorder Email'));
    });
  });
});
