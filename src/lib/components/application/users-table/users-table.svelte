<script lang="ts">
  import { QueryDataState, QueryFetchingState, createQueryManagerStore } from '$lib/stores/query-manager.store';
  import Button from '$lib/components/core/button/button.svelte';
  import { type User } from '$lib/data-models/user';
  import { usersApi } from '$lib/api/users';
  import UserForm from '$lib/components/application/user-form/user-form.svelte';
  import { onMount } from 'svelte';

  let selectedUser: User | undefined = undefined;

  const getUsersQuery = createQueryManagerStore({
    doInitialFetch: false,
    fetchQuery: async () => {
      return await usersApi.getList();
    },
  });

  let formIsVisible = false;

  const showForm = (user?: User) => {
    selectedUser = user;
    formIsVisible = true;
  };

  const hideForm = () => {
    selectedUser = undefined;
    formIsVisible = false;
  };

  const handleUserSaved = () => {
    hideForm();
    getUsersQuery.query();
  };

  onMount(() => {
    getUsersQuery.query();
  });

  $: users = $getUsersQuery.response?.data || [];
</script>

{#if $getUsersQuery.fetchingState === QueryFetchingState.INITIAL_LOADING || $getUsersQuery.dataState === QueryDataState.NOT_LOADED}
  <span data-id="loading-indicator">Loading...</span>
{:else}
  {#if $getUsersQuery.fetchingState === QueryFetchingState.PROCESSING}
    <span data-id="refetching-indicator">Refetching...</span>
  {/if}
  <table data-id="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr data-id="user">
          <td><button type="button" on:click={() => showForm(user)}>{user.firstName} {users[0]?.lastName}</button></td>
          <td>{user.email}</td>
          <td>{user.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Button data-id="refresh-trigger" on:click={() => getUsersQuery.query()}>Refresh</Button>
  <Button data-id="show-form-trigger" on:click={() => showForm()}>Show Form</Button>
  {#if formIsVisible}
    <UserForm onUserSaved={handleUserSaved} initialUser={selectedUser} />
  {/if}
{/if}
