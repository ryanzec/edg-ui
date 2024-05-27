<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  export let meltTrigger: AnyMeltElement;
</script>

<button data-id="collapsible-trigger" type="button" use:melt={$meltTrigger} aria-label="Toggle"><slot /></button>
