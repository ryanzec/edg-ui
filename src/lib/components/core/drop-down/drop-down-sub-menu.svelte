<script lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import DropDownMenu, { DropDownMenuType } from '$lib/components/core/drop-down/drop-down-menu.svelte';
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';

  type Props = {
    subMenu: AnyMeltElement;
    isOpened: WithGet<Writable<boolean>>;
    children?: import('svelte').Snippet;
  };

  let { subMenu, isOpened, children }: Props = $props();
</script>

<DropDownMenu
  data-id="sub-menu"
  meltMenu={subMenu}
  type={DropDownMenuType.SUB}
  {isOpened}
  flyOptions={{
    x: -50,
    duration: 150,
  }}
>
  {@render children?.()}
</DropDownMenu>
