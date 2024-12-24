<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // @todo need to figure out if there is a proper way to type this

  type Props = HTMLAttributes<HTMLButtonElement> & {
    meltItem: any;
    disabled?: boolean;
    closeOnClick?: boolean;
    onclick?: (event: MouseEvent) => void;
    rightContent?: import('svelte').Snippet;
    leftContent?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  };

  let {
    meltItem,
    disabled = false,
    closeOnClick = true,
    onclick,
    rightContent,
    leftContent,
    children,
    ...rest
  }: Props = $props();

  const handleClick = (event: MouseEvent) => {
    if (closeOnClick === false) {
      event.preventDefault();
    }

    // while this is a native event, we are simulating it is order to allow prevent of close the drop down on item
    // click to be configurable
    onclick?.(event);
  };
</script>

<button
  data-id="item"
  use:melt={meltItem}
  class="data-highlighted:bg-neutral-subtle z-drop-down px-xs flex min-h-[24px] items-center text-sm leading-none ring-0 outline-hidden select-none"
  class:opacity-disabled={disabled}
  onm-click={handleClick}
  {...rest}
  type="button"
  {disabled}
>
  {#if rightContent}<div class="mr-2xs">{@render leftContent?.()}</div>{/if}
  {@render children?.()}
  {#if rightContent}<div class="ml-auto">{@render rightContent?.()}</div>{/if}
</button>
