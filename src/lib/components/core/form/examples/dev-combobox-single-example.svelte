<script lang="ts" context="module">
  export type FormData = {
    userRole: UserRoleComboboxOption[];
  };

  export const formDataSchema = zodUtils.schemaForType<FormData>()(
    zod.object({ userRole: zod.array(userRoleSelectSchema).min(1, 'Required') }),
  );

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

  let submittedData: FormData | undefined = undefined;
  const {
    formAction,
    formErrors: { userRole: userRoleError },
    formData: { userRole },
  } = createFormManagerStore<FormData, typeof formDataSchema.shape>({
    defaultData: { userRole: [] },
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
      <FormField data-id="combobox-single" error={$userRoleError}>
        <Combobox name="userRole" label="Auto complete" options={userRoleOptions} selected={userRole} />
      </FormField>
    </FormFields>
    <button type="submit">Submit</button>
  </form>
  <!-- for manaul testing -->
  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
  <!-- for automated testing -->
  <pre data-id="submitted-data" class="hidden">{JSON.stringify(submittedData)}</pre>
</div>
