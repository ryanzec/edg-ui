<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Readable, Writable } from 'svelte/store';
  import DropDownRadioItem from '$lib/components/core/drop-down/drop-down-radio-item.svelte';

  export let meltRadioGroup: AnyMeltElement;
  // @todo need to figure out if there is a proper way to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let meltRadioItem: any;
  export let isChecked: Readable<(option: string) => boolean>;
  export let options: string[];
  export let value: Writable<string>;
</script>

<div data-id="radio-group" use:melt={$meltRadioGroup} class="flex flex-col">
  {#each options as option}
    <DropDownRadioItem item={$meltRadioItem({ value: option })} {isChecked} {option} {value}>{option}</DropDownRadioItem
    >
  {/each}
</div>
