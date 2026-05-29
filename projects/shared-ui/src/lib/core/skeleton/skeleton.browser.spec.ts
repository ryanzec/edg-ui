import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Skeleton, type SkeletonVariant } from './skeleton';

@Component({
  selector: 'test-skeleton-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  host: { class: 'block' },
  template: `
    <org-skeleton
      data-testid="skeleton"
      [variant]="variant()"
      [bordered]="bordered()"
      [rows]="rows()"
      [ariaLabel]="ariaLabel()"
    />
  `,
})
class SkeletonHost {
  public readonly variant = signal<SkeletonVariant>('card');
  public readonly bordered = signal<boolean>(true);
  public readonly rows = signal<number>(7);
  public readonly ariaLabel = signal<string>('loading');
}

@Component({
  selector: 'test-skeleton-bare-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  host: { class: 'block' },
  template: `<org-skeleton data-testid="skeleton" />`,
})
class SkeletonBareHost {}

describe('Skeleton (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  type SkeletonHostConfig = {
    variant?: SkeletonVariant;
    bordered?: boolean;
    rows?: number;
    ariaLabel?: string;
  };

  const createSkeleton = (config: SkeletonHostConfig = {}): ComponentFixture<SkeletonHost> =>
    createFixture(SkeletonHost, (instance) => {
      if (config.variant !== undefined) {
        instance.variant.set(config.variant);
      }

      if (config.bordered !== undefined) {
        instance.bordered.set(config.bordered);
      }

      if (config.rows !== undefined) {
        instance.rows.set(config.rows);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }
    });

  describe('a11y', () => {
    it('renders status role and aria-busy', () => {
      const fixture = createSkeleton();
      const host = queryByTestId(fixture, 'skeleton');

      expect(host.getAttribute('role')).toBe('status');
      expect(host.getAttribute('aria-busy')).toBe('true');
    });

    it('renders the default aria-label', () => {
      const fixture = createFixture(SkeletonBareHost);
      const host = queryByTestId(fixture, 'skeleton');

      expect(host.getAttribute('aria-label')).toBe('loading');
    });

    it('reflects a custom aria-label', async () => {
      const fixture = createSkeleton();
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.ariaLabel.set('preparing your dashboard');
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('preparing your dashboard');
    });
  });

  describe('host attributes', () => {
    it('renders the default host attributes', () => {
      const fixture = createSkeleton();
      const host = queryByTestId(fixture, 'skeleton');

      expect(host.getAttribute('data-variant')).toBe('card');
      expect(host.getAttribute('data-bordered')).toBe('1');
    });

    it('reflects the variant attribute', async () => {
      const fixture = createSkeleton();
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.variant.set('table');
      await flush(fixture);
      expect(host.getAttribute('data-variant')).toBe('table');

      fixture.componentInstance.variant.set('table-varied');
      await flush(fixture);
      expect(host.getAttribute('data-variant')).toBe('table-varied');

      fixture.componentInstance.variant.set('card-headless');
      await flush(fixture);
      expect(host.getAttribute('data-variant')).toBe('card-headless');
    });

    it('reflects the bordered attribute when false', async () => {
      const fixture = createSkeleton();
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.bordered.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-bordered')).toBe('0');
    });
  });

  describe('variant rendering', () => {
    it('renders a block and four bars for the card variant', () => {
      const fixture = createSkeleton({ variant: 'card' });
      const host = queryByTestId(fixture, 'skeleton');

      expect(host.querySelector('.block')).not.toBeNull();
      expect(host.querySelectorAll('.bar').length).toBe(4);
    });

    it('omits the block and renders three bars for the card-headless variant', () => {
      const fixture = createSkeleton({ variant: 'card-headless' });
      const host = queryByTestId(fixture, 'skeleton');

      expect(host.querySelector('.block')).toBeNull();
      expect(host.querySelectorAll('.bar').length).toBe(3);
    });

    it('renders full-width bars for the given rows in the table variant', () => {
      const fixture = createSkeleton({ variant: 'table', rows: 7 });
      const host = queryByTestId(fixture, 'skeleton');

      const bars = host.querySelectorAll('.bar');

      expect(host.querySelector('.block')).toBeNull();
      expect(bars.length).toBe(7);

      bars.forEach((bar) => {
        expect(bar.getAttribute('data-width')).toBe('full');
      });
    });

    it('renders bars with cycling widths for the table-varied variant', () => {
      const fixture = createSkeleton({ variant: 'table-varied', rows: 7 });
      const host = queryByTestId(fixture, 'skeleton');

      const bars = host.querySelectorAll('.bar');

      expect(host.querySelector('.block')).toBeNull();
      expect(bars.length).toBe(7);

      const expectedWidths = ['full', '3/4', '2/3', '1/2', 'full', '3/4', '1/3'];

      bars.forEach((bar, index) => {
        expect(bar.getAttribute('data-width')).toBe(expectedWidths[index]);
      });
    });
  });

  describe('rows input', () => {
    it('controls the table bar count', async () => {
      const fixture = createSkeleton({ variant: 'table' });
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.rows.set(3);
      await flush(fixture);
      expect(host.querySelectorAll('.bar').length).toBe(3);

      fixture.componentInstance.rows.set(12);
      await flush(fixture);
      expect(host.querySelectorAll('.bar').length).toBe(12);
    });

    it('is ignored for card variants', async () => {
      const fixture = createSkeleton({ variant: 'card' });
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.rows.set(12);
      await flush(fixture);
      expect(host.querySelectorAll('.bar').length).toBe(4);

      fixture.componentInstance.rows.set(3);
      await flush(fixture);
      expect(host.querySelectorAll('.bar').length).toBe(4);

      fixture.componentInstance.variant.set('card-headless');
      fixture.componentInstance.rows.set(12);
      await flush(fixture);
      expect(host.querySelectorAll('.bar').length).toBe(3);
    });

    it('is clamped to zero for negative values', async () => {
      const fixture = createSkeleton({ variant: 'table' });
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.rows.set(-3);
      await flush(fixture);

      expect(host.querySelectorAll('.bar').length).toBe(0);
    });

    it('wraps the table-varied width cycle via modulo', async () => {
      const fixture = createSkeleton({ variant: 'table-varied' });
      const host = queryByTestId(fixture, 'skeleton');

      fixture.componentInstance.rows.set(13);
      await flush(fixture);

      const bars = host.querySelectorAll('.bar');

      expect(bars.length).toBe(13);
      // 12 % 12 === 0 → cycle[0] === 'full'
      expect(bars[12].getAttribute('data-width')).toBe('full');
    });
  });
});
