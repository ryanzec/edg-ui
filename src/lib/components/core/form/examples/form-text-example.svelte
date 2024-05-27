<script lang="ts" context="module">
  export type FormData = {
    text: string;
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({
      text: zod
        .string()
        .min(1, 'Required')
        .refine(
          (data) => {
            return data === 'test';
          },
          { message: "must be 'test'" },
        ),
    }),
  );

  export type FormDataSchema = typeof formDataSchema.shape;
</script>

<script lang="ts">
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = undefined;
  const {
    formAction,
    formErrors: { text: textError },
    formData: { text },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { text: '' },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <FormFields>
      <FormField data-id="text" error={$textError}>
        <Label for="text">Text</Label>
        <TextInput bind:value={$text} name="text" />
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
