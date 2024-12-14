<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';


  interface Props {
    meltTrigger: AnyMeltElement;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { meltTrigger, class: extraClass = '', children }: Props = $props();
  
</script>

<div data-id="trigger" class="inline-block {extraClass}" use:melt={$meltTrigger} aria-label="Update dimensions">
  {@render children?.()}
  <span class="sr-only">Open Popover</span>
</div>
