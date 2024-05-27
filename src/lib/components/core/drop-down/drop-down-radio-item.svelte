<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import CircleIcon from '../icons/circle-icon.svelte';
  import CircleCheckIcon from '../icons/circle-check-icon.svelte';

  // @todo need to figure out if there is a proper way to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let item: any;
  export let isChecked: Readable<(option: string) => boolean>;
  export let option: string;
  export let closeOnClick: boolean = false;
  export let value: Writable<string>;

  // because the default behaviour for radio drop down elements include setting the checked state, in order to
  // be able to make the drop down not close on click, we need to manually apply that functionality
  const onClick = (event: CustomEvent<MouseEvent>) => {
    if (closeOnClick) {
      return;
    }

    const element = event.detail.target as HTMLElement;
    const dataValue = element.dataset.value;

    if (!dataValue) {
      return;
    }

    event.detail.preventDefault();
    value.set(dataValue);
  };
</script>

<DropDownItem data-id="radio-item" meltItem={item} on:click={onClick}>
  <div slot="leftContent">
    {#if $isChecked(option)}
      <CircleCheckIcon class="size-4" />
    {:else}
      <CircleIcon class="size-4" />
    {/if}
  </div>
  <slot /><slot name="rightContent" slot="rightContent" />
</DropDownItem>
