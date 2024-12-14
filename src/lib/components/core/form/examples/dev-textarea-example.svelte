<script lang="ts" module>
  export type FormData = { textarea: string };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({
      textarea: zod
        .string()
        .min(1, 'Required')
        .refine(
          (data) => {
            return isNaN(Number(data)) === false;
          },
          { message: 'must be numeric' },
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
  import Textarea from '$lib/components/core/form/textarea.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: { textarea: textareaError },
    formData: { textarea },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { textarea: '' },
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
      <FormField data-id="textarea" error={$textareaError}>
        <Label for="textarea">Textarea</Label>
        <Textarea bind:value={$textarea} name="textarea" />
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
