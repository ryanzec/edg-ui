<script lang="ts">
  import DropDownMenu, {
    DropDownMenuType,
    type DropDownMenuProps,
  } from '$lib/components/core/drop-down/drop-down-menu.svelte';
  import { type Writable } from 'svelte/store';
  import type { WithGet } from '@melt-ui/svelte/internal/helpers';

  type Props = DropDownMenuProps & {
    isOpened: WithGet<Writable<boolean>>;
    children?: import('svelte').Snippet;
  };

  let { isOpened, children, ...rest }: Props = $props();
</script>

<DropDownMenu data-id="sub-menu" type={DropDownMenuType.SUB} {isOpened} {...rest}>
  {@render children?.()}
</DropDownMenu>
