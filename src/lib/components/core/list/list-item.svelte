<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { IconName } from '$lib/components/core/icons/utils';

  export type ListItemProps = HTMLAttributes<HTMLLIElement> & {
    children: import('svelte').Snippet;
    preIcon?: IconName;
  };
</script>

<script lang="ts">
  import Icon from '$lib/components/core/icons/icon.svelte';
  import { tailwindUtils } from '$lib/utils/tailwind';

  let { children, preIcon, class: extraClass = '', ...rest }: ListItemProps = $props();
</script>

<li
  class={tailwindUtils.merge(
    'gap-xs px-xs py-2xs bg-surface-pure border-outline flex items-center border-t first:border-0',
    extraClass,
  )}
  {...rest}
>
  {#if preIcon}<Icon icon={preIcon} />{/if}
  {@render children()}
</li>
