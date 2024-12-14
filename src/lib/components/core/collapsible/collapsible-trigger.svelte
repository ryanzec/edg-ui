<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  type Props = {
    meltTrigger: AnyMeltElement;
    children?: import('svelte').Snippet;
  };

  let { meltTrigger, children }: Props = $props();
</script>

<button data-id="collapsible-trigger" type="button" use:melt={$meltTrigger} aria-label="Toggle"
  >{@render children?.()}</button
>
