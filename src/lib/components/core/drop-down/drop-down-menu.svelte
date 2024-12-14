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

  export let meltMenu: AnyMeltElement;
  export let isOpened: WithGet<Writable<boolean>>;
  export let type: DropDownMenuType = DropDownMenuType.MAIN;
  export let flyOptions: FlyParams = {
    duration: 150,
    y: -10,
  };
</script>

{#if $isOpened}
  <div
    data-id="menu"
    class="z-40 flex min-w-[220px] flex-col rounded-md border border-outline bg-surface-pure shadow ring-0"
    class:shadow-lg={type === DropDownMenuType.MAIN}
    class:shadow-md={type === DropDownMenuType.SUB}
    use:melt={$meltMenu}
    transition:fly={flyOptions}
    {...$$restProps}
  >
    <slot />
  </div>
{/if}
