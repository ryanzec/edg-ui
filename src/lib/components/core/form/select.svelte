<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';

  export type SelectOption = {
    value: string;
    display: string;
  };

  export type SelectProps = HTMLAttributes<HTMLSelectElement> & {
    options: SelectOption[];
    defaultDisplay?: string;
    name: string;
    value: string;
    id?: string;
    label?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  import { tailwindUtils } from '$lib/utils/tailwind';

  let {
    options,
    defaultDisplay = 'Select...',
    name,
    value = $bindable(),
    id = name,
    label,
    class: extraClass = '',
    ...rest
  }: SelectProps = $props();
</script>

{@render label?.()}

<!-- setting the selected for the option works around a ssr issue with sveltekit -->
<!-- https://github.com/sveltejs/svelte/issues/7160 -->
<select
  bind:value
  {name}
  {id}
  class={tailwindUtils.merge(
    'border-outline bg-input-background hover:border-outline-active focus:border-outline-active px-xs py-2xs rounded-sm border outline-hidden',
    extraClass,
  )}
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
