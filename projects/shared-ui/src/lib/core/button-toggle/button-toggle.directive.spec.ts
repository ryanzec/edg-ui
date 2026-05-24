import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { ButtonToggleBrainDirective } from './button-toggle-brain';

@Component({
  selector: 'test-button-toggle-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonToggleBrainDirective],
  template: `
    <div
      orgButtonToggleBrain
      #brainDirective="orgButtonToggleBrain"
      [value]="value()"
      [disabled]="disabled()"
      (changed)="onChanged($event)"
      data-testid="brain-host"
    ></div>
  `,
})
class ButtonToggleBrainHost {
  public readonly value = signal<string>('');
  public readonly disabled = signal<boolean>(false);
  public onChanged = vi.fn<(value: string) => void>();

  public readonly brainDirective = viewChild.required<ButtonToggleBrainDirective>('brainDirective');
}

describe('ButtonToggleBrainDirective', () => {
  let fixture: ComponentFixture<ButtonToggleBrainHost>;
  let component: ButtonToggleBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonToggleBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonToggleBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('currentValue', () => {
    it('reflects the value input when not form-controlled', async () => {
      component.value.set('center');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().currentValue()).toBe('center');
    });

    it('reflects the internal value after setFormControlled, ignoring the value input', async () => {
      component.value.set('center');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().setFormControlled();
      component.brainDirective().setInternalValue('right');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().currentValue()).toBe('right');
    });
  });

  describe('isDisabled', () => {
    it('is true when the disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('is true when setFormDisabled has been called with true', async () => {
      component.brainDirective().setFormDisabled(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('is false when neither the disabled input nor form-disabled is true', () => {
      expect(component.brainDirective().isDisabled()).toBe(false);
    });
  });

  describe('selectValue', () => {
    it('emits changed with the new value when a different value is selected', async () => {
      component.value.set('left');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('right');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onChanged).toHaveBeenCalledTimes(1);
      expect(component.onChanged).toHaveBeenCalledWith('right');
    });

    it('updates currentValue after selection when form-controlled', async () => {
      component.brainDirective().setFormControlled();
      component.brainDirective().setInternalValue('left');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('right');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().currentValue()).toBe('right');
    });

    it('does not emit when the disabled input is true', async () => {
      component.value.set('left');
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('right');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onChanged).not.toHaveBeenCalled();
    });

    it('does not emit when form-disabled is true', async () => {
      component.value.set('left');
      component.brainDirective().setFormDisabled(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('right');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onChanged).not.toHaveBeenCalled();
    });

    it('does not emit when the selected value matches currentValue in non-form-controlled mode', async () => {
      component.value.set('center');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('center');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onChanged).not.toHaveBeenCalled();
    });

    it('does not emit when the selected value matches currentValue in form-controlled mode', async () => {
      component.brainDirective().setFormControlled();
      component.brainDirective().setInternalValue('center');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().selectValue('center');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.onChanged).not.toHaveBeenCalled();
    });
  });

  describe('setInternalValue', () => {
    it('falls back to the default empty string when null is passed', async () => {
      component.brainDirective().setFormControlled();
      component.brainDirective().setInternalValue('center');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().currentValue()).toBe('center');

      component.brainDirective().setInternalValue(null as unknown as string);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().currentValue()).toBe('');
    });
  });
});
