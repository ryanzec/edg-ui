import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { CheckboxBrainDirective } from './checkbox-brain';

describe('CheckboxBrainDirective', () => {
  @Component({
    selector: 'test-checkbox-brain-host',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CheckboxBrainDirective],
    template: `
      <div
        orgCheckboxBrain
        #brainDirective="orgCheckboxBrain"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="disabled()"
        (changed)="onChanged($event)"
        (touched)="onTouched()"
        data-testid="brain-checkbox"
      ></div>
    `,
  })
  class CheckboxBrainHost {
    public readonly checked = signal<boolean>(false);
    public readonly indeterminate = signal<boolean>(false);
    public readonly disabled = signal<boolean>(false);
    public onChanged = vi.fn();
    public onTouched = vi.fn();

    public readonly brainDirective = viewChild.required<CheckboxBrainDirective>('brainDirective');
  }

  let fixture: ComponentFixture<CheckboxBrainHost>;
  let component: CheckboxBrainHost;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('[data-testid="brain-checkbox"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxBrainHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxBrainHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('defaults', () => {
    it('exposes the static checkbox role', () => {
      expect(component.brainDirective().role).toBe('checkbox');
    });

    it('defaults checked, indeterminate, and disabled to false', () => {
      expect(component.brainDirective().checked()).toBe(false);
      expect(component.brainDirective().indeterminate()).toBe(false);
      expect(component.brainDirective().disabled()).toBe(false);
    });
  });

  describe('ariaChecked', () => {
    it('returns false when unchecked and not indeterminate', () => {
      expect(component.brainDirective().ariaChecked()).toBe(false);
    });

    it('returns true when checked is true', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaChecked()).toBe(true);
    });

    it("returns 'mixed' when indeterminate is true regardless of checked", async () => {
      component.indeterminate.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaChecked()).toBe('mixed');

      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().ariaChecked()).toBe('mixed');
    });
  });

  describe('ariaDisabled host binding', () => {
    it('omits the aria-disabled attribute by default', () => {
      expect(getHost().getAttribute('aria-disabled')).toBeNull();
    });

    it("reflects 'true' on the host when disabled is true", async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost().getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('tabIndex', () => {
    it('returns 0 when not disabled', () => {
      expect(component.brainDirective().tabIndex()).toBe(0);
    });

    it('returns -1 when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.brainDirective().tabIndex()).toBe(-1);
    });
  });

  describe('validation context', () => {
    it('returns null for ariaInvalid and ariaDescribedBy by default', () => {
      expect(component.brainDirective().ariaInvalid()).toBeNull();
      expect(component.brainDirective().ariaDescribedBy()).toBeNull();
    });

    it('exposes true / messageId after a validation message is set', () => {
      component.brainDirective().setValidationContext(true, 'message-1');

      expect(component.brainDirective().ariaInvalid()).toBe(true);
      expect(component.brainDirective().ariaDescribedBy()).toBe('message-1');
    });

    it('resets to null when the validation context is cleared', () => {
      component.brainDirective().setValidationContext(true, 'message-1');
      component.brainDirective().setValidationContext(false, null);

      expect(component.brainDirective().ariaInvalid()).toBeNull();
      expect(component.brainDirective().ariaDescribedBy()).toBeNull();
    });
  });

  describe('setChecked', () => {
    it('updates the checked model with the provided value', () => {
      component.brainDirective().setChecked(true);

      expect(component.brainDirective().checked()).toBe(true);
    });

    it('coerces a null value to false via the defensive fallback', () => {
      component.brainDirective().setChecked(null as unknown as boolean);

      expect(component.brainDirective().checked()).toBe(false);
    });
  });

  describe('setIndeterminate', () => {
    it('updates the indeterminate model with the provided value', () => {
      component.brainDirective().setIndeterminate(true);

      expect(component.brainDirective().indeterminate()).toBe(true);
    });

    it('coerces a null value to false via the defensive fallback', () => {
      component.brainDirective().setIndeterminate(null as unknown as boolean);

      expect(component.brainDirective().indeterminate()).toBe(false);
    });
  });

  describe('handleClick', () => {
    it('toggles unchecked → checked, emits changed with true, and emits touched', () => {
      const event = new MouseEvent('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.brainDirective().handleClick(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.brainDirective().checked()).toBe(true);
      expect(component.brainDirective().indeterminate()).toBe(false);
      expect(component.onChanged).toHaveBeenCalledTimes(1);
      expect(component.onChanged).toHaveBeenCalledWith(true);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
    });

    it('toggles checked → unchecked and emits changed with false', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().handleClick(new MouseEvent('click'));

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).toHaveBeenCalledWith(false);
    });

    it('transitions indeterminate to checked=true and clears indeterminate', async () => {
      component.indeterminate.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().handleClick(new MouseEvent('click'));

      expect(component.brainDirective().checked()).toBe(true);
      expect(component.brainDirective().indeterminate()).toBe(false);
      expect(component.onChanged).toHaveBeenCalledWith(true);
    });

    it('preventDefaults and does not toggle or emit when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const event = new MouseEvent('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.brainDirective().handleClick(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
      expect(component.onTouched).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    it('triggers a click toggle on Space', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.brainDirective().handleKeyDown(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.brainDirective().checked()).toBe(true);
      expect(component.onChanged).toHaveBeenCalledWith(true);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
    });

    it('triggers a click toggle on Enter', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.brainDirective().handleKeyDown(event);

      expect(component.brainDirective().checked()).toBe(true);
      expect(component.onChanged).toHaveBeenCalledWith(true);
    });

    it('ignores other keys', () => {
      component.brainDirective().handleKeyDown(new KeyboardEvent('keydown', { key: 'a' }));

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
    });

    it('does not toggle or emit when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      component.brainDirective().handleKeyDown(new KeyboardEvent('keydown', { key: ' ' }));

      expect(component.brainDirective().checked()).toBe(false);
      expect(component.onChanged).not.toHaveBeenCalled();
    });
  });
});
