<script lang="ts">
  import { clickOutsideAction } from '$lib/actions/click-outside-action';
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import { type WithGet } from '@melt-ui/svelte/internal/helpers';
  import { type Writable } from 'svelte/store';

  type Props = {
    meltTrigger: AnyMeltElement;
    class?: string;
    isOpened: WithGet<Writable<boolean>>;
    children?: import('svelte').Snippet;
  };

  let { meltTrigger, class: extraClass = '', children, isOpened }: Props = $props();

  const handleClickOutside = () => {
    // while melt-ui is supposed to close the drop down on clicking outside of one, when you open a drop down
    // with another already opened, it is not close the first one so this is basically a hack to work around that
    // issue
    $isOpened = false;
  };
</script>

<div
  use:melt={$meltTrigger}
  use:clickOutsideAction={{ callback: handleClickOutside }}
  data-id="trigger"
  class="inline-block {extraClass}"
>
  {@render children?.()}
  <span class="sr-only">Open Popover</span>
</div>
