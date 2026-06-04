import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { ProgressBar, type ProgressBarColor, type ProgressBarShape, type ProgressBarSize } from './progress-bar';

@Component({
  selector: 'test-progress-bar-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBar],
  host: { class: 'block' },
  template: `
    <org-progress-bar
      data-testid="progress-bar"
      [color]="color()"
      [shape]="shape()"
      [size]="size()"
      [percentage]="percentage()"
      [ariaLabel]="ariaLabel()"
    />
  `,
})
class ProgressBarInteractiveHost {
  public readonly color = signal<ProgressBarColor>('primary');
  public readonly shape = signal<ProgressBarShape>('pill');
  public readonly size = signal<ProgressBarSize>('base');
  public readonly percentage = signal<number>(0);
  public readonly ariaLabel = signal<string | null | undefined>(undefined);
}

type ProgressBarHostConfig = {
  color?: ProgressBarColor;
  shape?: ProgressBarShape;
  size?: ProgressBarSize;
  percentage?: number;
  ariaLabel?: string | null;
};

describe('ProgressBar (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createProgressBar = (config: ProgressBarHostConfig = {}): ComponentFixture<ProgressBarInteractiveHost> =>
    createFixture(ProgressBarInteractiveHost, (instance) => {
      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.shape !== undefined) {
        instance.shape.set(config.shape);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.percentage !== undefined) {
        instance.percentage.set(config.percentage);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }
    });

  const queryFill = (host: HTMLElement): HTMLElement | null => host.querySelector('.fill');

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default color, shape, and size', () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-shape')).toBe('pill');
      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('reflects the color input', () => {
      const fixture = createProgressBar({ color: 'danger' });
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('reflects the shape input', () => {
      const fixture = createProgressBar({ shape: 'rounded' });
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('data-shape')).toBe('rounded');
    });

    it('reflects the size input', () => {
      const fixture = createProgressBar({ size: 'sm' });
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('updates the color attribute when color changes', async () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      fixture.componentInstance.color.set('safe');
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBe('safe');
    });

    it('updates the shape attribute when shape changes', async () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('data-shape')).toBe('pill');

      fixture.componentInstance.shape.set('rounded');
      await flush(fixture);

      expect(host.getAttribute('data-shape')).toBe('rounded');
    });

    it('updates the size attribute when size changes', async () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      fixture.componentInstance.size.set('lg');
      await flush(fixture);

      expect(host.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('accessibility', () => {
    it('applies role="progressbar" with the value bounds', () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('role')).toBe('progressbar');
      expect(host.getAttribute('aria-valuemin')).toBe('0');
      expect(host.getAttribute('aria-valuemax')).toBe('100');
    });

    it('has no aria-label by default', () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      expect(host.getAttribute('aria-label')).toBeNull();
    });

    it('reflects the aria-label input', async () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      fixture.componentInstance.ariaLabel.set('Upload progress');
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('Upload progress');
    });

    it('transforms a null aria-label to omitted', async () => {
      const fixture = createProgressBar();
      const host = queryByTestId(fixture, 'progress-bar');

      fixture.componentInstance.ariaLabel.set('Upload progress');
      await flush(fixture);
      expect(host.getAttribute('aria-label')).toBe('Upload progress');

      fixture.componentInstance.ariaLabel.set(null);
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('fill percentage', () => {
    it('sets aria-valuenow and the fill width to the percentage', () => {
      const fixture = createProgressBar({ percentage: 65 });
      const host = queryByTestId(fixture, 'progress-bar');
      const fill = queryFill(host);

      expect(host.getAttribute('aria-valuenow')).toBe('65');
      expect(fill?.style.width).toBe('65%');
    });

    it('updates aria-valuenow and the fill width when the percentage changes', async () => {
      const fixture = createProgressBar({ percentage: 20 });
      const host = queryByTestId(fixture, 'progress-bar');
      const fill = queryFill(host);

      fixture.componentInstance.percentage.set(80);
      await flush(fixture);

      expect(host.getAttribute('aria-valuenow')).toBe('80');
      expect(fill?.style.width).toBe('80%');
    });

    it('clamps a percentage above 100 to 100', () => {
      const fixture = createProgressBar({ percentage: 150 });
      const host = queryByTestId(fixture, 'progress-bar');
      const fill = queryFill(host);

      expect(host.getAttribute('aria-valuenow')).toBe('100');
      expect(fill?.style.width).toBe('100%');
    });

    it('clamps a negative percentage to 0', () => {
      const fixture = createProgressBar({ percentage: -25 });
      const host = queryByTestId(fixture, 'progress-bar');
      const fill = queryFill(host);

      expect(host.getAttribute('aria-valuenow')).toBe('0');
      expect(fill?.style.width).toBe('0%');
    });
  });
});
