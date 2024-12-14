import type { FormDataWritables, FormErrorsWritables } from '$lib/stores/form-manager.store';
import { zodUtils } from '$lib/utils/zod';
import * as zod from 'zod';

export type DynamicFormSection1FormData = {
  firstName: string;
};

export type DynamicFormSection2FormData = {
  lastName: string;
};

export type DynamicFormSectionsFormData = DynamicFormSection1FormData & DynamicFormSection2FormData;

export enum DynamicFormSection {
  ONE = 'one',
  TWO = 'two',
}

// because the return is explicit with the type, we don't need it defined on the function (might be hard to do anyway)
const buildFormValidationSchema = (enabledSections: DynamicFormSection[]) => {
  const section1Schema = zodUtils.schemaForType<DynamicFormSection1FormData>()(zod.object({
    firstName: zod.string().refine(
      (data) => {
        if (enabledSections.includes(DynamicFormSection.ONE) === false) {
          return true;
        }

        return data && data.length > 0;
      },
      { message: 'Required' },
    ),
  }));
  const section2Schema = zodUtils.schemaForType<DynamicFormSection2FormData>()(zod.object({
    lastName: zod.string().refine(
      (data) => {
        if (enabledSections.includes(DynamicFormSection.TWO) === false) {
          return true;
        }

        return data && data.length > 0;
      },
      { message: 'Required' },
    ),
  }));

  return zodUtils.schemaForType<DynamicFormSectionsFormData>()(zod.object({
    ...section1Schema.shape,
    ...section2Schema.shape,
  }));
};

export const DYNAMIC_FORM_SECTIONS_CONTEXT_KEY = 'dynamic-form-sections-context';

export type DynamicFormSectionsContext = {
  formData: FormDataWritables<DynamicFormSectionsFormData>;
  formErrors: FormErrorsWritables<DynamicFormSectionsFormData>;
};

export const dynamicFormSectionsComponentUtils = { buildFormValidationSchema };
