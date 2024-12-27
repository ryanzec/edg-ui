<script lang="ts" module>
  export type FormData = { checkbox: string[] };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ checkbox: zod.array(zod.string()).min(1, 'Required') }),
  );

  export type FormDataSchema = typeof formDataSchema.shape;
</script>

<script lang="ts">
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Fieldset from '$lib/components/core/form/fieldset.svelte';
  import Legend from '$lib/components/core/form/legend.svelte';
  import Checkbox from '$lib/components/core/form/checkbox.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: { checkbox: checkboxError },
    formData: { checkbox },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { checkbox: [] },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });

  let checkboxOptions: string[] = ['one', 'two'];
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <FormFields>
      <FormField data-id="checkbox-group" error={$checkboxError}>
        <Fieldset>
          <Legend>Checkbox</Legend>
          {#each checkboxOptions as checkboxOption}
            <Checkbox
              id="checkbox-{checkboxOption}"
              name="checkbox"
              value={checkboxOption}
              checked={$checkbox.includes(checkboxOption)}
              label={checkboxOption}
            />
          {/each}
        </Fieldset>
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manual testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
