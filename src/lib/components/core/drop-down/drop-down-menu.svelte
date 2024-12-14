<script module lang="ts">
  export enum DropDownMenuType {
    MAIN = 'main',
    SUB = 'sub',
  }
</script>

<script lang="ts">
  import { melt, type AnyMeltElement } from '@melt-ui/svelte';
  import { fly, type FlyParams } from 'svelte/transition';
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';

  interface Props {
    meltMenu: AnyMeltElement;
    isOpened: WithGet<Writable<boolean>>;
    type?: DropDownMenuType;
    flyOptions?: FlyParams;
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    meltMenu,
    isOpened,
    type = DropDownMenuType.MAIN,
    flyOptions = {
    duration: 150,
    y: -10,
  },
    children,
    ...rest
  }: Props = $props();
</script>

{#if $isOpened}
  <div
    data-id="menu"
    class="z-40 flex min-w-[220px] flex-col rounded-md border border-outline bg-surface-pure shadow ring-0"
    class:shadow-lg={type === DropDownMenuType.MAIN}
    class:shadow-md={type === DropDownMenuType.SUB}
    use:melt={$meltMenu}
    transition:fly={flyOptions}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
