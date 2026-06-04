import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Icon } from '../icon/icon';
import {
  Indicator,
  type IndicatorColor,
  type IndicatorColorStrength,
  type IndicatorPosition,
  type IndicatorShape,
  type IndicatorSize,
} from './indicator';
import { IndicatorAnchor } from './indicator-anchor';

@Component({
  selector: 'test-indicator-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, Icon],
  host: { class: 'block' },
  template: `
    <org-indicator
      data-testid="indicator"
      [color]="color()"
      [colorStrength]="colorStrength()"
      [size]="size()"
      [shape]="shape()"
      [number]="number()"
      [ring]="ring()"
      [pulse]="pulse()"
      [hasFade]="hasFade()"
      [position]="position()"
      [ariaLabel]="ariaLabel()"
    >
      @if (showIcon()) {
        <org-icon data-testid="projected-icon" name="check" size="2xs" />
      }
    </org-indicator>
  `,
})
class IndicatorInteractiveHost {
  public readonly color = signal<IndicatorColor>('primary');
  public readonly colorStrength = signal<IndicatorColorStrength>('strong');
  public readonly size = signal<IndicatorSize>('base');
  public readonly shape = signal<IndicatorShape>('circle');
  public readonly number = signal<number | null | undefined>(undefined);
  public readonly ring = signal<boolean>(false);
  public readonly pulse = signal<boolean>(false);
  public readonly hasFade = signal<boolean>(false);
  public readonly position = signal<IndicatorPosition | null | undefined>(undefined);
  public readonly ariaLabel = signal<string | null | undefined>(undefined);
  public readonly showIcon = signal<boolean>(false);
}

@Component({
  selector: 'test-indicator-anchor-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Indicator, IndicatorAnchor],
  host: { class: 'block' },
  template: `
    <org-indicator-anchor data-testid="anchor">
      <span data-testid="anchor-child">child</span>
      <org-indicator data-testid="anchored-indicator" color="safe" position="bottom-right" [ring]="true" />
    </org-indicator-anchor>
  `,
})
class IndicatorAnchorHost {}

type IndicatorHostConfig = {
  color?: IndicatorColor;
  colorStrength?: IndicatorColorStrength;
  size?: IndicatorSize;
  shape?: IndicatorShape;
  number?: number | null;
  ring?: boolean;
  pulse?: boolean;
  hasFade?: boolean;
  position?: IndicatorPosition | null;
  ariaLabel?: string | null;
  showIcon?: boolean;
};

describe('Indicator (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createIndicator = (config: IndicatorHostConfig = {}): ComponentFixture<IndicatorInteractiveHost> =>
    createFixture(IndicatorInteractiveHost, (instance) => {
      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.colorStrength !== undefined) {
        instance.colorStrength.set(config.colorStrength);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.shape !== undefined) {
        instance.shape.set(config.shape);
      }

      if (config.number !== undefined) {
        instance.number.set(config.number);
      }

      if (config.ring !== undefined) {
        instance.ring.set(config.ring);
      }

      if (config.pulse !== undefined) {
        instance.pulse.set(config.pulse);
      }

      if (config.hasFade !== undefined) {
        instance.hasFade.set(config.hasFade);
      }

      if (config.position !== undefined) {
        instance.position.set(config.position);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.showIcon !== undefined) {
        instance.showIcon.set(config.showIcon);
      }
    });

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default mode, color, color strength, and size', () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-mode')).toBe('dot');
      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-color-strength')).toBe('strong');
      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-shape')).toBe('circle');
    });

    it('omits position, ring, pulse, and fade by default', () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-position')).toBeNull();
      expect(host.getAttribute('data-ring')).toBeNull();
      expect(host.getAttribute('data-pulse')).toBeNull();
      expect(host.getAttribute('data-fade')).toBeNull();
    });

    it('applies role="status" to the host', () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('role')).toBe('status');
    });

    it('reflects the color input', () => {
      const fixture = createIndicator({ color: 'danger' });
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('reflects the size input', () => {
      const fixture = createIndicator({ size: 'sm' });
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('reflects the colorStrength input', () => {
      const fixture = createIndicator({ colorStrength: 'soft' });
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-color-strength')).toBe('soft');
    });

    it('updates the color strength attribute when colorStrength changes', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-color-strength')).toBe('strong');

      fixture.componentInstance.colorStrength.set('soft');
      await flush(fixture);

      expect(host.getAttribute('data-color-strength')).toBe('soft');
    });

    it('updates the color attribute when color changes', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('updates the size attribute when size changes', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);

      expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('reflects the shape input', () => {
      const fixture = createIndicator({ shape: 'rounded' });
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-shape')).toBe('rounded');
    });

    it('updates the shape attribute when shape changes', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-shape')).toBe('circle');

      fixture.componentInstance.shape.set('rounded');
      await flush(fixture);

      expect(host.getAttribute('data-shape')).toBe('rounded');
    });
  });

  describe('aria-label', () => {
    it('has no aria-label by default', () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('aria-label')).toBeNull();
    });

    it('reflects the aria-label input', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.ariaLabel.set('3 unread');
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBe('3 unread');
    });

    it('transforms a null aria-label to omitted', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.ariaLabel.set('3 unread');
      await flush(fixture);
      expect(host.getAttribute('aria-label')).toBe('3 unread');

      fixture.componentInstance.ariaLabel.set(null);
      await flush(fixture);

      expect(host.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('mode resolution', () => {
    it('uses dot mode by default with no number or icon', () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      expect(host.getAttribute('data-mode')).toBe('dot');
      expect(host.querySelector(':scope > span')).toBeNull();
    });

    it('switches to number mode when a number is provided', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(3);
      await flush(fixture);

      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('3');
    });

    it('switches to icon mode when an icon is projected and no number is set', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.showIcon.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-mode')).toBe('icon');
      expect(host.querySelector('org-icon')).not.toBeNull();
    });

    it('number wins over a projected icon', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.showIcon.set(true);
      fixture.componentInstance.number.set(3);
      await flush(fixture);

      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('3');
      // template gates ng-content behind the @else, so the projected icon must not be rendered
      expect(host.querySelector('org-icon')).toBeNull();
    });

    it('transforms a null number back to dot mode', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(3);
      await flush(fixture);
      expect(host.getAttribute('data-mode')).toBe('number');

      fixture.componentInstance.number.set(null);
      await flush(fixture);

      expect(host.getAttribute('data-mode')).toBe('dot');
      expect(host.querySelector(':scope > span')).toBeNull();
    });
  });

  describe('number display', () => {
    it('renders a number below 100 as-is', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(42);
      await flush(fixture);

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('42');
    });

    it('renders 99+ for numbers greater than or equal to 100', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(150);
      await flush(fixture);

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99+');
    });

    it('renders 99+ at the boundary value of 100', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(100);
      await flush(fixture);

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99+');
    });

    it('renders 99 exactly at the boundary value of 99', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(99);
      await flush(fixture);

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('99');
    });

    it('renders zero as "0" in number mode', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.number.set(0);
      await flush(fixture);

      // verifies hasNumber uses !== undefined, not truthiness — 0 must still produce number mode
      expect(host.getAttribute('data-mode')).toBe('number');

      const valueSpan = host.querySelector(':scope > span') as HTMLElement | null;

      expect(valueSpan?.textContent?.trim()).toBe('0');
    });
  });

  describe('boolean flags', () => {
    it('reflects data-ring when ring is true', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.ring.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-ring')).toBe('');
    });

    it('reflects data-pulse when pulse is true', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.pulse.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-pulse')).toBe('');
    });

    it('reflects data-fade when hasFade is true', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.hasFade.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-fade')).toBe('');
    });

    it('omits ring, pulse, and fade attributes when flags are set back to false', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.ring.set(true);
      fixture.componentInstance.pulse.set(true);
      fixture.componentInstance.hasFade.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-ring')).toBe('');
      expect(host.getAttribute('data-pulse')).toBe('');
      expect(host.getAttribute('data-fade')).toBe('');

      fixture.componentInstance.ring.set(false);
      fixture.componentInstance.pulse.set(false);
      fixture.componentInstance.hasFade.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-ring')).toBeNull();
      expect(host.getAttribute('data-pulse')).toBeNull();
      expect(host.getAttribute('data-fade')).toBeNull();
    });
  });

  describe('position', () => {
    it('reflects the position input', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.position.set('bottom-right');
      await flush(fixture);

      expect(host.getAttribute('data-position')).toBe('bottom-right');
    });

    it('transforms a null position to omitted', async () => {
      const fixture = createIndicator();
      const host = queryByTestId(fixture, 'indicator');

      fixture.componentInstance.position.set('bottom-right');
      await flush(fixture);
      expect(host.getAttribute('data-position')).toBe('bottom-right');

      fixture.componentInstance.position.set(null);
      await flush(fixture);

      expect(host.getAttribute('data-position')).toBeNull();
    });
  });

  describe('anchor', () => {
    it('projects its children', () => {
      const fixture = createFixture(IndicatorAnchorHost);
      const anchor = queryByTestId(fixture, 'anchor');

      expect(anchor.querySelector('[data-testid="anchor-child"]')).not.toBeNull();
      expect(anchor.querySelector('[data-testid="anchored-indicator"]')).not.toBeNull();
    });

    it('renders as the org-indicator-anchor host element', () => {
      const fixture = createFixture(IndicatorAnchorHost);
      const anchor = queryByTestId(fixture, 'anchor');

      expect(anchor.tagName.toLowerCase()).toBe('org-indicator-anchor');
    });
  });
});
