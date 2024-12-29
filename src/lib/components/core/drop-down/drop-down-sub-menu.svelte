<script module lang="ts">
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';

  export type DropDownSubMenuProps = DropDownMenuProps & {
    isOpened: WithGet<Writable<boolean>>;
    children?: import('svelte').Snippet;
  };
</script>

<script lang="ts">
  import DropDownMenu, {
    DropDownMenuType,
    type DropDownMenuProps,
  } from '$lib/components/core/drop-down/drop-down-menu.svelte';

  let { isOpened, children, ...rest }: DropDownSubMenuProps = $props();
</script>

<DropDownMenu data-id="sub-menu" type={DropDownMenuType.SUB} {isOpened} {...rest}>
  {@render children?.()}
</DropDownMenu>
