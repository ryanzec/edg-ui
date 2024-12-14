<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import CircleIcon from '../icons/circle-icon.svelte';
  import CircleCheckIcon from '../icons/circle-check-icon.svelte';

  // @todo need to figure out if there is a proper way to type this

  interface Props {
    item: any;
    isChecked: Readable<(option: string) => boolean>;
    option: string;
    closeOnClick?: boolean;
    value: Writable<string>;
    children?: import('svelte').Snippet;
    rightContent?: import('svelte').Snippet;
  }

  let { item, isChecked, option, closeOnClick = false, value, children, rightContent }: Props = $props();

  // because the default behaviour for radio drop down elements include setting the checked state, in order to
  // be able to make the drop down not close on click, we need to manually apply that functionality
  const handleClick = (event: MouseEvent) => {
    if (closeOnClick) {
      return;
    }

    const element = event.target as HTMLElement;
    const dataValue = element.dataset.value;

    if (!dataValue) {
      return;
    }

    event.preventDefault();
    value.set(dataValue);
  };

  const rightContent_render = $derived(rightContent);
</script>

<DropDownItem data-id="radio-item" meltItem={item} onclick={handleClick}>
  {#snippet leftContent()}
    <div>
      {#if $isChecked(option)}
        <CircleCheckIcon class="size-4" />
      {:else}
        <CircleIcon class="size-4" />
      {/if}
    </div>
  {/snippet}
  {@render children?.()}{#snippet rightContent()}
    {@render rightContent_render?.()}
  {/snippet}
</DropDownItem>
