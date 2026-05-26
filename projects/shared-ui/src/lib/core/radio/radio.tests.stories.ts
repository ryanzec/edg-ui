import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from 'storybook/test';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Radio, type RadioColor, type RadioSize } from './radio';
import { RadioGroup, type RadioGroupSize } from './radio-group';

@Component({
  selector: 'story-radio-standalone-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-base" (click)="size.set('base')">size-base</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-color-primary" (click)="color.set('primary')">color-primary</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-description-set" (click)="description.set('A helpful description')">
        description-set
      </button>
      <button type="button" data-testid="ctl-description-clear" (click)="description.set('')">description-clear</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-name-other" (click)="name.set('other')">name-other</button>
    </div>
  `,
})
class StoryRadioStandaloneShell {
  protected readonly name = signal<string>('plan');
  protected readonly value = signal<string>('pro');
  protected readonly size = signal<RadioSize>('base');
  protected readonly color = signal<RadioColor>('primary');
  protected readonly description = signal<string>('');
  protected readonly disabled = signal<boolean>(false);
  protected readonly label = signal<string>('Pro plan');

  protected readonly selectionRequestedCount = signal<number>(0);

  protected readout(): string {
    return `selectionRequestedCount=${this.selectionRequestedCount()}`;
  }

  protected handleSelectionRequested(): void {
    this.selectionRequestedCount.update((value) => value + 1);
  }
}

@Component({
  selector: 'story-radio-group-shell',
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
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-value-free" (click)="value.set('free')">value-free</button>
      <button type="button" data-testid="ctl-value-pro" (click)="value.set('pro')">value-pro</button>
      <button type="button" data-testid="ctl-value-team" (click)="value.set('team')">value-team</button>
      <button type="button" data-testid="ctl-value-clear" (click)="value.set('')">value-clear</button>
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-legend-set" (click)="legend.set('Plan')">legend-set</button>
      <button type="button" data-testid="ctl-description-set" (click)="description.set('Pick one')">
        description-set
      </button>
      <button type="button" data-testid="ctl-required-on" (click)="required.set(true)">required-on</button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
    </div>
  `,
})
class StoryRadioGroupShell {
  protected readonly name = signal<string>('plan');
  protected readonly value = signal<string>('');
  protected readonly size = signal<RadioGroupSize>('base');
  protected readonly legend = signal<string>('');
  protected readonly description = signal<string>('');
  protected readonly required = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);

  protected readonly valueChangeCount = signal<number>(0);
  protected readonly lastValueChange = signal<string>('');

  protected readout(): string {
    return `valueChangeCount=${this.valueChangeCount()} lastValueChange=${this.lastValueChange()}`;
  }

  protected handleValueChange(value: string): void {
    this.valueChangeCount.update((count) => count + 1);
    this.lastValueChange.set(value);
    this.value.set(value);
  }
}

@Component({
  selector: 'story-radio-form-shell',
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
class StoryRadioFormShell {
  protected readonly form = new FormGroup({
    plan: new FormControl<string>('pro', { nonNullable: true }),
  });

  protected readout(): string {
    return `value=${this.form.controls.plan.value}`;
  }
}

@Component({
  selector: 'story-radio-form-field-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Radio, FormField, FormFields],
  host: { class: 'block' },
  template: `
    <org-form-fields>
      <org-form-field [validationMessage]="validationMessage()">
        <org-radio data-testid="radio" name="plan" value="pro">Pro plan</org-radio>
      </org-form-field>
    </org-form-fields>
    <button type="button" data-testid="ctl-error-on" (click)="validationMessage.set('Required')">error-on</button>
    <button type="button" data-testid="ctl-error-off" (click)="validationMessage.set(null)">error-off</button>
  `,
})
class StoryRadioFormFieldShell {
  protected readonly validationMessage = signal<string | null>(null);
}

@Component({
  selector: 'story-radio-form-field-group-shell',
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
    <button type="button" data-testid="ctl-error-on" (click)="validationMessage.set('Required')">error-on</button>
    <button type="button" data-testid="ctl-error-off" (click)="validationMessage.set(null)">error-off</button>
  `,
})
class StoryRadioFormFieldGroupShell {
  protected readonly validationMessage = signal<string | null>(null);
}

const meta: Meta = {
  title: 'Core/Components/Radio/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderStandaloneShell: Story['render'] = () => ({
  template: `<story-radio-standalone-shell />`,
  moduleMetadata: { imports: [StoryRadioStandaloneShell] },
});

const renderGroupShell: Story['render'] = () => ({
  template: `<story-radio-group-shell />`,
  moduleMetadata: { imports: [StoryRadioGroupShell] },
});

const renderFormShell: Story['render'] = () => ({
  template: `<story-radio-form-shell />`,
  moduleMetadata: { imports: [StoryRadioFormShell] },
});

const renderFormFieldShell: Story['render'] = () => ({
  template: `<story-radio-form-field-shell />`,
  moduleMetadata: { imports: [StoryRadioFormFieldShell] },
});

const renderFormFieldGroupShell: Story['render'] = () => ({
  template: `<story-radio-form-field-group-shell />`,
  moduleMetadata: { imports: [StoryRadioFormFieldGroupShell] },
});

export const RendersDefaultHostAttributes: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-color')).toBe('primary');
    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('data-state')).toBeNull();
  },
};

export const ReflectsSizeOnHost: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));
    await expect(host.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await expect(host.getAttribute('data-size')).toBe('lg');

    await userEvent.click(canvas.getByTestId('ctl-size-base'));
    await expect(host.getAttribute('data-size')).toBe('base');
  },
};

export const ReflectsColorOnHost: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await userEvent.click(canvas.getByTestId('ctl-color-danger'));
    await expect(host.getAttribute('data-color')).toBe('danger');

    await userEvent.click(canvas.getByTestId('ctl-color-primary'));
    await expect(host.getAttribute('data-color')).toBe('primary');
  },
};

export const RendersProjectedLabelContent: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const labelText = host.querySelector('.label-text');

    await expect(labelText?.textContent?.trim()).toBe('Pro plan');
  },
};

export const RendersDescriptionWhenProvided: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await expect(host.querySelector('.description')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    const description = host.querySelector('.description');

    await expect(description).not.toBeNull();
    await expect(description?.textContent?.trim()).toBe('A helpful description');
  },
};

export const OmitsDescriptionWhenEmpty: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await userEvent.click(canvas.getByTestId('ctl-description-set'));
    await expect(host.querySelector('.description')).not.toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-description-clear'));
    await expect(host.querySelector('.description')).toBeNull();
  },
};

export const ForwardsValueToNativeInput: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(input.value).toBe('pro');
  },
};

export const UsesLocalNameWhenStandalone: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(input.name).toBe('plan');

    await userEvent.click(canvas.getByTestId('ctl-name-other'));

    await expect(input.name).toBe('other');
  },
};

export const StandaloneClickSelectsAndEmits: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const label = host.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('selectionRequestedCount=0');

    await userEvent.click(label);

    await expect(host.getAttribute('data-checked')).toBe('');
    await expect(readout.textContent).toContain('selectionRequestedCount=1');
  },
};

export const DisabledHostAttributeReflectsDisabled: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');

    await expect(host.getAttribute('data-disabled')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(host.getAttribute('data-disabled')).toBe('1');
  },
};

export const DisabledForwardsToNativeInput: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const input = host.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(input.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(input.disabled).toBe(true);
  },
};

export const DisabledRadioDoesNotSelectOnClick: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const host = await canvas.findByTestId('radio');
    const input = host.querySelector('input[type="radio"]') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    input.click();

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('selectionRequestedCount=0');
  },
};

export const TextSizeMapsForSmall: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('ctl-size-sm'));

    const host = await canvas.findByTestId('radio');
    const labelText = host.querySelector('.label-text') as HTMLElement;

    await expect(labelText.getAttribute('data-text-size')).toBe('sm');
  },
};

export const TextSizeMapsForBase: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('radio');
    const labelText = host.querySelector('.label-text') as HTMLElement;

    await expect(labelText.getAttribute('data-text-size')).toBe('base');
  },
};

export const TextSizeMapsForLarge: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('ctl-size-lg'));

    const host = await canvas.findByTestId('radio');
    const labelText = host.querySelector('.label-text') as HTMLElement;

    await expect(labelText.getAttribute('data-text-size')).toBe('xl');
  },
};

export const GroupHasRadiogroupRoleAndDefaultSize: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await expect(group.getAttribute('role')).toBe('radiogroup');
    await expect(group.getAttribute('data-size')).toBe('base');
    await expect(group.getAttribute('aria-disabled')).toBeNull();
    await expect(group.getAttribute('data-state')).toBeNull();
  },
};

export const GroupReflectsSizeOnHost: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-size-sm'));
    await expect(group.getAttribute('data-size')).toBe('sm');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await expect(group.getAttribute('data-size')).toBe('lg');
  },
};

export const GroupNameAppliesToChildNativeInputs: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const free = await canvas.findByTestId('radio-free');
    const pro = await canvas.findByTestId('radio-pro');
    const team = await canvas.findByTestId('radio-team');

    const freeInput = free.querySelector('input[type="radio"]') as HTMLInputElement;
    const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;
    const teamInput = team.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(freeInput.name).toBe('plan');
    await expect(proInput.name).toBe('plan');
    await expect(teamInput.name).toBe('plan');
  },
};

export const GroupValueSelectsMatchingChild: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const free = await canvas.findByTestId('radio-free');
    const pro = await canvas.findByTestId('radio-pro');
    const team = await canvas.findByTestId('radio-team');

    await userEvent.click(canvas.getByTestId('ctl-value-pro'));

    await expect(free.getAttribute('data-checked')).toBeNull();
    await expect(pro.getAttribute('data-checked')).toBe('');
    await expect(team.getAttribute('data-checked')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-value-team'));

    await expect(free.getAttribute('data-checked')).toBeNull();
    await expect(pro.getAttribute('data-checked')).toBeNull();
    await expect(team.getAttribute('data-checked')).toBe('');
  },
};

export const GroupClickingChildUpdatesValueAndEmits: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pro = await canvas.findByTestId('radio-pro');
    const proLabel = pro.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('valueChangeCount=0');

    await userEvent.click(proLabel);

    await expect(pro.getAttribute('data-checked')).toBe('');
    await expect(readout.textContent).toContain('valueChangeCount=1');
    await expect(readout.textContent).toContain('lastValueChange=pro');
  },
};

export const GroupLegendWiresAriaLabelledby: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await expect(group.getAttribute('aria-labelledby')).toBeNull();
    await expect(group.querySelector('.legend')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-legend-set'));

    const legendElement = group.querySelector('.legend') as HTMLElement;

    await expect(legendElement).not.toBeNull();
    await expect(legendElement.textContent?.trim()).toBe('Plan');
    await expect(group.getAttribute('aria-labelledby')).toBe(legendElement.id);
  },
};

export const GroupRendersDescription: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await expect(group.querySelector('.description')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    const description = group.querySelector('.description');

    await expect(description).not.toBeNull();
    await expect(description?.textContent?.trim()).toBe('Pick one');
  },
};

export const GroupRequiredMarksLegend: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-legend-set'));
    await expect(group.querySelector('.legend')?.getAttribute('data-required')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-required-on'));

    await expect(group.querySelector('.legend')?.getAttribute('data-required')).toBe('1');
  },
};

export const GroupDisabledCascadesToChildren: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');
    const pro = await canvas.findByTestId('radio-pro');
    const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(proInput.disabled).toBe(false);

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await expect(group.getAttribute('aria-disabled')).toBe('true');
    await expect(pro.getAttribute('data-disabled')).toBe('1');
    await expect(proInput.disabled).toBe(true);
  },
};

export const GroupDisabledIgnoresChildClicks: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const pro = await canvas.findByTestId('radio-pro');
    const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;
    const readout = await canvas.findByTestId('readout');

    proInput.click();

    await expect(pro.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('valueChangeCount=0');
  },
};

export const ReactiveFormWritesInitialValue: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const free = await canvas.findByTestId('radio-free');
    const pro = await canvas.findByTestId('radio-pro');
    const team = await canvas.findByTestId('radio-team');

    await expect(free.getAttribute('data-checked')).toBeNull();
    await expect(pro.getAttribute('data-checked')).toBe('');
    await expect(team.getAttribute('data-checked')).toBeNull();
  },
};

export const ReactiveFormUpdatesOnChildClick: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const team = await canvas.findByTestId('radio-team');
    const teamLabel = team.querySelector('label') as HTMLLabelElement;
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('value=pro');

    await userEvent.click(teamLabel);

    await expect(team.getAttribute('data-checked')).toBe('');
    await expect(readout.textContent).toContain('value=team');
  },
};

export const StandaloneRadioInFormFieldCascadesError: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = await canvas.findByTestId('radio');
    const input = radio.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(radio.getAttribute('data-state')).toBeNull();
    await expect(input.getAttribute('aria-invalid')).toBeNull();
    await expect(input.getAttribute('aria-describedby')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-error-on'));

    await expect(radio.getAttribute('data-state')).toBe('error');
    await expect(input.getAttribute('aria-invalid')).toBe('true');
    await expect(input.getAttribute('aria-describedby')).not.toBeNull();
    await expect(input.getAttribute('aria-describedby')).toContain('form-field-validation-');
  },
};

export const StandaloneRadioInFormFieldClearsErrorWhenRemoved: Story = {
  render: renderFormFieldShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = await canvas.findByTestId('radio');
    const input = radio.querySelector('input[type="radio"]') as HTMLInputElement;

    await userEvent.click(canvas.getByTestId('ctl-error-on'));
    await expect(input.getAttribute('aria-invalid')).toBe('true');

    await userEvent.click(canvas.getByTestId('ctl-error-off'));

    await expect(radio.getAttribute('data-state')).toBeNull();
    await expect(input.getAttribute('aria-invalid')).toBeNull();
    await expect(input.getAttribute('aria-describedby')).toBeNull();
  },
};

export const GroupInFormFieldCascadesErrorToChildren: Story = {
  render: renderFormFieldGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = await canvas.findByTestId('group');
    const free = await canvas.findByTestId('radio-free');
    const freeInput = free.querySelector('input[type="radio"]') as HTMLInputElement;
    const pro = await canvas.findByTestId('radio-pro');
    const proInput = pro.querySelector('input[type="radio"]') as HTMLInputElement;

    await expect(group.getAttribute('data-state')).toBeNull();
    await expect(freeInput.getAttribute('aria-invalid')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-error-on'));

    await expect(group.getAttribute('data-state')).toBe('error');
    await expect(freeInput.getAttribute('aria-invalid')).toBe('true');
    await expect(proInput.getAttribute('aria-invalid')).toBe('true');
    await expect(freeInput.getAttribute('aria-describedby')).toContain('form-field-validation-');
    await expect(proInput.getAttribute('aria-describedby')).toContain('form-field-validation-');
  },
};
