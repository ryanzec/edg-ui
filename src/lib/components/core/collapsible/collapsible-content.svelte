<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import { tailwindUtils } from '$lib/utils/tailwind';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    meltRoot: AnyMeltElement;
    meltContent: AnyMeltElement;
    isOpened: Writable<boolean>;
    children?: import('svelte').Snippet;
    class?: string;
  };

  let { meltRoot, meltContent, isOpened, children, class: extraClass = '', ...rest }: Props = $props();
</script>

<div data-id="collapsible-content" use:melt={$meltRoot} class={tailwindUtils.merge('relative', extraClass)} {...rest}>
  {#if $isOpened}
    <div use:melt={$meltContent}>
      {@render children?.()}
    </div>
  {/if}
</div>
