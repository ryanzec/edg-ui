import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vitestBrowserUtils } from '../../../../../../vitest-browser-utils';
import { FormDisabledDirective } from './form-disabled-directive';

@Component({
  selector: 'test-form-disabled-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormDisabledDirective],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form">
      <input formControlName="name" [orgFormDisabled]="isDisabled()" data-testid="name-input" />
    </form>
  `,
})
class FormDisabledHost {
  public readonly form = new FormGroup({
    name: new FormControl<string>(''),
  });

  public readonly isDisabled = signal<boolean>(false);
}

type FormDisabledHostConfig = {
  disabled?: boolean;
};

describe('FormDisabledDirective (browser)', () => {
  const { createFixture, flush, queryByTestId, setupTestBed, destroyFixture } =
    vitestBrowserUtils.createBrowserTestHarness();

  const createHost = (config: FormDisabledHostConfig = {}): ComponentFixture<FormDisabledHost> =>
    createFixture(FormDisabledHost, (instance) => {
      if (config.disabled !== undefined) {
        instance.isDisabled.set(config.disabled);
      }
    });

  beforeEach(setupTestBed);

  afterEach(destroyFixture);

  it('renders the initial enabled state', () => {
    const fixture = createHost();
    const input = queryByTestId(fixture, 'name-input') as HTMLInputElement;

    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-disabled')).toBeNull();
  });

  it('disables the form control when the input is true', async () => {
    const fixture = createHost();
    const input = queryByTestId(fixture, 'name-input') as HTMLInputElement;

    fixture.componentInstance.isDisabled.set(true);
    await flush(fixture);

    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  it('restores the form control when the input toggles back', async () => {
    const fixture = createHost();
    const input = queryByTestId(fixture, 'name-input') as HTMLInputElement;

    fixture.componentInstance.isDisabled.set(true);
    await flush(fixture);
    expect(input.disabled).toBe(true);

    fixture.componentInstance.isDisabled.set(false);
    await flush(fixture);

    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-disabled')).toBeNull();
  });

  it('applies the disabled state at mount', () => {
    const fixture = createHost({ disabled: true });
    const input = queryByTestId(fixture, 'name-input') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });
});
