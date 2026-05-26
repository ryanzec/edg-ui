import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { TimeInput, type TimeInputFormat } from './time-input';

@Component({
  selector: 'story-time-input-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: `
    <org-time-input
      data-testid="time-input"
      [name]="name()"
      [format]="format()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [error]="error()"
      [ariaLabel]="ariaLabel()"
      [(value)]="value"
      (focused)="onFocused()"
      (blurred)="onBlurred()"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-format-12h" (click)="format.set('12-hour')">format-12h</button>
      <button type="button" data-testid="ctl-format-24h" (click)="format.set('24-hour')">format-24h</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-readonly-on" (click)="readonly.set(true)">readonly-on</button>
      <button type="button" data-testid="ctl-readonly-off" (click)="readonly.set(false)">readonly-off</button>
      <button type="button" data-testid="ctl-error-on" (click)="error.set(true)">error-on</button>
      <button type="button" data-testid="ctl-error-off" (click)="error.set(false)">error-off</button>
      <button type="button" data-testid="ctl-aria-label-set" (click)="ariaLabel.set('pick a time')">
        aria-label-set
      </button>
      <button type="button" data-testid="ctl-aria-label-clear" (click)="ariaLabel.set(undefined)">
        aria-label-clear
      </button>
      <button type="button" data-testid="ctl-value-set-12h" (click)="value.set('09:41 am')">value-set-12h</button>
      <button type="button" data-testid="ctl-value-set-24h" (click)="value.set('14:30')">value-set-24h</button>
      <button type="button" data-testid="ctl-value-clear" (click)="value.set('')">value-clear</button>
    </div>
  `,
})
class StoryTimeInputTestsShell {
  protected readonly name = signal<string>('time-input-test');
  protected readonly format = signal<TimeInputFormat>('12-hour');
  protected readonly disabled = signal<boolean>(false);
  protected readonly readonly = signal<boolean>(false);
  protected readonly error = signal<boolean>(false);
  protected readonly ariaLabel = signal<string | undefined>(undefined);
  protected readonly value = signal<string>('');

  protected readonly focusedCount = signal<number>(0);
  protected readonly blurredCount = signal<number>(0);

  protected readout(): string {
    return [
      `value="${this.value()}"`,
      `focusedCount=${this.focusedCount()}`,
      `blurredCount=${this.blurredCount()}`,
    ].join(' ');
  }

  protected onFocused(): void {
    this.focusedCount.update((current) => current + 1);
  }

  protected onBlurred(): void {
    this.blurredCount.update((current) => current + 1);
  }
}

@Component({
  selector: 'story-time-input-auto-focus-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: `
    <button type="button" data-testid="elsewhere">elsewhere</button>
    <org-time-input data-testid="time-input" name="auto-focus" [autoFocus]="true" />
  `,
})
class StoryTimeInputAutoFocusShell {}

@Component({
  selector: 'story-time-input-default-value-12h-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: ` <org-time-input data-testid="time-input" name="default-12h" defaultValue="09:41 am" /> `,
})
class StoryTimeInputDefaultValue12hShell {}

@Component({
  selector: 'story-time-input-default-value-24h-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: ` <org-time-input data-testid="time-input" name="default-24h" format="24-hour" defaultValue="14:30" /> `,
})
class StoryTimeInputDefaultValue24hShell {}

@Component({
  selector: 'story-time-input-reactive-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-time-input data-testid="time-input" name="reactive-form-time-input" [formControl]="timeControl" />
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set" (click)="timeControl.setValue('03:15 pm')">form-set</button>
      <button type="button" data-testid="ctl-form-clear" (click)="timeControl.setValue('')">form-clear</button>
      <button type="button" data-testid="ctl-form-disable" (click)="timeControl.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="timeControl.enable()">form-enable</button>
    </div>
  `,
})
class StoryTimeInputReactiveFormShell {
  protected readonly timeControl = new FormControl<string>('', { nonNullable: true });

  /**
   * subscribes to every form-control event (value / status / touched / pristine) so OnPush change detection
   * re-runs the readout after the cva chain finishes pushing into the formControl.
   */
  private readonly _formEvents = toSignal(this.timeControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value="${this.timeControl.value}"`,
      `disabled=${this.timeControl.disabled}`,
      `touched=${this.timeControl.touched}`,
      `dirty=${this.timeControl.dirty}`,
    ].join(' ');
  }
}

const meta: Meta = {
  title: 'Core/Components/TimeInput/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-time-input-tests-shell />`,
  moduleMetadata: { imports: [StoryTimeInputTestsShell] },
});

const renderAutoFocusShell: Story['render'] = () => ({
  template: `<story-time-input-auto-focus-shell />`,
  moduleMetadata: { imports: [StoryTimeInputAutoFocusShell] },
});

const renderDefaultValue12hShell: Story['render'] = () => ({
  template: `<story-time-input-default-value-12h-shell />`,
  moduleMetadata: { imports: [StoryTimeInputDefaultValue12hShell] },
});

const renderDefaultValue24hShell: Story['render'] = () => ({
  template: `<story-time-input-default-value-24h-shell />`,
  moduleMetadata: { imports: [StoryTimeInputDefaultValue24hShell] },
});

const renderReactiveFormShell: Story['render'] = () => ({
  template: `<story-time-input-reactive-form-shell />`,
  moduleMetadata: { imports: [StoryTimeInputReactiveFormShell] },
});

/** queries a segment span by its data-segment value. */
const getSegment = (host: HTMLElement, segment: 'hh' | 'mm' | 'meridiem'): HTMLElement | null =>
  host.querySelector(`[data-segment="${segment}"]`);

/** focuses the time-input shell and waits for the focused marker. */
const focusShell = async (host: HTMLElement): Promise<void> => {
  host.focus();

  await waitFor(() => expect(host.getAttribute('data-focused')).toBe('1'));
};

// host attributes

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await expect(host.getAttribute('role')).toBe('group');
    await expect(host.getAttribute('tabindex')).toBe('0');
    await expect(host.getAttribute('data-time-input')).toBe('1');
    await expect(host.getAttribute('data-variant')).toBe('bordered');
    await expect(host.getAttribute('data-format')).toBe('12-hour');
    await expect(host.getAttribute('data-has-pre')).toBe('1');
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('data-readonly')).toBeNull();
    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(host.getAttribute('data-focused')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsFormatHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));

    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));
  },
};

export const AppliesDisabledHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
      expect(host.getAttribute('tabindex')).toBe('-1');
    });
  },
};

export const AppliesReadonlyHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-readonly-on'));

    await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));
  },
};

export const AppliesErrorStateHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-error-on'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
  },
};

export const AppliesAriaLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-aria-label-set'));

    await waitFor(() => expect(host.getAttribute('aria-label')).toBe('pick a time'));
  },
};

// segment rendering

export const Renders12HourFormatWithThreeSegments: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await expect(getSegment(host, 'hh')).not.toBeNull();
    await expect(getSegment(host, 'mm')).not.toBeNull();
    await expect(getSegment(host, 'meridiem')).not.toBeNull();
  },
};

export const Renders24HourFormatWithTwoSegments: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));

    await waitFor(() => {
      expect(getSegment(host, 'hh')).not.toBeNull();
      expect(getSegment(host, 'mm')).not.toBeNull();
      expect(getSegment(host, 'meridiem')).toBeNull();
    });
  },
};

export const EmptySegmentsRenderPlaceholderDashes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    const hours = getSegment(host, 'hh') as HTMLElement;
    const minutes = getSegment(host, 'mm') as HTMLElement;
    const meridiem = getSegment(host, 'meridiem') as HTMLElement;

    await expect(hours.textContent?.trim()).toBe('--');
    await expect(minutes.textContent?.trim()).toBe('--');
    await expect(meridiem.textContent?.trim()).toBe('--');
    await expect(hours.getAttribute('data-empty')).toBe('1');
    await expect(minutes.getAttribute('data-empty')).toBe('1');
    await expect(meridiem.getAttribute('data-empty')).toBe('1');
  },
};

export const RendersHiddenInputWithNameAndFormattedValue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const hiddenInput = host.querySelector('input[type="hidden"]') as HTMLInputElement;

    await expect(hiddenInput.getAttribute('name')).toBe('time-input-test');
    await expect(hiddenInput.value).toBe('');

    await fireEvent.click(canvas.getByTestId('ctl-value-set-12h'));

    await waitFor(() => expect(hiddenInput.value).toBe('09:41 am'));
  },
};

// focus / blur

export const FocusingShellMarksHoursActiveAndAppliesFocusedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    const hours = getSegment(host, 'hh') as HTMLElement;

    await expect(hours.getAttribute('data-selected')).toBe('1');
  },
};

export const BlurringShellClearsFocusedAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    host.blur();

    await waitFor(() => expect(host.getAttribute('data-focused')).toBeNull());
  },
};

export const EmitsFocusedOutputOnFocus: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await focusShell(host);

    await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
  },
};

export const EmitsBlurredOutputOnBlur: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await focusShell(host);

    host.blur();

    await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
  },
};

export const AutoFocusFocusesShellOnMount: Story = {
  render: renderAutoFocusShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await waitFor(() => expect(host.getAttribute('data-focused')).toBe('1'));
  },
};

// segment selection (mouse)

export const MouseDownOnMinutesActivatesMinutesSegment: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    const minutes = getSegment(host, 'mm') as HTMLElement;
    fireEvent.mouseDown(minutes);

    await waitFor(() => expect(minutes.getAttribute('data-selected')).toBe('1'));
  },
};

export const MouseDownOnMeridiemActivatesMeridiemSegment: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    const meridiem = getSegment(host, 'meridiem') as HTMLElement;
    fireEvent.mouseDown(meridiem);

    await waitFor(() => expect(meridiem.getAttribute('data-selected')).toBe('1'));
  },
};

export const MouseDownIgnoredWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    const minutes = getSegment(host, 'mm') as HTMLElement;
    fireEvent.mouseDown(minutes);

    // active segment stays at hours (the default) because brain.selectSegment guards on disabled
    const hours = getSegment(host, 'hh') as HTMLElement;

    await expect(hours.getAttribute('data-selected')).toBe('1');
    await expect(minutes.getAttribute('data-selected')).toBeNull();
  },
};

export const MouseDownIgnoredWhenReadonly: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-readonly-on'));
    await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));

    const minutes = getSegment(host, 'mm') as HTMLElement;
    fireEvent.mouseDown(minutes);

    const hours = getSegment(host, 'hh') as HTMLElement;

    await expect(hours.getAttribute('data-selected')).toBe('1');
    await expect(minutes.getAttribute('data-selected')).toBeNull();
  },
};

// arrow navigation (12-hour)

export const ArrowRightCyclesSegmentsForwardIn12Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
  },
};

export const ArrowLeftCyclesSegmentsBackwardIn12Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
  },
};

// arrow navigation (24-hour)

export const ArrowRightCyclesHoursAndMinutesIn24Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
  },
};

// arrow up/down stepping

export const ArrowUpFromEmptyHoursSetsTo01In12Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));
  },
};

export const ArrowDownFromEmptyHoursSetsTo12In12Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
  },
};

export const ArrowUpWrapsHoursFrom12To1In12Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });
    fireEvent.keyDown(host, { key: '2' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));

    // active is now minutes — go back to hours
    fireEvent.keyDown(host, { key: 'ArrowLeft' });
    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));
  },
};

export const ArrowUpFromEmptyHoursSetsTo00In24Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('00'));
  },
};

export const ArrowDownFromEmptyHoursSetsTo23In24Hour: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('23'));
  },
};

export const ArrowUpStepsMinutes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('00'));

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('01'));
  },
};

export const ArrowUpTogglesMeridiem: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));

    fireEvent.keyDown(host, { key: 'ArrowUp' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM'));
  },
};

// digit input (12-hour)

export const HoursDigit12HourWaitsForSecondDigitOnZeroOrOne: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01');
      expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const HoursDigit12HourAdvancesOnDigitGreaterThanOne: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '5' });

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('05');
      expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const HoursDigit12HourCapsSecondDigitAt12: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });
    fireEvent.keyDown(host, { key: '9' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
  },
};

export const HoursDigit12HourZeroZeroBecomes12: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '0' });
    fireEvent.keyDown(host, { key: '0' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
  },
};

export const MinutesDigitWaitsOnZeroThroughFive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: '3' });

    await waitFor(() => {
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('03');
      expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const MinutesDigitAdvancesToMeridiemIn12HourOnDigitGreaterThanFive: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });
    fireEvent.keyDown(host, { key: '7' });

    await waitFor(() => {
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('07');
      expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const MinutesSecondDigitAppends: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });
    fireEvent.keyDown(host, { key: '3' });
    fireEvent.keyDown(host, { key: '5' });

    await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('35'));
  },
};

// digit input (24-hour)

export const HoursDigit24HourWaitsForSecondDigitOnZeroThroughTwo: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: '2' });

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('02');
      expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const HoursDigit24HourAdvancesOnDigitGreaterThanTwo: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: '5' });

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('05');
      expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

export const HoursDigit24HourCapsSecondDigitAt23: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: '2' });
    fireEvent.keyDown(host, { key: '9' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('23'));
  },
};

export const MinutesIn24HourStaysOnMinutesAfterFill: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });
    fireEvent.keyDown(host, { key: '7' });

    // in 24-hour there is no meridiem segment, so the next-segment target stays minutes
    await waitFor(() => {
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('07');
      expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

// meridiem A/P keys

export const LowercaseAKeySetsMeridiemToAm: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'a' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM'));
  },
};

export const UppercasePKeySetsMeridiemToPm: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowLeft' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    fireEvent.keyDown(host, { key: 'P' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));
  },
};

// backspace / delete

export const BackspaceClearsActiveHoursSegment: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));

    fireEvent.keyDown(host, { key: 'Backspace' });

    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--'));
  },
};

export const BackspaceClearsActiveMinutesSegment: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });
    fireEvent.keyDown(host, { key: '3' });

    await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('03'));

    fireEvent.keyDown(host, { key: 'Backspace' });

    await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('--'));
  },
};

export const DeleteClearsActiveMeridiemSegment: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowLeft' });
    fireEvent.keyDown(host, { key: 'p' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));

    fireEvent.keyDown(host, { key: 'Delete' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('--'));
  },
};

// disabled / readonly gating for keyboard

export const DisabledBlocksKeyboardInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-disabled-on'));
    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

    host.focus();
    fireEvent.keyDown(host, { key: '1' });

    await expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
  },
};

export const ReadonlyBlocksKeyboardInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-readonly-on'));
    await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));

    await focusShell(host);
    fireEvent.keyDown(host, { key: '1' });

    await expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
  },
};

// value model two-way binding

export const TypingFullTimeEmitsValueViaModel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });
    fireEvent.keyDown(host, { key: '2' });
    fireEvent.keyDown(host, { key: '3' });
    fireEvent.keyDown(host, { key: '0' });
    fireEvent.keyDown(host, { key: 'p' });

    await waitFor(() => expect(readout.textContent).toContain('value="12:30 pm"'));
  },
};

export const PartialEntryKeepsValueEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '1' });
    fireEvent.keyDown(host, { key: '2' });
    fireEvent.keyDown(host, { key: '3' });
    fireEvent.keyDown(host, { key: '0' });

    // hours + minutes filled but no meridiem in 12-hour → value stays empty
    await expect(readout.textContent).toContain('value=""');
  },
};

export const ExternalValueParsesInto12HourSegments: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-value-set-12h'));

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('41');
      expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM');
    });
  },
};

export const ExternalValueParsesInto24HourSegments: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));
    await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

    await fireEvent.click(canvas.getByTestId('ctl-value-set-24h'));

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('14');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('30');
    });
  },
};

export const ExternalClearedValueEmptiesSegments: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-value-set-12h'));
    await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09'));

    await fireEvent.click(canvas.getByTestId('ctl-value-clear'));

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('--');
      expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('--');
    });
  },
};

// default value

export const DefaultValueAppliedAtInit12Hour: Story = {
  render: renderDefaultValue12hShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('41');
      expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM');
    });
  },
};

export const DefaultValueAppliedAtInit24Hour: Story = {
  render: renderDefaultValue24hShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('14');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('30');
    });
  },
};

// format flip side-effect

export const FlippingTo24HourWhileMeridiemActiveSnapsBackToMinutes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await focusShell(host);

    fireEvent.keyDown(host, { key: 'ArrowRight' });
    fireEvent.keyDown(host, { key: 'ArrowRight' });

    await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

    await fireEvent.click(canvas.getByTestId('ctl-format-24h'));

    await waitFor(() => {
      expect(getSegment(host, 'meridiem')).toBeNull();
      expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
    });
  },
};

// reactive form integration

export const FormControlSetValueSyncsToTimeInput: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-form-set'));

    await waitFor(() => {
      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('03');
      expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('15');
      expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM');
    });
  },
};

export const TypingIntoFieldPropagatesToFormControl: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await focusShell(host);

    fireEvent.keyDown(host, { key: '4' });
    fireEvent.keyDown(host, { key: '1' });
    fireEvent.keyDown(host, { key: '5' });
    fireEvent.keyDown(host, { key: 'a' });

    await waitFor(() => expect(readout.textContent).toContain('value="04:15 am"'));
  },
};

export const FormControlDisableDisablesField: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');

    await fireEvent.click(canvas.getByTestId('ctl-form-disable'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const BlurMarksFormControlTouched: Story = {
  render: renderReactiveFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('time-input');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    await focusShell(host);
    host.blur();

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};
