<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type CollapibleTriggerProps = HTMLAttributes<HTMLButtonElement> & {
    meltTrigger: AnyMeltElement;
    children?: import('svelte').Snippet;
    class?: string;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { meltTrigger, children, class: extraClass = '', ...rest }: CollapibleTriggerProps = $props();
</script>

<button
  data-id="collapsible-trigger"
  type="button"
  use:melt={$meltTrigger}
  aria-label="Toggle"
  class={tailwindUtils.merge('cursor-pointer', extraClass)}
  {...rest}
>
  {@render children?.()}
</button>
