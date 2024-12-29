<script module lang="ts">
  import type { Readable, Writable } from 'svelte/store';
  import { type DropDownItemProps } from '$lib/components/core/drop-down/drop-down-item.svelte';

  type DropDownRadioItemProps = DropDownItemProps & {
    isChecked: Readable<(option: string) => boolean>;
    option: string;
    closeOnClick?: boolean;
    value: Writable<string>;
    children?: import('svelte').Snippet;
    rightContent?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  import DropDownItem from '$lib/components/core/drop-down/drop-down-item.svelte';
  import Icon from '$lib/components/core/icons/icon.svelte';

  let {
    isChecked,
    option,
    closeOnClick = false,
    value,
    children,
    rightContent,
    ...rest
  }: DropDownRadioItemProps = $props();

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

<DropDownItem data-id="radio-item" onclick={handleClick} {...rest}>
  {#snippet leftContent()}
    <div>
      {#if $isChecked(option)}
        <Icon icon="circle-check" />
      {:else}
        <Icon icon="circle" />
      {/if}
    </div>
  {/snippet}
  {@render children?.()}{#snippet rightContent()}
    {@render rightContent_render?.()}
  {/snippet}
</DropDownItem>
