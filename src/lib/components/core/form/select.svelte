<script lang="ts" module>
  export type SelectOption = {
    value: string;
    display: string;
  };
</script>

<script lang="ts">
  interface Props {
    options: SelectOption[];
    defaultDisplay: 'Select...';
    name: string;
    value: string;
    id?: string;
    label?: import('svelte').Snippet;
  }

  let {
    options,
    defaultDisplay,
    name,
    value = $bindable(),
    id = name,
    label
  }: Props = $props();
</script>

{@render label?.()}

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
