<script module lang="ts">
  export type CheckboxValue = boolean | 'indeterminate';

  export type CheckboxProps = HTMLAttributes<HTMLInputElement> & {
    checked: boolean;
    name: string;
    id?: string;
    value: string;
    label?: string;
    showLabel?: boolean;
    indeterminate?: boolean;
  };
</script>

<script lang="ts">
  import { stringUtils } from '$lib/utils/string';
  import Icon, { IconSize, IconColor } from '$lib/components/core/icons/icon.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    checked = $bindable(),
    name,
    id = name,
    value,
    label = value,
    showLabel = true,
    indeterminate = false,
    ...rest
  }: CheckboxProps = $props();
</script>

<label data-id="checkbox" class="gap-2xs flex cursor-pointer items-center" for={id} id="{value}-label">
  <span class="h-lg w-lg">
    {#if indeterminate}
      <Icon icon="square-minus" size={IconSize.FULL} color={IconColor.BRAND} />
    {:else if checked}
      <Icon icon="square-check" size={IconSize.FULL} color={IconColor.BRAND} />
    {:else}
      <Icon icon="square" size={IconSize.FULL} />
    {/if}
  </span>
  <input {id} {name} type="checkbox" {value} bind:checked class="hidden appearance-none" {...rest} />
  {#if showLabel}
    {stringUtils.toTitleCase(label)}
  {/if}
</label>
