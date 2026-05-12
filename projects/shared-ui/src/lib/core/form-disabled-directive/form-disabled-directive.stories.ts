import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormDisabledDirective } from './form-disabled-directive';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';

@Component({
  selector: 'story-form-disabled-default-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormDisabledDirective,
    Input,
    Button,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
  ],
  template: `
    <org-storybook-example-container
      title="Form Disabled Directive"
      currentState="Toggle the button to drive the reactive form control's disabled state from the template"
    >
      <org-storybook-example-container-section label="Reactive Form">
        <form [formGroup]="form" class="flex flex-col gap-2">
          <org-input name="first-name" formControlName="firstName" [orgFormDisabled]="isDisabled()" />
        </form>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Control State">
        <div class="flex flex-col gap-1">
          <div><strong>Disabled Input Value:</strong> {{ isDisabled() }}</div>
          <div><strong>FormControl.disabled:</strong> {{ form.controls.firstName.disabled }}</div>
          <div><strong>FormControl.value:</strong> {{ form.controls.firstName.value || 'empty' }}</div>
        </div>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Controls">
        <org-button
          buttonVariant="outline"
          [label]="(isDisabled() ? 'Enable' : 'Disable') + ' Field'"
          (clicked)="toggleDisabled()"
        />
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class FormDisabledDefaultDemo {
  public readonly form = new FormGroup({
    firstName: new FormControl<string>('Ada Lovelace'),
  });

  public readonly isDisabled = signal<boolean>(false);

  public toggleDisabled(): void {
    this.isDisabled.update((current) => !current);
  }
}

@Component({
  selector: 'story-form-disabled-initial-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormDisabledDirective,
    Input,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
  ],
  template: `
    <org-storybook-example-container
      title="Initial Disabled State"
      currentState="The directive applies the disabled state on mount"
    >
      <org-storybook-example-container-section label="Reactive Form">
        <form [formGroup]="form" class="flex flex-col gap-2">
          <org-input name="email" formControlName="email" [orgFormDisabled]="true" />
        </form>
      </org-storybook-example-container-section>

      <org-storybook-example-container-section label="Control State">
        <div class="flex flex-col gap-1">
          <div><strong>FormControl.disabled:</strong> {{ form.controls.email.disabled }}</div>
        </div>
      </org-storybook-example-container-section>
    </org-storybook-example-container>
  `,
})
class FormDisabledInitialDemo {
  public readonly form = new FormGroup({
    email: new FormControl<string>('ada@example.com'),
  });
}

const meta: Meta<FormDisabledDirective> = {
  title: 'Core/Directives/FormDisabled',
  component: FormDisabledDirective,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Form Disabled Directive

  A directive that drives the disabled state of a reactive form control from the template. Reactive forms treat the \`FormControl\` as the source of truth for disabled state and Angular warns when \`[disabled]\` is bound alongside a form-bound control. This directive resolves that conflict by calling \`disable()\` / \`enable()\` on the underlying control whenever its boolean input changes, while also exposing \`aria-disabled\` on the host for styling and accessibility hooks.

  ### Requirements
  - **MUST** be used on an element that has an \`NgControl\` (i.e. \`formControl\`, \`formControlName\`, or \`ngModel\`).

  ### Usage Examples
  \`\`\`html
  <!-- Reactive form, toggled via a signal -->
  <form [formGroup]="form">
    <org-input name="first-name" formControlName="firstName" [orgFormDisabled]="isDisabled()" />
  </form>

  <!-- Initial disabled state -->
  <org-input name="email" formControlName="email" [orgFormDisabled]="true" />
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FormDisabledDirective>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates driving the disabled state of a reactive form control from the template. Click the button to toggle the field between enabled and disabled.',
      },
    },
  },
  render: () => ({
    template: `<story-form-disabled-default-demo />`,
    moduleMetadata: {
      imports: [FormDisabledDefaultDemo],
    },
  }),
};

export const InitialDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates applying the disabled state at mount time by passing a static `true` value.',
      },
    },
  },
  render: () => ({
    template: `<story-form-disabled-initial-demo />`,
    moduleMetadata: {
      imports: [FormDisabledInitialDemo],
    },
  }),
};
