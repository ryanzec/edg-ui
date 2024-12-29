<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  export type RadioProps = HTMLAttributes<HTMLInputElement> & {
    group: string;
    name: string;
    id?: string;
    value: string;
  };
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import Icon, { IconColor } from '$lib/components/core/icons/icon.svelte';

  let { group = $bindable(), name, id = name, value, ...rest }: RadioProps = $props();
</script>

<label class="flex items-center" for={id} id="{value}-label">
  <span class="pr-2xs">
    {#if group === value}
      <Icon icon="circle-dot" color={IconColor.BRAND} />
    {:else}
      <Icon icon="circle" />
    {/if}
  </span>
  <input bind:group {id} {name} type="radio" {value} class="appearance-none" {...rest} />
  {stringUtils.toTitleCase(value)}
</label>
