import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import { Checkbox } from './checkbox';
import { CheckboxGroup } from './checkbox-group';
import { FormField } from '../form-fields/form-field';

describe('Checkbox', () => {
  describe('host attributes — defaults', () => {
    @Component({
      selector: 'test-checkbox-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox],
      template: `<org-checkbox name="foo" value="bar" data-testid="checkbox">label</org-checkbox>`,
    })
    class CheckboxDefaultsHost {}

    let fixture: ComponentFixture<CheckboxDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default size and color host attributes', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
    });

    it('omits data-checked, data-indeterminate, data-state, and data-disabled by default', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(host.getAttribute('data-indeterminate')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-checkbox-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox],
      template: `
        <org-checkbox
          name="foo"
          value="bar"
          [size]="size()"
          [color]="color()"
          [checked]="checked()"
          [indeterminate]="indeterminate()"
          [disabled]="disabled()"
          data-testid="checkbox"
        >
          label
        </org-checkbox>
      `,
    })
    class CheckboxAttrsHost {
      public readonly size = signal<'sm' | 'base' | 'lg'>('lg');
      public readonly color = signal<'primary' | 'danger'>('danger');
      public readonly checked = signal<boolean>(false);
      public readonly indeterminate = signal<boolean>(false);
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CheckboxAttrsHost>;
    let component: CheckboxAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the size and color inputs on the host', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
    });

    it('sets data-checked to an empty string when checked is true', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-checked')).toBe('');
    });

    it('sets data-indeterminate to an empty string when indeterminate is true', async () => {
      component.indeterminate.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-indeterminate')).toBe('');
    });

    it("sets data-disabled to '1' when disabled is true", async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-disabled')).toBe('1');
    });
  });

  describe('description rendering', () => {
    @Component({
      selector: 'test-checkbox-description-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox],
      template: `
        <org-checkbox name="foo" value="bar" [description]="description()" data-testid="checkbox"> label </org-checkbox>
      `,
    })
    class CheckboxDescriptionHost {
      public readonly description = signal<string>('');
    }

    let fixture: ComponentFixture<CheckboxDescriptionHost>;
    let component: CheckboxDescriptionHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxDescriptionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxDescriptionHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the description element when description is empty', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.querySelector('.checkbox-description')).toBeNull();
    });

    it('renders the description text when description is provided', async () => {
      component.description.set('helpful sub-line');
      fixture.detectChanges();
      await fixture.whenStable();

      const description = fixture.nativeElement.querySelector(
        '[data-testid="checkbox"] .checkbox-description'
      ) as HTMLElement;

      expect(description.textContent?.trim()).toBe('helpful sub-line');
    });
  });

  describe('label content projection', () => {
    @Component({
      selector: 'test-checkbox-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox],
      template: `
        <org-checkbox name="foo" value="bar" data-testid="checkbox">
          <strong data-testid="content">projected label</strong>
        </org-checkbox>
      `,
    })
    class CheckboxProjectionHost {}

    it('renders projected content inside the checkbox label', async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxProjectionHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CheckboxProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const projected = fixture.nativeElement.querySelector(
        '[data-testid="checkbox"] [data-testid="content"]'
      ) as HTMLElement;

      expect(projected.textContent?.trim()).toBe('projected label');
    });
  });

  describe('user interaction', () => {
    @Component({
      selector: 'test-checkbox-interaction-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox],
      template: `
        <org-checkbox
          name="foo"
          value="bar"
          [disabled]="disabled()"
          (checkedChange)="onCheckedChange($event)"
          data-testid="checkbox"
        >
          label
        </org-checkbox>
      `,
    })
    class CheckboxInteractionHost {
      public readonly disabled = signal<boolean>(false);
      public onCheckedChange = vi.fn();
    }

    let fixture: ComponentFixture<CheckboxInteractionHost>;
    let component: CheckboxInteractionHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxInteractionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxInteractionHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('toggles data-checked and emits checkedChange when the label is clicked', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      label.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledTimes(1);
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles data-checked and emits checkedChange on Space keydown', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles data-checked and emits checkedChange on Enter keydown', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle or emit when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      label.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(component.onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('reactive forms integration', () => {
    @Component({
      selector: 'test-checkbox-form-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox, ReactiveFormsModule],
      template: `
        <org-checkbox name="foo" value="bar" [formControl]="control" data-testid="checkbox">label</org-checkbox>
      `,
    })
    class CheckboxFormHost {
      public readonly control = new FormControl<boolean>(false, { nonNullable: true });
    }

    let fixture: ComponentFixture<CheckboxFormHost>;
    let component: CheckboxFormHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxFormHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxFormHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the form control value onto the host data-checked attribute', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;

      expect(host.getAttribute('data-checked')).toBeNull();

      component.control.setValue(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(host.getAttribute('data-checked')).toBe('');
    });

    it('updates the form control value when the user clicks the checkbox', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      label.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.control.value).toBe(true);
    });

    it('marks the form control as touched after a user interaction', async () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(component.control.touched).toBe(false);

      label.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.control.touched).toBe(true);
    });
  });

  describe('validation context via parent form-field', () => {
    @Component({
      selector: 'test-checkbox-validation-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [Checkbox, FormField],
      template: `
        <org-form-field [validationMessage]="message()">
          <org-checkbox name="foo" value="bar" data-testid="checkbox">label</org-checkbox>
        </org-form-field>
      `,
    })
    class CheckboxValidationHost {
      public readonly message = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<CheckboxValidationHost>;
    let component: CheckboxValidationHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxValidationHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxValidationHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not mark the checkbox as invalid when no validation message is set', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });

    it('sets data-state, aria-invalid, and aria-describedby when the form-field has a validation message', async () => {
      component.message.set('required');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="checkbox"]') as HTMLElement;
      const label = host.querySelector('label') as HTMLLabelElement;

      expect(host.getAttribute('data-state')).toBe('error');
      expect(label.getAttribute('aria-invalid')).toBe('true');
      expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });
  });
});

describe('CheckboxGroup', () => {
  describe('host attributes — defaults', () => {
    let fixture: ComponentFixture<CheckboxGroup>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxGroup],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxGroup);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default size on the host', () => {
      const host = fixture.nativeElement as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('base');
    });

    it('omits data-state, data-disabled, and aria-labelledby by default', () => {
      const host = fixture.nativeElement as HTMLElement;

      expect(host.getAttribute('data-state')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('aria-labelledby')).toBeNull();
    });

    it('does not render the header section when neither legend nor description is provided', () => {
      const host = fixture.nativeElement as HTMLElement;

      expect(host.querySelector('.header')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-checkbox-group-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxGroup],
      template: `<org-checkbox-group [size]="size()" [disabled]="disabled()" data-testid="group"></org-checkbox-group>`,
    })
    class CheckboxGroupAttrsHost {
      public readonly size = signal<'sm' | 'base' | 'lg'>('lg');
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CheckboxGroupAttrsHost>;
    let component: CheckboxGroupAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxGroupAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxGroupAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the size input on the host', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-size')).toBe('lg');
    });

    it("sets data-disabled to '1' when disabled is true", async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-disabled')).toBe('1');
    });
  });

  describe('header rendering', () => {
    @Component({
      selector: 'test-checkbox-group-header-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxGroup],
      template: `
        <org-checkbox-group
          [legend]="legend()"
          [description]="description()"
          [required]="required()"
          data-testid="group"
        ></org-checkbox-group>
      `,
    })
    class CheckboxGroupHeaderHost {
      public readonly legend = signal<string>('');
      public readonly description = signal<string>('');
      public readonly required = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CheckboxGroupHeaderHost>;
    let component: CheckboxGroupHeaderHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxGroupHeaderHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxGroupHeaderHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the legend text and links the host aria-labelledby when legend is provided', async () => {
      component.legend.set('Notifications');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;
      const legend = host.querySelector('.legend') as HTMLElement;

      expect(legend.textContent?.trim()).toBe('Notifications');
      expect(legend.id).toMatch(/^checkbox-group-legend-/);
      expect(host.getAttribute('aria-labelledby')).toBe(legend.id);
    });

    it("sets data-required='1' on the legend when required is true", async () => {
      component.legend.set('Notifications');
      component.required.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const legend = fixture.nativeElement.querySelector('[data-testid="group"] .legend') as HTMLElement;

      expect(legend.getAttribute('data-required')).toBe('1');
    });

    it('renders the description text when description is provided', async () => {
      component.description.set('Pick the events you want emailed.');
      fixture.detectChanges();
      await fixture.whenStable();

      const description = fixture.nativeElement.querySelector('[data-testid="group"] .description') as HTMLElement;

      expect(description.textContent?.trim()).toBe('Pick the events you want emailed.');
    });
  });

  describe('child checkbox projection', () => {
    @Component({
      selector: 'test-checkbox-group-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxGroup, Checkbox],
      template: `
        <org-checkbox-group data-testid="group">
          <org-checkbox name="a" value="a">A</org-checkbox>
          <org-checkbox name="b" value="b">B</org-checkbox>
          <org-checkbox name="c" value="c">C</org-checkbox>
        </org-checkbox-group>
      `,
    })
    class CheckboxGroupProjectionHost {}

    it('renders projected child checkboxes inside the options container', async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxGroupProjectionHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CheckboxGroupProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const options = fixture.nativeElement.querySelector('[data-testid="group"] .options') as HTMLElement;

      expect(options.querySelectorAll('org-checkbox').length).toBe(3);
    });
  });

  describe('error state via parent form-field', () => {
    @Component({
      selector: 'test-checkbox-group-validation-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxGroup, FormField],
      template: `
        <org-form-field [validationMessage]="message()">
          <org-checkbox-group data-testid="group"></org-checkbox-group>
        </org-form-field>
      `,
    })
    class CheckboxGroupValidationHost {
      public readonly message = signal<string | undefined>(undefined);
    }

    let fixture: ComponentFixture<CheckboxGroupValidationHost>;
    let component: CheckboxGroupValidationHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxGroupValidationHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxGroupValidationHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not apply data-state when no validation message is present', () => {
      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-state')).toBeNull();
    });

    it("applies data-state='error' when the form-field has a validation message", async () => {
      component.message.set('Pick at least one notification type');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('[data-testid="group"]') as HTMLElement;

      expect(host.getAttribute('data-state')).toBe('error');
    });
  });
});
