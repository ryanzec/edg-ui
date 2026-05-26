import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { FormField, type FormFieldLabelOrientation } from './form-field';
import { FormFields } from './form-fields';

@Component({
  selector: 'story-form-field-standalone-tests-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-field
      data-testid="form-field"
      [labelOrientation]="labelOrientation()"
      [reserveValidationSpace]="reserveValidationSpace()"
      [validationMessage]="validationMessage()"
    >
      <org-label text="Email" htmlFor="standalone-email" />
      <org-input name="standalone-email" data-testid="projected-input" />
    </org-form-field>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-label-orientation-horizontal" (click)="labelOrientation.set('horizontal')">
        label-orientation-horizontal
      </button>
      <button type="button" data-testid="ctl-label-orientation-vertical" (click)="labelOrientation.set('vertical')">
        label-orientation-vertical
      </button>
      <button type="button" data-testid="ctl-label-orientation-clear" (click)="labelOrientation.set(undefined)">
        label-orientation-clear
      </button>
      <button type="button" data-testid="ctl-reserve-on" (click)="reserveValidationSpace.set(true)">reserve-on</button>
      <button type="button" data-testid="ctl-reserve-off" (click)="reserveValidationSpace.set(false)">
        reserve-off
      </button>
      <button type="button" data-testid="ctl-message-required" (click)="validationMessage.set('field is required')">
        message-required
      </button>
      <button type="button" data-testid="ctl-message-other" (click)="validationMessage.set('must be a valid email')">
        message-other
      </button>
      <button type="button" data-testid="ctl-message-whitespace" (click)="validationMessage.set('   ')">
        message-whitespace
      </button>
      <button type="button" data-testid="ctl-message-clear" (click)="validationMessage.set(undefined)">
        message-clear
      </button>
    </div>
  `,
})
class StoryFormFieldStandaloneTestsShell {
  protected readonly labelOrientation = signal<FormFieldLabelOrientation | undefined>(undefined);
  protected readonly reserveValidationSpace = signal<boolean | undefined>(undefined);
  protected readonly validationMessage = signal<string | undefined>(undefined);
}

@Component({
  selector: 'story-form-field-with-parent-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFields, FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-fields
      data-testid="form-fields"
      [labelOrientation]="parentLabelOrientation()"
      [reserveValidationSpace]="parentReserveValidationSpace()"
      [orientation]="parentOrientation()"
    >
      <org-form-field
        data-testid="form-field"
        [labelOrientation]="childLabelOrientation()"
        [reserveValidationSpace]="childReserveValidationSpace()"
        [validationMessage]="childValidationMessage()"
      >
        <org-label text="Email" htmlFor="with-parent-email" />
        <org-input name="with-parent-email" />
      </org-form-field>
    </org-form-fields>
    <div class="flex flex-wrap gap-1">
      <button
        type="button"
        data-testid="ctl-parent-label-horizontal"
        (click)="parentLabelOrientation.set('horizontal')"
      >
        parent-label-horizontal
      </button>
      <button type="button" data-testid="ctl-parent-label-vertical" (click)="parentLabelOrientation.set('vertical')">
        parent-label-vertical
      </button>
      <button type="button" data-testid="ctl-parent-reserve-on" (click)="parentReserveValidationSpace.set(true)">
        parent-reserve-on
      </button>
      <button type="button" data-testid="ctl-parent-reserve-off" (click)="parentReserveValidationSpace.set(false)">
        parent-reserve-off
      </button>
      <button
        type="button"
        data-testid="ctl-parent-orientation-horizontal"
        (click)="parentOrientation.set('horizontal')"
      >
        parent-orientation-horizontal
      </button>
      <button type="button" data-testid="ctl-parent-orientation-vertical" (click)="parentOrientation.set('vertical')">
        parent-orientation-vertical
      </button>
      <button type="button" data-testid="ctl-child-label-horizontal" (click)="childLabelOrientation.set('horizontal')">
        child-label-horizontal
      </button>
      <button type="button" data-testid="ctl-child-label-vertical" (click)="childLabelOrientation.set('vertical')">
        child-label-vertical
      </button>
      <button type="button" data-testid="ctl-child-label-clear" (click)="childLabelOrientation.set(undefined)">
        child-label-clear
      </button>
      <button type="button" data-testid="ctl-child-reserve-on" (click)="childReserveValidationSpace.set(true)">
        child-reserve-on
      </button>
      <button type="button" data-testid="ctl-child-reserve-off" (click)="childReserveValidationSpace.set(false)">
        child-reserve-off
      </button>
      <button type="button" data-testid="ctl-child-reserve-clear" (click)="childReserveValidationSpace.set(undefined)">
        child-reserve-clear
      </button>
      <button
        type="button"
        data-testid="ctl-child-message-required"
        (click)="childValidationMessage.set('field is required')"
      >
        child-message-required
      </button>
      <button type="button" data-testid="ctl-child-message-clear" (click)="childValidationMessage.set(undefined)">
        child-message-clear
      </button>
    </div>
  `,
})
class StoryFormFieldWithParentShell {
  protected readonly parentLabelOrientation = signal<FormFieldLabelOrientation>('vertical');
  protected readonly parentReserveValidationSpace = signal<boolean>(false);
  protected readonly parentOrientation = signal<FormFieldLabelOrientation>('vertical');
  protected readonly childLabelOrientation = signal<FormFieldLabelOrientation | undefined>(undefined);
  protected readonly childReserveValidationSpace = signal<boolean | undefined>(undefined);
  protected readonly childValidationMessage = signal<string | undefined>(undefined);
}

@Component({
  selector: 'story-form-fields-multiple-children-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFields, FormField, Label, Input],
  host: { class: 'block' },
  template: `
    <org-form-fields
      data-testid="form-fields"
      [labelOrientation]="labelOrientation()"
      [reserveValidationSpace]="reserveValidationSpace()"
    >
      <org-form-field data-testid="form-field-one">
        <org-label text="First Name" htmlFor="multi-first-name" />
        <org-input name="multi-first-name" />
      </org-form-field>
      <org-form-field data-testid="form-field-two">
        <org-label text="Last Name" htmlFor="multi-last-name" />
        <org-input name="multi-last-name" />
      </org-form-field>
    </org-form-fields>
    <div class="flex flex-wrap gap-1">
      <button type="button" data-testid="ctl-label-orientation-horizontal" (click)="labelOrientation.set('horizontal')">
        label-orientation-horizontal
      </button>
      <button type="button" data-testid="ctl-reserve-on" (click)="reserveValidationSpace.set(true)">reserve-on</button>
    </div>
  `,
})
class StoryFormFieldsMultipleChildrenShell {
  protected readonly labelOrientation = signal<FormFieldLabelOrientation>('vertical');
  protected readonly reserveValidationSpace = signal<boolean>(false);
}

const meta: Meta = {
  title: 'Core/Components/Form Fields/Tests',
  parameters: {
    docs: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

const renderStandaloneShell: Story['render'] = () => ({
  template: `<story-form-field-standalone-tests-shell />`,
  moduleMetadata: { imports: [StoryFormFieldStandaloneTestsShell] },
});

const renderWithParentShell: Story['render'] = () => ({
  template: `<story-form-field-with-parent-shell />`,
  moduleMetadata: { imports: [StoryFormFieldWithParentShell] },
});

const renderMultipleChildrenShell: Story['render'] = () => ({
  template: `<story-form-fields-multiple-children-shell />`,
  moduleMetadata: { imports: [StoryFormFieldsMultipleChildrenShell] },
});

export const StandaloneFormFieldDefaultsLabelOrientationToVertical: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await expect(host.getAttribute('data-label-orientation')).toBe('vertical');
  },
};

export const FormFieldReflectsExplicitHorizontalLabelOrientation: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-label-orientation-horizontal'));

    await waitFor(() => expect(host.getAttribute('data-label-orientation')).toBe('horizontal'));
  },
};

export const FormFieldInheritsLabelOrientationFromParent: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-parent-label-horizontal'));

    await waitFor(() => expect(host.getAttribute('data-label-orientation')).toBe('horizontal'));
  },
};

export const PerFieldLabelOrientationOverridesParent: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-parent-label-horizontal'));
    await userEvent.click(canvas.getByTestId('ctl-child-label-vertical'));

    await waitFor(() => expect(host.getAttribute('data-label-orientation')).toBe('vertical'));

    await userEvent.click(canvas.getByTestId('ctl-child-label-clear'));

    await waitFor(() => expect(host.getAttribute('data-label-orientation')).toBe('horizontal'));
  },
};

export const NoValidationDivWhenNoMessageAndReserveOff: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await expect(host.querySelector('.form-field-validation')).toBeNull();
  },
};

export const ValidationDivRendersMessageText: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.textContent?.trim()).toBe('field is required');
    });
  },
};

export const ValidationDivUpdatesWhenMessageChanges: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.textContent?.trim()).toBe('field is required');
    });

    await userEvent.click(canvas.getByTestId('ctl-message-other'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.textContent?.trim()).toBe('must be a valid email');
    });
  },
};

export const WhitespaceOnlyMessageDoesNotSetHasMessage: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    // reserve must be on so the validation div is in the dom while the message is whitespace
    await userEvent.click(canvas.getByTestId('ctl-reserve-on'));
    await userEvent.click(canvas.getByTestId('ctl-message-whitespace'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation).not.toBeNull();
      expect(validation?.getAttribute('data-has-message')).toBeNull();
      expect(validation?.textContent?.trim()).toBe('');
    });
  },
};

export const ValidationDivHasAriaLivePolite: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.getAttribute('aria-live')).toBe('polite');
    });
  },
};

export const ValidationDivHasAriaAtomicTrue: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.getAttribute('aria-atomic')).toBe('true');
    });
  },
};

export const ValidationDivSetsDataHasMessageWhenMessagePresent: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.getAttribute('data-has-message')).toBe('');
    });
  },
};

export const ValidationDivOmitsDataHasMessageWhenReservedButEmpty: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-reserve-on'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation).not.toBeNull();
      expect(validation?.getAttribute('data-has-message')).toBeNull();
    });
  },
};

export const ValidationDivIdMatchesUuidPattern: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.id).toMatch(
        /^form-field-validation-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  },
};

export const ValidationDivIdRemainsStableAcrossInputChanges: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-message-required'));

    let initialId: string | null = null;

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      initialId = validation?.id ?? null;

      expect(initialId).not.toBeNull();
    });

    await userEvent.click(canvas.getByTestId('ctl-message-other'));
    await userEvent.click(canvas.getByTestId('ctl-label-orientation-horizontal'));
    await userEvent.click(canvas.getByTestId('ctl-reserve-on'));

    await waitFor(() => {
      const validation = host.querySelector('.form-field-validation') as HTMLElement | null;

      expect(validation?.id).toBe(initialId);
    });
  },
};

export const StandaloneReserveValidationSpaceRendersValidationDiv: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-reserve-on'));

    await waitFor(() => expect(host.querySelector('.form-field-validation')).not.toBeNull());
  },
};

export const FormFieldInheritsReserveValidationSpaceFromParent: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await expect(host.querySelector('.form-field-validation')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-parent-reserve-on'));

    await waitFor(() => expect(host.querySelector('.form-field-validation')).not.toBeNull());
  },
};

export const PerFieldReserveValidationSpaceFalseOverridesParentTrue: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await userEvent.click(canvas.getByTestId('ctl-parent-reserve-on'));

    await waitFor(() => expect(host.querySelector('.form-field-validation')).not.toBeNull());

    await userEvent.click(canvas.getByTestId('ctl-child-reserve-off'));

    await waitFor(() => expect(host.querySelector('.form-field-validation')).toBeNull());
  },
};

export const PerFieldReserveValidationSpaceTrueOverridesParentFalse: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');

    await expect(host.querySelector('.form-field-validation')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-child-reserve-on'));

    await waitFor(() => expect(host.querySelector('.form-field-validation')).not.toBeNull());
  },
};

export const FormFieldProjectsContentIntoFormFieldContent: Story = {
  render: renderStandaloneShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = await canvas.findByTestId('form-field');
    const content = host.querySelector('.form-field-content');

    await expect(content).not.toBeNull();
    await expect(content?.querySelector('[data-testid="projected-input"]')).not.toBeNull();
    await expect(content?.querySelector('org-label')).not.toBeNull();
  },
};

export const FormFieldsContainerDefaultsOrientationVertical: Story = {
  render: renderMultipleChildrenShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = await canvas.findByTestId('form-fields');

    await expect(container.getAttribute('data-orientation')).toBe('vertical');
  },
};

export const FormFieldsContainerReflectsOrientationHorizontal: Story = {
  render: renderWithParentShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = await canvas.findByTestId('form-fields');

    await userEvent.click(canvas.getByTestId('ctl-parent-orientation-horizontal'));

    await waitFor(() => expect(container.getAttribute('data-orientation')).toBe('horizontal'));
  },
};

export const FormFieldsProjectsMultipleChildren: Story = {
  render: renderMultipleChildrenShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const container = await canvas.findByTestId('form-fields');

    await expect(container.querySelectorAll('org-form-field').length).toBe(2);
  },
};

export const FormFieldsLabelOrientationCascadesToAllChildren: Story = {
  render: renderMultipleChildrenShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fieldOne = await canvas.findByTestId('form-field-one');
    const fieldTwo = await canvas.findByTestId('form-field-two');

    await userEvent.click(canvas.getByTestId('ctl-label-orientation-horizontal'));

    await waitFor(() => {
      expect(fieldOne.getAttribute('data-label-orientation')).toBe('horizontal');
      expect(fieldTwo.getAttribute('data-label-orientation')).toBe('horizontal');
    });
  },
};

export const FormFieldsReserveValidationSpaceCascadesToAllChildren: Story = {
  render: renderMultipleChildrenShell,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fieldOne = await canvas.findByTestId('form-field-one');
    const fieldTwo = await canvas.findByTestId('form-field-two');

    await expect(fieldOne.querySelector('.form-field-validation')).toBeNull();
    await expect(fieldTwo.querySelector('.form-field-validation')).toBeNull();

    await userEvent.click(canvas.getByTestId('ctl-reserve-on'));

    await waitFor(() => {
      expect(fieldOne.querySelector('.form-field-validation')).not.toBeNull();
      expect(fieldTwo.querySelector('.form-field-validation')).not.toBeNull();
    });
  },
};
