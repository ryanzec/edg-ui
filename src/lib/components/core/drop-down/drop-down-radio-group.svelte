<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Readable, Writable } from 'svelte/store';
  import DropDownRadioItem from '$lib/components/core/drop-down/drop-down-radio-item.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // @todo need to figure out if there is a proper way to type this

  type Props = HTMLAttributes<HTMLDivElement> & {
    meltRadioGroup: AnyMeltElement;

    meltRadioItem: any;
    isChecked: Readable<(option: string) => boolean>;
    options: string[];
    value: Writable<string>;
  };

  let { meltRadioGroup, meltRadioItem, isChecked, options, value, ...rest }: Props = $props();
</script>

<div data-id="radio-group" use:melt={$meltRadioGroup} class="flex flex-col" {...rest}>
  {#each options as option}
    <DropDownRadioItem meltItem={$meltRadioItem({ value: option })} {isChecked} {option} {value}
      >{option}</DropDownRadioItem
    >
  {/each}
</div>
