<script lang="ts" context="module">
  export type SelectOption = {
    value: string;
    display: string;
  };
</script>

<script lang="ts">
  export let options: SelectOption[];
  export let defaultDisplay: 'Select...';
  export let name: string;
  export let value: string;
  export let id: string = name;
</script>

<slot name="label" />

<!-- setting the selected for the option works around a ssr issue with sveltekit -->
<!-- https://github.com/sveltejs/svelte/issues/7160 -->
<select bind:value {name} {id} class="p-2">
  {#if defaultDisplay}
    <option value selected={!value}>{defaultDisplay}</option>
  {/if}
  {#each options as option}
    <option value={option.value} selected={option.value === value}>
      {option.display}
    </option>
  {/each}
</select>
