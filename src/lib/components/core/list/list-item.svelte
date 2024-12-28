<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Icon from '$lib/components/core/icons/icon.svelte';
  import type { IconName } from '$lib/components/core/icons/utils';

  type Props = HTMLAttributes<HTMLLIElement> & {
    children: import('svelte').Snippet;
    preIcon?: IconName;
  };

  let { children, preIcon }: Props = $props();
</script>

<li class="gap-xs px-xs py-2xs bg-surface-pure border-outline flex items-center border-t first:border-0">
  {#if preIcon}<Icon icon={preIcon} />{/if}
  {@render children()}
</li>
