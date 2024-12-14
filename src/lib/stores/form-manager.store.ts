// test cases to build:
// - with on blur validation, once validation has been done once, validate should run on change / input
// - touch tracking works when validating the entire form
// - touch tracking works when validating a particular field
// - has validated tracking works when validating the entire form
// - has validated works when validating a particular field
// - dirty tracking works when changing the value
// - dirty tracking works when change the value back to the original value (no longer shows as dirty)

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// there are numerous locations where we are doing explicit casting and such which related to:
//
// - the fact that is seems like Node element is typed in a way they should not be
// - to account for the fact that we are modifying data without really knowing the exact type since this is generic
//
// while there might be a better way to handle these things that I am not aware of with typescript, the casting seems
// like the sanest solution for the time being and this can be refactored later if other pattern are learned
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputType, domUtils } from '$lib/utils/dom';
import { loggerUtils } from '$lib/utils/logger';
import { zodUtils } from '$lib/utils/zod';
import { get, writable, type Writable } from 'svelte/store';
import { type ZodRawShape, type ZodObject } from 'zod';
import * as _ from 'lodash-es';
import { stringUtils } from '$lib/utils/string';
import deepEqual from 'fast-deep-equal';
import { objectUtils } from '$lib/utils/object';

type FormGeneralError = {
  message?: string;
  sourceError?: any;
};

export type WithFormFieldErrors = {
  errors: string[];
};

export type FormFieldError = {
  [key: number]: FormFieldError | undefined;
  [key: string]: FormFieldError | undefined;

  // @ts-expect-error to support objects we need the above [key: string] how that means this throws as error that
  // it is not a FormFieldError which is expected
  errors: string[];
};

export type FormFieldErrors<TFormData> = {
  [K in keyof TFormData]?: FormFieldError;
};

type ValidateReturns<TFormData> = {
  isValid: boolean;
  errors?: FormFieldErrors<TFormData>;
};

type ZodFormatterErrors = { _errors: string[]; [key: string]: any };

const parseError = (
  fieldFormattedErrors: ZodFormatterErrors['_errors'],
  currentErrors?: FormFieldError,
): FormFieldError | undefined => {
  let newFormat: FormFieldError | undefined;

  if (fieldFormattedErrors.length > 0) {
    // @ts-expect-error see FormFieldError type for explination of the expected error
    newFormat = {
      ...(currentErrors || {}),
      errors: fieldFormattedErrors,
    };
  }

  return newFormat;
};

const parseErrors = <TFormData>(
  formattedErrors: ZodFormatterErrors,
  parentPath: string = '',
): FormFieldErrors<TFormData> => {
  const newFormat: FormFieldErrors<TFormData> = {};
  const keys = Object.keys(formattedErrors);

  keys.forEach((key) => {
    if (key === '_errors') {
      return;
    }

    const fieldFormattedErrors = formattedErrors[key]._errors;
    const nestedKeys = Object.keys(formattedErrors[key]);
    const key2 = key as keyof TFormData;

    if (nestedKeys.length > 1) {
      const value = parseErrors<TFormData>(formattedErrors[key], `${parentPath}${key}.`);

      if (Object.keys(value).length > 0 || nestedKeys.includes('_errors')) {
        newFormat[key2] = {
          ...value,
          errors: fieldFormattedErrors,
        };
      }
    }

    const formFieldError = parseError(fieldFormattedErrors, newFormat[key2]);

    if (formFieldError) {
      newFormat[key2] = {
        ...formFieldError,
        errors: fieldFormattedErrors,
      };
    }
  });

  // avoid weird typescript error
  return newFormat;
};

export const internalValidate = <TFormData, TSchemaObject extends ZodRawShape>(
  schema: ZodObject<TSchemaObject>,
  data: TFormData,
): ValidateReturns<TFormData> => {
  const validationResults = schema.safeParse(data);

  if (validationResults.success) {
    return { isValid: true };
  }

  // for some reason even though the type this returns as should work, typescript does not seem to like it so
  // forcing the type to avoid incorrect typescript errors
  const formattedErrors = validationResults.error.format() as ZodFormatterErrors;
  const formFieldErrors = parseErrors<TFormData>(formattedErrors);

  return {
    isValid: false,
    errors: formFieldErrors,
  };
};

type ValidatePropertyReturns = {
  isValid: boolean;
  error?: FormFieldError;
};

export const internalValidateProperty = <TFormData, TSchemaObject extends ZodRawShape>(
  schema: ZodObject<TSchemaObject>,
  data: TFormData,
  propertyName: keyof TFormData,
): ValidatePropertyReturns => {
  const value = _.get(data, propertyName);
  const validationResults = zodUtils.getNestedSchema(propertyName as string, schema.shape).safeParse(value);

  if (validationResults.success) {
    return { isValid: true };
  }

  const formattedErrors = validationResults?.error.format() as { _errors: string[]; [key: string]: any };

  return {
    isValid: false,
    // @ts-expect-error see FormFieldError type for explination of the expected error
    error: { errors: formattedErrors._errors },
  };
};

export type FormErrorsObject<TFormData> = {
  [key in keyof TFormData]: FormFieldError | undefined;
};

export type FormManagerUtils<TFormData, TSchemaObject extends ZodRawShape> = {
  updateDefaultData: (newDefaultData: TFormData) => void;
  updateValidationSchema: (newValidationSchema: ZodObject<TSchemaObject>) => void;
  submit: () => Promise<void>;
  validate: () => Promise<boolean>;
  validateProperty: (propertyName: keyof TFormData) => Promise<boolean>;
  setValidationSchema: (newValidationSchema: ZodObject<TSchemaObject>) => void;
  getFormData: () => TFormData;
  getFormErrors: () => FormErrorsObject<TFormData>;
  clearFormErrors: () => void;
};

export type FormDataWritables<TFormData> = {
  [key in keyof TFormData]: Writable<TFormData[key]>;
};

export type FormErrorsWritables<TFormData> = {
  [key in keyof TFormData]: Writable<FormFieldError | undefined>;
};

export type FormManagerStore<TFormData, TSchemaObject extends ZodRawShape> = {
  formData: FormDataWritables<TFormData>;
  isTouched: Writable<string[]>;
  isDirty: Writable<string[]>;
  hasValidated: Writable<string[]>;
  isSubmitting: Writable<boolean>;
  formErrors: FormErrorsWritables<TFormData>;
  formAction: (element: HTMLFormElement) => void;
  formManagerUtils: FormManagerUtils<TFormData, TSchemaObject>;

  // this is for any error that might happen outside of the validation process like the validation itself
  // failing to work of the submit itself failing to work
  generalError?: Writable<FormGeneralError | undefined>;
};

export enum FormValidationMode {
  BLUR = 'blur',
  CHANGE = 'change',
}

export type CreateFormManagerStoreOptions<TFormData, TSchemaObject extends ZodRawShape> = {
  defaultData: TFormData;
  validationSchema?: ZodObject<TSchemaObject>;
  validationMode?: FormValidationMode;
  onSubmit: (formData: TFormData) => Promise<void>;
  onValueChange?: (formData: TFormData) => void;
};

export const createFormManagerStore = <TFormData extends object, TSchemaObject extends ZodRawShape>(
  options: CreateFormManagerStoreOptions<TFormData, TSchemaObject>,
): FormManagerStore<TFormData, TSchemaObject> => {
  let defaultData = options.defaultData;
  let validationSchema = options.validationSchema;
  const validationMode = options.validationMode || FormValidationMode.CHANGE;
  const formData: FormDataWritables<TFormData> = Object.keys(defaultData).reduce<FormDataWritables<TFormData>>(
    (collector, key) => {
      // since a form value can be an array or object, we need to deep clone it to prevent modifying the store
      // causing mutation to the default data
      collector[key as keyof TFormData] = writable(structuredClone(defaultData[key as keyof TFormData]));

      return collector;
    },
    {} as FormDataWritables<TFormData>,
  );
  const isTouched: Writable<string[]> = writable([]);
  const isDirty: Writable<string[]> = writable([]);
  const hasValidated: Writable<string[]> = writable([]);
  const formErrors: FormErrorsWritables<TFormData> = Object.keys(defaultData).reduce<FormErrorsWritables<TFormData>>(
    (collector, key) => {
      collector[key as keyof TFormData] = writable<FormFieldError | undefined>(undefined);

      return collector;
    },
    {} as FormErrorsWritables<TFormData>,
  );

  const formElement: Writable<HTMLFormElement | undefined> = writable(undefined);
  const isSubmitting = writable<boolean>(false);
  const generalError: Writable<FormGeneralError | undefined> = writable(undefined);

  const updateDefaultData = (newDefaultData: TFormData) => {
    defaultData = newDefaultData;
  };

  const updateValidationSchema = (newValidationSchema: ZodObject<TSchemaObject>) => {
    validationSchema = newValidationSchema;
  };

  const getFormData = (): TFormData => {
    const newFormDataObject = Object.keys(formData).reduce<TFormData>((collector, key) => {
      collector[key as keyof TFormData] = get(formData[key as keyof TFormData]);

      return collector;
    }, {} as TFormData);

    return newFormDataObject;
  };

  const getFormErrors = (): FormErrorsObject<TFormData> => {
    return Object.keys(formErrors).reduce<FormErrorsObject<TFormData>>((collector, key) => {
      collector[key as keyof TFormData] = get(formErrors[key as keyof TFormData]);

      return collector;
    }, {} as FormErrorsObject<TFormData>);
  };

  const clearFormErrors = () => {
    Object.keys(formErrors).forEach((key) => {
      formErrors[key as keyof TFormData].set(undefined);
    });
  };

  const submit = async () => {
    const isValid = await validate();

    if (isValid === false) {
      return;
    }

    isSubmitting.set(true);
    clearFormErrors();
    generalError.set(undefined);

    try {
      await options.onSubmit(getFormData());
    } catch (error) {
      generalError.set({
        message: error instanceof Error ? error.message : undefined,
        sourceError: error,
      });

      return;
    }

    isSubmitting.set(false);

    return;
  };

  const validate = async () => {
    if (!validationSchema) {
      return true;
    }

    clearFormErrors();
    generalError.set(undefined);

    const formData = getFormData();
    let validationResults: ValidateReturns<TFormData> | undefined;
    const allKeys: string[] = [];

    objectUtils.collectKeysForValue(formData, allKeys);

    // since we are validating the entire form, we should mark all fields as touched and validated
    isTouched.set(allKeys);
    hasValidated.set(allKeys);

    try {
      validationResults = internalValidate(validationSchema, formData);

      if (validationResults?.isValid) {
        return true;
      }

      Object.keys(validationResults?.errors || {}).forEach((key) => {
        formErrors[key as keyof TFormData].set(validationResults?.errors?.[key as keyof TFormData] as FormFieldError);
      });

      return false;
    } catch (error) {
      generalError.set({
        message: error instanceof Error ? error.message : undefined,
        sourceError: error,
      });

      return false;
    }
  };

  const validateProperty = async (propertyName: keyof TFormData) => {
    const [propertyFirstPart, restOfPath] = stringUtils.splitOnceWithAll(propertyName.toString(), '.');

    if (!validationSchema) {
      return true;
    }

    hasValidated.update((currentValidated) => [...new Set([...currentValidated, propertyName.toString()])]);

    try {
      const validationResults = internalValidateProperty(validationSchema, getFormData(), propertyName);

      if (validationResults.isValid === false) {
        formErrors[propertyFirstPart as keyof TFormData].update((currentError) => {
          if (restOfPath) {
            return _.set(structuredClone(currentError || {}), restOfPath, validationResults.error) as FormFieldError;
          }

          // this still could be a nested object and we are just validated somewhere up in the nested so still need
          // to reference the current error
          return Object.assign(structuredClone(currentError || {}), validationResults.error) as FormFieldError;
        });

        return false;
      }

      formErrors[propertyFirstPart as keyof TFormData].update((currentError) => {
        if (!currentError || !restOfPath) {
          return;
        }

        _.unset(currentError, restOfPath);

        return currentError;
      });

      return true;
    } catch (error) {
      loggerUtils.error(error);

      generalError.set({
        message: error instanceof Error ? error.message : undefined,
        sourceError: error,
      });

      return false;
    }
  };

  const setValidationSchema = (newValidationSchema: ZodObject<TSchemaObject>) => {
    validationSchema = newValidationSchema;
    clearFormErrors();
  };

  const updateTouched = (propertyName: string) => {
    if (get(isTouched).includes(propertyName)) {
      return;
    }

    isTouched.update((currentTouched) => [...new Set([...currentTouched, propertyName])]);
  };

  const updateDirty = (propertyPath: string) => {
    const [firstPart, resetOfPath] = stringUtils.splitOnceWithAll(propertyPath.toString(), '.');
    const propertyName = firstPart as keyof TFormData;
    const currentValue = resetOfPath ? _.get(get(formData[propertyName]), resetOfPath) : get(formData[propertyName]);
    const originalValue = resetOfPath ? _.get(defaultData[propertyName], resetOfPath) : defaultData[propertyName];
    const propertyIsDirty = deepEqual(currentValue, originalValue) === false;

    if (!propertyIsDirty) {
      isDirty.update((currentDirty) => currentDirty.filter((item) => item !== propertyPath));

      return;
    }

    isDirty.update((currentDirty) => [...new Set([...currentDirty, propertyPath])]);
  };

  const formAction = (element: HTMLFormElement) => {
    const onBlur = (event: Event) => {
      const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const skipBlur = inputElement.dataset.skipBlur !== undefined;

      // some of the more complex input may need to disable the validation on blur so this accounts for that
      if (skipBlur) {
        return;
      }

      const propertyName = inputElement.name as keyof TFormData;

      updateTouched(propertyName as string);

      if (validationMode === FormValidationMode.BLUR || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName);
      }
    };

    const onTextChange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const propertyName = inputElement.name as keyof TFormData;

      updateDirty(propertyName as string);
      updateTouched(propertyName as string);

      if (validationMode === FormValidationMode.CHANGE || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName);
      }
    };

    const onTextInput = (event: Event) => {
      const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const skipInputEvent = inputElement.dataset.skipInputEvent !== undefined;

      // let this event to be skipped for custom input components (like combobox)
      if (skipInputEvent) {
        return;
      }

      const propertyName = inputElement.name as keyof TFormData;

      updateDirty(propertyName as string);
      updateTouched(propertyName as string);

      if (validationMode === FormValidationMode.CHANGE || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName);
      }
    };

    const onCheckboxChange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement;
      const propertyName = inputElement.name;
      const checked = inputElement.checked;
      const value = inputElement.value;
      const [topLevelProperty, nestedProperty] = stringUtils.splitOnceWithAll<keyof TFormData>(propertyName, '.');
      const topLevelValue = get(formData[topLevelProperty]);
      let currentValue = !nestedProperty
        ? (topLevelValue as string[])
        : (_.get(topLevelValue, nestedProperty) as string[]);

      if (checked) {
        currentValue = [...new Set([...currentValue, value])];
      } else {
        currentValue = currentValue.filter((item) => item !== value);
      }

      formData[topLevelProperty].update((currentStore) => {
        if (!nestedProperty) {
          return currentValue as TFormData[keyof TFormData];
        }

        _.set(currentStore as Record<string, unknown>, nestedProperty, currentValue);

        return currentStore;
      });

      updateDirty(propertyName);
      updateTouched(propertyName);

      if (validationMode === FormValidationMode.CHANGE || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName as keyof TFormData);
      }
    };

    const onRadioChange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const propertyName = inputElement.name as keyof TFormData;

      updateDirty(propertyName as string);
      updateTouched(propertyName as string);

      if (validationMode === FormValidationMode.CHANGE || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName);
      }
    };

    const onSelectChange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const propertyName = inputElement.name as keyof TFormData;

      updateDirty(propertyName as string);
      updateTouched(propertyName as string);

      if (validationMode === FormValidationMode.CHANGE || get(hasValidated).includes(propertyName.toString())) {
        validateProperty(propertyName);
      }
    };

    const getAllInputElements = (element: HTMLFormElement): Element[] => {
      const inputElements = element.querySelectorAll('input');
      const textareaElements = element.querySelectorAll('textarea');
      const selectElements = element.querySelectorAll('select');

      return [...Array.from(inputElements), ...Array.from(textareaElements), ...Array.from(selectElements)];
    };

    const assignFormInputEventHandlers = (element: Element) => {
      // @todo event to add if we move forward with this
      const inputType = domUtils.getInputType(element);

      if (inputType === InputType.CHECKBOX) {
        element.addEventListener('change', onCheckboxChange);

        return;
      }

      if (inputType === InputType.RADIO) {
        element.addEventListener('change', onRadioChange);

        return;
      }

      if (inputType === InputType.SELECT) {
        element.addEventListener('change', onSelectChange);

        return;
      }

      element.addEventListener('input', onTextInput);
      element.addEventListener('change', onTextChange);
      element.addEventListener('blur', onBlur);
    };

    const checkForInputElements = (mutation: MutationRecord) => {
      Array.from(mutation.addedNodes).some((node) => {
        const formInputElements = domUtils.getFormInputElementsRecursive(node as Element);

        for (const inputElement of formInputElements) {
          assignFormInputEventHandlers(inputElement);
        }
      });
    };

    const domMutationHandler = (mutationList: MutationRecord[]) => {
      for (const mutation of mutationList) {
        checkForInputElements(mutation);
      }
    };

    const inputElements = getAllInputElements(element);

    for (const inputElement of inputElements) {
      assignFormInputEventHandlers(inputElement);
    }

    formElement.set(element);

    element.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      submit();
    });

    // this is to handle any new input elements that might be added to the form after the initial setup
    const domObserver = new MutationObserver(domMutationHandler);

    domObserver.observe(element, {
      childList: true,
      subtree: true,
    });
  };

  const formManagerUtils: FormManagerUtils<TFormData, TSchemaObject> = {
    updateDefaultData,
    updateValidationSchema,
    submit,
    validate,
    validateProperty,
    setValidationSchema,
    getFormData,
    getFormErrors,
    clearFormErrors,
  };

  return {
    formData,
    isTouched,
    isDirty,
    hasValidated,
    isSubmitting,
    formErrors,
    formAction,
    formManagerUtils,
  };
};
