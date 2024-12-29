<script lang="ts" module>
  export type SelectOption = {
    value: string;
    display: string;
  };
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLSelectElement> & {
    options: SelectOption[];
    defaultDisplay?: string;
    name: string;
    value: string;
    id?: string;
    label?: import('svelte').Snippet;
  };

  let { options, defaultDisplay = 'Select...', name, value = $bindable(), id = name, label, ...rest }: Props = $props();
</script>

{@render label?.()}

<!-- setting the selected for the option works around a ssr issue with sveltekit -->
<!-- https://github.com/sveltejs/svelte/issues/7160 -->
<select
  bind:value
  {name}
  {id}
  class="border-outline bg-input-background hover:border-outline-active focus:border-outline-active px-xs py-2xs rounded-sm border outline-hidden"
  {...rest}
>
  {#if defaultDisplay}
    <option value selected={!value}>{defaultDisplay}</option>
  {/if}
  {#each options as option}
    <option value={option.value} selected={option.value === value}>
      {option.display}
    </option>
  {/each}
</select>
