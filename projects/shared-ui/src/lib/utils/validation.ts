import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { z } from 'zod';

/**
 * Gets the error message for a field from the form errors object
 *
 * @param errors - The errors object from the form
 * @param fieldLabel - The label of the field
 * @returns The error message for the field
 */
const getFormErrorMessage = (errors: ValidationErrors, fieldLabel: string): string | null => {
  if (errors.zod) {
    return errors.zod;
  }

  if (errors.required) {
    return `${fieldLabel} is required`;
  }

  if (errors.email) {
    return 'Invalid email address';
  }

  return null;
};

/**
 * Creates an Angular ValidatorFn using a Zod schema.
 * This implementation is compatible with Zod 4.
 * @param schema The Zod schema to validate against.
 * @returns A ValidatorFn that returns a `ValidationErrors` object
 * with a `zodError` key on failure, otherwise null.
 */
export function zodValidator(schema: z.ZodType): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // The .safeParse() method is the modern, recommended way to validate in Zod.
    const result = schema.safeParse(control.value);

    // If validation is successful, return null.
    if (result.success) {
      return null;
    }

    // On failure, return the ZodError object for detailed template access.
    if (result.error) {
      const firstError = result.error.issues[0];

      return { zod: firstError.message };
    }

    return null;
  };
}

export const validationUtils = {
  getFormErrorMessage,
  zodValidator,
};
