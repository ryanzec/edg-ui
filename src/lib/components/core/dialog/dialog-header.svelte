<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import XIcon from '$lib/components/core/icons/x-icon.svelte';

  type Props = {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };

  let { meltTitle, meltClose, title }: Props = $props();
</script>

<div data-id="header" class="flex items-center">
  <h2 use:melt={$meltTitle} class="m-0 text-lg font-medium">
    {title}
  </h2>
  <button use:melt={$meltClose} aria-label="close" class="ml-auto">
    <XIcon class="size-4" />
  </button>
</div>
