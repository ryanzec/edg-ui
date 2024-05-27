<script lang="ts" context="module">
  export type Complex = {
    firstName: string;
    lastName: string;
    checkbox: string[];
    radio: string;
  };
  export type FormData = {
    complex: Complex;
  };

  export const complexSchema = zod.object({
    firstName: zod.string().min(1, 'Required'),
    lastName: zod.string(),
    checkbox: zod.array(zod.string()).min(1, 'Required'),
    radio: zod.string().min(1, 'Required'),
  });

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ complex: zod.object(complexSchema.shape) }),
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
  import Legend from '$lib/components/core/form/legend.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';
  import Fieldset from '$lib/components/core/form/fieldset.svelte';
  import Checkbox from '$lib/components/core/form/checkbox.svelte';
  import { stringUtils } from '$lib/utils/string';
  import Radio from '$lib/components/core/form/radio.svelte';

  let submittedData: FormData | undefined = undefined;
  const {
    formAction,
    formErrors: { complex: complexError },
    formData: { complex },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: {
      complex: {
        firstName: '',
        lastName: '',
        checkbox: [],
        radio: '',
      },
    },
    validationSchema: formDataSchema,
    onSubmit: async (data: FormData) => {
      submittedData = data;
    },
  });
  let checkboxOptions: string[] = ['one', 'two'];
  let radioOptions: string[] = ['one', 'two'];
</script>

<div>
  <h1>Forms</h1>
  <form use:formAction>
    <FormFields>
      <FormField data-id="object" error={$complexError}>
        <Legend>Complex</Legend>
        <FormField data-id="first-name" error={$complexError?.firstName}>
          <Label id="first-name" for="complex.firstName">First Name</Label>
          <TextInput bind:value={$complex.firstName} name="complex.firstName" />
        </FormField>
        <FormField data-id="last-name" error={$complexError?.lastName}>
          <Label for="complex.lastName">Last Name</Label>
          <TextInput bind:value={$complex.lastName} name="complex.lastName" />
        </FormField>
        <FormField data-id="checkbox" error={$complexError?.checkbox}>
          <Fieldset>
            <Legend>Checkbox</Legend>
            {#each checkboxOptions as checkboxOption}
              <Checkbox
                id="checkbox-{checkboxOption}"
                name="complex.checkbox"
                value={checkboxOption}
                checked={$complex.checkbox.includes(checkboxOption)}
              >
                {stringUtils.toTitleCase(checkboxOption)}
              </Checkbox>
            {/each}
          </Fieldset>
        </FormField>
        <FormField data-id="radio" error={$complexError?.radio}>
          <Fieldset>
            <Legend>Radio</Legend>
            {#each radioOptions as radioOption}
              <Radio bind:group={$complex.radio} name="complex.radio" id="radio-{radioOption}" value={radioOption} />
            {/each}
          </Fieldset>
        </FormField>
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
