<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import XIcon from '../icons/x-icon.svelte';

  type Props = {
    meltTitle: AnyMeltElement;
    meltClose: AnyMeltElement;
    title: string;
  };

  let { meltTitle, meltClose, title }: Props = $props();
</script>

<h2 data-id="header" use:melt={$meltTitle} class="flex justify-between">
  {title}
  <button use:melt={$meltClose} aria-label="close">
    <XIcon class="size-base" />
  </button>
</h2>
