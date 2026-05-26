import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  CheckboxToggle,
  type CheckboxToggleColor,
  type CheckboxToggleLabelPosition,
  type CheckboxToggleSize,
} from './checkbox-toggle';
import { FormField } from '../form-fields/form-field';
import { type IconName } from '../icon/icon-brain';

@Component({
  selector: 'story-checkbox-toggle-tests-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-label-position-start" (click)="labelPosition.set('start')">
        label-position-start
      </button>
      <button type="button" data-testid="ctl-checked-on" (click)="checked.set(true)">checked-on</button>
      <button type="button" data-testid="ctl-checked-off" (click)="checked.set(false)">checked-off</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-description-set" (click)="description.set('Up to once a week.')">
        description-set
      </button>
      <button type="button" data-testid="ctl-description-clear" (click)="description.set('')">description-clear</button>
      <button type="button" data-testid="ctl-icon-on-check" (click)="iconOn.set('check')">icon-on-check</button>
      <button type="button" data-testid="ctl-icon-on-clear" (click)="iconOn.set(undefined)">icon-on-clear</button>
      <button type="button" data-testid="ctl-icon-off-x" (click)="iconOff.set('x')">icon-off-x</button>
      <button type="button" data-testid="ctl-icon-off-clear" (click)="iconOff.set(undefined)">icon-off-clear</button>
      <button type="button" data-testid="ctl-icon-on-null" (click)="iconOn.set(null)">icon-on-null</button>
      <button type="button" data-testid="ctl-icon-off-null" (click)="iconOff.set(null)">icon-off-null</button>
    </div>
  `,
})
class StoryCheckboxToggleTestsShell {
  protected readonly labelText = signal<string>('Label');
  protected readonly size = signal<CheckboxToggleSize>('base');
  protected readonly color = signal<CheckboxToggleColor>('primary');
  protected readonly labelPosition = signal<CheckboxToggleLabelPosition>('end');
  protected readonly description = signal<string>('');
  protected readonly iconOn = signal<IconName | null | undefined>(undefined);
  protected readonly iconOff = signal<IconName | null | undefined>(undefined);
  protected readonly checked = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);

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
  selector: 'story-checkbox-toggle-projection-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle],
  host: { class: 'block' },
  template: `
    <org-checkbox-toggle data-testid="toggle" name="setting" value="on">Enable notifications</org-checkbox-toggle>
  `,
})
class StoryCheckboxToggleProjectionShell {}

@Component({
  selector: 'story-checkbox-toggle-form-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-form-set-true" (click)="control.setValue(true)">form-set-true</button>
      <button type="button" data-testid="ctl-form-set-false" (click)="control.setValue(false)">form-set-false</button>
      <button type="button" data-testid="ctl-form-set-null" (click)="setNullValue()">form-set-null</button>
      <button type="button" data-testid="ctl-form-disable" (click)="control.disable()">form-disable</button>
      <button type="button" data-testid="ctl-form-enable" (click)="control.enable()">form-enable</button>
      <button type="button" data-testid="ctl-consumer-disabled-on" (click)="consumerDisabled.set(true)">
        consumer-disabled-on
      </button>
      <button type="button" data-testid="ctl-consumer-disabled-off" (click)="consumerDisabled.set(false)">
        consumer-disabled-off
      </button>
    </div>
  `,
})
class StoryCheckboxToggleFormShell {
  public readonly control = new FormControl<boolean>(false, { nonNullable: true });
  protected readonly consumerDisabled = signal<boolean>(false);

  protected readout(): string {
    return `value=${this.control.value} touched=${this.control.touched} disabled=${this.control.disabled}`;
  }

  protected setNullValue(): void {
    this.control.setValue(null as unknown as boolean);
  }
}

@Component({
  selector: 'story-checkbox-toggle-form-field-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxToggle, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()" data-testid="form-field">
      <org-checkbox-toggle data-testid="toggle" name="setting" value="on">Label</org-checkbox-toggle>
    </org-form-field>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-message-set" (click)="validationMessage.set('Required')">
        message-set
      </button>
      <button type="button" data-testid="ctl-message-clear" (click)="validationMessage.set(undefined)">
        message-clear
      </button>
    </div>
  `,
})
class StoryCheckboxToggleFormFieldShell {
  protected readonly validationMessage = signal<string | null | undefined>(undefined);
}

const meta: Meta = {
  title: 'Core/Components/Checkbox Toggle/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-checkbox-toggle-tests-shell />`,
  moduleMetadata: { imports: [StoryCheckboxToggleTestsShell] },
});

const renderProjectionShell: Story['render'] = () => ({
  template: `<story-checkbox-toggle-projection-shell />`,
  moduleMetadata: { imports: [StoryCheckboxToggleProjectionShell] },
});

const renderFormShell: Story['render'] = () => ({
  template: `<story-checkbox-toggle-form-shell />`,
  moduleMetadata: { imports: [StoryCheckboxToggleFormShell] },
});

const renderFormFieldShell: Story['render'] = () => ({
  template: `<story-checkbox-toggle-form-field-shell />`,
  moduleMetadata: { imports: [StoryCheckboxToggleFormFieldShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-color')).toBe('primary');
    await expect(host.getAttribute('data-label-position')).toBe('end');
  },
};

export const OmitsStateHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('data-state')).toBeNull();
  },
};

export const ReflectsSizeColorAndLabelPositionInputs: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await userEvent.click(canvas.getByTestId('ctl-label-position-start'));

    await expect(host.getAttribute('data-size')).toBe('lg');
    await expect(host.getAttribute('data-color')).toBe('danger');
    await expect(host.getAttribute('data-label-position')).toBe('start');
  },
};

export const ReflectsDataCheckedWhenCheckedIsTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-checked-on'));

    await expect(host.getAttribute('data-checked')).toBe('');
  },
};

export const ReflectsDataDisabledWhenDisabledIsTrue: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(host.getAttribute('data-disabled')).toBe('');
  },
};

export const ClearsDataCheckedWhenInputFlipsBackToFalse: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-checked-on'));
    await expect(host.getAttribute('data-checked')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-checked-off'));

    await expect(host.getAttribute('data-checked')).toBeNull();
  },
};

export const TextSizeMapsForSmall: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    const labelSpan = host.querySelector('.label') as HTMLElement;

    await expect(labelSpan.getAttribute('data-text-size')).toBe('sm');
  },
};

export const TextSizeMapsForBase: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const labelSpan = host.querySelector('.label') as HTMLElement;

    await expect(labelSpan.getAttribute('data-text-size')).toBe('base');
  },
};

export const TextSizeMapsForLarge: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    const labelSpan = host.querySelector('.label') as HTMLElement;

    await expect(labelSpan.getAttribute('data-text-size')).toBe('lg');
  },
};

export const IconSizeMapsForSmall: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-on-check'));
    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('2xs');
  },
};

export const IconSizeMapsForBase: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-on-check'));

    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('2xs');
  },
};

export const IconSizeMapsForLarge: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-on-check'));
    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    const icon = host.querySelector('org-icon') as HTMLElement;

    await expect(icon.getAttribute('data-size')).toBe('xs');
  },
};

export const DescriptionIsHiddenWhenEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.querySelector('.description')).toBeNull();
  },
};

export const RendersDescriptionTextWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    const description = host.querySelector('.description') as HTMLElement;

    await expect(description).not.toBeNull();
    await expect(description.textContent?.trim()).toBe('Up to once a week.');
  },
};

export const RendersNoKnobIconsByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.querySelector('.icon-on')).toBeNull();
    await expect(host.querySelector('.icon-off')).toBeNull();
  },
};

export const RendersIconOnSlotOnlyWhenIconOnProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-on-check'));

    await expect(host.querySelector('.icon-on')).not.toBeNull();
    await expect(host.querySelector('.icon-off')).toBeNull();
  },
};

export const RendersIconOffSlotOnlyWhenIconOffProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-off-x'));

    await expect(host.querySelector('.icon-off')).not.toBeNull();
    await expect(host.querySelector('.icon-on')).toBeNull();
  },
};

export const TransformsNullIconInputsToUndefinedAndSkipsRendering: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-icon-on-null'));
    await userEvent.click(canvas.getByTestId('ctl-icon-off-null'));

    await expect(host.querySelector('.icon-on')).toBeNull();
    await expect(host.querySelector('.icon-off')).toBeNull();
  },
};

export const ProjectsLabelContentIntoLabelSpan: Story = {
  render: renderProjectionShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const labelSpan = host.querySelector('.label') as HTMLElement;

    await expect(labelSpan.textContent?.trim()).toBe('Enable notifications');
  },
};

export const ForwardsNameAndValueToNativeCheckbox: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await expect(nativeInput.name).toBe('setting');
    await expect(nativeInput.value).toBe('on');
  },
};

export const MirrorsCheckedStateToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await expect(nativeInput.checked).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-checked-on'));

    await expect(nativeInput.checked).toBe(true);
  },
};

export const MirrorsDisabledStateToNativeInput: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await expect(nativeInput.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(nativeInput.disabled).toBe(true);
  },
};

export const TogglesAndEmitsCheckedChangeOnLabelClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(label);

    await expect(host.getAttribute('data-checked')).toBe('');
    await expect(readout.textContent).toContain('checkedChangeCount=1');
    await expect(readout.textContent).toContain('lastCheckedChangeValue=true');
  },
};

export const TogglesBackToFalseOnSecondLabelClick: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(label);
    await userEvent.click(label);

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('checkedChangeCount=2');
    await expect(readout.textContent).toContain('lastCheckedChangeValue=false');
  },
};

export const DoesNotToggleOrEmitOnLabelClickWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const label = host.querySelector('label') as HTMLLabelElement;

    await userEvent.click(label);

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('checkedChangeCount=0');
  },
};

export const TogglesOnSpaceKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    label.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('lastCheckedChangeValue=true');
    });
  },
};

export const TogglesOnEnterKey: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    label.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('lastCheckedChangeValue=true');
    });
  },
};

export const IgnoresOtherKeyDowns: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    label.focus();
    await userEvent.keyboard('a');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('checkedChangeCount=0');
  },
};

export const DoesNotToggleOnSpaceOrEnterWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const label = host.querySelector('label') as HTMLLabelElement;

    label.focus();
    await userEvent.keyboard(' ');
    await userEvent.keyboard('{Enter}');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('checkedChangeCount=0');
  },
};

export const AppliesSwitchRoleToLabelElement: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(label.getAttribute('role')).toBe('switch');
  },
};

export const OmitsAriaDisabledByDefaultAndSetsItWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(label.getAttribute('aria-disabled')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(label.getAttribute('aria-disabled')).toBe('true');
  },
};

export const SetsTabIndexBasedOnDisabledState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(label.getAttribute('tabindex')).toBe('0');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(label.getAttribute('tabindex')).toBe('-1');
  },
};

export const ReflectsInitialFormControlValueAsDataChecked: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-form-set-true'));

    await expect(host.getAttribute('data-checked')).toBe('');
    await expect(nativeInput.checked).toBe(true);
  },
};

export const WritesProgrammaticFormControlValueIntoToggle: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-form-set-true'));
    await expect(host.getAttribute('data-checked')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-form-set-false'));

    await expect(host.getAttribute('data-checked')).toBeNull();
  },
};

export const CoercesNullFormControlValueToFalse: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-form-set-true'));
    await expect(host.getAttribute('data-checked')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-form-set-null'));

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(nativeInput.checked).toBe(false);
  },
};

export const UpdatesFormControlValueWhenLabelIsClicked: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(label);

    await expect(readout.textContent).toContain('value=true');
  },
};

export const MarksFormControlAsTouchedAfterClick: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    await userEvent.click(label);

    await expect(readout.textContent).toContain('touched=true');
  },
};

export const PropagatesFormControlDisableToHostAndNativeInput: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const nativeInput = host.querySelector('input[type="checkbox"]') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await expect(host.getAttribute('data-disabled')).toBe('');
    await expect(nativeInput.disabled).toBe(true);
  },
};

export const DoesNotUpdateValueWhenClickedWhileFormControlIsDisabled: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    const label = host.querySelector('label') as HTMLLabelElement;

    await userEvent.click(label);

    await expect(readout.textContent).toContain('value=false');
  },
};

export const DoesNotApplyErrorAttributesWithoutValidationMessage: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(label.getAttribute('aria-invalid')).toBeNull();
    await expect(label.getAttribute('aria-describedby')).toBeNull();
  },
};

export const AppliesErrorAttributesWhenValidationMessageIsSet: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-message-set'));

    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(host.getAttribute('data-state')).toBe('error');
    await expect(label.getAttribute('aria-invalid')).toBe('true');
    await expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
  },
};

export const ClearsErrorAttributesWhenValidationMessageIsCleared: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-message-set'));
    await expect(host.getAttribute('data-state')).toBe('error');

    await userEvent.click(canvas.getByTestId('ctl-message-clear'));

    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(label.getAttribute('aria-invalid')).toBeNull();
    await expect(label.getAttribute('aria-describedby')).toBeNull();
  },
};

export const HostAriaDisabledReflectsDisabledState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await expect(host.getAttribute('aria-disabled')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(host.getAttribute('aria-disabled')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-disabled-off'));

    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const AriaCheckedOnLabelTracksCheckedState: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');
    const label = host.querySelector('label') as HTMLLabelElement;

    await expect(label.getAttribute('aria-checked')).toBe('false');

    await userEvent.click(canvas.getByTestId('ctl-checked-on'));

    await expect(label.getAttribute('aria-checked')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-checked-off'));

    await expect(label.getAttribute('aria-checked')).toBe('false');
  },
};

export const ClearsDisabledStateWhenBothSourcesAreCleared: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('toggle');

    await userEvent.click(canvas.getByTestId('ctl-consumer-disabled-on'));
    await userEvent.click(canvas.getByTestId('ctl-form-disable'));

    await expect(host.getAttribute('data-disabled')).toBe('');

    await userEvent.click(canvas.getByTestId('ctl-consumer-disabled-off'));
    await userEvent.click(canvas.getByTestId('ctl-form-enable'));

    await expect(host.getAttribute('data-disabled')).toBeNull();
  },
};
