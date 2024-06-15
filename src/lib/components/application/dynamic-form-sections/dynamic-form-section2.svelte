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
    formData: { lastName },
    formErrors: { lastName: lastNameError },
  } = getContext<DynamicFormSectionsContext>(DYNAMIC_FORM_SECTIONS_CONTEXT_KEY);
</script>

<FormField error={$lastNameError}>
  <Label for="lastName">Last Name</Label>
  <TextInput bind:value={$lastName} name="lastName" />
</FormField>
