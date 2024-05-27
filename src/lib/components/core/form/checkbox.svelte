<script context="module" lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
  export type OnChangeCheckboxArguments = { curr: CheckboxValue; next: CheckboxValue };
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import SquareIcon from '../icons/square-icon.svelte';
  import SquareCheckIcon from '../icons/square-check-icon.svelte';

  export let checked: boolean;
  export let name: string;
  export let id: string = name;
  export let value: string;
</script>

<label class="flex items-center" for={id} id="{value}-label">
  <div class="pr-1">
    {#if checked}
      <SquareCheckIcon />
    {:else}
      <SquareIcon />
    {/if}
  </div>
  <input {id} {name} type="checkbox" {value} {checked} class="appearance-none" />
  {stringUtils.toTitleCase(value)}
</label>
