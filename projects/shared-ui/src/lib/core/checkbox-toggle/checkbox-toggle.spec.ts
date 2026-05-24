import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import {
  CheckboxToggle,
  CheckboxToggleColor,
  CheckboxToggleLabelPosition,
  CheckboxToggleSize,
} from './checkbox-toggle';
import { FormField } from '../form-fields/form-field';

const getHost = (fixture: ComponentFixture<unknown>): HTMLElement =>
  fixture.nativeElement.querySelector('[data-testid="toggle"]') as HTMLElement;

const getLabel = (fixture: ComponentFixture<unknown>): HTMLLabelElement =>
  fixture.nativeElement.querySelector('[data-testid="toggle"] label') as HTMLLabelElement;

const getNativeInput = (fixture: ComponentFixture<unknown>): HTMLInputElement =>
  fixture.nativeElement.querySelector('[data-testid="toggle"] input[type="checkbox"]') as HTMLInputElement;

describe('CheckboxToggle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('host attributes — defaults', () => {
    @Component({
      selector: 'test-checkbox-toggle-defaults-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `<org-checkbox-toggle name="setting" value="on" data-testid="toggle">Label</org-checkbox-toggle>`,
    })
    class CheckboxToggleDefaultsHost {}

    let fixture: ComponentFixture<CheckboxToggleDefaultsHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleDefaultsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleDefaultsHost);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('applies the default size, color, and label-position host attributes', () => {
      const host = getHost(fixture);

      expect(host.getAttribute('data-size')).toBe('base');
      expect(host.getAttribute('data-color')).toBe('primary');
      expect(host.getAttribute('data-label-position')).toBe('end');
    });

    it('omits the data-checked, data-disabled, and data-state attributes by default', () => {
      const host = getHost(fixture);

      expect(host.getAttribute('data-checked')).toBeNull();
      expect(host.getAttribute('data-disabled')).toBeNull();
      expect(host.getAttribute('data-state')).toBeNull();
    });
  });

  describe('host attributes — driven by inputs', () => {
    @Component({
      selector: 'test-checkbox-toggle-attrs-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle
          name="setting"
          value="on"
          [size]="size()"
          [color]="color()"
          [labelPosition]="labelPosition()"
          [checked]="checked()"
          [disabled]="disabled()"
          data-testid="toggle"
        >
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleAttrsHost {
      public readonly size = signal<CheckboxToggleSize>('lg');
      public readonly color = signal<CheckboxToggleColor>('danger');
      public readonly labelPosition = signal<CheckboxToggleLabelPosition>('start');
      public readonly checked = signal<boolean>(false);
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CheckboxToggleAttrsHost>;
    let component: CheckboxToggleAttrsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleAttrsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleAttrsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects size, color, and labelPosition on the host', () => {
      const host = getHost(fixture);

      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
      expect(host.getAttribute('data-label-position')).toBe('start');
    });

    it('reflects data-checked as an empty string when checked is true', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBe('');
    });

    it('reflects data-disabled as an empty string when disabled is true', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-disabled')).toBe('');
    });

    it('clears data-checked when the input flips back to false', async () => {
      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getHost(fixture).getAttribute('data-checked')).toBe('');

      component.checked.set(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
    });
  });

  describe('text size derivation', () => {
    @Component({
      selector: 'test-checkbox-toggle-text-size-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle name="setting" value="on" [size]="size()" data-testid="toggle">Label</org-checkbox-toggle>
      `,
    })
    class CheckboxToggleTextSizeHost {
      public readonly size = signal<CheckboxToggleSize>('base');
    }

    let fixture: ComponentFixture<CheckboxToggleTextSizeHost>;
    let component: CheckboxToggleTextSizeHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleTextSizeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleTextSizeHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const readLabelTextSize = () =>
      (fixture.nativeElement.querySelector('[data-testid="toggle"] .label') as HTMLElement).getAttribute(
        'data-text-size'
      );

    it('maps size sm to text-size sm', async () => {
      component.size.set('sm');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readLabelTextSize()).toBe('sm');
    });

    it('maps size base to text-size base', () => {
      expect(readLabelTextSize()).toBe('base');
    });

    it('maps size lg to text-size lg', async () => {
      component.size.set('lg');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readLabelTextSize()).toBe('lg');
    });
  });

  describe('icon size derivation', () => {
    @Component({
      selector: 'test-checkbox-toggle-icon-size-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle name="setting" value="on" iconOn="check" [size]="size()" data-testid="toggle">
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleIconSizeHost {
      public readonly size = signal<CheckboxToggleSize>('base');
    }

    let fixture: ComponentFixture<CheckboxToggleIconSizeHost>;
    let component: CheckboxToggleIconSizeHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleIconSizeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleIconSizeHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    const readIconSize = () =>
      (fixture.nativeElement.querySelector('[data-testid="toggle"] org-icon') as HTMLElement).getAttribute('data-size');

    it('maps size sm to icon size 2xs', async () => {
      component.size.set('sm');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readIconSize()).toBe('2xs');
    });

    it('maps size base to icon size 2xs', () => {
      expect(readIconSize()).toBe('2xs');
    });

    it('maps size lg to icon size xs', async () => {
      component.size.set('lg');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(readIconSize()).toBe('xs');
    });
  });

  describe('description rendering', () => {
    @Component({
      selector: 'test-checkbox-toggle-description-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle name="setting" value="on" [description]="description()" data-testid="toggle">
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleDescriptionHost {
      public readonly description = signal<string>('');
    }

    let fixture: ComponentFixture<CheckboxToggleDescriptionHost>;
    let component: CheckboxToggleDescriptionHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleDescriptionHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleDescriptionHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render the description span when description is empty', () => {
      expect(fixture.nativeElement.querySelector('[data-testid="toggle"] .description')).toBeNull();
    });

    it('renders the description text when provided', async () => {
      component.description.set('Up to once a week.');
      fixture.detectChanges();
      await fixture.whenStable();

      const description = fixture.nativeElement.querySelector('[data-testid="toggle"] .description') as HTMLElement;

      expect(description).not.toBeNull();
      expect(description.textContent?.trim()).toBe('Up to once a week.');
    });
  });

  describe('icon rendering', () => {
    @Component({
      selector: 'test-checkbox-toggle-icons-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle name="setting" value="on" [iconOn]="iconOn()" [iconOff]="iconOff()" data-testid="toggle">
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleIconsHost {
      public readonly iconOn = signal<'check' | null | undefined>(undefined);
      public readonly iconOff = signal<'x' | null | undefined>(undefined);
    }

    let fixture: ComponentFixture<CheckboxToggleIconsHost>;
    let component: CheckboxToggleIconsHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleIconsHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleIconsHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders no knob icons by default', () => {
      const host = getHost(fixture);

      expect(host.querySelector('.icon-on')).toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });

    it('renders the icon-on slot only when iconOn is provided', async () => {
      component.iconOn.set('check');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost(fixture);

      expect(host.querySelector('.icon-on')).not.toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });

    it('renders the icon-off slot only when iconOff is provided', async () => {
      component.iconOff.set('x');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost(fixture);

      expect(host.querySelector('.icon-off')).not.toBeNull();
      expect(host.querySelector('.icon-on')).toBeNull();
    });

    it('transforms null iconOn / iconOff inputs to undefined and skips rendering', async () => {
      component.iconOn.set(null);
      component.iconOff.set(null);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost(fixture);

      expect(host.querySelector('.icon-on')).toBeNull();
      expect(host.querySelector('.icon-off')).toBeNull();
    });
  });

  describe('content projection', () => {
    @Component({
      selector: 'test-checkbox-toggle-projection-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `<org-checkbox-toggle name="setting" value="on" data-testid="toggle"
        >Enable notifications</org-checkbox-toggle
      >`,
    })
    class CheckboxToggleProjectionHost {}

    it('projects the label content into the .label span', async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleProjectionHost],
      }).compileComponents();

      const fixture = TestBed.createComponent(CheckboxToggleProjectionHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const label = fixture.nativeElement.querySelector('[data-testid="toggle"] .label') as HTMLElement;

      expect(label.textContent?.trim()).toBe('Enable notifications');
    });
  });

  describe('native input wiring', () => {
    @Component({
      selector: 'test-checkbox-toggle-native-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle
          [name]="name()"
          [value]="value()"
          [checked]="checked()"
          [disabled]="disabled()"
          data-testid="toggle"
        >
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleNativeHost {
      public readonly name = signal<string>('notifications');
      public readonly value = signal<string>('on');
      public readonly checked = signal<boolean>(false);
      public readonly disabled = signal<boolean>(false);
    }

    let fixture: ComponentFixture<CheckboxToggleNativeHost>;
    let component: CheckboxToggleNativeHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleNativeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleNativeHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('forwards name and value to the native checkbox input', () => {
      const input = getNativeInput(fixture);

      expect(input.name).toBe('notifications');
      expect(input.value).toBe('on');
    });

    it('mirrors the checked state to the native input', async () => {
      expect(getNativeInput(fixture).checked).toBe(false);

      component.checked.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getNativeInput(fixture).checked).toBe(true);
    });

    it('mirrors the disabled state to the native input', async () => {
      expect(getNativeInput(fixture).disabled).toBe(false);

      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getNativeInput(fixture).disabled).toBe(true);
    });
  });

  describe('click interaction', () => {
    @Component({
      selector: 'test-checkbox-toggle-click-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle
          name="setting"
          value="on"
          [disabled]="disabled()"
          (checkedChange)="onCheckedChange($event)"
          data-testid="toggle"
        >
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleClickHost {
      public readonly disabled = signal<boolean>(false);
      public onCheckedChange = vi.fn<(value: boolean) => void>();
    }

    let fixture: ComponentFixture<CheckboxToggleClickHost>;
    let component: CheckboxToggleClickHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleClickHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleClickHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('toggles data-checked and emits checkedChange when the label is clicked', async () => {
      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledTimes(1);
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles back to false and emits false on a second click', async () => {
      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();
      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
      expect(component.onCheckedChange).toHaveBeenCalledTimes(2);
      expect(component.onCheckedChange).toHaveBeenLastCalledWith(false);
    });

    it('does not toggle or emit when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
      expect(component.onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    @Component({
      selector: 'test-checkbox-toggle-keyboard-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle],
      template: `
        <org-checkbox-toggle
          name="setting"
          value="on"
          [disabled]="disabled()"
          (checkedChange)="onCheckedChange($event)"
          data-testid="toggle"
        >
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleKeyboardHost {
      public readonly disabled = signal<boolean>(false);
      public onCheckedChange = vi.fn<(value: boolean) => void>();
    }

    let fixture: ComponentFixture<CheckboxToggleKeyboardHost>;
    let component: CheckboxToggleKeyboardHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleKeyboardHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleKeyboardHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('toggles on Space', async () => {
      getLabel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('toggles on Enter', async () => {
      getLabel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBe('');
      expect(component.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('ignores other keys', async () => {
      getLabel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'a', cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
      expect(component.onCheckedChange).not.toHaveBeenCalled();
    });

    it('does not toggle on Space or Enter when disabled', async () => {
      component.disabled.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      getLabel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
      getLabel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
      expect(component.onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('reactive forms integration', () => {
    @Component({
      selector: 'test-checkbox-toggle-form-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle, ReactiveFormsModule],
      template: `
        <org-checkbox-toggle name="setting" value="on" [formControl]="control" data-testid="toggle">
          Label
        </org-checkbox-toggle>
      `,
    })
    class CheckboxToggleFormHost {
      public readonly control = new FormControl<boolean>(false, { nonNullable: true });
    }

    let fixture: ComponentFixture<CheckboxToggleFormHost>;
    let component: CheckboxToggleFormHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleFormHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleFormHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the initial form control value as data-checked', async () => {
      component.control.setValue(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBe('');
      expect(getNativeInput(fixture).checked).toBe(true);
    });

    it('writes a programmatic form control value into the toggle', async () => {
      component.control.setValue(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getHost(fixture).getAttribute('data-checked')).toBe('');

      component.control.setValue(false);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-checked')).toBeNull();
    });

    it('updates the form control value when the label is clicked', async () => {
      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.control.value).toBe(true);
    });

    it('marks the form control as touched after a click', async () => {
      expect(component.control.touched).toBe(false);

      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.control.touched).toBe(true);
    });

    it('propagates control.disable() to the host and native input', async () => {
      component.control.disable();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getHost(fixture).getAttribute('data-disabled')).toBe('');
      expect(getNativeInput(fixture).disabled).toBe(true);
    });

    it('does not emit when clicked while the form control is disabled', async () => {
      component.control.disable();
      fixture.detectChanges();
      await fixture.whenStable();

      getLabel(fixture).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.control.value).toBe(false);
    });
  });

  describe('form-field validation context', () => {
    @Component({
      selector: 'test-checkbox-toggle-form-field-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CheckboxToggle, FormField],
      template: `
        <org-form-field [validationMessage]="validationMessage()" data-testid="form-field">
          <org-checkbox-toggle name="setting" value="on" data-testid="toggle">Label</org-checkbox-toggle>
        </org-form-field>
      `,
    })
    class CheckboxToggleFormFieldHost {
      public readonly validationMessage = signal<string | null | undefined>(undefined);
    }

    let fixture: ComponentFixture<CheckboxToggleFormFieldHost>;
    let component: CheckboxToggleFormFieldHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CheckboxToggleFormFieldHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxToggleFormFieldHost);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not apply error attributes when no validation message is set', () => {
      const host = getHost(fixture);
      const label = getLabel(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });

    it('applies data-state, aria-invalid, and aria-describedby when a validation message is set', async () => {
      component.validationMessage.set('Required');
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost(fixture);
      const label = getLabel(fixture);

      expect(host.getAttribute('data-state')).toBe('error');
      expect(label.getAttribute('aria-invalid')).toBe('true');
      expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });

    it('clears the error attributes when the validation message is cleared', async () => {
      component.validationMessage.set('Required');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getHost(fixture).getAttribute('data-state')).toBe('error');

      component.validationMessage.set(undefined);
      fixture.detectChanges();
      await fixture.whenStable();

      const host = getHost(fixture);
      const label = getLabel(fixture);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });
  });
});
