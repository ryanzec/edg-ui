<script lang="ts" module>
  export type FormData = {
    userRoles: UserRoleComboboxOption[];
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(zod.object({ userRoles: zod.array(userRoleSelectSchema).min(2, 'Required') }));

  export type FormDataSchema = typeof formDataSchema.shape;
</script>

<script lang="ts">
  import { userDataUtils, userRoleSelectSchema, type UserRoleComboboxOption } from '$lib/data-models/user';
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';

  let userRoleOptions = userDataUtils.getRolesAsComboboxOptions();

  let submittedData: FormData | undefined = $state(undefined);
  const {
    formAction,
    formErrors: { userRoles: userRolesError },
    formData: { userRoles },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { userRoles: [] },
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
      <FormField data-id="combobox-multiple" error={$userRolesError}>
        <Combobox isMultiple name="userRoles" label="Auto complete" options={userRoleOptions} selected={userRoles} />
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
