<script module lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import type { Writable } from 'svelte/store';
  import type { HTMLAttributes } from 'svelte/elements';

  export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement> & {
    meltRoot: AnyMeltElement;
    meltContent: AnyMeltElement;
    isOpened: Writable<boolean>;
    children?: import('svelte').Snippet;
    class?: string;
  };
</script>

<script lang="ts">
  import { melt } from '@melt-ui/svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  let {
    meltRoot,
    meltContent,
    isOpened,
    children,
    class: extraClass = '',
    ...rest
  }: CollapsibleContentProps = $props();
</script>

<div data-id="collapsible-content" use:melt={$meltRoot} class={tailwindUtils.merge('relative', extraClass)} {...rest}>
  {#if $isOpened}
    <div use:melt={$meltContent}>
      {@render children?.()}
    </div>
  {/if}
</div>
