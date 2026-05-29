import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { LastUpdated } from './last-updated';
import { type LastUpdatedFormat, type LastUpdatedState } from './last-updated-brain';

const FIXED_DATE_TIME = DateTime.fromISO('2026-05-02T14:02:00');

@Component({
  selector: 'test-last-updated-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LastUpdated],
  host: { class: 'block' },
  template: `
    <org-last-updated
      data-testid="last-updated"
      [state]="state()"
      [format]="format()"
      [label]="label()"
      [refreshable]="refreshable()"
      [tooltipText]="tooltipText()"
      [dateTime]="dateTime()"
      (refresh)="handleRefresh()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class LastUpdatedHost {
  public readonly state = signal<LastUpdatedState>('fresh');
  public readonly format = signal<LastUpdatedFormat>('absolute');
  public readonly label = signal<string>('Last updated');
  public readonly refreshable = signal<boolean>(false);
  public readonly tooltipText = signal<string | null | undefined>(undefined);
  public readonly dateTime = signal<DateTime>(FIXED_DATE_TIME);

  public readonly refreshCount = signal<number>(0);

  protected readout(): string {
    return `refreshCount=${this.refreshCount()}`;
  }

  protected handleRefresh(): void {
    this.refreshCount.update((value) => value + 1);
  }
}

type LastUpdatedHostConfig = {
  state?: LastUpdatedState;
  format?: LastUpdatedFormat;
  label?: string;
  refreshable?: boolean;
  tooltipText?: string | null;
  dateTime?: DateTime;
};

describe('LastUpdated (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createLastUpdated = (config: LastUpdatedHostConfig = {}): ComponentFixture<LastUpdatedHost> =>
    createFixture(LastUpdatedHost, (instance) => {
      if (config.state !== undefined) {
        instance.state.set(config.state);
      }

      if (config.format !== undefined) {
        instance.format.set(config.format);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }

      if (config.refreshable !== undefined) {
        instance.refreshable.set(config.refreshable);
      }

      if (config.tooltipText !== undefined) {
        instance.tooltipText.set(config.tooltipText);
      }

      if (config.dateTime !== undefined) {
        instance.dateTime.set(config.dateTime);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('renders the default state attribute as fresh', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-state')).toBe('fresh');
    });

    it('renders the default format attribute as absolute', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-format')).toBe('absolute');
    });

    it('exposes role status on the host', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('role')).toBe('status');
    });

    it('reflects the stale state in the host attribute', () => {
      const fixture = createLastUpdated({ state: 'stale' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-state')).toBe('stale');
    });

    it('reflects the error state in the host attribute', () => {
      const fixture = createLastUpdated({ state: 'error' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-state')).toBe('error');
    });

    it('reflects the loading state in the host attribute', () => {
      const fixture = createLastUpdated({ state: 'loading' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-state')).toBe('loading');
    });

    it('reflects the relative format in the host attribute', () => {
      const fixture = createLastUpdated({ format: 'relative' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-format')).toBe('relative');
    });

    it('reflects a custom format as custom in the host attribute', () => {
      const fixture = createLastUpdated({ format: 'yyyy-MM-dd' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('data-format')).toBe('custom');
    });
  });

  describe('aria-label', () => {
    it('uses the loading aria-label when loading', () => {
      const fixture = createLastUpdated({ state: 'loading' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('aria-label')).toBe('loading last updated');
    });

    it('composes label, state, and formatted time when not loading', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.getAttribute('aria-label')).toBe('Last updated (fresh): 5/2/26 2:02 PM');
    });
  });

  describe('pre slot indicator', () => {
    it('renders a safe indicator for the fresh state', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');
      const indicator = host.querySelector('org-indicator.pre');

      expect(indicator).not.toBeNull();
      expect(indicator?.getAttribute('data-color')).toBe('safe');
    });

    it('renders a caution indicator for the stale state', () => {
      const fixture = createLastUpdated({ state: 'stale' });
      const host = queryByTestId(fixture, 'last-updated');
      const indicator = host.querySelector('org-indicator.pre');

      expect(indicator?.getAttribute('data-color')).toBe('caution');
    });

    it('renders a danger indicator for the error state', () => {
      const fixture = createLastUpdated({ state: 'error' });
      const host = queryByTestId(fixture, 'last-updated');
      const indicator = host.querySelector('org-indicator.pre');

      expect(indicator?.getAttribute('data-color')).toBe('danger');
    });
  });

  describe('pre slot spinner and refresh', () => {
    it('renders the spinner and nothing else for the loading state', () => {
      const fixture = createLastUpdated({ state: 'loading' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
      expect(host.querySelector('org-indicator.pre')).toBeNull();
      expect(host.querySelector('org-button.refresh')).toBeNull();
    });

    it('renders the refresh button when refreshable and not loading', () => {
      const fixture = createLastUpdated({ refreshable: true });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-button.refresh')).not.toBeNull();
      expect(host.querySelector('org-indicator.pre')).toBeNull();
      expect(host.querySelector('org-loading-spinner.spinner')).toBeNull();
    });

    it('prefers the spinner over the refresh button when loading and refreshable', () => {
      const fixture = createLastUpdated({ refreshable: true, state: 'loading' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
      expect(host.querySelector('org-button.refresh')).toBeNull();
    });
  });

  describe('label and time rendering', () => {
    it('renders the label text', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');
      const label = host.querySelector('.label');

      expect(label?.textContent?.trim()).toBe('Last updated');
    });

    it('renders the time element with an iso datetime attribute', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');
      const time = host.querySelector('time');

      expect(time).not.toBeNull();
      expect(time?.getAttribute('datetime')).toContain('2026-05-02T14:02:00');
    });

    it('renders the absolute formatted time', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');
      const time = host.querySelector('time');

      expect(time?.textContent?.trim()).toBe('5/2/26 2:02 PM');
    });

    it('renders a custom formatted time', () => {
      const fixture = createLastUpdated({ format: 'yyyy-MM-dd' });
      const host = queryByTestId(fixture, 'last-updated');
      const time = host.querySelector('time');

      expect(time?.textContent?.trim()).toBe('2026-05-02');
    });

    it('shows the placeholder and empty datetime for an invalid date', async () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      fixture.componentInstance.dateTime.set(DateTime.invalid('test reason'));
      await flush(fixture);

      const time = host.querySelector('time');

      expect(time?.textContent?.trim()).toBe('----');
      expect(time?.getAttribute('datetime')).toBe('');
    });
  });

  describe('refresh output', () => {
    it('emits refresh when clicking the refresh button', async () => {
      const fixture = createLastUpdated({ refreshable: true });
      const host = queryByTestId(fixture, 'last-updated');
      const readout = queryByTestId(fixture, 'readout');
      const refreshButton = host.querySelector('org-button.refresh button') as HTMLButtonElement;

      expect(readout.textContent).toContain('refreshCount=0');

      await userEvent.click(refreshButton);
      await flush(fixture);

      expect(readout.textContent).toContain('refreshCount=1');
    });

    it('removes a pending refresh button when loading takes over', async () => {
      const fixture = createLastUpdated({ refreshable: true });
      const host = queryByTestId(fixture, 'last-updated');
      const readout = queryByTestId(fixture, 'readout');
      const refreshButton = host.querySelector('org-button.refresh button') as HTMLButtonElement;

      await userEvent.click(refreshButton);
      await flush(fixture);

      expect(readout.textContent).toContain('refreshCount=1');

      fixture.componentInstance.state.set('loading');
      await flush(fixture);

      await waitFor(() => {
        expect(host.querySelector('org-button.refresh')).toBeNull();
        expect(host.querySelector('org-loading-spinner.spinner')).not.toBeNull();
      });
    });
  });

  describe('tooltip', () => {
    it('wraps the content in a tooltip when tooltip text is provided', () => {
      const fixture = createLastUpdated({ tooltipText: 'absolute time' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-tooltip')).not.toBeNull();
    });

    it('does not wrap in a tooltip when tooltip text is undefined', () => {
      const fixture = createLastUpdated();
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-tooltip')).toBeNull();
    });

    it('transforms a null tooltip text into an omitted tooltip', async () => {
      const fixture = createLastUpdated({ tooltipText: 'absolute time' });
      const host = queryByTestId(fixture, 'last-updated');

      expect(host.querySelector('org-tooltip')).not.toBeNull();

      fixture.componentInstance.tooltipText.set(null);
      await flush(fixture);

      expect(host.querySelector('org-tooltip')).toBeNull();
    });
  });
});
