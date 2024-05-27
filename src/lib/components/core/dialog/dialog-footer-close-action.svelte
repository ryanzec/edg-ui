<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  export let meltClose: AnyMeltElement;
  export let title: string = 'Cancel';
</script>

<button data-id="close-action" type="button" use:melt={$meltClose}>
  {title}
</button>
