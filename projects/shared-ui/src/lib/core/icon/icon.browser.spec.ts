import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Icon, type IconColor, type IconSize } from './icon';
import { type IconName } from './icon-brain';

@Component({
  selector: 'test-icon-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'block' },
  template: `<org-icon data-testid="icon" [name]="name()" [size]="size()" [color]="color()" [label]="label()" />`,
})
class IconHost {
  public readonly name = signal<IconName>('check');
  public readonly size = signal<IconSize>('base');
  public readonly color = signal<IconColor>('inherit');
  public readonly label = signal<string | null | undefined>(undefined);
}

type IconHostConfig = {
  name?: IconName;
  size?: IconSize;
  color?: IconColor;
  label?: string | null;
};

describe('Icon (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createIcon = (config: IconHostConfig = {}): ComponentFixture<IconHost> =>
    createFixture(IconHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }
    });

  const queryIconSvg = (host: HTMLElement): SVGElement => host.querySelector('svg') as SVGElement;

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default name, size, and color attributes', () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      expect(host.getAttribute('data-icon')).toBe('check');
      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('inherit');
    });

    it('reflects the size input on the host', () => {
      expect(queryByTestId(createIcon({ size: 'lg' }), 'icon').getAttribute('data-size')).toBe('lg');
      expect(queryByTestId(createIcon({ size: '2xl' }), 'icon').getAttribute('data-size')).toBe('2xl');
    });

    it('reflects the color input on the host', () => {
      expect(queryByTestId(createIcon({ color: 'primary' }), 'icon').getAttribute('data-color')).toBe('primary');
      expect(queryByTestId(createIcon({ color: 'danger' }), 'icon').getAttribute('data-color')).toBe('danger');
    });

    it('reflects the name input on the host', () => {
      expect(queryByTestId(createIcon({ name: 'x' }), 'icon').getAttribute('data-icon')).toBe('x');
      expect(queryByTestId(createIcon({ name: 'plus' }), 'icon').getAttribute('data-icon')).toBe('plus');
    });
  });

  describe('svg rendering', () => {
    it('renders an svg element', () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      expect(host.querySelector('svg')).not.toBeNull();
    });

    it('updates the svg markup when the name changes', async () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      const initialMarkup = queryIconSvg(host).innerHTML;

      fixture.componentInstance.name.set('x');
      await flush(fixture);

      expect(queryIconSvg(host).innerHTML).not.toBe(initialMarkup);
    });
  });

  describe('accessibility', () => {
    it('is decorative by default', () => {
      const fixture = createIcon();
      const svg = queryIconSvg(queryByTestId(fixture, 'icon'));

      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('role')).toBeNull();
    });

    it('becomes meaningful when a label is provided', async () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('Task completed');
      await flush(fixture);

      const svg = queryIconSvg(host);

      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.getAttribute('aria-label')).toBe('Task completed');
      expect(svg.getAttribute('aria-hidden')).toBeNull();
    });

    it('reverts to decorative when the label is cleared', async () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('Task completed');
      await flush(fixture);
      expect(queryIconSvg(host).getAttribute('role')).toBe('img');

      fixture.componentInstance.label.set(undefined);
      await flush(fixture);

      const svg = queryIconSvg(host);

      expect(svg.getAttribute('role')).toBeNull();
      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    it('transforms a null label into a decorative icon', async () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('Task completed');
      await flush(fixture);
      expect(queryIconSvg(host).getAttribute('role')).toBe('img');

      fixture.componentInstance.label.set(null);
      await flush(fixture);

      const svg = queryIconSvg(host);

      expect(svg.getAttribute('role')).toBeNull();
      expect(svg.getAttribute('aria-label')).toBeNull();
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });

    it('updates the aria-label when the label changes', async () => {
      const fixture = createIcon();
      const host = queryByTestId(fixture, 'icon');

      fixture.componentInstance.label.set('Task completed');
      await flush(fixture);
      expect(queryIconSvg(host).getAttribute('aria-label')).toBe('Task completed');

      fixture.componentInstance.label.set('Another label');
      await flush(fixture);

      expect(queryIconSvg(host).getAttribute('aria-label')).toBe('Another label');
    });
  });
});
