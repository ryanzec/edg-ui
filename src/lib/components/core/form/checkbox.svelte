<script module lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
  import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';
  import SquareMinusIcon from '$lib/components/core/icons/square-minus-icon.svelte';

  type Props = {
    checked: boolean;
    name: string;
    id?: string;
    value: string;
    label?: string;
    indeterminate?: boolean;
  };

  let { checked = $bindable(), name, id = name, value, label = value, indeterminate = false }: Props = $props();
</script>

<label data-id="checkbox" class="gap-2xs flex cursor-pointer items-center" for={id} id="{value}-label">
  <span class="h-xl w-xl">
    {#if indeterminate}
      <SquareMinusIcon class="h-xl text-brand w-xl" />
    {:else if checked}
      <SquareCheckIcon class="h-xl text-brand w-xl" />
    {:else}
      <SquareIcon class="h-xl w-xl" />
    {/if}
  </span>
  <input {id} {name} type="checkbox" {value} bind:checked class="hidden appearance-none" />
  {stringUtils.toTitleCase(label)}
</label>
