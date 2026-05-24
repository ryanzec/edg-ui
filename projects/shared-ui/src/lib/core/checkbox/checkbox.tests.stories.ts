import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { map } from 'rxjs';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Checkbox, type CheckboxColor, type CheckboxSize } from './checkbox';
import { CheckboxGroup, type CheckboxGroupSize } from './checkbox-group';
import { FormField } from '../form-fields/form-field';

@Component({
  selector: 'story-checkbox-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox],
  host: { class: 'block' },
  template: `
    <org-checkbox
      data-testid="checkbox"
      name="opt"
      value="opt"
      [size]="size()"
      [color]="color()"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
      [description]="description()"
      (checkedChange)="handleCheckedChange($event)"
    >
      <span data-testid="label-content">{{ labelText() }}</span>
    </org-checkbox>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-size-sm" (click)="size.set('sm')">size-sm</button>
      <button type="button" data-testid="ctl-size-lg" (click)="size.set('lg')">size-lg</button>
      <button type="button" data-testid="ctl-color-danger" (click)="color.set('danger')">color-danger</button>
      <button type="button" data-testid="ctl-checked-on" (click)="checked.set(true)">checked-on</button>
      <button type="button" data-testid="ctl-checked-off" (click)="checked.set(false)">checked-off</button>
      <button type="button" data-testid="ctl-indeterminate-on" (click)="indeterminate.set(true)">
        indeterminate-on
      </button>
      <button type="button" data-testid="ctl-indeterminate-and-checked-on" (click)="setIndeterminateAndChecked()">
        indeterminate-and-checked-on
      </button>
      <button type="button" data-testid="ctl-disabled-on" (click)="disabled.set(true)">disabled-on</button>
      <button type="button" data-testid="ctl-disabled-off" (click)="disabled.set(false)">disabled-off</button>
      <button type="button" data-testid="ctl-description-set" (click)="description.set('helpful sub-line')">
        description-set
      </button>
    </div>
  `,
})
class StoryCheckboxTestsShell {
  protected readonly size = signal<CheckboxSize>('base');
  protected readonly color = signal<CheckboxColor>('primary');
  protected readonly checked = signal<boolean>(false);
  protected readonly indeterminate = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly description = signal<string>('');
  protected readonly labelText = signal<string>('projected label');

  protected readonly changeCount = signal<number>(0);
  protected readonly lastChangeValue = signal<boolean | null>(null);

  protected readout(): string {
    return `changeCount=${this.changeCount()} lastChangeValue=${this.lastChangeValue()}`;
  }

  protected handleCheckedChange(value: boolean): void {
    this.changeCount.update((count) => count + 1);
    this.lastChangeValue.set(value);
  }

  protected setIndeterminateAndChecked(): void {
    this.indeterminate.set(true);
    this.checked.set(true);
  }
}

@Component({
  selector: 'story-checkbox-form-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, FormField, ReactiveFormsModule],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()">
      <org-checkbox data-testid="checkbox" name="opt" value="opt" [formControl]="control">label</org-checkbox>
    </org-form-field>
    <pre data-testid="readout">{{ readout() }}</pre>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-control-value-true" (click)="control.setValue(true)">
        control-value-true
      </button>
      <button type="button" data-testid="ctl-control-value-null" (click)="setControlValueNull()">
        control-value-null
      </button>
      <button type="button" data-testid="ctl-validation-set" (click)="validationMessage.set('required')">
        validation-set
      </button>
      <button type="button" data-testid="ctl-validation-clear" (click)="validationMessage.set(undefined)">
        validation-clear
      </button>
    </div>
  `,
})
class StoryCheckboxFormShell {
  protected readonly control = new FormControl<boolean>(false, { nonNullable: true });
  protected readonly validationMessage = signal<string | undefined>(undefined);

  // toSignal subscription drives readout updates under OnPush because plain control.value / control.touched are not signals
  private readonly _controlState = toSignal(
    this.control.events.pipe(map(() => ({ value: this.control.value, touched: this.control.touched }))),
    { initialValue: { value: this.control.value, touched: this.control.touched } }
  );

  protected readout(): string {
    const state = this._controlState();

    return `value=${state.value} touched=${state.touched}`;
  }

  protected setControlValueNull(): void {
    // simulate a defensive writeValue(null) scenario — control is typed as boolean but reactive forms can hand null
    this.control.setValue(null as unknown as boolean);
  }
}

@Component({
  selector: 'story-checkbox-group-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, CheckboxGroup, FormField],
  host: { class: 'block' },
  template: `
    <org-form-field [validationMessage]="validationMessage()">
      <org-checkbox-group
        data-testid="group"
        [size]="size()"
        [disabled]="disabled()"
        [legend]="legend()"
        [description]="description()"
        [required]="required()"
      >
        <org-checkbox name="a" value="a">A</org-checkbox>
        <org-checkbox name="b" value="b">B</org-checkbox>
        <org-checkbox name="c" value="c">C</org-checkbox>
      </org-checkbox-group>
    </org-form-field>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-group-size-lg" (click)="size.set('lg')">group-size-lg</button>
      <button type="button" data-testid="ctl-group-disabled-on" (click)="disabled.set(true)">group-disabled-on</button>
      <button type="button" data-testid="ctl-group-legend-set" (click)="legend.set('Notifications')">
        group-legend-set
      </button>
      <button type="button" data-testid="ctl-group-description-set" (click)="description.set('Pick the events.')">
        group-description-set
      </button>
      <button type="button" data-testid="ctl-group-required-on" (click)="required.set(true)">group-required-on</button>
      <button type="button" data-testid="ctl-group-validation-set" (click)="validationMessage.set('pick at least one')">
        group-validation-set
      </button>
    </div>
  `,
})
class StoryCheckboxGroupTestsShell {
  protected readonly size = signal<CheckboxGroupSize>('base');
  protected readonly disabled = signal<boolean>(false);
  protected readonly legend = signal<string>('');
  protected readonly description = signal<string>('');
  protected readonly required = signal<boolean>(false);
  protected readonly validationMessage = signal<string | undefined>(undefined);
}

const meta: Meta = {
  title: 'Core/Components/Checkbox/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderShell: Story['render'] = () => ({
  template: `<story-checkbox-tests-shell />`,
  moduleMetadata: { imports: [StoryCheckboxTestsShell] },
});

const renderFormShell: Story['render'] = () => ({
  template: `<story-checkbox-form-shell />`,
  moduleMetadata: { imports: [StoryCheckboxFormShell] },
});

const renderGroupShell: Story['render'] = () => ({
  template: `<story-checkbox-group-tests-shell />`,
  moduleMetadata: { imports: [StoryCheckboxGroupTestsShell] },
});

const getLabel = (host: HTMLElement): HTMLLabelElement => host.querySelector('label') as HTMLLabelElement;

export const RendersDefaultSizeAndColorHostAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(host.getAttribute('data-size')).toBe('base');
    await expect(host.getAttribute('data-color')).toBe('primary');
  },
};

export const OmitsStateHostAttributesByDefault: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(host.getAttribute('data-indeterminate')).toBeNull();
    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-disabled')).toBeNull();
  },
};

export const ReflectsSizeAndColorInputsOnHost: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-size-lg'));
    await userEvent.click(canvas.getByTestId('ctl-color-danger'));

    await waitFor(() => {
      expect(host.getAttribute('data-size')).toBe('lg');
      expect(host.getAttribute('data-color')).toBe('danger');
    });
  },
};

export const ReflectsCheckedHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-checked-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(getLabel(host).getAttribute('aria-checked')).toBe('true');
    });
  },
};

export const ReflectsIndeterminateHostAttribute: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-indeterminate-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-indeterminate')).toBe('');
      expect(getLabel(host).getAttribute('aria-checked')).toBe('mixed');
    });
  },
};

export const IndeterminateBeatsCheckedForAriaChecked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-indeterminate-and-checked-on'));

    await waitFor(() => expect(getLabel(host).getAttribute('aria-checked')).toBe('mixed'));
  },
};

export const ReflectsDisabledHostAndAriaAttributes: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => {
      expect(host.getAttribute('data-disabled')).toBe('1');
      expect(host.getAttribute('aria-disabled')).toBe('true');
    });
  },
};

export const LabelExposesCheckboxRole: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(getLabel(host).getAttribute('role')).toBe('checkbox');
  },
};

export const LabelIsKeyboardFocusableWhenEnabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(getLabel(host).getAttribute('tabindex')).toBe('0');
  },
};

export const LabelIsRemovedFromTabOrderWhenDisabled: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await waitFor(() => expect(getLabel(host).getAttribute('tabindex')).toBe('-1'));
  },
};

export const DescriptionNotRenderedWhenEmpty: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(host.querySelector('.checkbox-description')).toBeNull();
  },
};

export const DescriptionRenderedWhenProvided: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-description-set'));

    await waitFor(() => {
      const description = host.querySelector('.checkbox-description') as HTMLElement;

      expect(description.textContent?.trim()).toBe('helpful sub-line');
    });
  },
};

export const ProjectedContentRendersInsideLabel: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const projected = host.querySelector('[data-testid="label-content"]') as HTMLElement;

    await expect(projected.textContent?.trim()).toBe('projected label');
    await expect(getLabel(host).contains(projected)).toBe(true);
  },
};

export const ClickTogglesCheckedAndEmits: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getLabel(host));

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('changeCount=1');
      expect(readout.textContent).toContain('lastChangeValue=true');
    });
  },
};

export const ClickTogglesCheckedBackToUnchecked: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');
    const label = getLabel(host);

    await userEvent.click(label);
    await userEvent.click(label);

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBeNull();
      expect(readout.textContent).toContain('changeCount=2');
      expect(readout.textContent).toContain('lastChangeValue=false');
    });
  },
};

export const SpaceKeyTogglesCheckedAndEmits: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');
    const label = getLabel(host);

    label.focus();
    await userEvent.keyboard(' ');

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('lastChangeValue=true');
    });
  },
};

export const EnterKeyTogglesCheckedAndEmits: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');
    const label = getLabel(host);

    label.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(readout.textContent).toContain('lastChangeValue=true');
    });
  },
};

export const OtherKeysAreIgnored: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');
    const label = getLabel(host);

    label.focus();
    await userEvent.keyboard('a');

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('changeCount=0');
  },
};

export const ClickFromIndeterminateLandsOnCheckedAndClearsIndeterminate: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-indeterminate-on'));

    await waitFor(() => expect(host.getAttribute('data-indeterminate')).toBe(''));

    await userEvent.click(getLabel(host));

    await waitFor(() => {
      expect(host.getAttribute('data-checked')).toBe('');
      expect(host.getAttribute('data-indeterminate')).toBeNull();
      expect(readout.textContent).toContain('lastChangeValue=true');
    });
  },
};

export const DisabledBlocksClickToggleAndEmission: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    await userEvent.click(getLabel(host));

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('changeCount=0');
  },
};

export const DisabledBlocksKeyboardToggleAndEmission: Story = {
  render: renderShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(canvas.getByTestId('ctl-disabled-on'));

    const label = getLabel(host);
    label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    await expect(host.getAttribute('data-checked')).toBeNull();
    await expect(readout.textContent).toContain('changeCount=0');
  },
};

export const FormControlValueReflectsOntoHost: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await expect(host.getAttribute('data-checked')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-control-value-true'));

    await waitFor(() => expect(host.getAttribute('data-checked')).toBe(''));
  },
};

export const ClickUpdatesFormControlValue: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await userEvent.click(getLabel(host));

    await waitFor(() => expect(readout.textContent).toContain('value=true'));
  },
};

export const InteractionMarksFormControlAsTouched: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const readout = await canvas.findByTestId('readout');

    await expect(readout.textContent).toContain('touched=false');

    await userEvent.click(getLabel(host));

    await waitFor(() => expect(readout.textContent).toContain('touched=true'));
  },
};

export const WriteValueNullCoercesToUnchecked: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    // first flip to true so we can observe the coercion back to false
    await userEvent.click(canvas.getByTestId('ctl-control-value-true'));

    await waitFor(() => expect(host.getAttribute('data-checked')).toBe(''));

    await userEvent.click(canvas.getByTestId('ctl-control-value-null'));

    await waitFor(() => expect(host.getAttribute('data-checked')).toBeNull());
  },
};

export const NoValidationAttributesWhenNoMessage: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');
    const label = getLabel(host);

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(label.getAttribute('aria-invalid')).toBeNull();
    await expect(label.getAttribute('aria-describedby')).toBeNull();
  },
};

export const ValidationMessageDrivesErrorAttributes: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-validation-set'));

    await waitFor(() => {
      const label = getLabel(host);

      expect(host.getAttribute('data-state')).toBe('error');
      expect(label.getAttribute('aria-invalid')).toBe('true');
      expect(label.getAttribute('aria-describedby')).toMatch(/^form-field-validation-/);
    });
  },
};

export const ClearingValidationMessageResetsErrorAttributes: Story = {
  render: renderFormShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('checkbox');

    await userEvent.click(canvas.getByTestId('ctl-validation-set'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));

    await userEvent.click(canvas.getByTestId('ctl-validation-clear'));

    await waitFor(() => {
      const label = getLabel(host);

      expect(host.getAttribute('data-state')).toBeNull();
      expect(label.getAttribute('aria-invalid')).toBeNull();
      expect(label.getAttribute('aria-describedby')).toBeNull();
    });
  },
};

export const GroupAppliesDefaultSizeOnHost: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await expect(host.getAttribute('data-size')).toBe('base');
  },
};

export const GroupOmitsStateDisabledAndLabelledByByDefault: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await expect(host.getAttribute('data-state')).toBeNull();
    await expect(host.getAttribute('data-disabled')).toBeNull();
    await expect(host.getAttribute('aria-labelledby')).toBeNull();
  },
};

export const GroupDoesNotRenderHeaderWhenNoLegendOrDescription: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await expect(host.querySelector('.header')).toBeNull();
  },
};

export const GroupReflectsSizeInputOnHost: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-size-lg'));

    await waitFor(() => expect(host.getAttribute('data-size')).toBe('lg'));
  },
};

export const GroupReflectsDisabledOnHost: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-disabled-on'));

    await waitFor(() => expect(host.getAttribute('data-disabled')).toBe('1'));
  },
};

export const GroupLegendLinksAriaLabelledBy: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-legend-set'));

    await waitFor(() => {
      const legend = host.querySelector('.legend') as HTMLElement;

      expect(legend.textContent?.trim()).toBe('Notifications');
      expect(legend.id).toMatch(/^checkbox-group-legend-/);
      expect(host.getAttribute('aria-labelledby')).toBe(legend.id);
    });
  },
};

export const GroupRequiredAddsDataRequiredOnLegend: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-legend-set'));
    await userEvent.click(canvas.getByTestId('ctl-group-required-on'));

    await waitFor(() => {
      const legend = host.querySelector('.legend') as HTMLElement;

      expect(legend.getAttribute('data-required')).toBe('1');
    });
  },
};

export const GroupRendersDescriptionWhenProvided: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-description-set'));

    await waitFor(() => {
      const description = host.querySelector('.description') as HTMLElement;

      expect(description.textContent?.trim()).toBe('Pick the events.');
    });
  },
};

export const GroupRendersProjectedChildren: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');
    const options = host.querySelector('.options') as HTMLElement;

    await expect(options.querySelectorAll('org-checkbox').length).toBe(3);
  },
};

export const GroupHasNoDataStateWithoutValidationMessage: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await expect(host.getAttribute('data-state')).toBeNull();
  },
};

export const GroupAppliesErrorStateFromFormFieldValidationMessage: Story = {
  render: renderGroupShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('group');

    await userEvent.click(canvas.getByTestId('ctl-group-validation-set'));

    await waitFor(() => expect(host.getAttribute('data-state')).toBe('error'));
  },
};
