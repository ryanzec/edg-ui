import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { SliderInput, type SliderInputColor, type SliderInputSize, type SliderInputDirection } from './slider-input';

@Component({
  selector: 'story-slider-input-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-direction-vertical" (click)="direction.set('vertical')">
        direction-vertical
      </button>
      <button type="button" data-testid="ctl-direction-horizontal" (click)="direction.set('horizontal')">
        direction-horizontal
      </button>
      <button type="button" data-testid="ctl-step-5" (click)="step.set(5)">step-5</button>
      <button type="button" data-testid="ctl-step-10" (click)="step.set(10)">step-10</button>
      <button type="button" data-testid="ctl-max-200" (click)="max.set(200)">max-200</button>
      <button type="button" data-testid="ctl-max-zero" (click)="max.set(0)">max-zero</button>
      <button type="button" data-testid="ctl-values-single" (click)="values.set([50])">values-single</button>
      <button type="button" data-testid="ctl-values-single-low" (click)="values.set([10])">values-single-low</button>
      <button type="button" data-testid="ctl-values-two" (click)="values.set([30, 70])">values-two</button>
      <button type="button" data-testid="ctl-values-two-touching" (click)="values.set([40, 40])">
        values-two-touching
      </button>
      <button type="button" data-testid="ctl-values-three" (click)="values.set([20, 50, 80])">values-three</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-allow-crossing-off" (click)="allowCrossing.set(false)">
        allow-crossing-off
      </button>
      <button type="button" data-testid="ctl-allow-crossing-on" (click)="allowCrossing.set(true)">
        allow-crossing-on
      </button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-show-ticks-on" (click)="showTicks.set(true)">show-ticks-on</button>
      <button type="button" data-testid="ctl-show-ticks-off" (click)="showTicks.set(false)">show-ticks-off</button>
      <button type="button" data-testid="ctl-tick-count-3" (click)="tickCount.set(3)">tick-count-3</button>
      <button type="button" data-testid="ctl-tick-count-0" (click)="tickCount.set(0)">tick-count-0</button>
      <button type="button" data-testid="ctl-aria-label-volume" (click)="ariaLabel.set('volume')">
        aria-label-volume
      </button>
    </div>
  `,
})
class StorySliderInputTestsShell {
  protected readonly direction = signal<SliderInputDirection>('horizontal');
  protected readonly min = signal<number>(0);
  protected readonly max = signal<number>(100);
  protected readonly step = signal<number>(1);
  protected readonly values = signal<number[]>([50]);
  protected readonly disabled = signal<boolean>(false);
  protected readonly allowCrossing = signal<boolean>(true);
  protected readonly color = signal<SliderInputColor>('primary');
  protected readonly size = signal<SliderInputSize>('base');
  protected readonly showTicks = signal<boolean>(false);
  protected readonly tickCount = signal<number>(0);
  protected readonly ariaLabel = signal<string>('slider');

  protected readonly lastValuesChange = signal<number[]>([]);
  protected readonly lastChanged = signal<number[]>([]);
  protected readonly valuesChangeCount = signal<number>(0);
  protected readonly changedCount = signal<number>(0);

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
  selector: 'story-slider-input-reactive-form-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-25" (click)="formControl.setValue([25])">form-set-25</button>
      <button type="button" data-testid="ctl-form-set-75" (click)="formControl.setValue([75])">form-set-75</button>
      <button type="button" data-testid="ctl-form-disable" (click)="formControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="formControl.enable()">form-enable</button>
    </div>
  `,
})
class StorySliderInputReactiveFormShell {
  protected readonly formControl = new FormControl<number[]>([50], { nonNullable: true });

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

const meta: Meta = {
  title: 'Core/Components/Slider Input/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-slider-input-tests-shell />`,
  moduleMetadata: { imports: [StorySliderInputTestsShell] },
});

const renderReactiveShell: Story['render'] = () => ({
  template: `<story-slider-input-reactive-form-shell />`,
  moduleMetadata: { imports: [StorySliderInputReactiveFormShell] },
});

const getThumb = (host: HTMLElement, index: number): HTMLButtonElement => {
  return host.querySelector(`[data-thumb-index="${index}"]`) as HTMLButtonElement;
};

const getThumbs = (host: HTMLElement): HTMLButtonElement[] => {
  return Array.from(host.querySelectorAll('[role="slider"]')) as HTMLButtonElement[];
};

const getTicks = (host: HTMLElement): HTMLElement[] => {
  return Array.from(host.querySelectorAll('.tick')) as HTMLElement[];
};

// host attributes & defaults

export const ReflectsDefaultSizeAndColorAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-color')).toBe('primary');
  },
};

export const OmitsShowTicksAttributeByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(host.getAttribute('data-show-ticks')).toBeNull();
  },
};

export const ReflectsDirectionAttributeOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(host.getAttribute('data-direction')).toBe('horizontal');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));
  },
};

export const ReflectsShowTicksAttributeWhenShowTicksTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-show-ticks-on'));

    await waitFor(() => expect(host.getAttribute('data-show-ticks')).toBe(''));
  },
};

export const ReflectsSizeAndColorAttributeChanges: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => {
      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
    });
  },
};

export const ReflectsDisabledAndAriaDisabledOnHostWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

// thumb count & a11y

export const RendersOneThumbPerValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(getThumbs(host).length).toBe(1);

    await userEvent.click(canvas.getByTestId('ctl-values-two'));
    await waitFor(() => expect(getThumbs(host).length).toBe(2));

    await userEvent.click(canvas.getByTestId('ctl-values-three'));
    await waitFor(() => expect(getThumbs(host).length).toBe(3));
  },
};

export const EachThumbExposesSliderArias: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    await expect(thumb.getAttribute('role')).toBe('slider');
    await expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    await expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    await expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    await expect(thumb.getAttribute('aria-orientation')).toBe('horizontal');
    await expect(thumb.getAttribute('tabindex')).toBe('0');
  },
};

export const ThumbAriaOrientationReflectsDirection: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-orientation')).toBe('vertical'));
  },
};

export const SingleThumbAriaLabelIsBaseLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-volume'));

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-label')).toBe('volume'));
  },
};

export const MultiThumbAriaLabelIsSuffixedWithOneBasedIndex: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-aria-label-volume'));
    await userEvent.click(canvas.getByTestId('ctl-values-three'));

    await waitFor(() => {
      expect(getThumb(host, 0).getAttribute('aria-label')).toBe('volume 1');
      expect(getThumb(host, 1).getAttribute('aria-label')).toBe('volume 2');
      expect(getThumb(host, 2).getAttribute('aria-label')).toBe('volume 3');
    });
  },
};

export const DisabledThumbsAreNonInteractive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      const thumb = getThumb(host, 0);

      expect(thumb.disabled).toBe(true);
      expect(thumb.getAttribute('tabindex')).toBe('-1');
      expect(thumb.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

// allowCrossing constraints

export const AllowCrossingTrueExposesGlobalMinMaxOnEveryThumb: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-values-three'));

    await waitFor(() => {
      const thumbs = getThumbs(host);

      for (const thumb of thumbs) {
        expect(thumb.getAttribute('aria-valuemin')).toBe('0');
        expect(thumb.getAttribute('aria-valuemax')).toBe('100');
      }
    });
  },
};

export const AllowCrossingFalseConstrainsAriaMinMaxByNeighbors: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-values-three'));
    await userEvent.click(canvas.getByTestId('ctl-allow-crossing-off'));

    await waitFor(() => {
      // values=[20, 50, 80]
      expect(getThumb(host, 0).getAttribute('aria-valuemin')).toBe('0');
      expect(getThumb(host, 0).getAttribute('aria-valuemax')).toBe('50');
      expect(getThumb(host, 1).getAttribute('aria-valuemin')).toBe('20');
      expect(getThumb(host, 1).getAttribute('aria-valuemax')).toBe('80');
      expect(getThumb(host, 2).getAttribute('aria-valuemin')).toBe('50');
      expect(getThumb(host, 2).getAttribute('aria-valuemax')).toBe('100');
    });
  },
};

export const AllowCrossingFalseClampsKeyboardAtNeighbor: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-values-two-touching'));
    await userEvent.click(canvas.getByTestId('ctl-allow-crossing-off'));

    await waitFor(() => expect(getThumbs(host).length).toBe(2));

    // values=[40, 40]: pressing End on thumb 0 should jump to thumbAriaValueMax(0)=40 (clamped)
    fireEvent.keyDown(getThumb(host, 0), { key: 'End' });

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('40'));

    // pressing End on thumb 1 should jump to thumbAriaValueMax(1)=100 (no right neighbor)
    fireEvent.keyDown(getThumb(host, 1), { key: 'End' });

    await waitFor(() => expect(getThumb(host, 1).getAttribute('aria-valuenow')).toBe('100'));
  },
};

// keyboard (horizontal)

export const ArrowRightIncrementsByStepOnHorizontal: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));
  },
};

export const ArrowLeftDecrementsByStepOnHorizontal: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('49'));
  },
};

export const ArrowUpAndArrowDownAlsoIncrementAndDecrementOnHorizontal: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowUp' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

    fireEvent.keyDown(thumb, { key: 'ArrowDown' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
  },
};

export const ShiftArrowNudgesByTenTimesStep: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowRight', shiftKey: true });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('60'));
  },
};

export const PageUpAndPageDownNudgeByTenPercentOfRange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-max-200'));

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuemax')).toBe('200'));

    const thumb = getThumb(host, 0);

    // range = 200, pageStep = max(1, 20) = 20; from 50 -> 70
    fireEvent.keyDown(thumb, { key: 'PageUp' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('70'));

    fireEvent.keyDown(thumb, { key: 'PageDown' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
  },
};

export const HomeJumpsToConstrainedMin: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'Home' });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('0'));
  },
};

export const EndJumpsToConstrainedMax: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'End' });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('100'));
  },
};

export const HomeAndEndRespectAllowCrossingFalseNeighbors: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-values-two'));
    await userEvent.click(canvas.getByTestId('ctl-allow-crossing-off'));

    await waitFor(() => expect(getThumbs(host).length).toBe(2));

    // values=[30, 70]: End on thumb 0 -> 70 (neighbor max)
    fireEvent.keyDown(getThumb(host, 0), { key: 'End' });

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('70'));

    // Home on thumb 1 -> 70 (neighbor min, since thumb 0 is now at 70)
    fireEvent.keyDown(getThumb(host, 1), { key: 'Home' });

    await waitFor(() => expect(getThumb(host, 1).getAttribute('aria-valuenow')).toBe('70'));
  },
};

export const KeyboardSnapsToStep: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-step-10'));

    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('60'));
  },
};

export const KeyboardIsNoOpWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    // give microtasks a chance to flush so a stray update would be visible
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
  },
};

export const NonHandledKeyDoesNotChangeValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'a' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
  },
};

// keyboard (vertical)

export const VerticalArrowUpIncrementsAndArrowDownDecrements: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));

    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowUp' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

    fireEvent.keyDown(thumb, { key: 'ArrowDown' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
  },
};

export const VerticalArrowRightAndLeftAlsoIncrementAndDecrement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-direction-vertical'));

    await waitFor(() => expect(host.getAttribute('data-direction')).toBe('vertical'));

    const thumb = getThumb(host, 0);

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('51'));

    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
    await waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe('50'));
  },
};

// ticks

export const NoTicksRenderedByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await expect(getTicks(host).length).toBe(0);
  },
};

export const ShowTicksWithTickCountZeroRendersMinAndMaxTicks: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-show-ticks-on'));

    await waitFor(() => {
      const ticks = getTicks(host);

      expect(ticks.length).toBe(2);
      expect(ticks[0].querySelector('.tick-label')?.textContent?.trim()).toBe('0');
      expect(ticks[1].querySelector('.tick-label')?.textContent?.trim()).toBe('100');
    });
  },
};

export const ShowTicksWithTickCountThreeRendersFiveLinearlySpacedTicks: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-show-ticks-on'));
    await userEvent.click(canvas.getByTestId('ctl-tick-count-3'));

    await waitFor(() => {
      const labels = getTicks(host).map((tick) => tick.querySelector('.tick-label')?.textContent?.trim());

      expect(labels).toEqual(['0', '25', '50', '75', '100']);
    });
  },
};

export const NoTicksWhenRangeIsZero: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-show-ticks-on'));
    await userEvent.click(canvas.getByTestId('ctl-max-zero'));

    // wait for show-ticks attribute to be present so we know the ticks branch had a chance to render
    await waitFor(() => expect(host.getAttribute('data-show-ticks')).toBe(''));

    expect(getTicks(host).length).toBe(0);
  },
};

// fill bar

export const SingleThumbFillStartsAtZeroAndEndsAtThumbPercent: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    const fill = host.querySelector('.fill') as HTMLElement;

    await expect(fill.style.getPropertyValue('--slider-input-fill-start')).toBe('0%');
    await expect(fill.style.getPropertyValue('--slider-input-fill-end')).toBe('50%');
  },
};

export const MultiThumbFillSpansFromLowestToHighest: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-values-three'));

    await waitFor(() => {
      const fill = host.querySelector('.fill') as HTMLElement;

      // values=[20, 50, 80] -> fill from 20% to 80%
      expect(fill.style.getPropertyValue('--slider-input-fill-start')).toBe('20%');
      expect(fill.style.getPropertyValue('--slider-input-fill-end')).toBe('80%');
    });
  },
};

// output events

export const KeyboardNudgeEmitsChangedAndValuesChange: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('changedCount=0');
    await expect(readout.textContent).toContain('valuesChangeCount=0');

    fireEvent.keyDown(getThumb(host, 0), { key: 'ArrowRight' });

    await waitFor(() => {
      expect(readout.textContent).toContain('lastChanged=[51]');
      expect(readout.textContent).toContain('lastValuesChange=[51]');
      expect(readout.textContent).toContain('changedCount=1');
      expect(readout.textContent).toContain('valuesChangeCount=1');
    });
  },
};

export const NoOpKeyboardChangeDoesNotEmitChanged: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const readout = await canvas.findByTestId('readout');

    // values=[10] near the min: ArrowLeft from 10 -> 9, that's a change. instead use values-single (50) and PageDown 10x to reach 0, then PageDown again to stay at 0 with no emission
    await userEvent.click(canvas.getByTestId('ctl-values-single-low'));

    await waitFor(() => expect(readout.textContent).toContain('values=[10]'));

    // press Home to jump to 0
    fireEvent.keyDown(getThumb(host, 0), { key: 'Home' });

    await waitFor(() => expect(readout.textContent).toContain('values=[0]'));

    const countAfterHome = Number(readout.textContent?.match(/changedCount=(\d+)/)?.[1] ?? '-1');

    // press Home again: already at 0, finalValue === currentValues[0], no emission
    fireEvent.keyDown(getThumb(host, 0), { key: 'Home' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const countAfterSecondHome = Number(readout.textContent?.match(/changedCount=(\d+)/)?.[1] ?? '-1');

    expect(countAfterSecondHome).toBe(countAfterHome);
  },
};

// reactive forms

export const FormControlSetValueWritesThroughToThumb: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-form-set-25'));

    await waitFor(() => expect(getThumb(host, 0).getAttribute('aria-valuenow')).toBe('25'));
  },
};

export const KeyboardNudgeUpdatesFormControlValue: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('value=[50]');

    fireEvent.keyDown(getThumb(host, 0), { key: 'ArrowRight' });

    await waitFor(() => expect(readout.textContent).toContain('value=[51]'));
  },
};

export const FormControlDisableDisablesSlider: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(getThumb(host, 0).disabled).toBe(true);
    });
  },
};

export const FormControlEnableReEnablesSlider: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(getThumb(host, 0).disabled).toBe(false);
    });
  },
};

export const KeyboardNudgeMarksFormControlTouched: Story = {
  render: renderReactiveShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('slider');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    fireEvent.keyDown(getThumb(host, 0), { key: 'ArrowRight' });

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};
