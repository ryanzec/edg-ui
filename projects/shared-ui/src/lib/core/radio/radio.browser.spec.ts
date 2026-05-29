import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Radio, type RadioColor, type RadioSize } from './radio';
import { RadioGroup, type RadioGroupSize } from './radio-group';

@Component({
  selector: 'test-radio-standalone-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio],
  host: { class: 'block' },
  template: `
    <org-radio
      data-testid="radio"
      [name]="name()"
      [value]="value()"
      [size]="size()"
      [color]="color()"
      [description]="description()"
      [disabled]="disabled()"
      (selectionRequested)="handleSelectionRequested()"
    >
      {{ label() }}
    </org-radio>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class RadioStandaloneHost {
  public readonly name = signal<string>('plan');
  public readonly value = signal<string>('pro');
  public readonly size = signal<RadioSize>('base');
  public readonly color = signal<RadioColor>('primary');
  public readonly description = signal<string>('');
  public readonly disabled = signal<boolean>(false);
  public readonly label = signal<string>('Pro plan');

  private readonly _selectionRequestedCount = signal<number>(0);

  protected readout(): string {
    return `selectionRequestedCount=${this._selectionRequestedCount()}`;
  }

  protected handleSelectionRequested(): void {
    this._selectionRequestedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'test-radio-group-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio, RadioGroup],
  host: { class: 'block' },
  template: `
    <org-radio-group
      data-testid="group"
      [name]="name()"
      [value]="value()"
      [size]="size()"
      [legend]="legend()"
      [description]="description()"
      [required]="required()"
      [disabled]="disabled()"
      (valueChange)="handleValueChange($event)"
    >
      <org-radio data-testid="radio-free" value="free">Free</org-radio>
      <org-radio data-testid="radio-pro" value="pro">Pro</org-radio>
      <org-radio data-testid="radio-team" value="team">Team</org-radio>
    </org-radio-group>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class RadioGroupHost {
  public readonly name = signal<string>('plan');
  public readonly value = signal<string>('');
  public readonly size = signal<RadioGroupSize>('base');
  public readonly legend = signal<string>('');
  public readonly description = signal<string>('');
  public readonly required = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);

  private readonly _valueChangeCount = signal<number>(0);
  private readonly _lastValueChange = signal<string>('');

  protected readout(): string {
    return `valueChangeCount=${this._valueChangeCount()} lastValueChange=${this._lastValueChange()}`;
  }

  protected handleValueChange(value: string): void {
    this._valueChangeCount.update((count) => count + 1);
    this._lastValueChange.set(value);
    this.value.set(value);
  }
}

@Component({
  selector: 'test-radio-form-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Radio, RadioGroup],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <org-radio-group data-testid="group" formControlName="plan" name="plan">
        <org-radio data-testid="radio-free" value="free">Free</org-radio>
        <org-radio data-testid="radio-pro" value="pro">Pro</org-radio>
        <org-radio data-testid="radio-team" value="team">Team</org-radio>
      </org-radio-group>
    </form>
    <pre data-testid="readout">{{ readout() }}</pre>
  `,
})
class RadioFormHost {
  public readonly form = new FormGroup({
    plan: new FormControl<string>('pro', { nonNullable: true }),
  });

  protected readout(): string {
    return `value=${this.form.controls.plan.value}`;
  }
}

@Component({
  selector: 'test-radio-form-field-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio, FormField, FormFields],
  host: { class: 'block' },
  template: `
    <org-form-fields>
      <org-form-field [validationMessage]="validationMessage()">
        <org-radio data-testid="radio" name="plan" value="pro">Pro plan</org-radio>
      </org-form-field>
    </org-form-fields>
  `,
})
class RadioFormFieldHost {
  public readonly validationMessage = signal<string | null>(null);
}

@Component({
  selector: 'test-radio-form-field-group-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio, RadioGroup, FormField, FormFields],
  host: { class: 'block' },
  template: `
    <org-form-fields>
      <org-form-field [validationMessage]="validationMessage()">
        <org-radio-group data-testid="group" name="plan">
          <org-radio data-testid="radio-free" value="free">Free</org-radio>
          <org-radio data-testid="radio-pro" value="pro">Pro</org-radio>
        </org-radio-group>
      </org-form-field>
    </org-form-fields>
  `,
})
class RadioFormFieldGroupHost {
  public readonly validationMessage = signal<string | null>(null);
}

type RadioStandaloneHostConfig = {
  name?: string;
  value?: string;
  size?: RadioSize;
  color?: RadioColor;
  description?: string;
  disabled?: boolean;
  label?: string;
};

type RadioGroupHostConfig = {
  name?: string;
  value?: string;
  size?: RadioGroupSize;
  legend?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
};

describe('Radio (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createStandaloneRadio = (config: RadioStandaloneHostConfig = {}): ComponentFixture<RadioStandaloneHost> =>
    createFixture(RadioStandaloneHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
      }

      if (config.color !== undefined) {
        instance.color.set(config.color);
      }

      if (config.description !== undefined) {
        instance.description.set(config.description);
      }

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }

      if (config.label !== undefined) {
        instance.label.set(config.label);
      }
    });

  const createGroupRadio = (config: RadioGroupHostConfig = {}): ComponentFixture<RadioGroupHost> =>
    createFixture(RadioGroupHost, (instance) => {
      if (config.name !== undefined) {
        instance.name.set(config.name);
      }

      if (config.value !== undefined) {
        instance.value.set(config.value);
      }

      if (config.size !== undefined) {
        instance.size.set(config.size);
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

      if (config.disabled !== undefined) {
        instance.disabled.set(config.disabled);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  describe('standalone radio', () => {
    it('renders the default host attributes', () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-checked')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
    });

    it('reflects the size input on the host', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);
      expect(host.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('lg');
      await flush(fixture);
      expect(host.getAttribute('data-size')).toBe('lg');

      fixture.componentInstance.size.set('base');
      await flush(fixture);
      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('reflects the color input on the host', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');

      fixture.componentInstance.color.set('danger');
      await flush(fixture);
      expect(host.getAttribute('data-color')).toBe('danger');

      fixture.componentInstance.color.set('primary');
      await flush(fixture);
      expect(host.getAttribute('data-color')).toBe('primary');
    });

    it('renders the projected label content', () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const labelText = host.querySelector('.label-text');

      expect(labelText?.textContent?.trim()).toBe('Pro plan');
    });

    it('renders the description when provided', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');

      expect(host.querySelector('.description')).toBeNull();

      fixture.componentInstance.description.set('A helpful description');
      await flush(fixture);

      const description = host.querySelector('.description');

      expect(description).not.toBeNull();
      expect(description?.textContent?.trim()).toBe('A helpful description');
    });

    it('omits the description when empty', async () => {
      const fixture = createStandaloneRadio({ description: 'A helpful description' });
      const host = queryByTestId(fixture, 'radio');

      expect(host.querySelector('.description')).not.toBeNull();

      fixture.componentInstance.description.set('');
      await flush(fixture);

      expect(host.querySelector('.description')).toBeNull();
    });

    it('forwards the value to the native input', () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(input.value).toBe('pro');
    });

    it('uses the local name when standalone', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(input.name).toBe('plan');

      fixture.componentInstance.name.set('other');
      await flush(fixture);

      expect(input.name).toBe('other');
    });

    it('selects and emits on click', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const label = host.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('selectionRequestedCount=0');

      await userEvent.click(label);
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('selectionRequestedCount=1');
    });

    it('reflects the disabled host attribute', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');

      expect(host.getAttribute('data-disabled')).toBeNull();

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(host.getAttribute('data-disabled')).toBe('1');
    });

    it('forwards the disabled state to the native input', async () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(input.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(input.disabled).toBe(true);
    });

    it('does not select on click when disabled', async () => {
      const fixture = createStandaloneRadio({ disabled: true });
      await flush(fixture);

      const host = queryByTestId(fixture, 'radio');
      const input = host.querySelector('input[type="radio"]') as HTMLInputElement;
      const readout = queryByTestId(fixture, 'readout');

      input.click();
      await flush(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('selectionRequestedCount=0');
    });

    it('maps the text size for the small variant', async () => {
      const fixture = createStandaloneRadio({ size: 'sm' });
      await flush(fixture);

      const host = queryByTestId(fixture, 'radio');
      const labelText = host.querySelector('.label-text') as HTMLElement;

      expect(labelText.getAttribute('data-text-size')).toBe('sm');
    });

    it('maps the text size for the base variant', () => {
      const fixture = createStandaloneRadio();
      const host = queryByTestId(fixture, 'radio');
      const labelText = host.querySelector('.label-text') as HTMLElement;

      expect(labelText.getAttribute('data-text-size')).toBe('base');
    });

    it('maps the text size for the large variant', async () => {
      const fixture = createStandaloneRadio({ size: 'lg' });
      await flush(fixture);

      const host = queryByTestId(fixture, 'radio');
      const labelText = host.querySelector('.label-text') as HTMLElement;

      expect(labelText.getAttribute('data-text-size')).toBe('xl');
    });
  });

  describe('radio group', () => {
    it('has the radiogroup role and default size', () => {
      const fixture = createGroupRadio();
      const group = queryByTestId(fixture, 'group');

      expect(group.getAttribute('role')).toBe('radiogroup');
      expect(group.getAttribute('data-size')).toBe('base');
      expect(group.getAttribute('aria-disabled')).toBeNull();
      expect(group.getAttribute('data-state')).toBeNull();
    });

    it('reflects the size on the host', async () => {
      const fixture = createGroupRadio();
      const group = queryByTestId(fixture, 'group');

      fixture.componentInstance.size.set('sm');
      await flush(fixture);
      expect(group.getAttribute('data-size')).toBe('sm');

      fixture.componentInstance.size.set('lg');
      await flush(fixture);
      expect(group.getAttribute('data-size')).toBe('lg');
    });

    it('applies the group name to child native inputs', () => {
      const fixture = createGroupRadio();
      const free = queryByTestId(fixture, 'radio-free');
      const pro = queryByTestId(fixture, 'radio-pro');
      const team = queryByTestId(fixture, 'radio-team');

      const freeInput = free.querySelector('input[type="radio"]') as HTMLInputElement;
      const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;
      const teamInput = team.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(freeInput.name).toBe('plan');
      expect(proInput.name).toBe('plan');
      expect(teamInput.name).toBe('plan');
    });

    it('selects the matching child for the group value', async () => {
      const fixture = createGroupRadio();
      const free = queryByTestId(fixture, 'radio-free');
      const pro = queryByTestId(fixture, 'radio-pro');
      const team = queryByTestId(fixture, 'radio-team');

      fixture.componentInstance.value.set('pro');
      await flush(fixture);

      expect(free.getAttribute('data-checked')).toBeNull();
      expect(pro.getAttribute('data-checked')).toBe('');
      expect(team.getAttribute('data-checked')).toBeNull();

      fixture.componentInstance.value.set('team');
      await flush(fixture);

      expect(free.getAttribute('data-checked')).toBeNull();
      expect(pro.getAttribute('data-checked')).toBeNull();
      expect(team.getAttribute('data-checked')).toBe('');
    });

    it('updates the value and emits when clicking a child', async () => {
      const fixture = createGroupRadio();
      const pro = queryByTestId(fixture, 'radio-pro');
      const proLabel = pro.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('valueChangeCount=0');

      await userEvent.click(proLabel);
      await flush(fixture);

      expect(pro.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('valueChangeCount=1');
      expect(readout.textContent).toContain('lastValueChange=pro');
    });

    it('wires aria-labelledby to the legend', async () => {
      const fixture = createGroupRadio();
      const group = queryByTestId(fixture, 'group');

      expect(group.getAttribute('aria-labelledby')).toBeNull();
      expect(group.querySelector('.legend')).toBeNull();

      fixture.componentInstance.legend.set('Plan');
      await flush(fixture);

      const legendElement = group.querySelector('.legend') as HTMLElement;

      expect(legendElement).not.toBeNull();
      expect(legendElement.textContent?.trim()).toBe('Plan');
      expect(group.getAttribute('aria-labelledby')).toBe(legendElement.id);
    });

    it('renders the group description', async () => {
      const fixture = createGroupRadio();
      const group = queryByTestId(fixture, 'group');

      expect(group.querySelector('.description')).toBeNull();

      fixture.componentInstance.description.set('Pick one');
      await flush(fixture);

      const description = group.querySelector('.description');

      expect(description).not.toBeNull();
      expect(description?.textContent?.trim()).toBe('Pick one');
    });

    it('marks the legend as required', async () => {
      const fixture = createGroupRadio({ legend: 'Plan' });
      const group = queryByTestId(fixture, 'group');

      expect(group.querySelector('.legend')?.getAttribute('data-required')).toBeNull();

      fixture.componentInstance.required.set(true);
      await flush(fixture);

      expect(group.querySelector('.legend')?.getAttribute('data-required')).toBe('1');
    });

    it('cascades the disabled state to children', async () => {
      const fixture = createGroupRadio();
      const group = queryByTestId(fixture, 'group');
      const pro = queryByTestId(fixture, 'radio-pro');
      const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(proInput.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      await flush(fixture);

      expect(group.getAttribute('aria-disabled')).toBe('true');
      expect(pro.getAttribute('data-disabled')).toBe('1');
      expect(proInput.disabled).toBe(true);
    });

    it('ignores child clicks when disabled', async () => {
      const fixture = createGroupRadio({ disabled: true });
      await flush(fixture);

      const pro = queryByTestId(fixture, 'radio-pro');
      const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;
      const readout = queryByTestId(fixture, 'readout');

      proInput.click();
      await flush(fixture);

      expect(pro.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('valueChangeCount=0');
    });
  });

  describe('reactive form integration', () => {
    it('writes the initial value into the matching child', () => {
      const fixture = createFixture(RadioFormHost);
      const free = queryByTestId(fixture, 'radio-free');
      const pro = queryByTestId(fixture, 'radio-pro');
      const team = queryByTestId(fixture, 'radio-team');

      expect(free.getAttribute('data-checked')).toBeNull();
      expect(pro.getAttribute('data-checked')).toBe('');
      expect(team.getAttribute('data-checked')).toBeNull();
    });

    it('updates the form value on a child click', async () => {
      const fixture = createFixture(RadioFormHost);
      const team = queryByTestId(fixture, 'radio-team');
      const teamLabel = team.querySelector('label') as HTMLLabelElement;
      const readout = queryByTestId(fixture, 'readout');

      expect(readout.textContent).toContain('value=pro');

      await userEvent.click(teamLabel);
      await flush(fixture);

      expect(team.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('value=team');
    });
  });

  describe('form-field integration', () => {
    it('cascades the error to a standalone radio in a form-field', async () => {
      const fixture = createFixture(RadioFormFieldHost);
      const radio = queryByTestId(fixture, 'radio');
      const input = radio.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(radio.getAttribute('data-state')).toBeNull();
      expect(input.getAttribute('aria-invalid')).toBeNull();
      expect(input.getAttribute('aria-describedby')).toBeNull();

      fixture.componentInstance.validationMessage.set('Required');
      await flush(fixture);

      expect(radio.getAttribute('data-state')).toBe('error');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).not.toBeNull();
      expect(input.getAttribute('aria-describedby')).toContain('form-field-validation-');
    });

    it('clears the error on a standalone radio when removed', async () => {
      const fixture = createFixture(RadioFormFieldHost);
      const radio = queryByTestId(fixture, 'radio');
      const input = radio.querySelector('input[type="radio"]') as HTMLInputElement;

      fixture.componentInstance.validationMessage.set('Required');
      await flush(fixture);
      expect(input.getAttribute('aria-invalid')).toBe('true');

      fixture.componentInstance.validationMessage.set(null);
      await flush(fixture);

      expect(radio.getAttribute('data-state')).toBeNull();
      expect(input.getAttribute('aria-invalid')).toBeNull();
      expect(input.getAttribute('aria-describedby')).toBeNull();
    });

    it('cascades the error to children of a group in a form-field', async () => {
      const fixture = createFixture(RadioFormFieldGroupHost);
      const group = queryByTestId(fixture, 'group');
      const free = queryByTestId(fixture, 'radio-free');
      const freeInput = free.querySelector('input[type="radio"]') as HTMLInputElement;
      const pro = queryByTestId(fixture, 'radio-pro');
      const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(group.getAttribute('data-state')).toBeNull();
      expect(freeInput.getAttribute('aria-invalid')).toBeNull();

      fixture.componentInstance.validationMessage.set('Required');
      await flush(fixture);

      expect(group.getAttribute('data-state')).toBe('error');
      expect(freeInput.getAttribute('aria-invalid')).toBe('true');
      expect(proInput.getAttribute('aria-invalid')).toBe('true');
      expect(freeInput.getAttribute('aria-describedby')).toContain('form-field-validation-');
      expect(proInput.getAttribute('aria-describedby')).toContain('form-field-validation-');
    });
  });
});
