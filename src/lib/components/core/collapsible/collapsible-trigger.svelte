<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import { tailwindUtils } from '$lib/utils/tailwind.js';

  type Props = {
    meltTrigger: AnyMeltElement;
    children?: import('svelte').Snippet;
    class?: string;
  };

  let { meltTrigger, children, class: extraClass = '' }: Props = $props();
</script>

<button
  data-id="collapsible-trigger"
  type="button"
  use:melt={$meltTrigger}
  aria-label="Toggle"
  class={tailwindUtils.merge('cursor-pointer', extraClass)}
>
  {@render children?.()}
</button>
