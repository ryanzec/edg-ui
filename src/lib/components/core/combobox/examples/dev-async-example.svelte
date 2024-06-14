<script lang="ts">
  import { usersApi } from '$lib/api/users';
  import Combobox from '$lib/components/core/combobox/combobox.svelte';
  import type { User, UserComboboxOption } from '$lib/data-models/user';
  import { writable } from 'svelte/store';

  const getOptions = async () => {
    const response = await usersApi.getList();

    if (!response.data) {
      return [];
    }

    return response.data.map((user: User) => {
      return {
        display: `${user.firstName} ${user.lastName}`,
        value: user.id,
        meta: user,
      };
    });
  };

  const selected = writable<UserComboboxOption[]>([]);
</script>

<Combobox name="value" label="async" {selected} {getOptions} />
<!-- for manaul testing -->
<pre>{JSON.stringify($selected, null, 2)}</pre>
<!-- for automated testing -->
<pre data-id="selected-value" class="hidden">{JSON.stringify($selected)}</pre>
