<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import CircleCheckIcon from '$lib/components/core/icons/circle-check-icon.svelte';
  import CircleIcon from '$lib/components/core/icons/circle-icon.svelte';

  export let group: string;
  export let name: string;
  export let id: string = name;
  export let value: string;
</script>

<label class="flex items-center" for={id} id="{value}-label">
  <div class="pr-1">
    {#if group === value}
      <CircleCheckIcon />
    {:else}
      <CircleIcon />
    {/if}
  </div>
  <input bind:group {id} {name} type="radio" {value} class="appearance-none" />
  {stringUtils.toTitleCase(value)}
</label>
