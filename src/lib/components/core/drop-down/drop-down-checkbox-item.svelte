<script module lang="ts">
  import type { Writable } from 'svelte/store';
  import { type DropDownItemProps } from '$lib/components/core/drop-down/drop-down-item.svelte';

  export type DropDownCheckboxItemProps = DropDownItemProps & {
    checked: Writable<boolean>;
    closeOnClick?: boolean;
    children?: import('svelte').Snippet;
    rightContent?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  import Icon from '$lib/components/core/icons/icon.svelte';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';

  let { checked, closeOnClick = false, children, rightContent, ...rest }: DropDownCheckboxItemProps = $props();

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

<DropDownItem data-id="checkbox-item" onclick={handleClick} {...rest}>
  {#snippet leftContent()}
    <div>
      {#if $checked}
        <Icon icon="square-check" />
      {:else}
        <Icon icon="square" />
      {/if}
    </div>
  {/snippet}
  {@render children?.()}{#snippet rightContent()}
    {@render rightContent_render?.()}
  {/snippet}
</DropDownItem>
