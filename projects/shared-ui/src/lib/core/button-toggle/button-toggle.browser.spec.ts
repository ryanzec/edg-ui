import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { type ButtonSize } from '../button/button';
import { ButtonToggle, type ButtonToggleItem } from './button-toggle';

const defaultItems: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary' },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

const itemsWithDisabled: ButtonToggleItem[] = [
  { label: 'Left', value: 'left', buttonColor: 'primary' },
  { label: 'Center', value: 'center', buttonColor: 'primary', buttonDisabled: true },
  { label: 'Right', value: 'right', buttonColor: 'primary' },
];

@Component({
  selector: 'test-button-toggle-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggle],
  host: { class: 'block' },
  template: `
    <org-button-toggle
      data-testid="toggle"
      [items]="items()"
      [value]="value()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [buttonSize]="buttonSize()"
      (changed)="handleChanged($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ButtonToggleInteractiveHost {
  public readonly items = signal<ButtonToggleItem[]>(defaultItems);
  public readonly value = signal<string>('center');
  public readonly disabled = signal<boolean>(false);
  public readonly fullWidth = signal<boolean>(false);
  public readonly buttonSize = signal<ButtonSize>('base');

  protected readonly changedCount = signal<number>(0);
  protected readonly lastChangedValue = signal<string>('');

  protected readout(): string {
    return `changedCount=${this.changedCount()} lastChangedValue=${this.lastChangedValue()}`;
  }

  protected handleChanged(value: string): void {
    this.changedCount.update((count) => count + 1);
    this.lastChangedValue.set(value);
  }
}

@Component({
  selector: 'test-button-toggle-reactive-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggle, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-button-toggle
      data-testid="toggle"
      [items]="items"
      [formControl]="formControl"
      (changed)="handleChanged($event)"
    />
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class ButtonToggleReactiveFormHost {
  protected readonly items = defaultItems;
  public readonly formControl = new FormControl<string | null>('center');

  protected readonly changedCount = signal<number>(0);

  /**
   * subscribes to every form-control event so OnPush change detection re-runs the readout after the cva chain
   * finishes pushing into the formControl. without this, the readout can race the cva _onChange callback and
   * show stale values.
   */
  private readonly _formEvents = toSignal(this.formControl.events, { initialValue: null });

  protected readout(): string {
    this._formEvents();

    return [
      `value=${this.formControl.value}`,
      `disabled=${this.formControl.disabled}`,
      `touched=${this.formControl.touched}`,
      `changedCount=${this.changedCount()}`,
    ].join(' ');
  }

  protected handleChanged(_value: string): void {
    this.changedCount.update((count) => count + 1);
  }
}

type ButtonToggleHostConfig = {
  items?: ButtonToggleItem[];
  value?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  buttonSize?: ButtonSize;
};

const getInnerButtons = (host: HTMLElement): HTMLButtonElement[] =>
  Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

describe('ButtonToggle (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveToggle = (
    config: ButtonToggleHostConfig = {}
  ): ComponentFixture<ButtonToggleInteractiveHost> =>
    createFixture(ButtonToggleInteractiveHost, (instance) => {
      if (config.items !== undefined) {
        instance.items.set(config.items);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.fullWidth !== undefined) {
        instance.fullWidth.set(config.fullWidth);
      }

      if (config.buttonSize !== undefined) {
        instance.buttonSize.set(config.buttonSize);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('applies role="group" on the host', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('role')).toBe('group');
    });

    it('omits boolean host attributes by default', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
      expect(host.getAttribute('data-full-width')).toBeNull();
    });

    it('sets data and aria disabled when disabled', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('sets data-full-width when fullWidth true', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.fullWidth.set(true);

      await waitFor(() => expect(host.getAttribute('data-full-width')).toBe(''));
    });

    it('removes data-full-width when it flips back', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.fullWidth.set(true);
      await waitFor(() => expect(host.getAttribute('data-full-width')).toBe(''));

      fixture.componentInstance.fullWidth.set(false);
      await waitFor(() => expect(host.getAttribute('data-full-width')).toBeNull());
    });
  });

  describe('rendering', () => {
    it('renders one button per item', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(getInnerButtons(host)).toHaveLength(defaultItems.length);
    });

    it('renders zero buttons when items empty', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.items.set([]);

      await waitFor(() => expect(getInnerButtons(host)).toHaveLength(0));
    });

    it('renders item labels', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      const labels = getInnerButtons(host).map((button) => button.textContent?.trim());

      expect(labels).toEqual(['Left', 'Center', 'Right']);
    });
  });

  describe('active state', () => {
    it('marks the matching button aria-pressed', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const buttons = getInnerButtons(host);

      expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
      expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
      expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
    });

    it('moves the active button when value changes', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.value.set('right');

      await waitFor(() => {
        const buttons = getInnerButtons(host);

        expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
        expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
        expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
      });
    });
  });

  describe('disabled state', () => {
    it('disables every inner button when wrapper disabled', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));
    });

    it('disables only buttonDisabled items when wrapper enabled', () => {
      const fixture = createInteractiveToggle({ items: itemsWithDisabled });
      const host = queryByTestId(fixture, 'toggle');
      const buttons = getInnerButtons(host);

      expect(buttons[0].disabled).toBe(false);
      expect(buttons[1].disabled).toBe(true);
      expect(buttons[2].disabled).toBe(false);
    });
  });

  describe('changed output', () => {
    it('emits changed on non-active button click', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('changedCount=0');

      await userEvent.click(getInnerButtons(host)[2]);

      await waitFor(() => {
        expect(readout.textContent).toContain('changedCount=1');
        expect(readout.textContent).toContain('lastChangedValue=right');
      });
    });

    it('does not emit changed when the active button is clicked', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getInnerButtons(host)[1]);
      await flush(fixture);

      expect(readout.textContent).toContain('changedCount=0');
    });

    it('does not emit changed when wrapper disabled', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.disabled.set(true);

      await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));

      getInnerButtons(host)[2].click();
      await flush(fixture);

      expect(readout.textContent).toContain('changedCount=0');
    });
  });

  describe('reactive form integration', () => {
    it('marks the initial form-control value active', () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const buttons = getInnerButtons(host);

      expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    });

    it('updates the form-control value on click', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getInnerButtons(host)[2]);

      await waitFor(() => expect(readout.textContent).toContain('value=right'));
    });

    it('does not emit changed when active button clicked in form mode', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('changedCount=0');

      await userEvent.click(getInnerButtons(host)[1]);
      await flush(fixture);

      expect(readout.textContent).toContain('changedCount=0');
      expect(readout.textContent).toContain('value=center');
    });

    it('marks a button active when the control is set programmatically', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.formControl.setValue('left');

      await waitFor(() => {
        const buttons = getInnerButtons(host);

        expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
        expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('propagates control disable to host and inner buttons', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => {
        expect(host.getAttribute('data-disabled')).toBe('');
        expect(host.getAttribute('aria-disabled')).toBe('true');
        expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true);
      });
    });

    it('marks the form control touched after a click', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('touched=false');

      await userEvent.click(getInnerButtons(host)[2]);

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });

    it('does not emit changed when the form is disabled', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.formControl.disable();

      await waitFor(() => expect(getInnerButtons(host).every((button) => button.disabled)).toBe(true));

      getInnerButtons(host)[2].click();
      await flush(fixture);

      expect(readout.textContent).toContain('value=center');
    });

    it('falls back to empty string when the control is set to null', async () => {
      const fixture = createFixture(ButtonToggleReactiveFormHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.formControl.setValue(null);

      await waitFor(() => {
        const buttons = getInnerButtons(host);

        expect(buttons.every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
      });
    });
  });
});
