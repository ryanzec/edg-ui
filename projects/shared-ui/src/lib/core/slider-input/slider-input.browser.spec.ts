import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { SliderInput, type SliderInputColor, type SliderInputSize, type SliderInputDirection } from './slider-input';

@Component({
  selector: 'test-slider-input-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderInput],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .slider-wrapper {
        width: 25rem;
      }
      .slider-wrapper.vertical {
        width: auto;
        height: 12rem;
      }
    `,
  ],
  template: `
    <div class="slider-wrapper" [class.vertical]="direction() === 'vertical'">
      <org-slider-input
        data-testid="slider"
        [direction]="direction()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [values]="values()"
        [disabled]="disabled()"
        [allowCrossing]="allowCrossing()"
        [color]="color()"
        [size]="size()"
        [showTicks]="showTicks()"
        [tickCount]="tickCount()"
        [ariaLabel]="ariaLabel()"
        (valuesChange)="onValuesChange($event)"
        (changed)="onChanged($event)"
      />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class SliderInputHost {
  public readonly direction = signal<SliderInputDirection>('horizontal');
  public readonly min = signal<number>(0);
  public readonly max = signal<number>(100);
  public readonly step = signal<number>(1);
  public readonly values = signal<number[]>([50]);
  public readonly disabled = signal<boolean>(false);
  public readonly allowCrossing = signal<boolean>(true);
  public readonly color = signal<SliderInputColor>('primary');
  public readonly size = signal<SliderInputSize>('base');
  public readonly showTicks = signal<boolean>(false);
  public readonly tickCount = signal<number>(0);
  public readonly ariaLabel = signal<string>('slider');

  public readonly lastValuesChange = signal<number[]>([]);
  public readonly lastChanged = signal<number[]>([]);
  public readonly valuesChangeCount = signal<number>(0);
  public readonly changedCount = signal<number>(0);

  protected readout(): string {
    return [
      `values=[${this.values().join(',')}]`,
      `lastValuesChange=[${this.lastValuesChange().join(',')}]`,
      `lastChanged=[${this.lastChanged().join(',')}]`,
      `valuesChangeCount=${this.valuesChangeCount()}`,
      `changedCount=${this.changedCount()}`,
    ].join(' ');
  }

  protected onValuesChange(newValues: number[]): void {
    this.lastValuesChange.set(newValues);
    this.valuesChangeCount.update((value) => value + 1);
    this.values.set(newValues);
  }

  protected onChanged(newValues: number[]): void {
    this.lastChanged.set(newValues);
    this.changedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-slider-input-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderInput, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }
      .slider-wrapper {
        width: 25rem;
      }
    `,
  ],
  template: `
    <div class="slider-wrapper">
      <org-slider-input data-testid="slider" direction="horizontal" [formControl]="formControl" />
    </div>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class SliderInputReactiveFormHost {
  public readonly formControl = new FormControl<number[]>([50], { nonNullable: true });

  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value=[${this.formControl.value.join(',')}]`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
      `dirty=${this.formControl.dirty}`,
    ].join(' ');
  }
}

const getThumb = (host: HTMLElement, index: number): HTMLButtonElement => {
  return host.querySelector(`[data-thumb-index="${index}"]`) as HTMLButtonElement;
};

const getThumbs = (host: HTMLElement): HTMLButtonElement[] => {
  return Array.from(host.querySelectorAll('[role="slider"]')) as HTMLButtonElement[];
};

const getTicks = (host: HTMLElement): HTMLElement[] => {
  return Array.from(host.querySelectorAll('.tick')) as HTMLElement[];
};

const pressKey = (element: HTMLElement, key: string, options: { shiftKey?: boolean } = {}): void => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      shiftKey: options.shiftKey ?? false,
      bubbles: true,
      cancelable: true,
    })
  );
};

describe('SliderInput (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  beforeEach(setupTestBed);
  afterEach(destroyFixture);

  const createHost = (): ComponentFixture<SliderInputHost> => createFixture(SliderInputHost);

  const createReactiveHost = (): ComponentFixture<SliderInputReactiveFormHost> =>
    createFixture(SliderInputReactiveFormHost);

  describe('host attributes & defaults', () => {
    it('reflects default size and color attributes', () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
    });

    it('omits show-ticks attribute by default', () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(host.getAttribute('data-show-ticks')).toBeNull();
    });

    it('reflects direction attribute on host', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(host.getAttribute('data-direction')).toBe('horizontal');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));
    });

    it('reflects show-ticks attribute when showTicks true', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.showTicks.set(true);
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-show-ticks')).toBe(''));
    });

    it('reflects size and color attribute changes', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.size.set('lg');
      fixture.componentInstance.color.set('danger');
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-size')).toBe('lg');
        expect(host.getAttribute('data-color')).toBe('danger');
      });
    });

    it('reflects disabled and aria-disabled on host when disabled', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('thumb count & a11y', () => {
    it('renders one thumb per value', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(getThumbs(host).length).toBe(1);

      fixture.componentInstance.values.set([30, 70]);
      await flush(fixture);
      await waitFor(() => expect(getThumbs(host).length).toBe(2));

      fixture.componentInstance.values.set([20, 50, 80]);
      await flush(fixture);
      await waitFor(() => expect(getThumbs(host).length).toBe(3));
    });

    it('each thumb exposes slider arias', () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      expect(thumb.getAttribute('role')).toBe('slider');
      expect(thumb.getAttribute('aria-valuemin')).toBe('0');
      expect(thumb.getAttribute('aria-valuemax')).toBe('100');
      expect(thumb.getAttribute('aria-valuenow')).toBe('50');
      expect(thumb.getAttribute('aria-orientation')).toBe('horizontal');
      expect(thumb.getAttribute('tabindex')).toBe('0');
    });

    it('thumb aria-orientation reflects direction', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-orientation')).toBe('vertical'));
    });

    it('single thumb aria-label is base label', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.ariaLabel.set('volume');
      await flush(fixture);

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-label')).toBe('volume'));
    });

    it('multi thumb aria-label is suffixed with one-based index', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.ariaLabel.set('volume');
      fixture.componentInstance.values.set([20, 50, 80]);
      await flush(fixture);

      await waitFor(() => {
        expect(getThumb(host, 0).getAttribute('aria-label')).toBe('volume 1');
        expect(getThumb(host, 1).getAttribute('aria-label')).toBe('volume 2');
        expect(getThumb(host, 2).getAttribute('aria-label')).toBe('volume 3');
      });
    });

    it('disabled thumbs are non-interactive', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => {
        const thumb = getThumb(host, 0);

        expect(thumb.disabled).toBe(true);
        expect(thumb.getAttribute('tabindex')).toBe('-1');
        expect(thumb.getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('allowCrossing constraints', () => {
    it('allowCrossing true exposes global min/max on every thumb', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.values.set([20, 50, 80]);
      await flush(fixture);

      await waitFor(() => {
        const thumbs = getThumbs(host);

        for (const thumb of thumbs) {
          expect(thumb.getAttribute('aria-valuemin')).toBe('0');
          expect(thumb.getAttribute('aria-valuemax')).toBe('100');
        }
      });
    });

    it('allowCrossing false constrains aria min/max by neighbors', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.values.set([20, 50, 80]);
      fixture.componentInstance.allowCrossing.set(false);
      await flush(fixture);

      await waitFor(() => {
        // values=[20, 50, 80]
        expect(getThumb(host, 0).getAttribute('aria-valuemin')).toBe('0');
        expect(getThumb(host, 0).getAttribute('aria-valuemax')).toBe('50');
        expect(getThumb(host, 1).getAttribute('aria-valuemin')).toBe('20');
        expect(getThumb(host, 1).getAttribute('aria-valuemax')).toBe('80');
        expect(getThumb(host, 2).getAttribute('aria-valuemin')).toBe('50');
        expect(getThumb(host, 2).getAttribute('aria-valuemax')).toBe('100');
      });
    });

    it('allowCrossing false clamps keyboard at neighbor', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.values.set([40, 40]);
      fixture.componentInstance.allowCrossing.set(false);
      await flush(fixture);

      await waitFor(() => expect(getThumbs(host).length).toBe(2));

      // values=[40, 40]: pressing End on thumb 0 should jump to thumbAriaValueMax(0)=40 (clamped)
      pressKey(getThumb(host, 0), 'End');

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('40'));

      // pressing End on thumb 1 should jump to thumbAriaValueMax(1)=100 (no right neighbor)
      pressKey(getThumb(host, 1), 'End');

      await waitFor(() => expect(getThumb(host, 1).getAttribute('aria-valuenow')).toBe('100'));
    });
  });

  describe('keyboard (horizontal)', () => {
    it('ArrowRight increments by step on horizontal', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowRight');

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));
    });

    it('ArrowLeft decrements by step on horizontal', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowLeft');

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('49'));
    });

    it('ArrowUp and ArrowDown also increment and decrement on horizontal', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowUp');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

      pressKey(thumb, 'ArrowDown');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
    });

    it('shift arrow nudges by ten times step', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowRight', { shiftKey: true });

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('60'));
    });

    it('PageUp and PageDown nudge by ten percent of range', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.max.set(200);
      await flush(fixture);

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuemax')).toBe('200'));

      const thumb = getThumb(host, 0);

      // range = 200, pageStep = max(1, 20) = 20; from 50 -> 70
      pressKey(thumb, 'PageUp');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('70'));

      pressKey(thumb, 'PageDown');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
    });

    it('Home jumps to constrained min', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'Home');

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('0'));
    });

    it('End jumps to constrained max', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'End');

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('100'));
    });

    it('Home and End respect allowCrossing false neighbors', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.values.set([30, 70]);
      fixture.componentInstance.allowCrossing.set(false);
      await flush(fixture);

      await waitFor(() => expect(getThumbs(host).length).toBe(2));

      // values=[30, 70]: End on thumb 0 -> 70 (neighbor max)
      pressKey(getThumb(host, 0), 'End');

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('70'));

      // Home on thumb 1 -> 70 (neighbor min, since thumb 0 is now at 70)
      pressKey(getThumb(host, 1), 'Home');

      await waitFor(() => expect(getThumb(host, 1).getAttribute('aria-valuenow')).toBe('70'));
    });

    it('keyboard snaps to step', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.step.set(10);
      await flush(fixture);

      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowRight');

      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('60'));
    });

    it('keyboard is no-op when disabled', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowRight');

      // give microtasks a chance to flush so a stray update would be visible
      await flush(fixture);

      expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    });

    it('non-handled key does not change value', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const thumb = getThumb(host, 0);

      pressKey(thumb, 'a');

      await flush(fixture);

      expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('keyboard (vertical)', () => {
    it('vertical ArrowUp increments and ArrowDown decrements', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));

      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowUp');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

      pressKey(thumb, 'ArrowDown');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
    });

    it('vertical ArrowRight and ArrowLeft also increment and decrement', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.direction.set('vertical');
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));

      const thumb = getThumb(host, 0);

      pressKey(thumb, 'ArrowRight');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

      pressKey(thumb, 'ArrowLeft');
      await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
    });
  });

  describe('ticks', () => {
    it('no ticks rendered by default', () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      expect(getTicks(host).length).toBe(0);
    });

    it('show ticks with tick count zero renders min and max ticks', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.showTicks.set(true);
      await flush(fixture);

      await waitFor(() => {
        const ticks = getTicks(host);

        expect(ticks.length).toBe(2);
        expect(ticks[0].querySelector('.tick-label')?.textContent?.trim()).toBe('0');
        expect(ticks[1].querySelector('.tick-label')?.textContent?.trim()).toBe('100');
      });
    });

    it('show ticks with tick count three renders five linearly spaced ticks', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.showTicks.set(true);
      fixture.componentInstance.tickCount.set(3);
      await flush(fixture);

      await waitFor(() => {
        const labels = getTicks(host).map((tick) => tick.querySelector('.tick-label')?.textContent?.trim());

        expect(labels).toEqual(['0', '25', '50', '75', '100']);
      });
    });

    it('no ticks when range is zero', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.showTicks.set(true);
      fixture.componentInstance.max.set(0);
      await flush(fixture);

      // wait for show-ticks attribute to be present so we know the ticks branch had a chance to render
      await waitFor(() => expect(host.getAttribute('data-show-ticks')).toBe(''));

      expect(getTicks(host).length).toBe(0);
    });
  });

  describe('fill bar', () => {
    it('single thumb fill starts at zero and ends at thumb percent', () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      const fill = host.querySelector('.fill') as HTMLElement;

      expect(fill.style.getPropertyValue('--slider-input-fill-start')).toBe('0%');
      expect(fill.style.getPropertyValue('--slider-input-fill-end')).toBe('50%');
    });

    it('multi thumb fill spans from lowest to highest', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.values.set([20, 50, 80]);
      await flush(fixture);

      await waitFor(() => {
        const fill = host.querySelector('.fill') as HTMLElement;

        // values=[20, 50, 80] -> fill from 20% to 80%
        expect(fill.style.getPropertyValue('--slider-input-fill-start')).toBe('20%');
        expect(fill.style.getPropertyValue('--slider-input-fill-end')).toBe('80%');
      });
    });
  });

  describe('output events', () => {
    it('keyboard nudge emits changed and valuesChange', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('changedCount=0');
      expect(readout.textContent).toContain('valuesChangeCount=0');

      pressKey(getThumb(host, 0), 'ArrowRight');

      await waitFor(() => {
        expect(readout.textContent).toContain('lastChanged=[51]');
        expect(readout.textContent).toContain('lastValuesChange=[51]');
        expect(readout.textContent).toContain('changedCount=1');
        expect(readout.textContent).toContain('valuesChangeCount=1');
      });
    });

    it('no-op keyboard change does not emit changed', async () => {
      const fixture = createHost();
      const host = queryByTestId(fixture, 'slider');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.values.set([10]);
      await flush(fixture);

      await waitFor(() => expect(readout.textContent).toContain('values=[10]'));

      // press Home to jump to 0
      pressKey(getThumb(host, 0), 'Home');

      await waitFor(() => expect(readout.textContent).toContain('values=[0]'));

      const countAfterHome = Number(readout.textContent?.match(/changedCount=(\d+)/)?.[1] ?? '-1');

      // press Home again: already at 0, finalValue === currentValues[0], no emission
      pressKey(getThumb(host, 0), 'Home');

      await flush(fixture);

      const countAfterSecondHome = Number(readout.textContent?.match(/changedCount=(\d+)/)?.[1] ?? '-1');

      expect(countAfterSecondHome).toBe(countAfterHome);
    });
  });

  describe('reactive forms', () => {
    it('form control setValue writes through to thumb', async () => {
      const fixture = createReactiveHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.formControl.setValue([25]);
      await flush(fixture);

      await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('25'));
    });

    it('keyboard nudge updates form control value', async () => {
      const fixture = createReactiveHost();
      const host = queryByTestId(fixture, 'slider');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('value=[50]');

      pressKey(getThumb(host, 0), 'ArrowRight');

      await waitFor(() => expect(readout.textContent).toContain('value=[51]'));
    });

    it('form control disable disables slider', async () => {
      const fixture = createReactiveHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.formControl.disable();
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(getThumb(host, 0).disabled).toBe(true);
      });
    });

    it('form control enable re-enables slider', async () => {
      const fixture = createReactiveHost();
      const host = queryByTestId(fixture, 'slider');

      fixture.componentInstance.formControl.disable();
      await flush(fixture);

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      fixture.componentInstance.formControl.enable();
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBeNull();
        expect(getThumb(host, 0).disabled).toBe(false);
      });
    });

    it('keyboard nudge marks form control touched', async () => {
      const fixture = createReactiveHost();
      const host = queryByTestId(fixture, 'slider');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('touched=false');

      pressKey(getThumb(host, 0), 'ArrowRight');

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });
  });
});
