import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { Checkbox, type CheckboxColor, type CheckboxSize } from './checkbox';
import { CheckboxGroup, type CheckboxGroupSize } from './checkbox-group';
import { FormField } from '../form-fields/form-field';

@Component({
  selector: 'test-checkbox-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox],
  host: { class: 'block' },
  template: `
    <org-checkbox
      data-testid="checkbox"
      name="opt"
      value="opt"
      [size]="size()"
      [color]="color()"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
      [description]="description()"
      (checkedChange)="handleCheckedChange($event)"
    >
      <span data-testid="label-content">{{ labelText() }}</span>
    </org-checkbox>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CheckboxInteractiveHost {
  public readonly size = signal<CheckboxSize>('base');
  public readonly color = signal<CheckboxColor>('primary');
  public readonly checked = signal<boolean>(false);
  public readonly indeterminate = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);
  public readonly description = signal<string>('');
  public readonly labelText = signal<string>('projected label');

  protected readonly changeCount = signal<number>(0);
  protected readonly lastChangeValue = signal<boolean | null>(null);

  protected readout(): string {
    return `changeCount=${this.changeCount()} lastChangeValue=${this.lastChangeValue()}`;
  }

  protected handleCheckedChange(value: boolean): void {
    this.changeCount.update((count) => count + 1);
    this.lastChangeValue.set(value);
  }
}

@Component({
  selector: 'test-checkbox-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, FormField, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()">
      <org-checkbox data-testid="checkbox" name="opt" value="opt" [formControl]="control">label</org-checkbox>
    </org-form-field>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CheckboxFormHost {
  public readonly control = new FormControl<boolean>(false, { nonNullable: true });
  public readonly validationMessage = signal<string | undefined>(undefined);

  // toSignal subscription drives readout updates under OnPush because plain control.value / control.touched are not signals
  private readonly _controlState = toSignal(
    this.control.events.pipe(map(() => ({ value: this.control.value, touched: this.control.touched }))),
    { initialValue: { value: this.control.value, touched: this.control.touched } }
  );

  protected readout(): string {
    const state = this._controlState();

    return `value=${state.value} touched=${state.touched}`;
  }
}

@Component({
  selector: 'test-checkbox-group-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, CheckboxGroup, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()">
      <org-checkbox-group
        data-testid="group"
        [size]="size()"
        [disabled]="disabled()"
        [legend]="legend()"
        [description]="description()"
        [required]="required()"
      >
        <org-checkbox name="a" value="a">A</org-checkbox>
        <org-checkbox name="b" value="b">B</org-checkbox>
        <org-checkbox name="c" value="c">C</org-checkbox>
      </org-checkbox-group>
    </org-form-field>
  `,
})
class CheckboxGroupHost {
  public readonly size = signal<CheckboxGroupSize>('base');
  public readonly disabled = signal<boolean>(false);
  public readonly legend = signal<string>('');
  public readonly description = signal<string>('');
  public readonly required = signal<boolean>(false);
  public readonly validationMessage = signal<string | undefined>(undefined);
}

type CheckboxHostConfig = {
  size?: CheckboxSize;
  color?: CheckboxColor;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  description?: string;
};

type CheckboxGroupHostConfig = {
  size?: CheckboxGroupSize;
  disabled?: boolean;
  legend?: string;
  description?: string;
  required?: boolean;
};

const getLabel = (host: HTMLElement): HTMLLabelElement => host.querySelector('label') as HTMLLabelElement;

describe('Checkbox (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveCheckbox = (config: CheckboxHostConfig = {}): ComponentFixture<CheckboxInteractiveHost> =>
    createFixture(CheckboxInteractiveHost, (instance) => {
      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.checked !== undefined) {
        instance.checked.set(config.checked);
      }

      if (config.indeterminate !== undefined) {
        instance.indeterminate.set(config.indeterminate);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.description !== undefined) {
        instance.description.set(config.description);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default size and color host attributes', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
    });

    it('omits the state host attributes by default', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(host.getAttribute('data-indeterminate')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('reflects the size and color inputs on the host', () => {
      const fixture = createInteractiveCheckbox({ size: 'lg', color: 'danger' });
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('reflects the checked host attribute', () => {
      const fixture = createInteractiveCheckbox({ checked: true });
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-checked')).toBe('');
      expect(getLabel(host).getAttribute('aria-checked')).toBe('true');
    });

    it('reflects the indeterminate host attribute', () => {
      const fixture = createInteractiveCheckbox({ indeterminate: true });
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-indeterminate')).toBe('');
      expect(getLabel(host).getAttribute('aria-checked')).toBe('mixed');
    });

    it('lets indeterminate win over checked for aria-checked', () => {
      const fixture = createInteractiveCheckbox({ indeterminate: true, checked: true });
      const host = queryByTestId(fixture, 'checkbox');

      expect(getLabel(host).getAttribute('aria-checked')).toBe('mixed');
    });

    it('reflects the disabled host and aria attributes', () => {
      const fixture = createInteractiveCheckbox({ disabled: true });
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-disabled')).toBe('1');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('label a11y', () => {
    it('exposes the checkbox role on the label', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');

      expect(getLabel(host).getAttribute('role')).toBe('checkbox');
    });

    it('keeps the label keyboard focusable when enabled', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');

      expect(getLabel(host).getAttribute('tabindex')).toBe('0');
    });

    it('removes the label from the tab order when disabled', () => {
      const fixture = createInteractiveCheckbox({ disabled: true });
      const host = queryByTestId(fixture, 'checkbox');

      expect(getLabel(host).getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('description', () => {
    it('does not render the description when empty', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.querySelector('.checkbox-description')).toBeNull();
    });

    it('renders the description when provided', () => {
      const fixture = createInteractiveCheckbox({ description: 'helpful sub-line' });
      const host = queryByTestId(fixture, 'checkbox');

      const description = host.querySelector('.checkbox-description') as HTMLElement;

      expect(description.textContent?.trim()).toBe('helpful sub-line');
    });
  });

  describe('content projection', () => {
    it('renders projected content inside the label', () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const projected = host.querySelector('[data-testid="label-content"]') as HTMLElement;

      expect(projected.textContent?.trim()).toBe('projected label');
      expect(getLabel(host).contains(projected)).toBe(true);
    });
  });

  describe('interaction', () => {
    it('toggles checked and emits on click', async () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getLabel(host));

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(readout.textContent).toContain('changeCount=1');
        expect(readout.textContent).toContain('lastChangeValue=true');
      });
    });

    it('toggles checked back to unchecked on a second click', async () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');
      const label = getLabel(host);

      await userEvent.click(label);
      await userEvent.click(label);

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBeNull();
        expect(readout.textContent).toContain('changeCount=2');
        expect(readout.textContent).toContain('lastChangeValue=false');
      });
    });

    it('toggles checked and emits on the Space key', async () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');
      const label = getLabel(host);

      label.focus();
      label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true }));
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(readout.textContent).toContain('lastChangeValue=true');
      });
    });

    it('toggles checked and emits on the Enter key', async () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');
      const label = getLabel(host);

      label.focus();
      label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }));
      await flush(fixture);

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(readout.textContent).toContain('lastChangeValue=true');
      });
    });

    it('ignores other keys', async () => {
      const fixture = createInteractiveCheckbox();
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');
      const label = getLabel(host);

      label.focus();
      label.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', cancelable: true, bubbles: true }));
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('changeCount=0');
    });

    it('lands on checked and clears indeterminate when clicked from indeterminate', async () => {
      const fixture = createInteractiveCheckbox({ indeterminate: true });
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');

      expect(host.getAttribute('data-indeterminate')).toBe('');

      await userEvent.click(getLabel(host));

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(host.getAttribute('data-indeterminate')).toBeNull();
        expect(readout.textContent).toContain('lastChangeValue=true');
      });
    });
  });

  describe('disabled', () => {
    it('blocks the click toggle and emission when disabled', async () => {
      const fixture = createInteractiveCheckbox({ disabled: true });
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');

      // userEvent.click refuses to interact with the aria-disabled label, so dispatch the click directly
      // to verify the brain's disabled guard short-circuits the toggle
      getLabel(host).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('changeCount=0');
    });

    it('blocks the keyboard toggle and emission when disabled', async () => {
      const fixture = createInteractiveCheckbox({ disabled: true });
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');
      const label = getLabel(host);

      label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true }));
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('changeCount=0');
    });
  });

  describe('reactive form integration', () => {
    it('reflects the form-control value onto the host', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');

      expect(host.getAttribute('data-checked')).toBeNull();

      fixture.componentInstance.control.setValue(true);

      await waitFor(() => expect(host.getAttribute('data-checked')).toBe(''));
    });

    it('updates the form-control value on click', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(getLabel(host));

      await waitFor(() => expect(readout.textContent).toContain('value=true'));
    });

    it('marks the form control as touched on interaction', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('touched=false');

      await userEvent.click(getLabel(host));

      await waitFor(() => expect(readout.textContent).toContain('touched=true'));
    });

    it('coerces a writeValue(null) into unchecked', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');

      fixture.componentInstance.control.setValue(true);
      await waitFor(() => expect(host.getAttribute('data-checked')).toBe(''));

      // simulate a defensive writeValue(null) scenario — control is typed as boolean but reactive forms can hand null
      fixture.componentInstance.control.setValue(null as unknown as boolean);

      await waitFor(() => expect(host.getAttribute('data-checked')).toBeNull());
    });
  });

  describe('validation', () => {
    it('applies no validation attributes when there is no message', () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');
      const label = getLabel(host);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });

    it('drives the error attributes from the validation message', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');

      fixture.componentInstance.validationMessage.set('required');

      await waitFor(() => {
        const label = getLabel(host);

        expect(host.getAttribute('data-state')).toBe('error');
        expect(label.getAttribute('aria-invalid')).toBe('true');
        expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
      });
    });

    it('resets the error attributes when the validation message is cleared', async () => {
      const fixture = createFixture(CheckboxFormHost);
      const host = queryByTestId(fixture, 'checkbox');

      fixture.componentInstance.validationMessage.set('required');
      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));

      fixture.componentInstance.validationMessage.set(undefined);

      await waitFor(() => {
        const label = getLabel(host);

        expect(host.getAttribute('data-state')).toBeNull();
        expect(label.getAttribute('aria-invalid')).toBeNull();
        expect(label.getAttribute('aria-describedby')).toBeNull();
      });
    });
  });
});

describe('CheckboxGroup (browser)', () => {
  const { createFixture, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createCheckboxGroup = (config: CheckboxGroupHostConfig = {}): ComponentFixture<CheckboxGroupHost> =>
    createFixture(CheckboxGroupHost, (instance) => {
      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.legend !== undefined) {
        instance.legend.set(config.legend);
      }

      if (config.description !== undefined) {
        instance.description.set(config.description);
      }

      if (config.required !== undefined) {
        instance.required.set(config.required);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attributes', () => {
    it('applies the default size on the host', () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');

      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('omits state, disabled, and aria-labelledby by default', () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');

      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-labelledby')).toBeNull();
    });

    it('reflects the size input on the host', () => {
      const fixture = createCheckboxGroup({ size: 'lg' });
      const host = queryByTestId(fixture, 'group');

      expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('reflects the disabled state on the host', () => {
      const fixture = createCheckboxGroup({ disabled: true });
      const host = queryByTestId(fixture, 'group');

      expect(host.getAttribute('data-disabled')).toBe('1');
    });
  });

  describe('header / legend / description', () => {
    it('does not render the header without a legend or description', () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');

      expect(host.querySelector('.header')).toBeNull();
    });

    it('links the legend via aria-labelledby', () => {
      const fixture = createCheckboxGroup({ legend: 'Notifications' });
      const host = queryByTestId(fixture, 'group');

      const legend = host.querySelector('.legend') as HTMLElement;

      expect(legend.textContent?.trim()).toBe('Notifications');
      expect(legend.id).toMatch(/^checkbox-group-legend-/);
      expect(host.getAttribute('aria-labelledby')).toBe(legend.id);
    });

    it('adds data-required on the legend when required', () => {
      const fixture = createCheckboxGroup({ legend: 'Notifications', required: true });
      const host = queryByTestId(fixture, 'group');

      const legend = host.querySelector('.legend') as HTMLElement;

      expect(legend.getAttribute('data-required')).toBe('1');
    });

    it('renders the description when provided', () => {
      const fixture = createCheckboxGroup({ description: 'Pick the events.' });
      const host = queryByTestId(fixture, 'group');

      const description = host.querySelector('.description') as HTMLElement;

      expect(description.textContent?.trim()).toBe('Pick the events.');
    });
  });

  describe('projection', () => {
    it('renders the projected children', () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');
      const options = host.querySelector('.options') as HTMLElement;

      expect(options.querySelectorAll('org-checkbox').length).toBe(3);
    });
  });

  describe('validation', () => {
    it('has no data-state without a validation message', () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');

      expect(host.getAttribute('data-state')).toBeNull();
    });

    it('applies the error state from the form-field validation message', async () => {
      const fixture = createCheckboxGroup();
      const host = queryByTestId(fixture, 'group');

      fixture.componentInstance.validationMessage.set('pick at least one');

      await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
    });
  });
});
