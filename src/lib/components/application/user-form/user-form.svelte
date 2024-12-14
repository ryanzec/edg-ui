<script module lang="ts">
  export type UserFormData = {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoleComboboxOption[];
  };
</script>

<script lang="ts">
  import { run } from 'svelte/legacy';

  import { usersApi } from '$lib/api/users';
  import type { ResponseStructure } from '$lib/api/utils';

  import Button from '$lib/components/core/button/button.svelte';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import FormField from '$lib/components/core/form/form-field.svelte';
  import FormFields from '$lib/components/core/form/form-fields.svelte';
  import Label from '$lib/components/core/form/label.svelte';
  import TextInput from '$lib/components/core/form/text-input.svelte';
  import {
    UserRole,
    userDataUtils,
    userRoleZodSchema,
    type CreateUserRequest,
    type UpdateUserRequest,
    type User,
    type UserRoleComboboxOption,
  } from '$lib/data-models/user';
  import { createFormManagerStore } from '$lib/stores/form-manager.store';
  import { MutateFetchingState, createMutateManagerStore } from '$lib/stores/mutate-manager.store';
  import { zodUtils } from '$lib/utils/zod';
  import * as zod from 'zod';

  interface Props {
    initialUser?: Pick<User, 'firstName' | 'lastName' | 'email' | 'role' | 'id'> | undefined;
    formIsProcessing?: boolean;
    onUserSaved?: ((user: User) => void) | undefined;
  }

  let { initialUser = undefined, formIsProcessing = $bindable(false), onUserSaved = undefined }: Props = $props();

  const createUserMutation = createMutateManagerStore({
    mutateQuery: async (input: CreateUserRequest) => {
      return await usersApi.create(input);
    },
    onSuccess: (response: ResponseStructure<User>) => {
      if (!response?.data) {
        // todo(logging) this should never happen
        return;
      }

      onUserSaved?.(response.data);
    },
  });

  const updateUserMutation = createMutateManagerStore({
    mutateQuery: async (input: UpdateUserRequest) => {
      return await usersApi.update(input);
    },
    onSuccess: (response: ResponseStructure<User>) => {
      if (!response?.data) {
        // todo(logging) this should never happen
        return;
      }

      onUserSaved?.(response.data);
    },
  });

  const userFormDataSchema = zodUtils.schemaForType<UserFormData>()(
    zod.object({
      firstName: zod.string().min(1, 'Required'),
      lastName: zod.string().min(1, 'Required'),
      email: zod.string().min(1, 'Required'),
      role: zod.array(userRoleZodSchema).min(1, 'Required'),
    }),
  );

  const userRoleOptions = userDataUtils.getRolesAsComboboxOptions();

  const {
    formAction,
    formErrors: { firstName: firstNameError, lastName: lastNameError, email: emailError, role: roleError },
    formData: { firstName, lastName, email, role },
  } = createFormManagerStore<UserFormData, typeof userFormDataSchema.shape>({
    defaultData: {
      firstName: initialUser?.firstName || '',
      lastName: initialUser?.firstName || '',
      email: initialUser?.firstName || '',
      role: [],
    },
    validationSchema: userFormDataSchema,
    onSubmit: async (data: UserFormData) => {
      const requestData: CreateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role[0]?.value as UserRole,
      };

      if (initialUser?.id) {
        await updateUserMutation.mutate({
          id: initialUser.id,
          ...requestData,
        });
      } else {
        await createUserMutation.mutate(requestData);
      }
    },
  });

  run(() => {
    formIsProcessing =
      $createUserMutation.fetchingState === MutateFetchingState.PROCESSING ||
      $updateUserMutation.fetchingState === MutateFetchingState.PROCESSING;
  });
</script>

<form use:formAction>
  <FormFields>
    <FormField error={$firstNameError}>
      <Label for="firstName">First Name</Label>
      <TextInput bind:value={$firstName} name="firstName" />
    </FormField>
    <FormField error={$lastNameError}>
      <Label for="lastName">Last Name</Label>
      <TextInput bind:value={$lastName} name="lastName" />
    </FormField>
    <FormField error={$emailError}>
      <Label for="email">Email</Label>
      <TextInput bind:value={$email} name="email" />
    </FormField>
    <FormField error={$roleError}>
      <Combobox name="role" label="Role" options={userRoleOptions} selected={role} />
    </FormField>
  </FormFields>
  <Button type="submit" disabled={formIsProcessing}>Submit</Button>
</form>
