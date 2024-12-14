<script lang="ts">
  import type { Writable } from 'svelte/store';
  import SquareIcon from '$lib/components/core/icons/square-icon.svelte';
  import SquareCheckIcon from '$lib/components/core/icons/square-check-icon.svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';

  // @todo need to figure out if there is a proper way to type this

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    checked: Writable<boolean>;
    closeOnClick?: boolean;
    children?: import('svelte').Snippet;
    rightContent?: import('svelte').Snippet;
  }

  let { item, checked, closeOnClick = false, children, rightContent }: Props = $props();

  // because the default behaviour for checkbox drop down elements includ setting the checked state, in order to
  // be able to make the drop down not close on click, we need to manually apply that functionality
  const handleClick = (event: MouseEvent) => {
    if (closeOnClick) {
      return;
    }

    event.preventDefault();
    checked.set(!$checked);
  };

  const rightContent_render = $derived(rightContent);
</script>

<DropDownItem data-id="checkbox-item" meltItem={item} onclick={handleClick}>
  {#snippet leftContent()}
    <div>
      {#if $checked}
        <SquareCheckIcon class="size-4" />
      {:else}
        <SquareIcon class="size-4" />
      {/if}
    </div>
  {/snippet}
  {@render children?.()}{#snippet rightContent()}
    {@render rightContent_render?.()}
  {/snippet}
</DropDownItem>
