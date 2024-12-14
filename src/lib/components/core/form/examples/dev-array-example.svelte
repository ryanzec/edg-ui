<script lang="ts" module>
  export type FormData = {
    simpleArray: string[];
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(zod.object({ simpleArray: zod.array(zod.string().min(1, 'Required')).min(2, 'Required') }));

  export type FormDataSchema = typeof formDataSchema.shape;
</script>

<script lang="ts">
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import Legend from '$lib/components/core/form/legend.svelte';
  import Button from '$lib/components/core/button/button.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = $state(undefined);

  const {
    formAction,
    formErrors: { simpleArray: simpleArrayError },
    formData: { simpleArray },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { simpleArray: [] },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <Legend>Simple Array</Legend>
    <FormFields>
      <FormField data-id="array-container" error={$simpleArrayError}>
        <Button
          class="self-start"
          data-id="add-array-value-trigger"
          onclick={() => simpleArray.update((data) => {
            return [...data, ''];
          })}
        >
          Add
        </Button>
        {#each $simpleArray as _, index}
          <FormField data-id="array-value-{index}" error={$simpleArrayError?.[index]}>
            <Label for="simpleArray.{index}">Text {index + 1}</Label>
            <TextInput bind:value={$simpleArray[index]} name="simpleArray.{index}" />
          </FormField>
        {/each}
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
