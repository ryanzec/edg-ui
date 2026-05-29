import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Divider, type DividerPadding, type DividerStyle, type DividerWeight } from './divider';
import { DividerBrainDirective, type DividerDirection } from './divider-brain';
import type { ComponentColor } from '../types/component-types';

@Component({
  selector: 'test-divider-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider],
  host: { class: 'block' },
  template: `
    <org-divider
      data-testid="divider"
      [direction]="direction()"
      [lineStyle]="lineStyle()"
      [weight]="weight()"
      [padding]="padding()"
      [color]="color()"
    />
  `,
})
class DividerHost {
  public readonly direction = signal<DividerDirection>('horizontal');
  public readonly lineStyle = signal<DividerStyle>('solid');
  public readonly weight = signal<DividerWeight>('thin');
  public readonly padding = signal<DividerPadding>('sm');
  public readonly color = signal<ComponentColor | null | undefined>(undefined);
}

@Component({
  selector: 'test-divider-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerBrainDirective],
  host: { class: 'block' },
  template: `
    <div
      data-testid="brain"
      orgDividerBrain
      [direction]="direction()"
      [isResizable]="isResizable()"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [isInteractive]="isInteractive()"
      (pointerDown)="handlePointerDown($event)"
      (pointerMove)="handlePointerMove($event)"
      (pointerUp)="handlePointerUp($event)"
      (pointerCancel)="handlePointerCancel($event)"
      (keyDown)="handleKeyDown($event)"
    ></div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class DividerBrainHost {
  public readonly direction = signal<DividerDirection>('horizontal');
  public readonly isResizable = signal<boolean>(false);
  public readonly value = signal<number | null | undefined>(undefined);
  public readonly min = signal<number>(0);
  public readonly max = signal<number>(100);
  public readonly isInteractive = signal<boolean>(true);

  protected readonly pointerDownCount = signal<number>(0);
  protected readonly pointerMoveCount = signal<number>(0);
  protected readonly pointerUpCount = signal<number>(0);
  protected readonly pointerCancelCount = signal<number>(0);
  protected readonly keyDownCount = signal<number>(0);
  protected readonly lastKey = signal<string>('');

  protected readout(): string {
    return (
      `pointerDown=${this.pointerDownCount()} ` +
      `pointerMove=${this.pointerMoveCount()} ` +
      `pointerUp=${this.pointerUpCount()} ` +
      `pointerCancel=${this.pointerCancelCount()} ` +
      `keyDown=${this.keyDownCount()} ` +
      `lastKey=${this.lastKey()}`
    );
  }

  protected handlePointerDown(_event: PointerEvent): void {
    this.pointerDownCount.update((value) => value + 1);
  }

  protected handlePointerMove(_event: PointerEvent): void {
    this.pointerMoveCount.update((value) => value + 1);
  }

  protected handlePointerUp(_event: PointerEvent): void {
    this.pointerUpCount.update((value) => value + 1);
  }

  protected handlePointerCancel(_event: PointerEvent): void {
    this.pointerCancelCount.update((value) => value + 1);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.keyDownCount.update((value) => value + 1);
    this.lastKey.set(event.key);
  }
}

type DividerHostConfig = {
  direction?: DividerDirection;
  lineStyle?: DividerStyle;
  weight?: DividerWeight;
  padding?: DividerPadding;
  color?: ComponentColor | null;
};

type DividerBrainHostConfig = {
  direction?: DividerDirection;
  isResizable?: boolean;
  value?: number | null;
  min?: number;
  max?: number;
  isInteractive?: boolean;
};

/** dispatches a synthetic pointer event of the given type on the brain element */
const dispatchPointer = (
  target: HTMLElement,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel'
): void => {
  target.dispatchEvent(new PointerEvent(type, { pointerId: 1, bubbles: true, cancelable: true }));
};

/** dispatches a synthetic keydown of the given key on the brain element */
const dispatchKeyDown = (target: HTMLElement, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

describe('Divider (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createDivider = (config: DividerHostConfig = {}): ComponentFixture<DividerHost> =>
    createFixture(DividerHost, (instance) => {
      if (config.direction !== undefined) {
        instance.direction.set(config.direction);
      }

      if (config.lineStyle !== undefined) {
        instance.lineStyle.set(config.lineStyle);
      }

      if (config.weight !== undefined) {
        instance.weight.set(config.weight);
      }

      if (config.padding !== undefined) {
        instance.padding.set(config.padding);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }
    });

  const createDividerBrain = (config: DividerBrainHostConfig = {}): ComponentFixture<DividerBrainHost> =>
    createFixture(DividerBrainHost, (instance) => {
      if (config.direction !== undefined) {
        instance.direction.set(config.direction);
      }

      if (config.isResizable !== undefined) {
        instance.isResizable.set(config.isResizable);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }

      if (config.min !== undefined) {
        instance.min.set(config.min);
      }

      if (config.max !== undefined) {
        instance.max.set(config.max);
      }

      if (config.isInteractive !== undefined) {
        instance.isInteractive.set(config.isInteractive);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default style, weight, padding, and direction attributes', () => {
      const fixture = createDivider();
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-style')).toBe('solid');
      expect(host.getAttribute('data-weight')).toBe('thin');
      expect(host.getAttribute('data-padding')).toBe('sm');
      expect(host.getAttribute('data-direction')).toBe('horizontal');
    });

    it('omits the data-color attribute by default', () => {
      const fixture = createDivider();
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-color')).toBeNull();
    });

    it('always applies the separator role from the brain', () => {
      const fixture = createDivider();
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('role')).toBe('separator');
    });

    it('reflects the horizontal direction', () => {
      const fixture = createDivider();
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-direction')).toBe('horizontal');
      expect(host.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('reflects the vertical direction', () => {
      const fixture = createDivider({ direction: 'vertical' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-direction')).toBe('vertical');
      expect(host.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('reflects the dashed line style', () => {
      const fixture = createDivider({ lineStyle: 'dashed' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-style')).toBe('dashed');
    });

    it('reflects the dotted line style', () => {
      const fixture = createDivider({ lineStyle: 'dotted' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-style')).toBe('dotted');
    });

    it('reflects the thick weight', () => {
      const fixture = createDivider({ weight: 'thick' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-weight')).toBe('thick');
    });

    it('reflects the none padding', () => {
      const fixture = createDivider({ padding: 'none' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-padding')).toBe('none');
    });

    it('reflects the base padding', () => {
      const fixture = createDivider({ padding: 'base' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-padding')).toBe('base');
    });

    it('reflects the lg padding', () => {
      const fixture = createDivider({ padding: 'lg' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-padding')).toBe('lg');
    });

    it('applies the data-color attribute when a color is set', async () => {
      const fixture = createDivider({ color: 'danger' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-color')).toBe('danger');

      fixture.componentInstance.color.set('primary');
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBe('primary');
    });

    it('transforms a null color into an omitted data-color attribute', async () => {
      const fixture = createDivider({ color: 'primary' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-color')).toBe('primary');

      fixture.componentInstance.color.set(null);
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBeNull();
    });

    it('omits the data-color attribute when color is undefined', async () => {
      const fixture = createDivider({ color: 'primary' });
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('data-color')).toBe('primary');

      fixture.componentInstance.color.set(undefined);
      await flush(fixture);

      expect(host.getAttribute('data-color')).toBeNull();
    });

    it('omits the aria-value attributes and tabindex for a non-resizable divider', () => {
      const fixture = createDivider();
      const host = queryByTestId(fixture, 'divider');

      expect(host.getAttribute('aria-valuenow')).toBeNull();
      expect(host.getAttribute('aria-valuemin')).toBeNull();
      expect(host.getAttribute('aria-valuemax')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('brain directive', () => {
    it('defaults to non-resizable attributes', () => {
      const fixture = createDividerBrain();
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('role')).toBe('separator');
      expect(host.getAttribute('aria-orientation')).toBe('horizontal');
      expect(host.getAttribute('data-direction')).toBe('horizontal');
      expect(host.getAttribute('aria-valuenow')).toBeNull();
      expect(host.getAttribute('aria-valuemin')).toBeNull();
      expect(host.getAttribute('aria-valuemax')).toBeNull();
      expect(host.getAttribute('tabindex')).toBeNull();
    });

    it('applies the aria-value attributes when resizable', () => {
      const fixture = createDividerBrain({ isResizable: true, value: 42, min: 10, max: 90 });
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('aria-valuenow')).toBe('42');
      expect(host.getAttribute('aria-valuemin')).toBe('10');
      expect(host.getAttribute('aria-valuemax')).toBe('90');
    });

    it('omits aria-valuenow when the value is null while resizable', async () => {
      const fixture = createDividerBrain({ isResizable: true, value: 42 });
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('aria-valuenow')).toBe('42');

      fixture.componentInstance.value.set(null);
      await flush(fixture);

      expect(host.getAttribute('aria-valuenow')).toBeNull();
    });

    it('sets tabindex to 0 when resizable and interactive', () => {
      const fixture = createDividerBrain({ isResizable: true });
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('tabindex')).toBe('0');
    });

    it('sets tabindex to -1 when resizable and non-interactive', () => {
      const fixture = createDividerBrain({ isResizable: true, isInteractive: false });
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('tabindex')).toBe('-1');
    });

    it('reflects the vertical direction on the brain host', () => {
      const fixture = createDividerBrain({ direction: 'vertical' });
      const host = queryByTestId(fixture, 'brain');

      expect(host.getAttribute('data-direction')).toBe('vertical');
      expect(host.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('forwards pointer events when resizable', async () => {
      const fixture = createDividerBrain({ isResizable: true });
      const host = queryByTestId(fixture, 'brain');
      const readout = queryByTestId(fixture, 'readout');

      dispatchPointer(host, 'pointerdown');
      dispatchPointer(host, 'pointermove');
      dispatchPointer(host, 'pointerup');
      dispatchPointer(host, 'pointercancel');

      await waitFor(() => expect(readout.textContent).toContain('pointerDown=1'));
      await waitFor(() => expect(readout.textContent).toContain('pointerMove=1'));
      await waitFor(() => expect(readout.textContent).toContain('pointerUp=1'));
      await waitFor(() => expect(readout.textContent).toContain('pointerCancel=1'));
    });

    it('forwards keydown events when resizable', async () => {
      const fixture = createDividerBrain({ isResizable: true });
      const host = queryByTestId(fixture, 'brain');
      const readout = queryByTestId(fixture, 'readout');

      dispatchKeyDown(host, 'ArrowRight');

      await waitFor(() => expect(readout.textContent).toContain('keyDown=1'));
      await waitFor(() => expect(readout.textContent).toContain('lastKey=ArrowRight'));
    });

    it('does not forward pointer events when not resizable', async () => {
      const fixture = createDividerBrain();
      const host = queryByTestId(fixture, 'brain');
      const readout = queryByTestId(fixture, 'readout');

      dispatchPointer(host, 'pointerdown');
      dispatchPointer(host, 'pointermove');
      dispatchPointer(host, 'pointerup');
      dispatchPointer(host, 'pointercancel');
      await flush(fixture);

      expect(readout.textContent).toContain('pointerDown=0');
      expect(readout.textContent).toContain('pointerMove=0');
      expect(readout.textContent).toContain('pointerUp=0');
      expect(readout.textContent).toContain('pointerCancel=0');
    });

    it('does not forward keydown events when not resizable', async () => {
      const fixture = createDividerBrain();
      const host = queryByTestId(fixture, 'brain');
      const readout = queryByTestId(fixture, 'readout');

      dispatchKeyDown(host, 'ArrowRight');
      await flush(fixture);

      expect(readout.textContent).toContain('keyDown=0');
    });

    it('stops forwarding once resizable is turned off', async () => {
      const fixture = createDividerBrain({ isResizable: true });
      const host = queryByTestId(fixture, 'brain');
      const readout = queryByTestId(fixture, 'readout');

      // warm up both listeners while resizable so each is invoked once before the toggle; the first
      // ever invocation of a host listener reads a stale signal-input snapshot in the browser test
      // runner, so the gating below is only reliable from the second invocation onward
      dispatchPointer(host, 'pointerdown');
      dispatchKeyDown(host, 'ArrowRight');

      await waitFor(() => expect(readout.textContent).toContain('pointerDown=1'));
      await waitFor(() => expect(readout.textContent).toContain('keyDown=1'));
      await waitFor(() => expect(readout.textContent).toContain('lastKey=ArrowRight'));

      fixture.componentInstance.isResizable.set(false);
      await flush(fixture);

      dispatchPointer(host, 'pointerdown');
      dispatchKeyDown(host, 'ArrowDown');
      await flush(fixture);

      expect(readout.textContent).toContain('pointerDown=1');
      expect(readout.textContent).toContain('keyDown=1');
      expect(readout.textContent).toContain('lastKey=ArrowRight');
    });
  });
});
