<script lang="ts" module>
  export type FormData = { radio: string };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ radio: zod.string().min(1, 'Required') }),
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
  import Radio from '$lib/components/core/form/radio.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: { radio: radioError },
    formData: { radio },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { radio: '' },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });

  let radioOptions: string[] = ['one', 'two'];
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <FormFields>
      <FormField data-id="radio-group" error={$radioError}>
        <Fieldset>
          <Legend>Radio</Legend>
          {#each radioOptions as radioOption}
            <Radio bind:group={$radio} name="radio" id="radio-{radioOption}" value={radioOption} />
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
