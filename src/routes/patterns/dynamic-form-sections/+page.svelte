<script lang="ts">
  import DynamicFormSection1 from '$lib/components/application/dynamic-form-sections/dynamic-form-section1.svelte';
  import DynamicFormSection2 from '$lib/components/application/dynamic-form-sections/dynamic-form-section2.svelte';
  import {
    DYNAMIC_FORM_SECTIONS_CONTEXT_KEY,
    DynamicFormSection,
    dynamicFormSectionsComponentUtils,
    type DynamicFormSectionsContext,
    type DynamicFormSectionsFormData,
  } from '$lib/components/application/dynamic-form-sections/utils';
  import Button from '$lib/components/core/button/button.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';
  import Toggle from '$lib/components/core/form/toggle.svelte';
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { setContext } from 'svelte';

  let submittedData: DynamicFormSectionsFormData | undefined = $state(undefined);
  let toggledSection1: boolean = $state(false);
  let toggledSection2: boolean = $state(false);

  const validationSchema = dynamicFormSectionsComponentUtils.buildFormValidationSchema([]);
  const {
    formManagerUtils,
    formAction,
    formErrors: { firstName: firstNameError, lastName: lastNameError },
    formData: { firstName, lastName },
  } = createFormManagerStore<DynamicFormSectionsFormData, typeof validationSchema.shape>({
    defaultData: {
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (data: DynamicFormSectionsFormData) => {
      submittedData = data;
    },
  });

  setContext<DynamicFormSectionsContext>(DYNAMIC_FORM_SECTIONS_CONTEXT_KEY, {
    formData: {
      firstName,
      lastName,
    },
    formErrors: {
      firstName: firstNameError,
      lastName: lastNameError,
    },
  });

  // keep the form validation in sync with what form sections are enabled so we need the $effect
  $effect(() => {
    const enabledSections: DynamicFormSection[] = [];

    if (toggledSection1) {
      enabledSections.push(DynamicFormSection.ONE);
    }

    if (toggledSection2) {
      enabledSections.push(DynamicFormSection.TWO);
    }

    formManagerUtils.setValidationSchema(dynamicFormSectionsComponentUtils.buildFormValidationSchema(enabledSections));
  });
</script>

<Toggle bind:checked={toggledSection1} value="1" name="enabled-section1" label="Toggle Section One" />
<Toggle bind:checked={toggledSection2} value="2" name="enabled-section2" label="Toggle Section Two" />
<form use:formAction>
  <FormFields>
    {#if toggledSection1}<DynamicFormSection1 />{/if}
    {#if toggledSection2}<DynamicFormSection2 />{/if}
  </FormFields>
  <Button type="submit">Submit</Button>
</form>
<div><pre>{JSON.stringify(submittedData, null, 2)}</pre></div>
