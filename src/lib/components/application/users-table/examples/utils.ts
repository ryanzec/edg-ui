import UsersTableSimpleExamples from '$lib/components/application/users-table/examples/users-table-simple-examples.svelte';
import { type DevNavigationItem } from '$lib/components/core/dev-navigation/dev-navigation.svelte';

export const usersTableExampleItems: DevNavigationItem = {
  display: 'Users Table',
  items: [
    {
      display: 'Simple',
      component: UsersTableSimpleExamples,
    },
  ],
};
