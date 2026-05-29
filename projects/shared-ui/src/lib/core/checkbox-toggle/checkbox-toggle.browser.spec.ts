import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import {
  CheckboxToggle,
  type CheckboxToggleColor,
  type CheckboxToggleLabelPosition,
  type CheckboxToggleSize,
} from './checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { type IconName } from '../icon/icon-brain';

@Component({
  selector: 'test-checkbox-toggle-interactive-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle],
  host: { class: 'block' },
  template: `
    <org-checkbox-toggle
      data-testid="toggle"
      name="setting"
      value="on"
      [size]="size()"
      [color]="color()"
      [labelPosition]="labelPosition()"
      [description]="description()"
      [iconOff]="iconOff()"
      [iconOn]="iconOn()"
      [checked]="checked()"
      [disabled]="disabled()"
      (checkedChange)="onCheckedChanged($event)"
    >
      {{ labelText() }}
    </org-checkbox-toggle>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CheckboxToggleInteractiveHost {
  public readonly labelText = signal<string>('Label');
  public readonly size = signal<CheckboxToggleSize>('base');
  public readonly color = signal<CheckboxToggleColor>('primary');
  public readonly labelPosition = signal<CheckboxToggleLabelPosition>('end');
  public readonly description = signal<string>('');
  public readonly iconOn = signal<IconName | null | undefined>(undefined);
  public readonly iconOff = signal<IconName | null | undefined>(undefined);
  public readonly checked = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);

  protected readonly checkedChangeCount = signal<number>(0);
  protected readonly lastCheckedChangeValue = signal<string>('none');

  protected readout(): string {
    return `checkedChangeCount=${this.checkedChangeCount()} lastCheckedChangeValue=${this.lastCheckedChangeValue()}`;
  }

  protected onCheckedChanged(value: boolean): void {
    this.checkedChangeCount.update((current) => current + 1);
    this.lastCheckedChangeValue.set(String(value));
  }
}

@Component({
  selector: 'test-checkbox-toggle-projection-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle],
  host: { class: 'block' },
  template: `
    <org-checkbox-toggle data-testid="toggle" name="setting" value="on">Enable notifications</org-checkbox-toggle>
  `,
})
class CheckboxToggleProjectionHost {}

@Component({
  selector: 'test-checkbox-toggle-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-checkbox-toggle
      data-testid="toggle"
      name="setting"
      value="on"
      [formControl]="control"
      [disabled]="consumerDisabled()"
    >
      Label
    </org-checkbox-toggle>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class CheckboxToggleFormHost {
  public readonly control = new FormControl<boolean>(false, { nonNullable: true });
  public readonly consumerDisabled = signal<boolean>(false);

  protected readout(): string {
    return `value=${this.control.value} touched=${this.control.touched} disabled=${this.control.disabled}`;
  }
}

@Component({
  selector: 'test-checkbox-toggle-form-field-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()" data-testid="form-field">
      <org-checkbox-toggle data-testid="toggle" name="setting" value="on">Label</org-checkbox-toggle>
    </org-form-field>
  `,
})
class CheckboxToggleFormFieldHost {
  public readonly validationMessage = signal<string | null | undefined>(undefined);
}

type ToggleHostConfig = {
  size?: CheckboxToggleSize;
  color?: CheckboxToggleColor;
  labelPosition?: CheckboxToggleLabelPosition;
  description?: string;
  iconOn?: IconName | null;
  iconOff?: IconName | null;
  checked?: boolean;
  disabled?: boolean;
};

describe('CheckboxToggle (browser)', () => {
  const { createFixture, flush, waitFor, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createInteractiveToggle = (config: ToggleHostConfig = {}): ComponentFixture<CheckboxToggleInteractiveHost> =>
    createFixture(CheckboxToggleInteractiveHost, (instance) => {
      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.labelPosition !== undefined) {
        instance.labelPosition.set(config.labelPosition);
      }

      if (config.description !== undefined) {
        instance.description.set(config.description);
      }

      if (config.iconOn !== undefined) {
        instance.iconOn.set(config.iconOn);
      }

      if (config.iconOff !== undefined) {
        instance.iconOff.set(config.iconOff);
      }

      if (config.checked !== undefined) {
        instance.checked.set(config.checked);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('host attribute reflection', () => {
    it('renders the default size, color, and label-position attributes', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-label-position')).toBe('end');
    });

    it('omits the checked, disabled, and state attributes by default', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
    });

    it('reflects the size, color, and label-position inputs', () => {
      const fixture = createInteractiveToggle({ size: 'lg', color: 'danger', labelPosition: 'start' });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
      expect(host.getAttribute('data-label-position')).toBe('start');
    });

    it('reflects data-checked when checked is true', () => {
      const fixture = createInteractiveToggle({ checked: true });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-checked')).toBe('');
    });

    it('reflects data-disabled when disabled is true', () => {
      const fixture = createInteractiveToggle({ disabled: true });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-disabled')).toBe('');
    });

    it('clears data-checked when the input flips back to false', async () => {
      const fixture = createInteractiveToggle({ checked: true });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('data-checked')).toBe('');

      fixture.componentInstance.checked.set(false);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
    });
  });

  describe('text size mapping', () => {
    it('maps the small size to the small text size', () => {
      const fixture = createInteractiveToggle({ size: 'sm' });
      const host = queryByTestId(fixture, 'toggle');
      const labelSpan = host.querySelector('.label') as HTMLElement;

      expect(labelSpan.getAttribute('data-text-size')).toBe('sm');
    });

    it('maps the base size to the base text size', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const labelSpan = host.querySelector('.label') as HTMLElement;

      expect(labelSpan.getAttribute('data-text-size')).toBe('base');
    });

    it('maps the large size to the large text size', () => {
      const fixture = createInteractiveToggle({ size: 'lg' });
      const host = queryByTestId(fixture, 'toggle');
      const labelSpan = host.querySelector('.label') as HTMLElement;

      expect(labelSpan.getAttribute('data-text-size')).toBe('lg');
    });
  });

  describe('icon size mapping', () => {
    it('maps the small size to the 2xs icon size', () => {
      const fixture = createInteractiveToggle({ iconOn: 'check', size: 'sm' });
      const host = queryByTestId(fixture, 'toggle');
      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('2xs');
    });

    it('maps the base size to the 2xs icon size', () => {
      const fixture = createInteractiveToggle({ iconOn: 'check' });
      const host = queryByTestId(fixture, 'toggle');
      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('2xs');
    });

    it('maps the large size to the xs icon size', () => {
      const fixture = createInteractiveToggle({ iconOn: 'check', size: 'lg' });
      const host = queryByTestId(fixture, 'toggle');
      const icon = host.querySelector('org-icon') as HTMLElement;

      expect(icon.getAttribute('data-size')).toBe('xs');
    });
  });

  describe('description', () => {
    it('hides the description when empty', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.querySelector('.description')).toBeNull();
    });

    it('renders the description text when provided', () => {
      const fixture = createInteractiveToggle({ description: 'Up to once a week.' });
      const host = queryByTestId(fixture, 'toggle');
      const description = host.querySelector('.description') as HTMLElement;

      expect(description).not.toBeNull();
      expect(description.textContent?.trim()).toBe('Up to once a week.');
    });
  });

  describe('icon slot rendering', () => {
    it('renders no knob icons by default', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.querySelector('.icon-on')).toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });

    it('renders the icon-on slot only when iconOn is provided', () => {
      const fixture = createInteractiveToggle({ iconOn: 'check' });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.querySelector('.icon-on')).not.toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });

    it('renders the icon-off slot only when iconOff is provided', () => {
      const fixture = createInteractiveToggle({ iconOff: 'x' });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.querySelector('.icon-off')).not.toBeNull();
      expect(host.querySelector('.icon-on')).toBeNull();
    });

    it('transforms null icon inputs to undefined and skips rendering', () => {
      const fixture = createInteractiveToggle({ iconOn: null, iconOff: null });
      const host = queryByTestId(fixture, 'toggle');

      expect(host.querySelector('.icon-on')).toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });
  });

  describe('content projection', () => {
    it('projects the label content into the label span', () => {
      const fixture = createFixture(CheckboxToggleProjectionHost);
      const host = queryByTestId(fixture, 'toggle');
      const labelSpan = host.querySelector('.label') as HTMLElement;

      expect(labelSpan.textContent?.trim()).toBe('Enable notifications');
    });
  });

  describe('native checkbox forwarding', () => {
    it('forwards name and value to the native checkbox', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(nativeInput.name).toBe('setting');
      expect(nativeInput.value).toBe('on');
    });

    it('mirrors the checked state to the native input', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(nativeInput.checked).toBe(false);

      fixture.componentInstance.checked.set(true);
      await flush(fixture);

      expect(nativeInput.checked).toBe(true);
    });

    it('mirrors the disabled state to the native input', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(nativeInput.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(nativeInput.disabled).toBe(true);
    });
  });

  describe('interaction', () => {
    it('toggles and emits checkedChange on label click', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(label);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('checkedChangeCount=1');
      expect(readout.textContent).toContain('lastCheckedChangeValue=true');
    });

    it('toggles back to false on a second label click', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(label);
      await userEvent.click(label);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('checkedChangeCount=2');
      expect(readout.textContent).toContain('lastCheckedChangeValue=false');
    });

    it('does not toggle or emit on label click when disabled', async () => {
      const fixture = createInteractiveToggle({ disabled: true });
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      // dispatch a native click since playwright refuses to click an aria-disabled element, yet a real user can
      label.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('checkedChangeCount=0');
    });

    it('toggles on the space key', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      label.focus();
      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(readout.textContent).toContain('lastCheckedChangeValue=true');
      });
    });

    it('toggles on the enter key', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      label.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(host.getAttribute('data-checked')).toBe('');
        expect(readout.textContent).toContain('lastCheckedChangeValue=true');
      });
    });

    it('ignores other key downs', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      label.focus();
      await userEvent.keyboard('a');
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('checkedChangeCount=0');
    });

    it('does not toggle on space or enter when disabled', async () => {
      const fixture = createInteractiveToggle({ disabled: true });
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      label.focus();
      await userEvent.keyboard(' ');
      await userEvent.keyboard('{Enter}');
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('checkedChangeCount=0');
    });
  });

  describe('accessibility attributes', () => {
    it('applies the switch role to the label element', () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('role')).toBe('switch');
    });

    it('omits aria-disabled by default and sets it when disabled', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(label.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets the tabindex based on the disabled state', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('tabindex')).toBe('0');

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(label.getAttribute('tabindex')).toBe('-1');
    });

    it('reflects the disabled state on the host aria-disabled', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');

      expect(host.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(host.getAttribute('aria-disabled')).toBe('true');

      fixture.componentInstance.disabled.set(false);
      await flush(fixture);

      expect(host.getAttribute('aria-disabled')).toBeNull();
    });

    it('tracks the checked state on the label aria-checked', async () => {
      const fixture = createInteractiveToggle();
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('aria-checked')).toBe('false');

      fixture.componentInstance.checked.set(true);
      await flush(fixture);

      expect(label.getAttribute('aria-checked')).toBe('true');

      fixture.componentInstance.checked.set(false);
      await flush(fixture);

      expect(label.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('reactive forms', () => {
    it('reflects a programmatically set true form-control value as data-checked', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      fixture.componentInstance.control.setValue(true);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBe('');
      expect(nativeInput.checked).toBe(true);
    });

    it('writes programmatic form-control value changes into the toggle', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.control.setValue(true);
      await flush(fixture);
      expect(host.getAttribute('data-checked')).toBe('');

      fixture.componentInstance.control.setValue(false);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
    });

    it('coerces a null form-control value to false', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      fixture.componentInstance.control.setValue(true);
      await flush(fixture);
      expect(host.getAttribute('data-checked')).toBe('');

      fixture.componentInstance.control.setValue(null as unknown as boolean);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(nativeInput.checked).toBe(false);
    });

    it('updates the form-control value when the label is clicked', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      await userEvent.click(label);
      await flush(fixture);

      expect(readout.textContent).toContain('value=true');
    });

    it('marks the form control as touched after a click', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('touched=false');

      await userEvent.click(label);
      await flush(fixture);

      expect(readout.textContent).toContain('touched=true');
    });

    it('propagates the form-control disable to the host and native input', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

      fixture.componentInstance.control.disable();
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBe('');
      expect(nativeInput.disabled).toBe(true);
    });

    it('does not update the value when clicked while the form control is disabled', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');
      const readout = queryByTestId(fixture, 'readout');

      fixture.componentInstance.control.disable();
      await flush(fixture);

      const label = host.querySelector('label') as HTMLLabelElement;

      // dispatch a native click since playwright refuses to click an aria-disabled element, yet a real user can
      label.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await flush(fixture);

      expect(readout.textContent).toContain('value=false');
    });

    it('clears the disabled state when both the consumer and form sources are cleared', async () => {
      const fixture = createFixture(CheckboxToggleFormHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.consumerDisabled.set(true);
      fixture.componentInstance.control.disable();
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBe('');

      fixture.componentInstance.consumerDisabled.set(false);
      fixture.componentInstance.control.enable();
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  });

  describe('form-field validation', () => {
    it('does not apply error attributes without a validation message', () => {
      const fixture = createFixture(CheckboxToggleFormFieldHost);
      const host = queryByTestId(fixture, 'toggle');
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });

    it('applies error attributes when a validation message is set', async () => {
      const fixture = createFixture(CheckboxToggleFormFieldHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.validationMessage.set('Required');
      await flush(fixture);

      const label = host.querySelector('label') as HTMLLabelElement;

      expect(host.getAttribute('data-state')).toBe('error');
      expect(label.getAttribute('aria-invalid')).toBe('true');
      expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });

    it('clears error attributes when the validation message is cleared', async () => {
      const fixture = createFixture(CheckboxToggleFormFieldHost);
      const host = queryByTestId(fixture, 'toggle');

      fixture.componentInstance.validationMessage.set('Required');
      await flush(fixture);
      expect(host.getAttribute('data-state')).toBe('error');

      fixture.componentInstance.validationMessage.set(undefined);
      await flush(fixture);

      const label = host.querySelector('label') as HTMLLabelElement;

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });
  });
});
