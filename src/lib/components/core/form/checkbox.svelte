<script module lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
  import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';

  type Props = {
    checked: boolean;
    name: string;
    id?: string;
    value: string;
    label?: string;
  };

  let { checked = $bindable(), name, id = name, value, label = value }: Props = $props();
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
