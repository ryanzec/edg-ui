import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  authenticationAuthenticateRequestSchema,
  type AuthenticationAuthenticateRequest,
} from '@organization/shared-utils';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardHeader } from '../../core/card/card-header';
import { Input } from '../../core/input/input';
import { Button } from '../../core/button/button';
import { FormFields } from '../../core/form-fields/form-fields';
import { FormField } from '../../core/form-fields/form-field';
import { Label } from '../../core/label/label';
import { ButtonGroup } from '../../core/button/button-group';
import { validationUtils } from '../../utils/validation';

@Component({
  selector: 'org-login-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    CardContent,
    CardHeader,
    Input,
    ReactiveFormsModule,
    Button,
    FormFields,
    FormField,
    Label,
    ButtonGroup,
  ],
  templateUrl: './login-form.html',
  host: {
    class: 'block w-base',
  },
})
export class LoginForm {
  public readonly isProcessing = input<boolean>(false);

  public readonly loginSubmitted = output<AuthenticationAuthenticateRequest>();

  public readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [validationUtils.zodValidator(authenticationAuthenticateRequestSchema.shape.email)],
      updateOn: 'submit',
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [validationUtils.zodValidator(authenticationAuthenticateRequestSchema.shape.password)],
      updateOn: 'submit',
    }),
  });

  public showPassword = false;

  public login(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.getRawValue();

      this.loginSubmitted.emit(formValue);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  public getFieldError(fieldName: keyof typeof this.loginForm.controls): string | null {
    const field = this.loginForm.get(fieldName);

    if (!field?.errors || field.touched === false) {
      return null;
    }

    return validationUtils.getFormErrorMessage(field.errors, this.getFieldLabel(fieldName));
  }

  protected getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      email: 'Email',
      password: 'Password',
    };

    return labels[fieldName] || fieldName;
  }
}
