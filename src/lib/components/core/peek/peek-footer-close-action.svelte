<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  interface Props {
    meltClose: AnyMeltElement;
    title?: string;
  }

  let { meltClose, title = 'Cancel' }: Props = $props();
</script>

<button data-id="close-action" type="button" use:melt={$meltClose}>
  {title}
</button>
