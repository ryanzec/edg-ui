import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, afterNextRender } from '@angular/core';
import { FormControl, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { StorybookExampleContainer } from '../../private/storybook-example-container/storybook-example-container';
import { StorybookExampleContainerSection } from '../../private/storybook-example-container-section/storybook-example-container-section';
import { Input } from '../../core/input/input';
import { Textarea } from '../../core/textarea/textarea';
import { Checkbox } from '../../core/checkbox/checkbox';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Radio } from '../../core/radio/radio';
import { RadioGroup } from '../../core/radio/radio-group';
import { Combobox } from '../../core/combobox/combobox';
import { type ComboboxOptionInput } from '../../core/combobox-store/combobox-store';
import { DatePickerInput } from '../../core/date-picker-input/date-picker-input';
import { Button } from '../../core/button/button';
import { ButtonIcon } from '../../core/button/button-icon';
import { Label } from '../../core/label/label';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { validationUtils } from '../../utils/validation';

const categoryOptions: ComboboxOptionInput[] = [
  { label: 'Technology', value: 'technology' },
  { label: 'Science', value: 'science' },
  { label: 'Art', value: 'art' },
  { label: 'Music', value: 'music' },
  { label: 'Sports', value: 'sports' },
  { label: 'Business', value: 'business' },
  { label: 'Education', value: 'education' },
  { label: 'Health', value: 'health' },
  { label: 'Travel', value: 'travel' },
  { label: 'Food', value: 'food' },
];

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.array(z.union([z.string(), z.number()])).min(1, 'Category is required'),
  isActive: z.boolean().refine((val) => val === true, 'Must be active'),
  isEnabled: z.boolean().refine((val) => val === true, 'Must be enabled'),
  priority: z.string().min(1, 'Priority is required'),
  dateRange: z.object({
    startDate: z.custom<DateTime>((val) => val instanceof DateTime, 'Start date is required'),
    endDate: z.custom<DateTime>((val) => val instanceof DateTime, 'End date is required'),
  }),
});

const tagSchema = z.string().min(1, 'Tag is required');

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.array(z.union([z.string(), z.number()])).min(1, 'Category is required'),
  isActive: z.boolean().refine((val) => val === true, 'Must be active'),
  isEnabled: z.boolean().refine((val) => val === true, 'Must be enabled'),
  priority: z.string().min(1, 'Priority is required'),
  date: z.custom<DateTime>((val) => val instanceof DateTime, 'Date is required'),
});

@Component({
  selector: 'story-nested-object-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Combobox,
    DatePickerInput,
    Button,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Nested Object Form"
      currentState="Form with nested object structure using reactive forms"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div formGroupName="profile" class="rounded-base border border-neutral p-3">
            <div class="text-sm font-semibold mb-1">Profile</div>

            <org-form-fields>
              <org-form-field [validationMessage]="getFieldError('profile.name')">
                <org-label htmlFor="nested-profile-name" class="text-sm font-medium" text="Name" [isRequired]="true" />
                <org-input formControlName="name" name="nested-profile-name" placeholder="Enter name" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.description')">
                <org-label
                  htmlFor="nested-profile-description"
                  class="text-sm font-medium"
                  text="Description"
                  [isRequired]="true"
                />
                <org-textarea
                  formControlName="description"
                  name="nested-profile-description"
                  placeholder="Enter description"
                  [rows]="3"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.category')">
                <org-label
                  htmlFor="nested-profile-category"
                  class="text-sm font-medium"
                  text="Category"
                  [isRequired]="true"
                />
                <org-combobox
                  formControlName="category"
                  name="nested-profile-category"
                  [options]="categoryOptions"
                  [isMultiSelect]="true"
                  placeholder="Select categories..."
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.isActive')">
                <org-checkbox formControlName="isActive" name="nested-profile-isActive" value="active">
                  Is Active *
                </org-checkbox>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.isEnabled')">
                <org-checkbox-toggle
                  formControlName="isEnabled"
                  name="nested-profile-isEnabled"
                  value="enabled"
                  onIcon="circle-check-big"
                  offIcon="circle-x"
                  onText="Enabled"
                  offText="Disabled"
                >
                  Is Enabled *
                </org-checkbox-toggle>
              </org-form-field>
              <org-form-field [validationMessage]="getFieldError('profile.priority')">
                <org-label
                  htmlFor="nested-profile-priority"
                  class="text-sm font-medium"
                  text="Priority"
                  [isRequired]="true"
                />
                <org-radio-group formControlName="priority" name="nested-profile-priority">
                  <org-radio value="low">Low</org-radio>
                  <org-radio value="medium">Medium</org-radio>
                  <org-radio value="high">High</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.dateRange')">
                <org-label
                  htmlFor="nested-profile-dateRange"
                  class="text-sm font-medium"
                  text="Date Range"
                  [isRequired]="true"
                />
                <org-date-picker-input
                  formControlName="dateRange"
                  name="nested-profile-dateRange"
                  [allowRangeSelection]="true"
                  placeholder="Select date range..."
                />
              </org-form-field>
            </org-form-fields>
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words">
            <div>name: "{{ formValues().profile.name }}"</div>
            <div>description: "{{ formValues().profile.description }}"</div>
            <div>category: {{ formValues().profile.category.length }} selected</div>
            <div>isActive: {{ formValues().profile.isActive }}</div>
            <div>isEnabled: {{ formValues().profile.isEnabled }}</div>
            <div>priority: "{{ formValues().profile.priority }}"</div>
            <div>dateRange: {{ formatDateRange(formValues().profile.dateRange) }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Nested FormGroup</strong>: Profile object contains all form fields in a nested structure</li>
        <li><strong>formGroupName</strong>: Used to bind to nested form group</li>
        <li><strong>Validation</strong>: Zod schema validates all fields with required checks</li>
        <li><strong>Form State</strong>: Tracks valid, dirty, touched, and pristine states</li>
        <li>
          <strong>All Input Types</strong>: Text, textarea, combobox, checkbox, checkbox toggle, radio, and date range
        </li>
      </ul>
    </org-storybook-example-container>
  `,
})
class NestedObjectDemoComponent {
  public readonly categoryOptions = categoryOptions;

  public readonly form = new FormGroup({
    profile: new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.priority)],
      }),
      dateRange: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(profileSchema.shape.dateRange)],
        }
      ),
    }),
  });

  public readonly formValues = signal(this.form.getRawValue());

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getFieldError(path: string): string | null {
    const pathParts = path.split('.');
    const control = this.form.get(pathParts) as any;

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, this.getFieldLabel(path));
  }

  protected getFieldLabel(path: string): string {
    const labels: Record<string, string> = {
      'profile.name': 'Name',
      'profile.description': 'Description',
      'profile.category': 'Category',
      'profile.isActive': 'Is Active',
      'profile.isEnabled': 'Is Enabled',
      'profile.priority': 'Priority',
      'profile.dateRange': 'Date Range',
    };

    return labels[path] || path;
  }

  protected formatDateRange(dateRange: { startDate: DateTime | null; endDate: DateTime | null }): string {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'Not selected';
    }

    const start = dateRange.startDate?.toISO() || 'N/A';
    const end = dateRange.endDate?.toISO() || 'N/A';

    return `${start} - ${end}`;
  }
}

@Component({
  selector: 'story-nested-object-with-defaults-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Combobox,
    DatePickerInput,
    Button,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Nested Object Form (With Defaults)"
      currentState="Form with nested object structure and default values"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div formGroupName="profile" class="rounded-base border border-neutral p-3">
            <div class="text-sm font-semibold mb-1">Profile</div>

            <org-form-fields>
              <org-form-field [validationMessage]="getFieldError('profile.name')">
                <org-label
                  htmlFor="nested-defaults-profile-name"
                  class="text-sm font-medium"
                  text="Name"
                  [isRequired]="true"
                />
                <org-input formControlName="name" name="nested-defaults-profile-name" placeholder="Enter name" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.description')">
                <org-label
                  htmlFor="nested-defaults-profile-description"
                  class="text-sm font-medium"
                  text="Description"
                  [isRequired]="true"
                />
                <org-textarea
                  formControlName="description"
                  name="nested-defaults-profile-description"
                  placeholder="Enter description"
                  [rows]="3"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.category')">
                <org-label
                  htmlFor="nested-defaults-profile-category"
                  class="text-sm font-medium"
                  text="Category"
                  [isRequired]="true"
                />
                <org-combobox
                  formControlName="category"
                  name="nested-defaults-profile-category"
                  [options]="categoryOptions"
                  [isMultiSelect]="true"
                  placeholder="Select categories..."
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.isActive')">
                <org-checkbox formControlName="isActive" name="nested-defaults-profile-isActive" value="active">
                  Is Active *
                </org-checkbox>
              </org-form-field>
              <org-form-field [validationMessage]="getFieldError('profile.isEnabled')">
                <org-checkbox-toggle
                  formControlName="isEnabled"
                  name="nested-defaults-profile-isEnabled"
                  value="enabled"
                  onIcon="circle-check-big"
                  offIcon="circle-x"
                  onText="Enabled"
                  offText="Disabled"
                >
                  Is Enabled *
                </org-checkbox-toggle>
              </org-form-field>
              <org-form-field [validationMessage]="getFieldError('profile.priority')">
                <org-label
                  htmlFor="nested-defaults-profile-priority"
                  class="text-sm font-medium"
                  text="Priority"
                  [isRequired]="true"
                />
                <org-radio-group formControlName="priority" name="nested-defaults-profile-priority">
                  <org-radio value="low">Low</org-radio>
                  <org-radio value="medium">Medium</org-radio>
                  <org-radio value="high">High</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('profile.dateRange')">
                <org-label
                  htmlFor="nested-defaults-profile-dateRange"
                  class="text-sm font-medium"
                  text="Date Range"
                  [isRequired]="true"
                />
                <org-date-picker-input
                  formControlName="dateRange"
                  name="nested-defaults-profile-dateRange"
                  [allowRangeSelection]="true"
                  placeholder="Select date range..."
                />
              </org-form-field>
            </org-form-fields>
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words">
            <div>name: "{{ formValues().profile.name }}"</div>
            <div>description: "{{ formValues().profile.description }}"</div>
            <div>category: {{ formValues().profile.category.length }} selected</div>
            <div>isActive: {{ formValues().profile.isActive }}</div>
            <div>isEnabled: {{ formValues().profile.isEnabled }}</div>
            <div>priority: "{{ formValues().profile.priority }}"</div>
            <div>dateRange: {{ formatDateRange(formValues().profile.dateRange) }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Default Values</strong>: Form is pre-populated with valid default data</li>
        <li><strong>Nested FormGroup</strong>: Profile object contains all form fields in a nested structure</li>
        <li><strong>Validation</strong>: All fields are already valid on load</li>
        <li><strong>Form State</strong>: Initially pristine until user makes changes</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class NestedObjectWithDefaultsDemoComponent {
  public readonly categoryOptions = categoryOptions;

  public readonly form = new FormGroup({
    profile: new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(profileSchema.shape.priority)],
      }),
      dateRange: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(profileSchema.shape.dateRange)],
        }
      ),
    }),
  });

  public readonly formValues = signal(this.form.getRawValue());

  constructor() {
    afterNextRender(() => {
      this.form.patchValue({
        profile: {
          name: 'John Doe',
          description: 'Software engineer with 5 years of experience in web development',
          category: ['technology', 'education'],
          isActive: true,
          isEnabled: true,
          priority: 'high',
          dateRange: {
            startDate: DateTime.now().startOf('day'),
            endDate: DateTime.now().plus({ days: 7 }).endOf('day'),
          },
        },
      });
    });

    this.formValues.set(this.form.getRawValue());

    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getFieldError(path: string): string | null {
    const pathParts = path.split('.');
    const control = this.form.get(pathParts) as any;

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, this.getFieldLabel(path));
  }

  protected getFieldLabel(path: string): string {
    const labels: Record<string, string> = {
      'profile.name': 'Name',
      'profile.description': 'Description',
      'profile.category': 'Category',
      'profile.isActive': 'Is Active',
      'profile.isEnabled': 'Is Enabled',
      'profile.priority': 'Priority',
      'profile.dateRange': 'Date Range',
    };

    return labels[path] || path;
  }

  protected formatDateRange(dateRange: { startDate: DateTime | null; endDate: DateTime | null }): string {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'Not selected';
    }

    const start = dateRange.startDate?.toISO() || 'N/A';
    const end = dateRange.endDate?.toISO() || 'N/A';

    return `${start} - ${end}`;
  }
}

@Component({
  selector: 'story-array-of-text-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Button,
    ButtonIcon,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Array of Text Inputs"
      currentState="Form with FormArray containing text inputs"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div class="flex items-center justify-between mb-1">
            <div class="text-sm font-semibold">Tags</div>
            <org-button type="button" color="primary" size="sm" (clicked)="addTag()">Add Tag</org-button>
          </div>

          <div formArrayName="tags" class="flex flex-col gap-2">
            @for (tag of tags.controls; track $index) {
              <div class="flex items-start gap-2">
                <org-form-field class="flex-1" [validationMessage]="getTagError($index)">
                  <org-input
                    [formControlName]="$index"
                    [name]="'tag-' + $index"
                    [placeholder]="'Tag ' + ($index + 1)"
                  />
                </org-form-field>
                <org-button
                  type="button"
                  color="danger"
                  variant="ghost"
                  size="sm"
                  [iconOnly]="true"
                  ariaLabel="Remove tag"
                  (clicked)="removeTag($index)"
                >
                  <org-button-icon name="trash" />
                </org-button>
              </div>
            }

            @if (tags.controls.length === 0) {
              <div class="text-sm text-neutral py-2">No tags added yet. Click "Add Tag" to start.</div>
            }
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words">
            <div>tags ({{ formValues().tags.length }}): {{ formatTags() }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>FormArray</strong>: Dynamic array of text input controls</li>
        <li><strong>Add/Remove</strong>: Buttons to dynamically add or remove array items</li>
        <li><strong>Validation</strong>: Each tag is validated using Zod schema</li>
        <li><strong>Empty State</strong>: Shows message when no items exist</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ArrayOfTextDemoComponent {
  public readonly form = new FormGroup({
    tags: new FormArray<FormControl<string>>([]),
  });

  public readonly formValues = signal(this.form.getRawValue());

  public get tags(): FormArray<FormControl<string>> {
    return this.form.get('tags') as FormArray<FormControl<string>>;
  }

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public addTag(): void {
    const tagControl = new FormControl('', {
      nonNullable: true,
      validators: [validationUtils.zodValidator(tagSchema)],
    });

    this.tags.push(tagControl);
  }

  public removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getTagError(index: number): string | null {
    const control = this.tags.at(index);

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, `Tag ${index + 1}`);
  }

  protected formatTags(): string {
    const tags = this.formValues().tags;

    if (tags.length === 0) {
      return '[]';
    }

    return JSON.stringify(tags);
  }
}

@Component({
  selector: 'story-array-of-text-with-defaults-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Button,
    ButtonIcon,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Array of Text Inputs (With Defaults)"
      currentState="Form with FormArray containing text inputs and default values"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div class="flex items-center justify-between mb-1">
            <div class="text-sm font-semibold">Tags</div>
            <org-button type="button" color="primary" size="sm" (clicked)="addTag()">Add Tag</org-button>
          </div>

          <div formArrayName="tags" class="flex flex-col gap-2">
            @for (tag of tags.controls; track $index) {
              <div class="flex items-start gap-2">
                <org-form-field class="flex-1" [validationMessage]="getTagError($index)">
                  <org-input
                    [formControlName]="$index"
                    [name]="'tag-defaults-' + $index"
                    [placeholder]="'Tag ' + ($index + 1)"
                  />
                </org-form-field>
                <org-button
                  type="button"
                  color="danger"
                  variant="ghost"
                  size="sm"
                  [iconOnly]="true"
                  ariaLabel="Remove tag"
                  (clicked)="removeTag($index)"
                >
                  <org-button-icon name="trash" />
                </org-button>
              </div>
            }
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words">
            <div>tags ({{ formValues().tags.length }}): {{ formatTags() }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Default Values</strong>: Form starts with 2 pre-populated tags</li>
        <li><strong>FormArray</strong>: Dynamic array of text input controls</li>
        <li><strong>Add/Remove</strong>: Can add more tags or remove existing ones</li>
        <li><strong>Validation</strong>: Each tag is validated using Zod schema</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ArrayOfTextWithDefaultsDemoComponent {
  public readonly form = new FormGroup({
    tags: new FormArray<FormControl<string>>([]),
  });

  public readonly formValues = signal(this.form.getRawValue());

  public get tags(): FormArray<FormControl<string>> {
    return this.form.get('tags') as FormArray<FormControl<string>>;
  }

  constructor() {
    this.tags.push(
      new FormControl('angular', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(tagSchema)],
      })
    );
    this.tags.push(
      new FormControl('typescript', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(tagSchema)],
      })
    );

    afterNextRender(() => {
      this.tags.get('0')?.patchValue('angular');
      this.tags.get('1')?.patchValue('typescript');
    });

    this.formValues.set(this.form.getRawValue());

    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public addTag(): void {
    const tagControl = new FormControl('', {
      nonNullable: true,
      validators: [validationUtils.zodValidator(tagSchema)],
    });

    this.tags.push(tagControl);
  }

  public removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getTagError(index: number): string | null {
    const control = this.tags.at(index);

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, `Tag ${index + 1}`);
  }

  protected formatTags(): string {
    const tags = this.formValues().tags;

    if (tags.length === 0) {
      return '[]';
    }

    return JSON.stringify(tags);
  }
}

@Component({
  selector: 'story-array-of-objects-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Combobox,
    DatePickerInput,
    Button,
    ButtonIcon,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Array of Objects"
      currentState="Form with FormArray containing complex object structures"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div class="flex items-center justify-between mb-1">
            <div class="text-sm font-semibold">Items</div>
            <org-button type="button" color="primary" size="sm" (clicked)="addItem()">Add Item</org-button>
          </div>

          <div formArrayName="items" class="flex flex-col gap-3">
            @for (item of items.controls; track $index) {
              <div [formGroupName]="$index" class="rounded-base border border-neutral p-3">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-sm font-semibold">Item {{ $index + 1 }}</div>
                  <org-button
                    type="button"
                    color="danger"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    ariaLabel="Remove item"
                    (clicked)="removeItem($index)"
                  >
                    <org-button-icon name="trash" />
                  </org-button>
                </div>

                <org-form-fields>
                  <org-form-field [validationMessage]="getItemFieldError($index, 'name')">
                    <org-label
                      [htmlFor]="'item-' + $index + '-name'"
                      class="text-sm font-medium"
                      text="Name"
                      [isRequired]="true"
                    />
                    <org-input formControlName="name" [name]="'item-' + $index + '-name'" placeholder="Enter name" />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'description')">
                    <org-label
                      [htmlFor]="'item-' + $index + '-description'"
                      class="text-sm font-medium"
                      text="Description"
                      [isRequired]="true"
                    />
                    <org-textarea
                      formControlName="description"
                      [name]="'item-' + $index + '-description'"
                      placeholder="Enter description"
                      [rows]="2"
                    />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'category')">
                    <org-label
                      [htmlFor]="'item-' + $index + '-category'"
                      class="text-sm font-medium"
                      text="Category"
                      [isRequired]="true"
                    />
                    <org-combobox
                      formControlName="category"
                      [name]="'item-' + $index + '-category'"
                      [options]="categoryOptions"
                      [isMultiSelect]="true"
                      placeholder="Select categories..."
                    />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'isActive')">
                    <org-checkbox formControlName="isActive" [name]="'item-' + $index + '-isActive'" value="active">
                      Is Active *
                    </org-checkbox>
                  </org-form-field>
                  <org-form-field [validationMessage]="getItemFieldError($index, 'isEnabled')">
                    <org-checkbox-toggle
                      formControlName="isEnabled"
                      [name]="'item-' + $index + '-isEnabled'"
                      value="enabled"
                      onIcon="circle-check-big"
                      offIcon="circle-x"
                      onText="Enabled"
                      offText="Disabled"
                    >
                      Is Enabled *
                    </org-checkbox-toggle>
                  </org-form-field>
                  <org-form-field [validationMessage]="getItemFieldError($index, 'priority')">
                    <org-label
                      [htmlFor]="'item-' + $index + '-priority'"
                      class="text-sm font-medium"
                      text="Priority"
                      [isRequired]="true"
                    />
                    <org-radio-group formControlName="priority" [name]="'item-' + $index + '-priority'">
                      <org-radio value="low">Low</org-radio>
                      <org-radio value="medium">Medium</org-radio>
                      <org-radio value="high">High</org-radio>
                    </org-radio-group>
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'date')">
                    <org-label
                      [htmlFor]="'item-' + $index + '-date'"
                      class="text-sm font-medium"
                      text="Date"
                      [isRequired]="true"
                    />
                    <org-date-picker-input
                      formControlName="date"
                      [name]="'item-' + $index + '-date'"
                      placeholder="Select date..."
                    />
                  </org-form-field>
                </org-form-fields>
              </div>
            }

            @if (items.controls.length === 0) {
              <div class="text-sm text-neutral py-2">No items added yet. Click "Add Item" to start.</div>
            }
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words max-h-2xs overflow-y-auto">
            <div>items ({{ formValues().items.length }}): {{ formatItems() }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>FormArray with FormGroups</strong>: Array of complex objects with multiple fields</li>
        <li><strong>Dynamic Add/Remove</strong>: Buttons to manage array items</li>
        <li>
          <strong>All Input Types</strong>: Each item has text, textarea, combobox, checkbox, checkbox toggle, radio,
          and date
        </li>
        <li><strong>Validation</strong>: Each field in each item is validated using Zod schema</li>
        <li><strong>Empty State</strong>: Shows message when no items exist</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ArrayOfObjectsDemoComponent {
  public readonly categoryOptions = categoryOptions;

  public readonly form = new FormGroup({
    items: new FormArray<FormGroup>([]),
  });

  public readonly formValues = signal(this.form.getRawValue());

  public get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public addItem(): void {
    const itemGroup = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.priority)],
      }),
      date: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(itemSchema.shape.date)],
        }
      ),
    });

    this.items.push(itemGroup);
  }

  public removeItem(index: number): void {
    this.items.removeAt(index);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getItemFieldError(itemIndex: number, fieldName: string): string | null {
    const itemGroup = this.items.at(itemIndex) as FormGroup;
    const control = itemGroup.get(fieldName);

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, this.getFieldLabel(fieldName));
  }

  protected getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      description: 'Description',
      category: 'Category',
      isActive: 'Is Active',
      isEnabled: 'Is Enabled',
      priority: 'Priority',
      date: 'Date',
    };

    return labels[fieldName] || fieldName;
  }

  protected formatItems(): string {
    const items = this.formValues().items;

    if (items.length === 0) {
      return '[]';
    }

    return JSON.stringify(items, null, 2);
  }
}

@Component({
  selector: 'story-array-of-objects-with-defaults-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    StorybookExampleContainer,
    StorybookExampleContainerSection,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Combobox,
    DatePickerInput,
    Button,
    ButtonIcon,
    Label,
    FormField,
    FormFields,
  ],
  template: `
    <org-storybook-example-container
      title="Array of Objects (With Defaults)"
      currentState="Form with FormArray containing complex objects and default values"
    >
      <org-storybook-example-container-section label="Form">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
          <div class="flex items-center justify-between mb-1">
            <div class="text-sm font-semibold">Items</div>
            <org-button type="button" color="primary" size="sm" (clicked)="addItem()">Add Item</org-button>
          </div>

          <div formArrayName="items" class="flex flex-col gap-3">
            @for (item of items.controls; track $index) {
              <div [formGroupName]="$index" class="rounded-base border border-neutral p-3">
                <div class="flex items-center justify-between mb-1">
                  <div class="text-sm font-semibold">Item {{ $index + 1 }}</div>
                  <org-button
                    type="button"
                    color="danger"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    ariaLabel="Remove item"
                    (clicked)="removeItem($index)"
                  >
                    <org-button-icon name="trash" />
                  </org-button>
                </div>

                <org-form-fields>
                  <org-form-field [validationMessage]="getItemFieldError($index, 'name')">
                    <org-label
                      [htmlFor]="'item-defaults-' + $index + '-name'"
                      class="text-sm font-medium"
                      text="Name"
                      [isRequired]="true"
                    />
                    <org-input
                      formControlName="name"
                      [name]="'item-defaults-' + $index + '-name'"
                      placeholder="Enter name"
                    />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'description')">
                    <org-label
                      [htmlFor]="'item-defaults-' + $index + '-description'"
                      class="text-sm font-medium"
                      text="Description"
                      [isRequired]="true"
                    />
                    <org-textarea
                      formControlName="description"
                      [name]="'item-defaults-' + $index + '-description'"
                      placeholder="Enter description"
                      [rows]="2"
                    />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'category')">
                    <org-label
                      [htmlFor]="'item-defaults-' + $index + '-category'"
                      class="text-sm font-medium"
                      text="Category"
                      [isRequired]="true"
                    />
                    <org-combobox
                      formControlName="category"
                      [name]="'item-defaults-' + $index + '-category'"
                      [options]="categoryOptions"
                      [isMultiSelect]="true"
                      placeholder="Select categories..."
                    />
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'isActive')">
                    <org-checkbox
                      formControlName="isActive"
                      [name]="'item-defaults-' + $index + '-isActive'"
                      value="active"
                    >
                      Is Active *
                    </org-checkbox>
                  </org-form-field>
                  <org-form-field [validationMessage]="getItemFieldError($index, 'isEnabled')">
                    <org-checkbox-toggle
                      formControlName="isEnabled"
                      [name]="'item-defaults-' + $index + '-isEnabled'"
                      value="enabled"
                      onIcon="circle-check-big"
                      offIcon="circle-x"
                      onText="Enabled"
                      offText="Disabled"
                    >
                      Is Enabled *
                    </org-checkbox-toggle>
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'priority')">
                    <org-label
                      [htmlFor]="'item-defaults-' + $index + '-priority'"
                      class="text-sm font-medium"
                      text="Priority"
                      [isRequired]="true"
                    />
                    <org-radio-group formControlName="priority" [name]="'item-defaults-' + $index + '-priority'">
                      <org-radio value="low">Low</org-radio>
                      <org-radio value="medium">Medium</org-radio>
                      <org-radio value="high">High</org-radio>
                    </org-radio-group>
                  </org-form-field>

                  <org-form-field [validationMessage]="getItemFieldError($index, 'date')">
                    <org-label
                      [htmlFor]="'item-defaults-' + $index + '-date'"
                      class="text-sm font-medium"
                      text="Date"
                      [isRequired]="true"
                    />
                    <org-date-picker-input
                      formControlName="date"
                      [name]="'item-defaults-' + $index + '-date'"
                      placeholder="Select date..."
                    />
                  </org-form-field>
                </org-form-fields>
              </div>
            }
          </div>

          <org-button type="submit" color="primary" buttonClass="w-full mt-1">Submit Form</org-button>
        </form>
      </org-storybook-example-container-section>

      <div class="flex gap-1">
        <div class="rounded-base bg-neutral-soft p-3 text-sm">
          <div class="font-medium mb-2">Form State:</div>
          <div class="flex flex-col gap-1 text-xs font-mono">
            <div>Valid: {{ form.valid }}</div>
            <div>Dirty: {{ form.dirty }}</div>
            <div>Touched: {{ form.touched }}</div>
            <div>Pristine: {{ form.pristine }}</div>
          </div>
        </div>

        <div class="rounded-base bg-info-soft p-3 text-sm flex-1">
          <div class="font-medium mb-2">Current Form Values:</div>
          <div class="flex flex-col gap-1 text-xs font-mono break-words max-h-2xs overflow-y-auto">
            <div>items ({{ formValues().items.length }}): {{ formatItems() }}</div>
          </div>
        </div>
      </div>

      <ul expected-behaviour class="mt-1 list-inside list-disc flex flex-col gap-1">
        <li><strong>Default Values</strong>: Form starts with 2 pre-populated items with valid data</li>
        <li><strong>FormArray with FormGroups</strong>: Array of complex objects with multiple fields</li>
        <li><strong>Dynamic Add/Remove</strong>: Can add more items or remove existing ones</li>
        <li>
          <strong>All Input Types</strong>: Each item has text, textarea, combobox, checkbox, checkbox toggle, radio,
          and date
        </li>
        <li><strong>Validation</strong>: All fields are already valid on load</li>
      </ul>
    </org-storybook-example-container>
  `,
})
class ArrayOfObjectsWithDefaultsDemoComponent {
  public readonly categoryOptions = categoryOptions;

  public readonly form = new FormGroup({
    items: new FormArray<FormGroup>([]),
  });

  public readonly formValues = signal(this.form.getRawValue());

  public get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  constructor() {
    const item1 = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.priority)],
      }),
      date: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(itemSchema.shape.date)],
        }
      ),
    });
    const item2 = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.priority)],
      }),
      date: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(itemSchema.shape.date)],
        }
      ),
    });

    this.items.push(item1);
    this.items.push(item2);

    afterNextRender(() => {
      item1.patchValue({
        name: 'Project Alpha',
        description: 'First major project focused on web development',
        category: ['technology', 'business'],
        isActive: true,
        isEnabled: true,
        priority: 'high',
        date: { startDate: DateTime.now().startOf('day'), endDate: null },
      });

      item2.patchValue({
        name: 'Project Beta',
        description: 'Second project with focus on mobile applications',
        category: ['technology'],
        isActive: true,
        isEnabled: true,
        priority: 'medium',
        date: { startDate: DateTime.now().plus({ days: 7 }).startOf('day'), endDate: null },
      });
    });

    this.formValues.set(this.form.getRawValue());

    this.form.valueChanges.subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  public addItem(): void {
    const itemGroup = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.name)],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.description)],
      }),
      category: new FormControl<(string | number)[]>([], {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.category)],
      }),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isActive)],
      }),
      isEnabled: new FormControl(false, {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.isEnabled)],
      }),
      priority: new FormControl('', {
        nonNullable: true,
        validators: [validationUtils.zodValidator(itemSchema.shape.priority)],
      }),
      date: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
        { startDate: null, endDate: null },
        {
          nonNullable: true,
          validators: [validationUtils.zodValidator(itemSchema.shape.date)],
        }
      ),
    });

    this.items.push(itemGroup);
  }

  public removeItem(index: number): void {
    this.items.removeAt(index);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getItemFieldError(itemIndex: number, fieldName: string): string | null {
    const itemGroup = this.items.at(itemIndex) as FormGroup;
    const control = itemGroup.get(fieldName);

    if (!control?.errors || control.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(control.errors, this.getFieldLabel(fieldName));
  }

  protected getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      description: 'Description',
      category: 'Category',
      isActive: 'Is Active',
      isEnabled: 'Is Enabled',
      priority: 'Priority',
      date: 'Date',
    };

    return labels[fieldName] || fieldName;
  }

  protected formatItems(): string {
    const items = this.formValues().items;

    if (items.length === 0) {
      return '[]';
    }

    return JSON.stringify(items, null, 2);
  }
}

const meta: Meta = {
  title: 'Examples/Form Array',
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Form Array Examples

  This example demonstrates how to use Angular's reactive forms with FormArray for dynamic forms, nested objects, and complex data structures using Zod 4 for validation.

  ### Features
  - **Nested FormGroup**: Forms with nested object structures
  - **FormArray**: Dynamic arrays of form controls
  - **Complex Objects**: Arrays containing FormGroups with multiple fields
  - **Zod Validation**: Schema-based validation with Zod 4
  - **Add/Remove**: Dynamic addition and removal of array items
  - **All Input Types**: Text, textarea, combobox, checkbox, checkbox toggle, radio, and date picker

  ### Use Cases Covered
  1. **Nested Object**: Form with a nested profile object containing all input types
  2. **Array of Text**: Dynamic array of simple text inputs (tags)
  3. **Array of Objects**: Dynamic array of complex objects with all input types

  Each use case includes a variant with default values to show pre-populated forms.

  ### Usage Pattern
  \`\`\`typescript
  // nested object
  public form = new FormGroup({
    profile: new FormGroup({
      name: new FormControl(''),
      // ...
    })
  });

  // array of text
  public form = new FormGroup({
    tags: new FormArray<FormControl<string>>([])
  });

  // array of objects
  public form = new FormGroup({
    items: new FormArray<FormGroup>([])
  });
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const NestedObject: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [NestedObjectDemoComponent],
    },
    template: '<story-nested-object-demo />',
  }),
};

export const NestedObjectWithDefaults: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [NestedObjectWithDefaultsDemoComponent],
    },
    template: '<story-nested-object-with-defaults-demo />',
  }),
};

export const ArrayOfText: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ArrayOfTextDemoComponent],
    },
    template: '<story-array-of-text-demo />',
  }),
};

export const ArrayOfTextWithDefaults: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ArrayOfTextWithDefaultsDemoComponent],
    },
    template: '<story-array-of-text-with-defaults-demo />',
  }),
};

export const ArrayOfObjects: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ArrayOfObjectsDemoComponent],
    },
    template: '<story-array-of-objects-demo />',
  }),
};

export const ArrayOfObjectsWithDefaults: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ArrayOfObjectsWithDefaultsDemoComponent],
    },
    template: '<story-array-of-objects-with-defaults-demo />',
  }),
};
