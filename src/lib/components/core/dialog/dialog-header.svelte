<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import XIcon from '$lib/components/core/icons/x-icon.svelte';

  export let meltTitle: AnyMeltElement;
  export let meltClose: AnyMeltElement;
  export let title: string;
</script>

<div data-id="header" class="flex items-center">
  <h2 use:melt={$meltTitle} class="m-0 text-lg font-medium">
    {title}
  </h2>
  <button use:melt={$meltClose} aria-label="close" class="ml-auto">
    <XIcon class="size-4" />
  </button>
</div>
