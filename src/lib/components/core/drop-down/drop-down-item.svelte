<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import { createEventDispatcher } from 'svelte';

  type CustomerEvents = {
    click: MouseEvent;
  };

  const dispatchEvent = createEventDispatcher<CustomerEvents>();

  // @todo need to figure out if there is a proper way to type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let meltItem: any;
  export let isDisabled: boolean = false;
  export let closeOnClick: boolean = true;

  let selfElement: HTMLElement;

  const onClick = (event: MouseEvent) => {
    if (closeOnClick === false) {
      event.preventDefault();
    }

    // while this is a native event, we are simulating it is order to allow prevent of close the drop down on item
    // click to be configurable
    dispatchEvent('click', event);
  };
  $: {
    if (!selfElement) {
      break $;
    }

    if (isDisabled) {
      selfElement.dataset.disabled = '';
    } else {
      delete selfElement.dataset.disabled;
    }
  }
</script>

<button
  data-id="item"
  use:melt={meltItem}
  bind:this={selfElement}
  class="data-[disabled]:text-neutral-300 z-40 flex min-h-[24px] select-none items-center rounded-sm px-2 text-sm leading-none outline-none ring-0 data-[highlighted]:bg-neutral-subtle"
  on:m-click={onClick}
  {...$$restProps}
  type="button"
>
  {#if $$slots.rightContent}<div class="mr-1"><slot name="leftContent" /></div>{/if}
  <slot />
  {#if $$slots.rightContent}<div class="ml-auto"><slot name="rightContent" /></div>{/if}
</button>
