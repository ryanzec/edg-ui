<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';

  type Props = {
    meltTrigger: AnyMeltElement;
    children?: import('svelte').Snippet;
    class?: string;
  };

  let { meltTrigger, children, class: extraClass = '' }: Props = $props();
</script>

<button data-id="collapsible-trigger" type="button" use:melt={$meltTrigger} aria-label="Toggle" class={extraClass}>
  {@render children?.()}
</button>
