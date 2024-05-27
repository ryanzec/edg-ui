<script lang="ts">
  import type { Writable } from 'svelte/store';
  import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
  import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';

  // @todo need to figure out if there is a proper way to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let item: any;
  export let checked: Writable<boolean>;
  export let closeOnClick: boolean = false;

  // because the default behaviour for checkbox drop down elements includ setting the checked state, in order to
  // be able to make the drop down not close on click, we need to manually apply that functionality
  const onClick = (event: CustomEvent<MouseEvent>) => {
    if (closeOnClick) {
      return;
    }

    event.detail.preventDefault();
    checked.set(!$checked);
  };
</script>

<DropDownItem data-id="checkbox-item" meltItem={item} on:click={onClick}>
  <div slot="leftContent">
    {#if $checked}
      <SquareCheckIcon class="size-4" />
    {:else}
      <SquareIcon class="size-4" />
    {/if}
  </div>
  <slot /><slot name="rightContent" slot="rightContent" />
</DropDownItem>
