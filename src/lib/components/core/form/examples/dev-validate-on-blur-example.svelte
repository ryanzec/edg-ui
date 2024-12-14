<script lang="ts" module>
  export type Complex = {
    firstName: string;
    lastName: string;
  };
  export type FormData = {
    text: string;
    checkbox: string[];
    radio: string;
    textarea: string;
    select: string;
    userRole: UserRoleComboboxOption[];
    userRoles: UserRoleComboboxOption[];
    simpleArray: string[];
    complex: Complex;
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
      text: zod
        .string()
        .min(1, 'Required')
        .refine(
          (data) => {
            return data === 'test';
          },
          { message: "must be 'test'" },
        ),
      checkbox: zod.array(zod.string()).min(1, 'Required'),
      radio: zod.string().min(1, 'Required'),
      textarea: zod.string().refine(
        (data) => {
          return isNaN(Number(data)) === false;
        },
        { message: 'must be numeric' },
      ),
      select: zod.string().min(1, 'Required'),
      userRole: zod.array(userRoleSelectSchema).min(1, 'Required'),
      userRoles: zod.array(userRoleSelectSchema).min(2, 'Required'),
      simpleArray: zod.array(zod.string().min(1, 'Required')).min(1, 'Required'),
      complex: zod.object(complexSchema.shape),
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
  import { userDataUtils, userRoleSelectSchema, type UserRoleComboboxOption } from '$lib/data-models/user';
  import { FormValidationMode, createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import type { SelectOption } from '$lib/components/core/form/select.svelte';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import Fieldset from '$lib/components/core/form/fieldset.svelte';
  import Legend from '$lib/components/core/form/legend.svelte';
  import Checkbox from '$lib/components/core/form/checkbox.svelte';
  import Select from '$lib/components/core/form/select.svelte';
  import Textarea from '$lib/components/core/form/textarea.svelte';
  import SelectLabel from '$lib/components/core/form/select-label.svelte';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import Button from '$lib/components/core/button/button.svelte';
  import Radio from '$lib/components/core/form/radio.svelte';
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
  let userRoleOptions = userDataUtils.getRolesAsComboboxOptions();

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: {
      text: textError,
      checkbox: checkboxError,
      radio: radioError,
      textarea: textareaError,
      select: selectError,
      userRole: userRoleError,
      userRoles: userRolesError,
      simpleArray: simpleArrayError,
      complex: complexError,
      complexArray: complexArrayError,
    },
    formData: { text, checkbox, radio, textarea, select, userRole, userRoles, simpleArray, complex, complexArray },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    validationMode: FormValidationMode.BLUR,
    defaultData: {
      text: '',
      checkbox: [],
      radio: '',
      textarea: '',
      select: '',
      userRole: [],
      userRoles: [],
      simpleArray: [],
      complexArray: [],
      complex: {
        firstName: '',
        lastName: '',
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
      <FormField data-id="text" error={$textError}>
        <Label for="text">Text</Label>
        <TextInput bind:value={$text} name="text" />
      </FormField>
      <FormField data-id="checkbox" error={$checkboxError}>
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
      <FormField data-id="radio" error={$radioError}>
        <Fieldset>
          <Legend>Radio</Legend>
          {#each radioOptions as radioOption}
            <Radio bind:group={$radio} name="radio" id="radio-{radioOption}" value={radioOption} />
          {/each}
        </Fieldset>
      </FormField>
      <FormField data-id="textarea" error={$textareaError}>
        <Label for="textarea">Textarea</Label>
        <Textarea bind:value={$textarea} name="textarea" />
      </FormField>
      <FormField data-id="select" error={$selectError}>
        <Select name="select" defaultDisplay="Select..." options={selectOptions} bind:value={$select}>
          {#snippet label()}
            <SelectLabel>Select</SelectLabel>
          {/snippet}
        </Select>
      </FormField>
      <FormField data-id="combobox-single" error={$userRoleError}>
        <Combobox name="userRole" label="Auto complete" options={userRoleOptions} selected={userRole} />
      </FormField>
      <FormField data-id="combobox-multiple" error={$userRolesError}>
        <Combobox isMultiple name="userRoles" label="Auto complete" options={userRoleOptions} selected={userRoles} />
      </FormField>
      <Legend>Simple Array</Legend>
      <FormField data-id="array-container" error={$simpleArrayError}>
        <Button
          data-id="add-array-value-trigger"
          class="self-start"
          on:click={() =>
            simpleArray.update((data) => {
              return [...data, ''];
            })}>Add</Button
        >
        {#each $simpleArray as _, index}
          <FormField data-id="array-value-{index}" error={$simpleArrayError?.[index]}>
            <Label for="simpleArray.{index}">Text {index + 1}</Label>
            <TextInput bind:value={$simpleArray[index]} name="simpleArray.{index}" />
          </FormField>
        {/each}
      </FormField>
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
      </FormField>
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
            })}>Add</Button
        >
        {#each $complexArray as _, index}
          <FormField error={$complexArrayError?.[index]}>
            <Legend>Complex {index + 1}</Legend>
            <FormField data-id="first-name-{index}" error={$complexArrayError?.[index]?.firstName}>
              <Label for="complexArray.{index}.firstName">First Name</Label>
              <TextInput bind:value={$complexArray[index].firstName} name="complexArray.{index}.firstName" />
            </FormField>
            <FormField data-id="last-name-{index}" error={$complexArrayError?.[index]?.lastName}>
              <Label for="complexArray.{index}.lastName">Last Name</Label>
              <TextInput bind:value={$complexArray[index].lastName} name="complexArray.{index}.lastName" />
            </FormField>
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
                data-id="array-value-{index}-{arrayIndex}"
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
