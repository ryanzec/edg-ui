<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { Readable, Writable } from 'svelte/store';
  import type { HTMLAttributes } from 'svelte/elements';

  export type DropDownRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
    meltRadioGroup: AnyMeltElement;
    // @todo need to figure out if there is a proper way to type this
    meltRadioItem: any;
    isChecked: Readable<(option: string) => boolean>;
    options: string[];
    value: Writable<string>;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import DropDownRadioItem from '$lib/components/core/drop-down/drop-down-radio-item.svelte';

  let { meltRadioGroup, meltRadioItem, isChecked, options, value, ...rest }: DropDownRadioGroupProps = $props();
</script>

<div data-id="radio-group" use:melt={$meltRadioGroup} class="flex flex-col" {...rest}>
  {#each options as option}
    <DropDownRadioItem meltItem={$meltRadioItem({ value: option })} {isChecked} {option} {value}
      >{option}</DropDownRadioItem
    >
  {/each}
</div>
