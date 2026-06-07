import type { Meta, StoryObj } from '@storybook/angular';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  afterNextRender,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { DesignSystemDemo } from '../../example/design-system-demo/design-system-demo';
import { DesignSystemDemoCanvas } from '../../example/design-system-demo/design-system-demo-canvas';
import { DesignSystemDemoExpectedBehaviour } from '../../example/design-system-demo/design-system-demo-expected-behaviour';
import { DesignSystemDemoHeader } from '../../example/design-system-demo/design-system-demo-header';
import { Input } from '../input/input';
import { Textarea } from '../textarea/textarea';
import { Checkbox } from '../checkbox/checkbox';
import { CheckboxToggle } from '../checkbox-toggle/checkbox-toggle';
import { Radio } from '../radio/radio';
import { RadioGroup } from '../radio/radio-group';
import { Button } from '../button/button';
import { Combobox } from '../combobox/combobox';
import { type ComboboxOptionInput } from '../combobox-store/combobox-store';
import { DatePickerInput } from '../date-picker-input/date-picker-input';
import { FormField } from '../form-fields/form-field';
import { FormFields } from '../form-fields/form-fields';
import { Label } from '../label/label';

const skillOptions: ComboboxOptionInput[] = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
];

@Component({
  selector: 'story-reactive-form-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Button,
    Combobox,
    DatePickerInput,
    FormField,
    FormFields,
    Label,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Reactive Forms Integration" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Complete Form Example</div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
            <org-form-fields>
              <org-form-field [validationMessage]="getFieldError('username')">
                <org-label text="Username" htmlFor="username" [isRequired]="true" />
                <org-input formControlName="username" name="username" placeholder="Enter your username" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('email')">
                <org-label text="Email" htmlFor="email" [isRequired]="true" />
                <org-input
                  type="email"
                  formControlName="email"
                  name="email"
                  placeholder="Enter your email"
                  preIcon="mail"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('bio')">
                <org-label text="Bio (max 200 chars)" htmlFor="bio" />
                <org-textarea formControlName="bio" name="bio" placeholder="Tell us about yourself..." [minLines]="4" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('agreeToTerms')">
                <org-checkbox formControlName="agreeToTerms" name="terms" value="agree">
                  I agree to the terms and conditions *
                </org-checkbox>
              </org-form-field>

              <org-form-field>
                <org-checkbox-toggle
                  formControlName="notifications"
                  name="notifications"
                  value="on"
                  onIcon="notification"
                  offIcon="notification-off"
                  onText="On"
                  offText="Off"
                >
                  Enable notifications
                </org-checkbox-toggle>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('contactMethod')">
                <org-label text="Preferred Contact Method" htmlFor="contactMethod" [isRequired]="true" />
                <org-radio-group formControlName="contactMethod" name="contactMethod">
                  <org-radio value="email">Email</org-radio>
                  <org-radio value="phone">Phone</org-radio>
                  <org-radio value="sms">SMS</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('skills')">
                <org-label text="Skills" htmlFor="skills" [isRequired]="true" />
                <org-combobox
                  formControlName="skills"
                  [options]="skillOptions"
                  [isMultiSelect]="true"
                  placeholder="Select your skills..."
                  name="skills"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('dateRange')">
                <org-label text="Date Range" htmlFor="dateRange" [isRequired]="true" />
                <org-date-picker-input
                  formControlName="dateRange"
                  [allowRangeSelection]="true"
                  placeholder="Select date range..."
                  name="dateRange"
                />
              </org-form-field>
            </org-form-fields>

            <org-button type="submit" color="primary" buttonClass="w-full" label="Submit Form" />
          </form>
        </div>

        <div class="flex gap-1">
          <div class="rounded-base bg-neutral-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Form State:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>Valid: {{ form.valid }}</div>
              <div>Dirty: {{ form.dirty }}</div>
              <div>Touched: {{ form.touched }}</div>
              <div>Pristine: {{ form.pristine }}</div>
            </div>
          </div>

          <div class="rounded-base bg-info-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Current Form Values:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>username: "{{ formValues().username }}"</div>
              <div>email: "{{ formValues().email }}"</div>
              <div>bio: "{{ formValues().bio }}"</div>
              <div>agreeToTerms: {{ formValues().agreeToTerms }}</div>
              <div>notifications: {{ formValues().notifications }}</div>
              <div>contactMethod: "{{ formValues().contactMethod }}"</div>
              <div>skills: {{ formValues().skills.length }} selected</div>
              <div>dateRange: {{ formatDateRange(formValues().dateRange) }}</div>
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
        <li><strong>Input</strong>: Binds to form control with 'formControlName', displays validation messages</li>
        <li><strong>Textarea</strong>: Multi-line text input with character limit validation</li>
        <li><strong>Checkbox</strong>: Boolean form control with required validation support</li>
        <li><strong>Checkbox Toggle</strong>: Alternative checkbox style with icon/text support</li>
        <li><strong>Radio Group</strong>: Radio button group with single selection validation</li>
        <li><strong>Combobox</strong>: Multi-select autocomplete with array value support</li>
        <li><strong>Date Picker</strong>: Date range selection with validation and reactive forms integration</li>
        <li><strong>Validation</strong>: All controls show errors when dirty or touched</li>
        <li><strong>Form State</strong>: Track valid, dirty, touched, and pristine states</li>
        <li><strong>Form Values</strong>: Live display of current form values updates as you type/interact</li>
        <li><strong>Submission</strong>: Form submission prevented until all validations pass</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class ReactiveFormDemoComponent {
  protected readonly skillOptions = skillOptions;

  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    bio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    agreeToTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    notifications: new FormControl(true, {
      nonNullable: true,
    }),
    contactMethod: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    skills: new FormControl<(string | number)[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    dateRange: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
      { startDate: null, endDate: null },
      {
        nonNullable: true,
        validators: [this._dateRangeValidator],
      }
    ),
  });

  protected readonly formValues = signal(this.form.getRawValue());

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid:', this.form.errors);
    }
  }

  protected getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (!field?.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName} is required`;
    }

    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (field.errors['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['maxlength']) {
      return `${fieldName} must be less than ${field.errors['maxlength'].requiredLength} characters`;
    }

    if (field.errors['dateRangeRequired']) {
      return 'Both start and end dates are required';
    }

    return '';
  }

  protected formatDateRange(dateRange: { startDate: DateTime | null; endDate: DateTime | null }): string {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'None';
    }

    const start = dateRange.startDate ? dateRange.startDate.toISO() : 'None';
    const end = dateRange.endDate ? dateRange.endDate.toISO() : 'None';

    return `${start} - ${end}`;
  }

  private _dateRangeValidator(control: AbstractControl): Record<string, boolean> | null {
    const value = control.value as { startDate: DateTime | null; endDate: DateTime | null };

    if (!value.startDate || !value.endDate) {
      return { dateRangeRequired: true };
    }

    return null;
  }
}

@Component({
  selector: 'story-simple-binding-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Button,
    Combobox,
    DatePickerInput,
    FormField,
    FormFields,
    Label,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Simple Data Binding" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Complete Form Example</div>
          <form (submit)="onSubmit($event)" class="flex flex-col gap-1 max-w-lg">
            <org-form-fields>
              <org-form-field [validationMessage]="usernameError()">
                <org-label text="Username" htmlFor="username" [isRequired]="true" />
                <org-input [(value)]="username" name="username" placeholder="Enter your username" />
              </org-form-field>

              <org-form-field [validationMessage]="emailError()">
                <org-label text="Email" htmlFor="email" [isRequired]="true" />
                <org-input type="email" [(value)]="email" name="email" placeholder="Enter your email" preIcon="mail" />
              </org-form-field>

              <org-form-field [validationMessage]="bioError()">
                <org-label text="Bio" htmlFor="bio" [isRequired]="true" />
                <org-textarea [(value)]="bio" name="bio" placeholder="Tell us about yourself..." [minLines]="4" />
              </org-form-field>

              <org-form-field [validationMessage]="agreeToTermsError()">
                <org-checkbox [(checked)]="agreeToTerms" name="agreeToTerms" value="agree">
                  I agree to the terms and conditions *
                </org-checkbox>
              </org-form-field>

              <org-form-field [validationMessage]="notificationsError()">
                <org-checkbox-toggle
                  [(checked)]="notifications"
                  name="notifications"
                  value="on"
                  onIcon="notification"
                  offIcon="notification-off"
                  onText="On"
                  offText="Off"
                >
                  Enable notifications *
                </org-checkbox-toggle>
              </org-form-field>

              <org-form-field [validationMessage]="contactMethodError()">
                <org-label text="Preferred Contact Method" htmlFor="contactMethod" [isRequired]="true" />
                <org-radio-group [(value)]="contactMethod" name="contactMethod" class="flex flex-col gap-2">
                  <org-radio value="email">Email</org-radio>
                  <org-radio value="phone">Phone</org-radio>
                  <org-radio value="sms">SMS</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="skillsError()">
                <org-label text="Skills" htmlFor="skills" [isRequired]="true" />
                <org-combobox
                  [options]="skillOptions"
                  [isMultiSelect]="true"
                  placeholder="Select your skills..."
                  (selectedValuesChanged)="skills.set($event)"
                  name="skills"
                />
              </org-form-field>

              <org-form-field [validationMessage]="dateRangeError()">
                <org-label text="Date Range" htmlFor="dateRange" [isRequired]="true" />
                <org-date-picker-input
                  [allowRangeSelection]="true"
                  [selectedStartDate]="startDate()"
                  [selectedEndDate]="endDate()"
                  placeholder="Select date range..."
                  (dateSelected)="onDateSelected($event)"
                  name="dateRange"
                />
              </org-form-field>
            </org-form-fields>

            <org-button type="submit" color="primary" buttonClass="w-full" label="Submit Form" />
          </form>
        </div>

        <div class="flex gap-1">
          <div class="rounded-base bg-neutral-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Form State:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>Valid: {{ isFormValid() }}</div>
              <div>Submitted: {{ submitted() }}</div>
            </div>
          </div>

          <div class="rounded-base bg-info-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Current Form Values:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>username: "{{ username() }}"</div>
              <div>email: "{{ email() }}"</div>
              <div>bio: "{{ bio() }}"</div>
              <div>agreeToTerms: {{ agreeToTerms() }}</div>
              <div>notifications: {{ notifications() }}</div>
              <div>contactMethod: "{{ contactMethod() }}"</div>
              <div>skills: {{ skills().length }} selected</div>
              <div>dateRange: {{ formatDateRange() }}</div>
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
        <li><strong>Input</strong>: Two-way binding with [(value)], displays validation on submit</li>
        <li><strong>Textarea</strong>: Multi-line text input with required validation</li>
        <li><strong>Checkbox</strong>: Boolean control with [(checked)] two-way binding and required validation</li>
        <li>
          <strong>Checkbox Toggle</strong>: Alternative checkbox style with icon/text support and required validation
        </li>
        <li><strong>Radio Group</strong>: Radio button group with [(value)] two-way binding and required validation</li>
        <li><strong>Combobox</strong>: Multi-select autocomplete with event binding and required validation</li>
        <li><strong>Date Picker</strong>: Date range selection with event binding and required validation</li>
        <li><strong>Validation</strong>: All fields show errors after form submission attempt</li>
        <li><strong>Form Submission</strong>: Prevented when form has validation errors</li>
        <li><strong>Form Values</strong>: Live display updates as you type/interact using signals</li>
        <li><strong>No FormControl needed</strong>: Uses signals and two-way binding instead</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class SimpleBindingDemoComponent {
  protected readonly skillOptions = skillOptions;

  protected username = signal('');
  protected email = signal('');
  protected bio = signal('');
  protected agreeToTerms = signal(false);
  protected notifications = signal(false);
  protected contactMethod = signal('');
  protected skills = signal<(string | number)[]>([]);
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);
  protected submitted = signal(false);

  private _isValidEmail = computed<boolean>(() => {
    const emailValue = this.email();

    if (!emailValue.trim()) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(emailValue);
  });

  protected usernameError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.username().trim()) {
      return 'Username is required';
    }

    if (this.username().trim().length < 3) {
      return 'Username must be at least 3 characters';
    }

    return '';
  });

  protected emailError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.email().trim()) {
      return 'Email is required';
    }

    if (!this._isValidEmail()) {
      return 'Please enter a valid email address';
    }

    return '';
  });

  protected bioError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.bio().trim()) {
      return 'Bio is required';
    }

    return '';
  });

  protected agreeToTermsError = computed<string>(() => {
    if (this.submitted() && !this.agreeToTerms()) {
      return 'You must agree to the terms and conditions';
    }

    return '';
  });

  protected notificationsError = computed<string>(() => {
    if (this.submitted() && !this.notifications()) {
      return 'You must enable notifications';
    }

    return '';
  });

  protected contactMethodError = computed<string>(() => {
    if (this.submitted() && !this.contactMethod().trim()) {
      return 'Please select a contact method';
    }

    return '';
  });

  protected skillsError = computed<string>(() => {
    if (this.submitted() && this.skills().length === 0) {
      return 'At least one skill is required';
    }

    return '';
  });

  protected dateRangeError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.startDate() || !this.endDate()) {
      return 'Both start and end dates are required';
    }

    return '';
  });

  protected isFormValid = computed<boolean>(() => {
    return (
      this.username().trim().length >= 3 &&
      this._isValidEmail() &&
      this.bio().trim().length > 0 &&
      this.agreeToTerms() &&
      this.notifications() &&
      this.contactMethod().trim().length > 0 &&
      this.skills().length > 0 &&
      this.startDate() !== null &&
      this.endDate() !== null
    );
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    console.log('Form validation state:', {
      username: this.username(),
      usernameValid: this.username().trim().length >= 3,
      email: this.email(),
      emailValid: this._isValidEmail(),
      bio: this.bio(),
      bioValid: this.bio().trim().length > 0,
      agreeToTerms: this.agreeToTerms(),
      notifications: this.notifications(),
      contactMethod: this.contactMethod(),
      contactMethodValid: this.contactMethod().trim().length > 0,
      skills: this.skills(),
      skillsValid: this.skills().length > 0,
      startDate: this.startDate(),
      endDate: this.endDate(),
      isFormValid: this.isFormValid(),
    });

    if (!this.isFormValid()) {
      console.log('Form is invalid - submission prevented');

      return;
    }

    console.log('Form submitted successfully:', {
      username: this.username(),
      email: this.email(),
      bio: this.bio(),
      agreeToTerms: this.agreeToTerms(),
      notifications: this.notifications(),
      contactMethod: this.contactMethod(),
      skills: this.skills(),
      startDate: this.startDate()?.toISO(),
      endDate: this.endDate()?.toISO(),
    });
  }

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    console.log('Date selected:', dates);
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
  }

  protected formatDateRange(): string {
    if (!this.startDate() && !this.endDate()) {
      return 'None';
    }

    const start = this.startDate() ? this.startDate()!.toISO() : 'None';
    const end = this.endDate() ? this.endDate()!.toISO() : 'None';

    return `${start} - ${end}`;
  }
}

type PrePopulatedFormData = {
  username: string;
  email: string;
  bio: string;
  agreeToTerms: boolean;
  notifications: boolean;
  contactMethod: string;
  skills: (string | number)[];
  dateRange: { startDate: DateTime | null; endDate: DateTime | null };
};

@Component({
  selector: 'story-reactive-form-pre-populated-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Button,
    Combobox,
    DatePickerInput,
    FormField,
    FormFields,
    Label,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Reactive Forms with Pre-populated Data" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Pre-populated Form Example</div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-1 max-w-lg">
            <org-form-fields>
              <org-form-field [validationMessage]="getFieldError('username')">
                <org-label text="Username" htmlFor="username" [isRequired]="true" />
                <org-input formControlName="username" name="username" placeholder="Enter your username" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('email')">
                <org-label text="Email" htmlFor="email" [isRequired]="true" />
                <org-input
                  type="email"
                  formControlName="email"
                  name="email"
                  placeholder="Enter your email"
                  preIcon="mail"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('bio')">
                <org-label text="Bio (max 200 chars)" htmlFor="bio" />
                <org-textarea formControlName="bio" name="bio" placeholder="Tell us about yourself..." [minLines]="4" />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('agreeToTerms')">
                <org-checkbox formControlName="agreeToTerms" name="terms" value="agree">
                  I agree to the terms and conditions *
                </org-checkbox>
              </org-form-field>

              <org-form-field>
                <org-checkbox-toggle
                  formControlName="notifications"
                  name="notifications"
                  value="on"
                  onIcon="notification"
                  offIcon="notification-off"
                  onText="On"
                  offText="Off"
                >
                  Enable notifications
                </org-checkbox-toggle>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('contactMethod')">
                <org-label text="Preferred Contact Method" htmlFor="contactMethod" [isRequired]="true" />
                <org-radio-group formControlName="contactMethod" name="contactMethod">
                  <org-radio value="email">Email</org-radio>
                  <org-radio value="phone">Phone</org-radio>
                  <org-radio value="sms">SMS</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('skills')">
                <org-label text="Skills" htmlFor="skills" [isRequired]="true" />
                <org-combobox
                  formControlName="skills"
                  [options]="skillOptions"
                  [isMultiSelect]="true"
                  placeholder="Select your skills..."
                  name="skills"
                />
              </org-form-field>

              <org-form-field [validationMessage]="getFieldError('dateRange')">
                <org-label text="Date Range" htmlFor="dateRange" [isRequired]="true" />
                <org-date-picker-input
                  formControlName="dateRange"
                  [allowRangeSelection]="true"
                  placeholder="Select date range..."
                  name="dateRange"
                />
              </org-form-field>
            </org-form-fields>

            <org-button type="submit" color="primary" buttonClass="w-full" label="Submit Form" />
          </form>
        </div>

        <div class="flex gap-1">
          <div class="rounded-base bg-neutral-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Form State:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>Valid: {{ form.valid }}</div>
              <div>Dirty: {{ form.dirty }}</div>
              <div>Touched: {{ form.touched }}</div>
              <div>Pristine: {{ form.pristine }}</div>
            </div>
          </div>

          <div class="rounded-base bg-info-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Current Form Values:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>username: "{{ formValues().username }}"</div>
              <div>email: "{{ formValues().email }}"</div>
              <div>bio: "{{ formValues().bio }}"</div>
              <div>agreeToTerms: {{ formValues().agreeToTerms }}</div>
              <div>notifications: {{ formValues().notifications }}</div>
              <div>contactMethod: "{{ formValues().contactMethod }}"</div>
              <div>skills: {{ formValues().skills.length }} selected</div>
              <div>dateRange: {{ formatDateRange(formValues().dateRange) }}</div>
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
        <li><strong>Pre-populated Data</strong>: Form is initialized with data passed via input property</li>
        <li><strong>Input</strong>: Binds to form control with 'formControlName', displays validation messages</li>
        <li><strong>Textarea</strong>: Multi-line text input with character limit validation</li>
        <li><strong>Checkbox</strong>: Boolean form control with required validation support</li>
        <li><strong>Checkbox Toggle</strong>: Alternative checkbox style with icon/text support</li>
        <li><strong>Radio Group</strong>: Radio button group with single selection validation</li>
        <li><strong>Combobox</strong>: Multi-select autocomplete with array value support</li>
        <li><strong>Date Picker</strong>: Date range selection with validation and reactive forms integration</li>
        <li><strong>Validation</strong>: All controls show errors when dirty or touched</li>
        <li><strong>Form State</strong>: Track valid, dirty, touched, and pristine states</li>
        <li><strong>Form Values</strong>: Live display of current form values updates as you type/interact</li>
        <li><strong>Submission</strong>: Form submission prevented until all validations pass</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class ReactiveFormPrePopulatedDemoComponent {
  protected readonly skillOptions = skillOptions;

  public defaultData = input<PrePopulatedFormData>({
    username: 'johndoe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer with 10+ years of experience in web development.',
    agreeToTerms: true,
    notifications: false,
    contactMethod: 'phone',
    skills: ['typescript', 'angular', 'nodejs'],
    dateRange: {
      startDate: DateTime.fromISO('2024-01-01'),
      endDate: DateTime.fromISO('2024-12-31'),
    },
  });

  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    bio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    agreeToTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    notifications: new FormControl(true, {
      nonNullable: true,
    }),
    contactMethod: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    skills: new FormControl<(string | number)[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    dateRange: new FormControl<{ startDate: DateTime | null; endDate: DateTime | null }>(
      { startDate: null, endDate: null },
      {
        nonNullable: true,
        validators: [this._dateRangeValidator],
      }
    ),
  });

  protected readonly formValues = signal(this.form.getRawValue());

  constructor() {
    afterNextRender(() => {
      const data = this.defaultData();
      this.form.reset(data);
      this.formValues.set(this.form.getRawValue());
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.formValues.set(this.form.getRawValue());
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid:', this.form.errors);
    }
  }

  protected getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (!field?.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName} is required`;
    }

    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (field.errors['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['maxlength']) {
      return `${fieldName} must be less than ${field.errors['maxlength'].requiredLength} characters`;
    }

    if (field.errors['dateRangeRequired']) {
      return 'Both start and end dates are required';
    }

    return '';
  }

  protected formatDateRange(dateRange: { startDate: DateTime | null; endDate: DateTime | null }): string {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'None';
    }

    const start = dateRange.startDate ? dateRange.startDate.toISO() : 'None';
    const end = dateRange.endDate ? dateRange.endDate.toISO() : 'None';

    return `${start} - ${end}`;
  }

  private _dateRangeValidator(control: AbstractControl): Record<string, boolean> | null {
    const value = control.value as { startDate: DateTime | null; endDate: DateTime | null };

    if (!value.startDate || !value.endDate) {
      return { dateRangeRequired: true };
    }

    return null;
  }
}

@Component({
  selector: 'story-simple-binding-pre-populated-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DesignSystemDemo,
    DesignSystemDemoHeader,
    DesignSystemDemoCanvas,
    DesignSystemDemoExpectedBehaviour,
    Input,
    Textarea,
    Checkbox,
    CheckboxToggle,
    Radio,
    RadioGroup,
    Button,
    Combobox,
    DatePickerInput,
    FormField,
    FormFields,
    Label,
  ],
  template: `
    <org-design-system-demo>
      <org-design-system-demo-header slot="header" title="Simple Data Binding with Pre-populated Data" />
      <org-design-system-demo-canvas slot="canvas">
        <div class="flex flex-col gap-2 items-start">
          <div class="text-sm font-medium">Pre-populated Form Example</div>
          <form (submit)="onSubmit($event)" class="flex flex-col gap-1 max-w-lg">
            <org-form-fields>
              <org-form-field [validationMessage]="usernameError()">
                <org-label text="Username" htmlFor="username" [isRequired]="true" />
                <org-input [(value)]="username" name="username" placeholder="Enter your username" />
              </org-form-field>

              <org-form-field [validationMessage]="emailError()">
                <org-label text="Email" htmlFor="email" [isRequired]="true" />
                <org-input type="email" [(value)]="email" name="email" placeholder="Enter your email" preIcon="mail" />
              </org-form-field>

              <org-form-field [validationMessage]="bioError()">
                <org-label text="Bio" htmlFor="bio" [isRequired]="true" />
                <org-textarea [(value)]="bio" name="bio" placeholder="Tell us about yourself..." [minLines]="4" />
              </org-form-field>

              <org-form-field [validationMessage]="agreeToTermsError()">
                <org-checkbox [(checked)]="agreeToTerms" name="agreeToTerms" value="agree">
                  I agree to the terms and conditions *
                </org-checkbox>
              </org-form-field>

              <org-form-field [validationMessage]="notificationsError()">
                <org-checkbox-toggle
                  [(checked)]="notifications"
                  name="notifications"
                  value="on"
                  onIcon="notification"
                  offIcon="notification-off"
                  onText="On"
                  offText="Off"
                >
                  Enable notifications *
                </org-checkbox-toggle>
              </org-form-field>

              <org-form-field [validationMessage]="contactMethodError()">
                <org-label text="Preferred Contact Method" htmlFor="contactMethod" [isRequired]="true" />
                <org-radio-group [(value)]="contactMethod" name="contactMethod" class="flex flex-col gap-2">
                  <org-radio value="email">Email</org-radio>
                  <org-radio value="phone">Phone</org-radio>
                  <org-radio value="sms">SMS</org-radio>
                </org-radio-group>
              </org-form-field>

              <org-form-field [validationMessage]="skillsError()">
                <org-label text="Skills" htmlFor="skills" [isRequired]="true" />
                <org-combobox
                  #skillsComponent
                  [options]="skillOptions"
                  [isMultiSelect]="true"
                  placeholder="Select your skills..."
                  (selectedValuesChanged)="skills.set($event)"
                  name="skills"
                />
              </org-form-field>

              <org-form-field [validationMessage]="dateRangeError()">
                <org-label text="Date Range" htmlFor="dateRange" [isRequired]="true" />
                <org-date-picker-input
                  [allowRangeSelection]="true"
                  [selectedStartDate]="startDate()"
                  [selectedEndDate]="endDate()"
                  placeholder="Select date range..."
                  (dateSelected)="onDateSelected($event)"
                  name="dateRange"
                />
              </org-form-field>
            </org-form-fields>

            <org-button type="submit" color="primary" buttonClass="w-full" label="Submit Form" />
          </form>
        </div>

        <div class="flex gap-1">
          <div class="rounded-base bg-neutral-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Form State:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>Valid: {{ isFormValid() }}</div>
              <div>Submitted: {{ submitted() }}</div>
            </div>
          </div>

          <div class="rounded-base bg-info-soft p-3 text-sm flex flex-col gap-2">
            <div class="font-medium">Current Form Values:</div>
            <div class="flex flex-col gap-1 text-xs font-mono">
              <div>username: "{{ username() }}"</div>
              <div>email: "{{ email() }}"</div>
              <div>bio: "{{ bio() }}"</div>
              <div>agreeToTerms: {{ agreeToTerms() }}</div>
              <div>notifications: {{ notifications() }}</div>
              <div>contactMethod: "{{ contactMethod() }}"</div>
              <div>skills: {{ skills().length }} selected</div>
              <div>dateRange: {{ formatDateRange() }}</div>
            </div>
          </div>
        </div>
      </org-design-system-demo-canvas>
    </org-design-system-demo>
    <org-design-system-demo-expected-behaviour>
      <ul class="flex flex-col gap-1 mt-1 list-inside list-disc">
        <li><strong>Pre-populated Data</strong>: Form is initialized with data passed via input property</li>
        <li><strong>Input</strong>: Two-way binding with [(value)], displays validation on submit</li>
        <li><strong>Textarea</strong>: Multi-line text input with required validation</li>
        <li><strong>Checkbox</strong>: Boolean control with [(checked)] two-way binding and required validation</li>
        <li>
          <strong>Checkbox Toggle</strong>: Alternative checkbox style with icon/text support and required validation
        </li>
        <li><strong>Radio Group</strong>: Radio button group with [(value)] two-way binding and required validation</li>
        <li><strong>Combobox</strong>: Multi-select autocomplete with event binding and required validation</li>
        <li><strong>Date Picker</strong>: Date range selection with event binding and required validation</li>
        <li><strong>Validation</strong>: All fields show errors after form submission attempt</li>
        <li><strong>Form Submission</strong>: Prevented when form has validation errors</li>
        <li><strong>Form Values</strong>: Live display updates as you type/interact using signals</li>
        <li><strong>No FormControl needed</strong>: Uses signals and two-way binding instead</li>
      </ul>
    </org-design-system-demo-expected-behaviour>
  `,
})
class SimpleBindingPrePopulatedDemoComponent implements AfterViewInit {
  protected readonly skillOptions = skillOptions;

  public defaultData = input<PrePopulatedFormData>({
    username: 'janedoe',
    email: 'jane.doe@example.com',
    bio: 'UX designer passionate about creating intuitive user interfaces.',
    agreeToTerms: true,
    notifications: true,
    contactMethod: 'phone',
    skills: ['javascript', 'react', 'vue'],
    dateRange: {
      startDate: DateTime.fromISO('2024-06-01'),
      endDate: DateTime.fromISO('2024-12-01'),
    },
  });

  @ViewChild('skillsComponent')
  private readonly _skillsComponent!: Combobox;

  protected username = signal('');
  protected email = signal('');
  protected bio = signal('');
  protected agreeToTerms = signal(false);
  protected notifications = signal(false);
  protected contactMethod = signal('');
  protected skills = signal<(string | number)[]>([]);
  protected startDate = signal<DateTime | null>(null);
  protected endDate = signal<DateTime | null>(null);
  protected submitted = signal(false);

  constructor() {
    const data = this.defaultData();
    this.username.set(data.username);
    this.email.set(data.email);
    this.bio.set(data.bio);
    this.agreeToTerms.set(data.agreeToTerms);
    this.notifications.set(data.notifications);
    this.contactMethod.set(data.contactMethod);
    this.skills.set(data.skills);
    this.startDate.set(data.dateRange.startDate);
    this.endDate.set(data.dateRange.endDate);
  }

  public ngAfterViewInit(): void {
    this._skillsComponent.setSelectedOptions(this.skills());
  }

  private _isValidEmail = computed<boolean>(() => {
    const emailValue = this.email();

    if (!emailValue.trim()) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(emailValue);
  });

  protected usernameError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.username().trim()) {
      return 'Username is required';
    }

    if (this.username().trim().length < 3) {
      return 'Username must be at least 3 characters';
    }

    return '';
  });

  protected emailError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.email().trim()) {
      return 'Email is required';
    }

    if (!this._isValidEmail()) {
      return 'Please enter a valid email address';
    }

    return '';
  });

  protected bioError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.bio().trim()) {
      return 'Bio is required';
    }

    return '';
  });

  protected agreeToTermsError = computed<string>(() => {
    if (this.submitted() && !this.agreeToTerms()) {
      return 'You must agree to the terms and conditions';
    }

    return '';
  });

  protected notificationsError = computed<string>(() => {
    if (this.submitted() && !this.notifications()) {
      return 'You must enable notifications';
    }

    return '';
  });

  protected contactMethodError = computed<string>(() => {
    if (this.submitted() && !this.contactMethod().trim()) {
      return 'Please select a contact method';
    }

    return '';
  });

  protected skillsError = computed<string>(() => {
    if (this.submitted() && this.skills().length === 0) {
      return 'At least one skill is required';
    }

    return '';
  });

  protected dateRangeError = computed<string>(() => {
    if (!this.submitted()) {
      return '';
    }

    if (!this.startDate() || !this.endDate()) {
      return 'Both start and end dates are required';
    }

    return '';
  });

  protected isFormValid = computed<boolean>(() => {
    return (
      this.username().trim().length >= 3 &&
      this._isValidEmail() &&
      this.bio().trim().length > 0 &&
      this.agreeToTerms() &&
      this.notifications() &&
      this.contactMethod().trim().length > 0 &&
      this.skills().length > 0 &&
      this.startDate() !== null &&
      this.endDate() !== null
    );
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    if (!this.isFormValid()) {
      console.log('Form is invalid - submission prevented');

      return;
    }

    console.log('Form submitted successfully:', {
      username: this.username(),
      email: this.email(),
      bio: this.bio(),
      agreeToTerms: this.agreeToTerms(),
      notifications: this.notifications(),
      contactMethod: this.contactMethod(),
      skills: this.skills(),
      startDate: this.startDate()?.toISO(),
      endDate: this.endDate()?.toISO(),
    });
  }

  protected onDateSelected(dates: { startDate: DateTime | null; endDate: DateTime | null }): void {
    this.startDate.set(dates.startDate);
    this.endDate.set(dates.endDate);
  }

  protected formatDateRange(): string {
    if (!this.startDate() && !this.endDate()) {
      return 'None';
    }

    const start = this.startDate() ? this.startDate()!.toISO() : 'None';
    const end = this.endDate() ? this.endDate()!.toISO() : 'None';

    return `${start} - ${end}`;
  }
}

const meta: Meta = {
  title: 'Core/Form',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
<div class="docs-top-level-overview">
  ## Reactive Forms Example

  This example demonstrates how all form controls work with Angular's reactive forms system.

  ### Features
  - Full reactive forms integration with \`formControlName\`
  - Validation support across all form controls
  - Form state management (dirty, touched, valid)
  - Error message display
  - Form submission handling

  ### Included Form Controls
  - **Input**: Text input fields with validation
  - **Textarea**: Multi-line text input
  - **Checkbox**: Standard checkbox controls
  - **Checkbox Toggle**: Toggle-style checkbox
  - **Radio Group**: Radio button groups for single selection

  ### Usage Pattern
  \`\`\`typescript
  public form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
    notifications: new FormControl(true),
    contactMethod: new FormControl('', [Validators.required]),
  });
  \`\`\`

  \`\`\`html
  <form [formGroup]="form" (ngSubmit)="submit()">
    <org-form-fields>
      <org-form-field>
        <org-input formControlName="username" placeholder="Username" />
      </org-form-field>
      <org-form-field>
        <org-textarea name="description" formControlName="description" placeholder="Description" />
      </org-form-field>
      <org-form-field>
        <org-checkbox formControlName="agreeToTerms" name="terms" value="agree">
          I agree to terms
        </org-checkbox>
      </org-form-field>
      <org-form-field>
        <org-checkbox-toggle formControlName="notifications" name="notifications" value="on">
          Enable notifications
        </org-checkbox-toggle>
      </org-form-field>
      <org-form-field>
        <org-radio-group formControlName="contactMethod" name="contact">
          <org-radio value="email">Email</org-radio>
          <org-radio value="phone">Phone</org-radio>
          <org-radio value="sms">SMS</org-radio>
        </org-radio-group>
      </org-form-field>
    </org-form-fields>
  </form>
  \`\`\`
</div>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<story-reactive-form-demo />`,
    moduleMetadata: {
      imports: [ReactiveFormDemoComponent],
    },
  }),
};

export const ReactiveForms: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive form demonstrating all form controls working with Angular reactive forms. Try submitting the form to see validation in action.',
      },
    },
  },
  render: () => ({
    template: `<story-reactive-form-demo />`,
    moduleMetadata: {
      imports: [ReactiveFormDemoComponent],
    },
  }),
};

export const SimpleBinding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive form demonstrating all form controls working with simple two-way data binding using signals. This approach is simpler for basic forms that don't need the full power of reactive forms.",
      },
    },
  },
  render: () => ({
    template: `<story-simple-binding-demo />`,
    moduleMetadata: {
      imports: [SimpleBindingDemoComponent],
    },
  }),
};

export const ReactiveFormsPrePopulated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a reactive form with pre-populated data passed via input property. This pattern is useful when editing existing records or loading saved data into a form.',
      },
    },
  },
  render: () => ({
    template: `<story-reactive-form-pre-populated-demo [defaultData]="sampleData" />`,
    props: {
      sampleData: {
        username: 'johndoe',
        email: 'john.doe@example.com',
        bio: 'Full-stack developer with 10+ years of experience in web development.',
        agreeToTerms: true,
        notifications: true,
        contactMethod: 'email',
        skills: ['typescript', 'angular', 'nodejs'],
        dateRange: {
          startDate: DateTime.fromISO('2024-01-01'),
          endDate: DateTime.fromISO('2024-12-31'),
        },
      },
    },
    moduleMetadata: {
      imports: [ReactiveFormPrePopulatedDemoComponent],
    },
  }),
};

export const SimpleBindingPrePopulated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a simple form with pre-populated data passed via input property. This pattern is useful when editing existing records or loading saved data into a form using signals and two-way binding.',
      },
    },
  },
  render: () => ({
    template: `<story-simple-binding-pre-populated-demo [defaultData]="sampleData" />`,
    props: {
      sampleData: {
        username: 'janedoe',
        email: 'jane.doe@example.com',
        bio: 'UX designer passionate about creating intuitive user interfaces.',
        agreeToTerms: true,
        notifications: true,
        contactMethod: 'phone',
        skills: ['javascript', 'react', 'vue'],
        dateRange: {
          startDate: DateTime.fromISO('2024-06-01'),
          endDate: DateTime.fromISO('2024-12-01'),
        },
      },
    },
    moduleMetadata: {
      imports: [SimpleBindingPrePopulatedDemoComponent],
    },
  }),
};
