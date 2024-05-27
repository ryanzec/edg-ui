<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import XIcon from '../icons/x-icon.svelte';

  export let meltTitle: AnyMeltElement;
  export let meltClose: AnyMeltElement;
  export let title: string;
</script>

<h2 data-id="header" use:melt={$meltTitle} class="flex justify-between">
  {title}
  <button use:melt={$meltClose} aria-label="close">
    <XIcon class="size-4" />
  </button>
</h2>
