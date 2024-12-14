<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  export let meltSeparator: AnyMeltElement;
</script>

<div data-id="separator" use:melt={$meltSeparator} class="m-1 h-[1px] bg-outline"></div>
