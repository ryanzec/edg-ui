<script context="module" lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
  import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';

  export let checked: boolean;
  export let name: string;
  export let id: string = name;
  export let value: string;
  export let label: string = value;
</script>

<label data-id="checkbox" class="flex cursor-pointer items-center" for={id} id="{value}-label">
  <div class="mr-1">
    {#if checked}
      <SquareCheckIcon />
    {:else}
      <SquareIcon />
    {/if}
  </div>
  <input {id} {name} type="checkbox" {value} bind:checked class="appearance-none" />
  {stringUtils.toTitleCase(label)}
</label>
