<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  export let meltTrigger: AnyMeltElement;

  let extraClass = '';
  export { extraClass as class };
</script>

<div data-id="trigger" class="inline-block {extraClass}" use:melt={$meltTrigger} aria-label="Update dimensions">
  <slot />
  <span class="sr-only">Open Popover</span>
</div>
