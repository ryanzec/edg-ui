<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  type Props = { meltSeparator: AnyMeltElement };

  let { meltSeparator }: Props = $props();
</script>

<div data-id="separator" use:melt={$meltSeparator} class="bg-outline m-1 h-[1px]"></div>
