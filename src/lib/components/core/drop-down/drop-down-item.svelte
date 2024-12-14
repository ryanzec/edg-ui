<script lang="ts">
  import { run } from 'svelte/legacy';

  import { melt } from '@melt-ui/svelte';
  import { createEventDispatcher } from 'svelte';

  type CustomerEvents = {
    click: MouseEvent;
  };

  const dispatchEvent = createEventDispatcher<CustomerEvents>();

  // @todo need to figure out if there is a proper way to type this
  
  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meltItem: any;
    isDisabled?: boolean;
    closeOnClick?: boolean;
    rightContent?: import('svelte').Snippet;
    leftContent?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    meltItem,
    isDisabled = false,
    closeOnClick = true,
    rightContent,
    leftContent,
    children,
    ...rest
  }: Props = $props();

  let selfElement: HTMLElement = $state();

  const onClick = (event: MouseEvent) => {
    if (closeOnClick === false) {
      event.preventDefault();
    }

    // while this is a native event, we are simulating it is order to allow prevent of close the drop down on item
    // click to be configurable
    dispatchEvent('click', event);
  };
  run(() => {
    if (!selfElement) {
      return;
    }

    if (isDisabled) {
      selfElement.dataset.disabled = '';
    } else {
      delete selfElement.dataset.disabled;
    }
  });
</script>

<button
  data-id="item"
  use:melt={meltItem}
  bind:this={selfElement}
  class="data-[disabled]:text-neutral-300 z-40 flex min-h-[24px] select-none items-center rounded-sm px-2 text-sm leading-none outline-none ring-0 data-[highlighted]:bg-neutral-subtle"
  onm-click={onClick}
  {...rest}
  type="button"
>
  {#if rightContent}<div class="mr-1">{@render leftContent?.()}</div>{/if}
  {@render children?.()}
  {#if rightContent}<div class="ml-auto">{@render rightContent?.()}</div>{/if}
</button>
