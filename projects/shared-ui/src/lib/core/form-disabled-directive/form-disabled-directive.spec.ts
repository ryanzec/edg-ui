import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';

import { FormDisabledDirective } from './form-disabled-directive';

@Component({
  selector: 'test-form-disabled-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormDisabledDirective],
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

describe('FormDisabledDirective', () => {
  let fixture: ComponentFixture<FormDisabledHost>;
  let component: FormDisabledHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDisabledHost],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDisabledHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('when orgFormDisabled is true', () => {
    beforeEach(async () => {
      component.isDisabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('disables the underlying form control', () => {
      expect(component.form.controls.name.disabled).toBe(true);
    });

    it('sets aria-disabled on the host element', () => {
      const input = fixture.nativeElement.querySelector('[data-testid="name-input"]') as HTMLInputElement;

      expect(input.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('when orgFormDisabled transitions from true to false', () => {
    beforeEach(async () => {
      component.isDisabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.isDisabled.set(false);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('re-enables the underlying form control', () => {
      expect(component.form.controls.name.disabled).toBe(false);
    });

    it('removes aria-disabled from the host element', () => {
      const input = fixture.nativeElement.querySelector('[data-testid="name-input"]') as HTMLInputElement;

      expect(input.getAttribute('aria-disabled')).toBeNull();
    });
  });
});
