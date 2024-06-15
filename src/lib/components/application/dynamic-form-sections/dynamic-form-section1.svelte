<script lang="ts">
  import {
    DYNAMIC_FORM_SECTIONS_CONTEXT_KEY,
    type DynamicFormSectionsContext,
  } from '$lib/components/application/dynamic-form-sections/utils';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import { getContext } from 'svelte';

  const {
    formData: { firstName },
    formErrors: { firstName: firstNameError },
  } = getContext<DynamicFormSectionsContext>(DYNAMIC_FORM_SECTIONS_CONTEXT_KEY);
</script>

<FormField error={$firstNameError}>
  <Label for="firstName">First Name</Label>
  <TextInput bind:value={$firstName} name="firstName" />
</FormField>
