<script lang="ts">
  import { usersApi } from '$lib/api/users';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import { UserRole, type User, type UserComboboxOption } from '$lib/data-models/user';
  import { writable } from 'svelte/store';

  const user: User = {
    id: '1',
    firstName: 'Test',
    lastName: 'Admin1',
    email: 'admin1@localhost',
    role: UserRole.ADMIN,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    deletedAt: '2021-01-01T00:00:00.000Z',
  };
  const staticOptions: UserComboboxOption[] = [
    {
      display: 'Option 1',
      value: user,
    },
    {
      display: 'Option 2',
      value: user,
    },
    {
      display: 'Option 3',
      value: user,
    },
  ];

  const getGroupedOptions = async () => {
    const response = await usersApi.getList();

    if (!response.data) {
      return { Static: staticOptions, Dynamic: [] };
    }

    return {
      Static: staticOptions,
      Dynamic: response.data.map((user: User) => {
        return {
          display: `${user.firstName} ${user.lastName}`,
          value: user,
        };
      }),
    };
  };

  const selected = writable<UserComboboxOption[]>([]);
</script>

<Combobox name="value" label="async" {selected} {getGroupedOptions} />
<!-- for manaul testing -->
<pre>{JSON.stringify($selected, null, 2)}</pre>
<!-- for automated testing -->
<pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
