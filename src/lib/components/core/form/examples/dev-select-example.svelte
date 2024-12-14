<script lang="ts" module>
  export type FormData = {
    select: string;
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ select: zod.string().min(1, 'Required') }),
  );

  export type FormDataSchema = typeof formDataSchema.shape;
</script>

<script lang="ts">
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import type { SelectOption } from '$lib/components/core/form/select.svelte';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Select from '$lib/components/core/form/select.svelte';
  import SelectLabel from '$lib/components/core/form/select-label.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let selectOptions: SelectOption[] = [
    {
      value: 'one',
      display: 'One',
    },
    {
      value: 'two',
      display: 'Two',
    },
  ];

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: { select: selectError },
    formData: { select },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { select: '' },
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
      <FormField data-id="select" error={$selectError}>
        <Select name="select" defaultDisplay="Select..." options={selectOptions} bind:value={$select}>
          {#snippet label()}
                    <SelectLabel >Select</SelectLabel>
                  {/snippet}
        </Select>
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
