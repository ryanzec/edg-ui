import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { TimeInput, type TimeInputFormat } from './time-input';

@Component({
  selector: 'test-time-input-interactive-host',
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
  `,
})
class TimeInputInteractiveHost {
  public readonly name = signal<string>('time-input-test');
  public readonly format = signal<TimeInputFormat>('12-hour');
  public readonly disabled = signal<boolean>(false);
  public readonly readonly = signal<boolean>(false);
  public readonly error = signal<boolean>(false);
  public readonly ariaLabel = signal<string | undefined>(undefined);
  public readonly value = signal<string>('');

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
  selector: 'test-time-input-auto-focus-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: `
    <button type="button" data-testid="elsewhere">elsewhere</button>
    <org-time-input data-testid="time-input" name="auto-focus" [autoFocus]="true" />
  `,
})
class TimeInputAutoFocusHost {}

@Component({
  selector: 'test-time-input-default-value-12h-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: ` <org-time-input data-testid="time-input" name="default-12h" defaultValue="09:41 am" /> `,
})
class TimeInputDefaultValue12hHost {}

@Component({
  selector: 'test-time-input-default-value-24h-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput],
  host: { class: 'block' },
  template: ` <org-time-input data-testid="time-input" name="default-24h" format="24-hour" defaultValue="14:30" /> `,
})
class TimeInputDefaultValue24hHost {}

@Component({
  selector: 'test-time-input-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeInput, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-time-input data-testid="time-input" name="reactive-form-time-input" [formControl]="timeControl" />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class TimeInputReactiveFormHost {
  public readonly timeControl = new FormControl<string>('', { nonNullable: true });

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

type TimeInputHostConfig = {
  name?: string;
  format?: TimeInputFormat;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  ariaLabel?: string;
  value?: string;
};

describe('TimeInput (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveTimeInput = (config: TimeInputHostConfig = {}): ComponentFixture<TimeInputInteractiveHost> =>
    createFixture(TimeInputInteractiveHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.format !== undefined) {
        instance.format.set(config.format);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.readonly !== undefined) {
        instance.readonly.set(config.readonly);
      }

      if (config.error !== undefined) {
        instance.error.set(config.error);
      }

      if (config.ariaLabel !== undefined) {
        instance.ariaLabel.set(config.ariaLabel);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }
    });

  /** queries a segment span by its data-segment value. */
  const getSegment = (host: HTMLElement, segment: 'hh' | 'mm' | 'meridiem'): HTMLElement | null =>
    host.querySelector(`[data-segment="${segment}"]`);

  /** focuses the time-input shell and waits for the focused marker. */
  const focusShell = async (host: HTMLElement): Promise<void> => {
    host.focus();

    await waitFor(() => expect(host.getAttribute('data-focused')).toBe('1'));
  };

  /** dispatches a cancelable keydown on the shell, mirroring the user pressing a key while focused. */
  const pressKey = (host: HTMLElement, key: string): void => {
    host.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  };

  /** dispatches a mousedown on a segment span, mirroring the user clicking it. */
  const mouseDownSegment = (segment: HTMLElement): void => {
    segment.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  };

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('renders the default host attributes', () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      expect(host.getAttribute('role')).toBe('group');
      expect(host.getAttribute('tabindex')).toBe('0');
      expect(host.getAttribute('data-time-input')).toBe('1');
      expect(host.getAttribute('data-variant')).toBe('bordered');
      expect(host.getAttribute('data-format')).toBe('12-hour');
      expect(host.getAttribute('data-has-pre')).toBe('1');
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-readonly')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-focused')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the format host attribute', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.format.set('24-hour');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));
    });

    it('applies the disabled host attributes', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
        expect(host.getAttribute('tabindex')).toBe('-1');
      });
    });

    it('applies the readonly host attribute', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.readonly.set(true);

      await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));
    });

    it('applies the error state host attribute', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.error.set(true);

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
    });

    it('applies the aria-label', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.ariaLabel.set('pick a time');

      await waitFor(() => expect(host.getAttribute('aria-label')).toBe('pick a time'));
    });
  });

  describe('segment rendering', () => {
    it('renders three segments in 12-hour format', () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      expect(getSegment(host, 'hh')).not.toBeNull();
      expect(getSegment(host, 'mm')).not.toBeNull();
      expect(getSegment(host, 'meridiem')).not.toBeNull();
    });

    it('renders two segments in 24-hour format', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.format.set('24-hour');

      await waitFor(() => {
        expect(getSegment(host, 'hh')).not.toBeNull();
        expect(getSegment(host, 'mm')).not.toBeNull();
        expect(getSegment(host, 'meridiem')).toBeNull();
      });
    });

    it('renders placeholder dashes for empty segments', () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      const hours = getSegment(host, 'hh') as HTMLElement;
      const minutes = getSegment(host, 'mm') as HTMLElement;
      const meridiem = getSegment(host, 'meridiem') as HTMLElement;

      expect(hours.textContent?.trim()).toBe('--');
      expect(minutes.textContent?.trim()).toBe('--');
      expect(meridiem.textContent?.trim()).toBe('--');
      expect(hours.getAttribute('data-empty')).toBe('1');
      expect(minutes.getAttribute('data-empty')).toBe('1');
      expect(meridiem.getAttribute('data-empty')).toBe('1');
    });

    it('renders a hidden input with the name and formatted value', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');
      const hiddenInput = host.querySelector('input[type="hidden"]') as HTMLInputElement;

      expect(hiddenInput.getAttribute('name')).toBe('time-input-test');
      expect(hiddenInput.value).toBe('');

      fixture.componentInstance.value.set('09:41 am');

      await waitFor(() => expect(hiddenInput.value).toBe('09:41 am'));
    });
  });

  describe('focus / blur', () => {
    it('marks hours active and applies the focused attribute on focus', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      const hours = getSegment(host, 'hh') as HTMLElement;

      expect(hours.getAttribute('data-selected')).toBe('1');
    });

    it('clears the focused attribute on blur', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      host.blur();

      await waitFor(() => expect(host.getAttribute('data-focused')).toBeNull());
    });

    it('emits the focused output on focus', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      await focusShell(host);

      await waitFor(() => expect(readout.textContent).toContain('focusedCount=1'));
    });

    it('emits the blurred output on blur', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      await focusShell(host);

      host.blur();

      await waitFor(() => expect(readout.textContent).toContain('blurredCount=1'));
    });

    it('auto-focuses the shell on mount', async () => {
      const fixture = createFixture(TimeInputAutoFocusHost);
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-focused')).toBe('1'));
    });
  });

  describe('segment selection (mouse)', () => {
    it('activates the minutes segment on mouse down', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      const minutes = getSegment(host, 'mm') as HTMLElement;
      mouseDownSegment(minutes);

      await waitFor(() => expect(minutes.getAttribute('data-selected')).toBe('1'));
    });

    it('activates the meridiem segment on mouse down', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      const meridiem = getSegment(host, 'meridiem') as HTMLElement;
      mouseDownSegment(meridiem);

      await waitFor(() => expect(meridiem.getAttribute('data-selected')).toBe('1'));
    });

    it('ignores mouse down when disabled', async () => {
      const fixture = createInteractiveTimeInput({ disabled: true });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      const minutes = getSegment(host, 'mm') as HTMLElement;
      mouseDownSegment(minutes);
      await flush(fixture);

      // active segment stays at hours (the default) because brain.selectSegment guards on disabled
      const hours = getSegment(host, 'hh') as HTMLElement;

      expect(hours.getAttribute('data-selected')).toBe('1');
      expect(minutes.getAttribute('data-selected')).toBeNull();
    });

    it('ignores mouse down when readonly', async () => {
      const fixture = createInteractiveTimeInput({ readonly: true });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));

      const minutes = getSegment(host, 'mm') as HTMLElement;
      mouseDownSegment(minutes);
      await flush(fixture);

      const hours = getSegment(host, 'hh') as HTMLElement;

      expect(hours.getAttribute('data-selected')).toBe('1');
      expect(minutes.getAttribute('data-selected')).toBeNull();
    });
  });

  describe('arrow navigation (12-hour)', () => {
    it('cycles segments forward with ArrowRight', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
    });

    it('cycles segments backward with ArrowLeft', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
    });
  });

  describe('arrow navigation (24-hour)', () => {
    it('cycles only hours and minutes with ArrowRight', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1'));
    });
  });

  describe('arrow up / down stepping', () => {
    it('sets hours to 01 from empty on ArrowUp in 12-hour', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowUp');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));
    });

    it('sets hours to 12 from empty on ArrowDown in 12-hour', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowDown');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
    });

    it('wraps hours from 12 to 01 on ArrowUp in 12-hour', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '1');
      pressKey(host, '2');
      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));

      // active is now minutes — go back to hours
      pressKey(host, 'ArrowLeft');
      pressKey(host, 'ArrowUp');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));
    });

    it('sets hours to 00 from empty on ArrowUp in 24-hour', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, 'ArrowUp');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('00'));
    });

    it('sets hours to 23 from empty on ArrowDown in 24-hour', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, 'ArrowDown');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('23'));
    });

    it('steps minutes with ArrowUp', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowUp');
      await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('00'));

      pressKey(host, 'ArrowUp');
      await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('01'));
    });

    it('toggles the meridiem with ArrowUp', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'ArrowUp');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));

      pressKey(host, 'ArrowUp');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM'));
    });
  });

  describe('digit input (12-hour)', () => {
    it('waits for a second digit on 0 or 1', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '1');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01');
        expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('advances on a digit greater than one', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '5');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('05');
        expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('caps the second digit at 12', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '1');
      pressKey(host, '9');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
    });

    it('treats 00 as 12', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '0');
      pressKey(host, '0');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('12'));
    });

    it('waits on minutes for digits 0 through 5', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, '3');

      await waitFor(() => {
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('03');
        expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('advances minutes to meridiem on a digit greater than five', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      pressKey(host, '7');

      await waitFor(() => {
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('07');
        expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('appends the second minutes digit', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      pressKey(host, '3');
      pressKey(host, '5');

      await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('35'));
    });
  });

  describe('digit input (24-hour)', () => {
    it('waits for a second digit on 0 through 2', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, '2');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('02');
        expect(getSegment(host, 'hh')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('advances on a digit greater than two', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, '5');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('05');
        expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
      });
    });

    it('caps the second digit at 23', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, '2');
      pressKey(host, '9');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('23'));
    });

    it('stays on minutes after fill in 24-hour', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      pressKey(host, '7');

      // in 24-hour there is no meridiem segment, so the next-segment target stays minutes
      await waitFor(() => {
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('07');
        expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
      });
    });
  });

  describe('meridiem A / P keys', () => {
    it('sets the meridiem to AM on the lowercase a key', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'a');

      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM'));
    });

    it('sets the meridiem to PM on the uppercase P key', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowLeft');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      pressKey(host, 'P');

      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));
    });
  });

  describe('backspace / delete', () => {
    it('clears the active hours segment on Backspace', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, '1');
      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('01'));

      pressKey(host, 'Backspace');

      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--'));
    });

    it('clears the active minutes segment on Backspace', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      pressKey(host, '3');
      await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('03'));

      pressKey(host, 'Backspace');

      await waitFor(() => expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('--'));
    });

    it('clears the active meridiem segment on Delete', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowLeft');
      pressKey(host, 'p');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM'));

      pressKey(host, 'Delete');

      await waitFor(() => expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('--'));
    });
  });

  describe('disabled / readonly keyboard gating', () => {
    it('blocks keyboard input when disabled', async () => {
      const fixture = createInteractiveTimeInput({ disabled: true });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-disabled')).toBe(''));

      host.focus();
      pressKey(host, '1');
      await flush(fixture);

      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
    });

    it('blocks keyboard input when readonly', async () => {
      const fixture = createInteractiveTimeInput({ readonly: true });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-readonly')).toBe(''));

      await focusShell(host);
      pressKey(host, '1');
      await flush(fixture);

      expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
    });
  });

  describe('value model two-way binding', () => {
    it('emits a full time value through the model when typed', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      await focusShell(host);

      pressKey(host, '1');
      pressKey(host, '2');
      pressKey(host, '3');
      pressKey(host, '0');
      pressKey(host, 'p');

      await waitFor(() => expect(readout.textContent).toContain('value="12:30 pm"'));
    });

    it('keeps the value empty for a partial entry', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      await focusShell(host);

      pressKey(host, '1');
      pressKey(host, '2');
      pressKey(host, '3');
      pressKey(host, '0');
      await flush(fixture);

      // hours + minutes filled but no meridiem in 12-hour → value stays empty
      expect(readout.textContent).toContain('value=""');
    });

    it('parses an external value into 12-hour segments', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.value.set('09:41 am');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('41');
        expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM');
      });
    });

    it('parses an external value into 24-hour segments', async () => {
      const fixture = createInteractiveTimeInput({ format: '24-hour' });
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => expect(host.getAttribute('data-format')).toBe('24-hour'));

      fixture.componentInstance.value.set('14:30');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('14');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('30');
      });
    });

    it('empties the segments when the external value is cleared', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.value.set('09:41 am');
      await waitFor(() => expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09'));

      fixture.componentInstance.value.set('');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('--');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('--');
        expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('--');
      });
    });
  });

  describe('default value', () => {
    it('applies the default value at init in 12-hour', async () => {
      const fixture = createFixture(TimeInputDefaultValue12hHost);
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('09');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('41');
        expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('AM');
      });
    });

    it('applies the default value at init in 24-hour', async () => {
      const fixture = createFixture(TimeInputDefaultValue24hHost);
      const host = queryByTestId(fixture, 'time-input');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('14');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('30');
      });
    });
  });

  describe('format flip side-effect', () => {
    it('snaps an active meridiem back to minutes when flipping to 24-hour', async () => {
      const fixture = createInteractiveTimeInput();
      const host = queryByTestId(fixture, 'time-input');

      await focusShell(host);

      pressKey(host, 'ArrowRight');
      pressKey(host, 'ArrowRight');
      await waitFor(() => expect(getSegment(host, 'meridiem')?.getAttribute('data-selected')).toBe('1'));

      fixture.componentInstance.format.set('24-hour');

      await waitFor(() => {
        expect(getSegment(host, 'meridiem')).toBeNull();
        expect(getSegment(host, 'mm')?.getAttribute('data-selected')).toBe('1');
      });
    });
  });

  describe('reactive form integration', () => {
    it('syncs a form-control setValue into the time-input', async () => {
      const fixture = createFixture(TimeInputReactiveFormHost);
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.timeControl.setValue('03:15 pm');

      await waitFor(() => {
        expect(getSegment(host, 'hh')?.textContent?.trim()).toBe('03');
        expect(getSegment(host, 'mm')?.textContent?.trim()).toBe('15');
        expect(getSegment(host, 'meridiem')?.textContent?.trim()).toBe('PM');
      });
    });

    it('propagates typing into the form-control value', async () => {
      const fixture = createFixture(TimeInputReactiveFormHost);
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      await focusShell(host);

      pressKey(host, '4');
      pressKey(host, '1');
      pressKey(host, '5');
      pressKey(host, 'a');

      await waitFor(() => expect(readout.textContent).toContain('value="04:15 am"'));
    });

    it('disables the field when the form control is disabled', async () => {
      const fixture = createFixture(TimeInputReactiveFormHost);
      const host = queryByTestId(fixture, 'time-input');

      fixture.componentInstance.timeControl.disable();

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('marks the form control touched on blur', async () => {
      const fixture = createFixture(TimeInputReactiveFormHost);
      const host = queryByTestId(fixture, 'time-input');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('touched=false');

      await focusShell(host);
      host.blur();

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });
  });
});
