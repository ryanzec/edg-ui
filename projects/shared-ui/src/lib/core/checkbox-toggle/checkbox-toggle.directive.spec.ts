import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { CheckboxToggleBrainDirective } from './checkbox-toggle-brain';

@Component({
  selector: 'test-checkbox-toggle-brain-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggleBrainDirective],
  template: `
    <div
      orgCheckboxToggleBrain
      #brainDirective="orgCheckboxToggleBrain"
      [(checked)]="checked"
      [disabled]="disabled()"
      (changed)="onChanged($event)"
      (touched)="onTouched()"
      data-testid="brain-host"
    ></div>
  `,
})
class CheckboxToggleBrainHost {
  public readonly checked = signal<boolean>(false);
  public readonly disabled = signal<boolean>(false);
  public onChanged = vi.fn<(value: boolean) => void>();
  public onTouched = vi.fn<() => void>();

  public readonly brainDirective = viewChild.required<CheckboxToggleBrainDirective>('brainDirective');
}

const getHost = (fixture: ComponentFixture<CheckboxToggleBrainHost>): HTMLElement =>
  fixture.nativeElement.querySelector('[data-testid="brain-host"]') as HTMLElement;

describe('CheckboxToggleBrainDirective', () => {
  let fixture: ComponentFixture<CheckboxToggleBrainHost>;
  let component: CheckboxToggleBrainHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxToggleBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxToggleBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('defaults', () => {
    it('starts unchecked, enabled, and with neutral accessibility state', () => {
      const brain = component.brainDirective();

      expect(brain.checked()).toBe(false);
      expect(brain.isDisabled()).toBe(false);
      expect(brain.ariaChecked()).toBe(false);
      expect(brain.ariaDisabled()).toBeNull();
      expect(brain.tabIndex()).toBe(0);
      expect(brain.ariaInvalid()).toBeNull();
      expect(brain.ariaDescribedBy()).toBeNull();
    });

    it('omits the host aria-disabled attribute by default', () => {
      expect(getHost(fixture).getAttribute('aria-disabled')).toBeNull();
    });

    it('exposes the static switch role', () => {
      expect(component.brainDirective().role).toBe('switch');
    });
  });

  describe('isDisabled', () => {
    it('is true when the consumer disabled input is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('is true when setFormDisabled(true) is called even though the input is false', async () => {
      component.brainDirective().setFormDisabled(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(true);
    });

    it('reflects on host aria-disabled and the computed tabIndex when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('aria-disabled')).toBe('true');
      expect(component.brainDirective().ariaDisabled()).toBe('true');
      expect(component.brainDirective().tabIndex()).toBe(-1);
    });

    it('clears disabled state when both the input and form-disabled signal are false', async () => {
      component.disabled.set(true);
      component.brainDirective().setFormDisabled(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.brainDirective().isDisabled()).toBe(true);

      component.disabled.set(false);
      component.brainDirective().setFormDisabled(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().isDisabled()).toBe(false);
    });
  });

  describe('ariaChecked', () => {
    it('tracks the checked model', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaChecked()).toBe(true);

      component.checked.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaChecked()).toBe(false);
    });
  });

  describe('setChecked', () => {
    it('updates the checked model', async () => {
      component.brainDirective().setChecked(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().checked()).toBe(true);
    });

    it('coerces null to false', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().setChecked(null as unknown as boolean);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().checked()).toBe(false);
    });
  });

  describe('setValidationContext', () => {
    it('drives ariaInvalid and ariaDescribedBy when a message is active', async () => {
      component.brainDirective().setValidationContext(true, 'validation-id');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaInvalid()).toBe(true);
      expect(component.brainDirective().ariaDescribedBy()).toBe('validation-id');
    });

    it('clears ariaInvalid and ariaDescribedBy when no message is active', async () => {
      component.brainDirective().setValidationContext(true, 'validation-id');
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().setValidationContext(false, null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaInvalid()).toBeNull();
      expect(component.brainDirective().ariaDescribedBy()).toBeNull();
    });
  });

  describe('handleClick', () => {
    it('toggles the checked model, emits changed with the new value, and emits touched', () => {
      const event = new MouseEvent('click', { cancelable: true });

      component.brainDirective().handleClick(event);

      expect(component.brainDirective().checked()).toBe(true);
      expect(component.onChanged).toHaveBeenCalledTimes(1);
      expect(component.onChanged).toHaveBeenCalledWith(true);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('toggles from true back to false on a second click', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().handleClick(new MouseEvent('click', { cancelable: true }));

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).toHaveBeenCalledWith(false);
    });

    it('does not toggle or emit when disabled but still prevents the default', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const event = new MouseEvent('click', { cancelable: true });

      component.brainDirective().handleClick(event);

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
      expect(component.onTouched).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('handleKeyDown', () => {
    it('toggles when Space is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });

      component.brainDirective().handleKeyDown(event);

      expect(component.brainDirective().checked()).toBe(true);
      expect(component.onChanged).toHaveBeenCalledWith(true);
      expect(event.defaultPrevented).toBe(true);
    });

    it('toggles when Enter is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });

      component.brainDirective().handleKeyDown(event);

      expect(component.brainDirective().checked()).toBe(true);
      expect(component.onChanged).toHaveBeenCalledWith(true);
      expect(event.defaultPrevented).toBe(true);
    });

    it('ignores other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });

      component.brainDirective().handleKeyDown(event);

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('does nothing when disabled, even for Space or Enter', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });

      component.brainDirective().handleKeyDown(spaceEvent);
      component.brainDirective().handleKeyDown(enterEvent);

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
      expect(spaceEvent.defaultPrevented).toBe(false);
      expect(enterEvent.defaultPrevented).toBe(false);
    });
  });
});
