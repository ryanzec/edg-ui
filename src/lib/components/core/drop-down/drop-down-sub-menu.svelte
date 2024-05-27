<script lang="ts">
  import { type AnyMeltElement } from '@melt-ui/svelte';
  import DropDownMenu, { DropDownMenuType } from '$lib/components/core/drop-down/drop-down-menu.svelte';
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';

  export let subMenu: AnyMeltElement;
  export let isOpened: WithGet<Writable<boolean>>;
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
  <slot />
</DropDownMenu>
