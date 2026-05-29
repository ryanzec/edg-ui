import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { LoadingSpinner } from './loading-spinner';
import { type IconColor, type IconSize } from '../icon/icon';

@Component({
  selector: 'test-loading-spinner-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinner],
  host: { class: 'block' },
  template: `
    <org-loading-spinner data-testid="spinner" [size]="size()" [iconColor]="iconColor()" [label]="label()" />
    <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
    <button type="button" data-testid="ctl-size-xs" (click)="size.set('xs')">size-xs</button>
    <button type="button" data-testid="ctl-icon-color-primary" (click)="iconColor.set('primary')">
      icon-color-primary
    </button>
    <button type="button" data-testid="ctl-icon-color-danger" (click)="iconColor.set('danger')">
      icon-color-danger
    </button>
    <button type="button" data-testid="ctl-label-saving" (click)="label.set('Saving changes')">label-saving</button>
  `,
})
class LoadingSpinnerHost {
  public readonly size = signal<IconSize>('base');
  public readonly iconColor = signal<IconColor>('inherit');
  public readonly label = signal<string>('Loading');
}

type LoadingSpinnerHostConfig = {
  size?: IconSize;
  iconColor?: IconColor;
  label?: string;
};

describe('Loading Spinner (browser)', () => {
  const { createFixture, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createLoadingSpinner = (config: LoadingSpinnerHostConfig = {}): ComponentFixture<LoadingSpinnerHost> =>
    createFixture(LoadingSpinnerHost, (instance) => {
      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.iconColor !== undefined) {
        instance.iconColor.set(config.iconColor);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default host attributes', () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-icon-color')).toBe('inherit');
    });

    it('reflects the size input on the host', async () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      await userEvent.click(queryByTestId(fixture, 'ctl-size-lg'));

      await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));
    });

    it('reflects the icon color input on the host', async () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      await userEvent.click(queryByTestId(fixture, 'ctl-icon-color-primary'));

      await waitFor(() => expect(host.getAttribute('data-icon-color')).toBe('primary'));
    });
  });

  describe('accessibility attributes', () => {
    it('renders the default accessibility attributes', () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      expect(host.getAttribute('role')).toBe('status');
      expect(host.getAttribute('aria-label')).toBe('Loading');
    });

    it('reflects the label input on aria-label', async () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      await userEvent.click(queryByTestId(fixture, 'ctl-label-saving'));

      await waitFor(() => expect(host.getAttribute('aria-label')).toBe('Saving changes'));
    });
  });

  describe('inner loader icon', () => {
    it('renders the inner loader icon', () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');
      const icon = host.querySelector('org-icon');

      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('data-icon')).toBe('loader');
    });

    it('reflects the size on the inner icon', async () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      await userEvent.click(queryByTestId(fixture, 'ctl-size-xs'));

      await waitFor(() => {
        const icon = host.querySelector('org-icon') as HTMLElement;

        expect(icon.getAttribute('data-size')).toBe('xs');
      });
    });

    it('reflects the color on the inner icon', async () => {
      const fixture = createLoadingSpinner();
      const host = queryByTestId(fixture, 'spinner');

      await userEvent.click(queryByTestId(fixture, 'ctl-icon-color-danger'));

      await waitFor(() => {
        const icon = host.querySelector('org-icon') as HTMLElement;

        expect(icon.getAttribute('data-color')).toBe('danger');
      });
    });
  });
});
