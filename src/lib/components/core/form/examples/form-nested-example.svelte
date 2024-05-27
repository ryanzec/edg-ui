<script lang="ts" context="module">
  export type Complex = {
    firstName: string;
    lastName: string;
  };
  export type FormData = {
    complexArray: (Complex & {
      simpleArray: string[];
    })[];
  };

  export const complexSchema = zod.object({
    firstName: zod.string().min(1, 'Required'),
    lastName: zod.string(),
  });

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({
      complexArray: zod
        .array(
          zod.object({
            ...complexSchema.shape,
            simpleArray: zod.array(zod.string().min(1, 'Required')).min(1, 'Required'),
          }),
        )
        .min(1, 'Required'),
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
  import Legend from '$lib/components/core/form/legend.svelte';
  import Button from '$lib/components/core/button/button.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let submittedData: FormData | undefined = undefined;
  const {
    formAction,
    formErrors: { complexArray: complexArrayError },
    formData: { complexArray },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { complexArray: [] },
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
      <Legend>Complex Array</Legend>
      <FormField data-id="nested-container" error={$complexArrayError}>
        <Button
          data-id="add-object-value-trigger"
          class="self-start"
          on:click={() =>
            complexArray.update((data) => {
              return [
                ...data,
                {
                  firstName: '',
                  lastName: '',
                  simpleArray: [],
                },
              ];
            })}
        >
          Add
        </Button>
        {#each $complexArray as _, index}
          <FormField data-id="object-value-{index}" error={$complexArrayError?.[index]}>
            <Legend>Complex {index + 1}</Legend>
            <FormField data-id="first-name" error={$complexArrayError?.[index]?.firstName}>
              <Label for="complexArray.{index}.firstName">First Name</Label>
              <TextInput bind:value={$complexArray[index].firstName} name="complexArray.{index}.firstName" />
            </FormField>
            <FormField data-id="last-name" error={$complexArrayError?.[index]?.lastName}>
              <Label for="complexArray.{index}.lastName">Last Name</Label>
              <TextInput bind:value={$complexArray[index].lastName} name="complexArray.{index}.lastName" />
            </FormField>
            <FormField data-id="array-container" error={$complexArrayError?.[index]?.simpleArray}>
              <Button
                data-id="add-array-value-trigger"
                class="self-start"
                on:click={() =>
                  complexArray.update((data) => {
                    const selfItem = data.slice(index, index + 1)[0];

                    selfItem.simpleArray = [...selfItem.simpleArray, ''];

                    data.splice(index, 1, selfItem);

                    return data;
                  })}>Add</Button
              >
              {#each $complexArray[index].simpleArray as _, arrayIndex}
                <FormField
                  data-id="array-value-{arrayIndex}"
                  error={$complexArrayError?.[index]?.simpleArray?.[arrayIndex]}
                >
                  <Label for="complexArray.{index}.simpleArray.{arrayIndex}">Text</Label>
                  <TextInput
                    bind:value={$complexArray[index].simpleArray[arrayIndex]}
                    name="complexArray.{index}.simpleArray.{arrayIndex}"
                  />
                </FormField>
              {/each}
            </FormField>
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
