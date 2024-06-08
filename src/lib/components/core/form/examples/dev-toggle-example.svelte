<script lang="ts" context="module">
  export type FormData = {
    toggle: string[];
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ toggle: zod.array(zod.string()).min(1, 'Required') }),
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
  import { stringUtils } from '$lib/utils/string';
  import FormFields from '$lib/components/core/form/form-fields.svelte';
  import Toggle from '$lib/components/core/form/toggle.svelte';

  let submittedData: FormData | undefined = undefined;
  const {
    formAction,
    formErrors: { toggle: toggleError },
    formData: { toggle },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { toggle: [] },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });

  let toggleOptions: string[] = ['one', 'two'];
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <FormFields>
      <FormField data-id="toggle-group" error={$toggleError}>
        <Fieldset>
          <Legend>Checkbox</Legend>
          {#each toggleOptions as option}
            <Toggle id="toggle-{option}" name="toggle" value={option} checked={$toggle.includes(option)}>
              {stringUtils.toTitleCase(option)}
            </Toggle>
          {/each}
        </Fieldset>
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
